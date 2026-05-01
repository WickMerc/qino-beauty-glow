// =====================================================================
// QINO — create-portal-session Edge Function (iteration 10)
// Returns a Stripe Customer Portal URL for the signed-in user.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
// @ts-ignore - npm import via Deno
import Stripe from "npm:stripe@14";
// @ts-ignore - npm import via Deno
import * as Sentry from "npm:@sentry/deno";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const SENTRY_DSN_VAL = Deno.env.get("SENTRY_DSN");
if (SENTRY_DSN_VAL) {
  try {
    Sentry.init({ dsn: SENTRY_DSN_VAL, tracesSampleRate: 0.1, environment: "edge-function" });
  } catch (e) {
    console.warn("[create-portal-session] Sentry init failed:", e);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse(405, { error: "method_not_allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

  if (!stripeKey) return jsonResponse(500, { error: "stripe_not_configured" });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return jsonResponse(401, { error: "unauthorized" });

  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return jsonResponse(401, { error: "unauthorized" });
  const user = userData.user;

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: subRow, error: subErr } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subErr) {
    console.error("[create-portal-session] sub lookup error:", subErr.message);
    return jsonResponse(500, { error: "internal_error" });
  }
  if (!subRow?.stripe_customer_id) {
    return jsonResponse(400, { error: "no_customer" });
  }

  const origin = req.headers.get("Origin") ?? "https://qinoapp.com";
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: subRow.stripe_customer_id,
      return_url: origin,
    });
    return jsonResponse(200, { portal_url: portal.url });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[create-portal-session] stripe portal error:", reason);
    return jsonResponse(500, { error: "stripe_error" });
  }
});
