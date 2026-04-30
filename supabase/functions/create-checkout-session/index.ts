// =====================================================================
// QINO — create-checkout-session Edge Function (iteration 10)
// Creates a Stripe Checkout session in subscription mode with a 3-day trial.
// JWT-validated. On first use, creates a Stripe customer and stores its id.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
// @ts-ignore - npm import via Deno
import Stripe from "npm:stripe@14";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRICE_BY_PLAN: Record<"monthly" | "annual", string> = {
  monthly: "price_1TRopH55q0TTVpXDs8PS0lpQ",
  annual: "price_1TRoos55q0TTVpXDlpFS9KJ8",
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

  if (!stripeKey) {
    return jsonResponse(500, { error: "stripe_not_configured" });
  }

  // ---- JWT validation ----
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

  // ---- Body ----
  let body: { plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }
  const plan = body.plan;
  if (plan !== "monthly" && plan !== "annual") {
    return jsonResponse(400, { error: "invalid_plan" });
  }
  const priceId = PRICE_BY_PLAN[plan];

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // ---- Look up subscription row ----
  const { data: subRow, error: subErr } = await admin
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subErr) {
    console.error("[create-checkout-session] sub lookup error:", subErr.message);
    return jsonResponse(500, { error: "internal_error" });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  let customerId = subRow?.stripe_customer_id ?? null;

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Upsert in case the trigger row is missing for some reason
      const { error: upsertErr } = await admin
        .from("subscriptions")
        .upsert(
          { user_id: user.id, stripe_customer_id: customerId, status: "free" },
          { onConflict: "user_id" }
        );
      if (upsertErr) {
        console.error(
          "[create-checkout-session] customer id persist error:",
          upsertErr.message
        );
        return jsonResponse(500, { error: "internal_error" });
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error("[create-checkout-session] stripe customer create error:", reason);
      return jsonResponse(500, { error: "stripe_error" });
    }
  }

  const origin = req.headers.get("Origin") ?? "https://qinoapp.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 3,
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: { supabase_user_id: user.id },
      payment_method_collection: "always",
      allow_promotion_codes: false,
    });

    return jsonResponse(200, { checkout_url: session.url, session_id: session.id });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[create-checkout-session] stripe checkout error:", reason);
    return jsonResponse(500, { error: "stripe_error" });
  }
});
