// =====================================================================
// QINO — stripe-webhook Edge Function (iteration 10)
// Receives Stripe webhook events. Verifies signature, deduplicates by
// event id, and syncs subscription state into public.subscriptions.
// NO JWT validation — webhook signature is the trust mechanism.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
// @ts-ignore - npm import via Deno
import Stripe from "npm:stripe@14";
// @ts-ignore - npm import via Deno
import * as Sentry from "npm:@sentry/deno";

const SENTRY_DSN_VAL = (globalThis as any).Deno?.env?.get?.("SENTRY_DSN");
if (SENTRY_DSN_VAL) {
  try {
    Sentry.init({ dsn: SENTRY_DSN_VAL, tracesSampleRate: 0.1, environment: "edge-function" });
  } catch (e) {
    console.warn("[stripe-webhook] Sentry init failed:", e);
  }
}

async function sendEmail(
  supabaseUrl: string,
  serviceKey: string,
  template: "trial_ending" | "payment_failed",
  toUserId: string,
  data?: Record<string, unknown>
) {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ template, to_user_id: toUserId, data: data ?? {} }),
    });
    if (!res.ok) console.warn("[stripe-webhook] email", template, "non-ok", res.status);
  } catch (e) {
    console.warn("[stripe-webhook] email", template, "failed:", e);
  }
}

async function userIdFromCustomer(
  admin: any,
  customerId: string
): Promise<string | null> {
  const { data } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function postHogServerCapture(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {}
) {
  const key = (globalThis as any).Deno?.env?.get?.("POSTHOG_PROJECT_KEY");
  const host = (globalThis as any).Deno?.env?.get?.("POSTHOG_HOST");
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { source: "webhook", ...properties },
      }),
    });
  } catch (e) {
    console.warn("[stripe-webhook] PostHog capture failed:", e);
  }
}

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const PRICE_TO_PLAN: Record<string, "monthly" | "annual"> = {
  price_1TRopH55q0TTVpXDs8PS0lpQ: "monthly",
  price_1TRoos55q0TTVpXDlpFS9KJ8: "annual",
};

function planFromSubscription(sub: any): "monthly" | "annual" | null {
  const priceId: string | undefined = sub?.items?.data?.[0]?.price?.id;
  if (!priceId) return null;
  return PRICE_TO_PLAN[priceId] ?? null;
}

function tsToIso(ts: number | null | undefined): string | null {
  if (!ts) return null;
  return new Date(ts * 1000).toISOString();
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("method_not_allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeKey || !webhookSecret) {
    console.error("[stripe-webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("not_configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  // Read raw body — needed for signature verification.
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: any;
  try {
    // constructEventAsync supports the Web Crypto API used in Deno/Workers.
    // @ts-ignore - present on Stripe SDK
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] signature verification failed:", reason);
    return new Response("invalid_signature", { status: 400 });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // ---- Idempotency ----
  const { error: idemErr } = await admin
    .from("webhook_events")
    .insert({ event_id: event.id });
  if (idemErr) {
    // Most likely a duplicate (PK conflict). Log and ack.
    console.log("[stripe-webhook] duplicate or insert error:", idemErr.message);
    return new Response("ok", { status: 200 });
  }

  // ---- Helpers to update subscription row ----
  const updateByCustomer = async (
    customerId: string,
    patch: Record<string, unknown>
  ) => {
    const { error } = await admin
      .from("subscriptions")
      .update(patch)
      .eq("stripe_customer_id", customerId);
    if (error) {
      console.error("[stripe-webhook] update by customer failed:", error.message);
    }
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const customerId: string | undefined =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId: string | undefined =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (!customerId || !subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await updateByCustomer(customerId, {
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_plan: planFromSubscription(sub),
          trial_ends_at: tsToIso(sub.trial_end),
          current_period_end: tsToIso(sub.current_period_end),
          cancel_at_period_end: !!sub.cancel_at_period_end,
        });
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const customerId: string =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (!customerId) break;
        await updateByCustomer(customerId, {
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_plan: planFromSubscription(sub),
          trial_ends_at: tsToIso(sub.trial_end),
          current_period_end: tsToIso(sub.current_period_end),
          cancel_at_period_end: !!sub.cancel_at_period_end,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId: string =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (!customerId) break;
        await updateByCustomer(customerId, {
          status: "canceled",
          stripe_subscription_id: null,
          current_plan: null,
          trial_ends_at: null,
          cancel_at_period_end: false,
        });
        const uid = await userIdFromCustomer(admin, customerId);
        if (uid) await postHogServerCapture("subscription_canceled", uid);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const sub = event.data.object;
        const customerId: string =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        console.log("[stripe-webhook] trial_will_end:", sub?.id);
        if (customerId) {
          const uid = await userIdFromCustomer(admin, customerId);
          if (uid) {
            await sendEmail(supabaseUrl, serviceKey, "trial_ending", uid, {
              plan: planFromSubscription(sub),
              trial_ends_at: tsToIso(sub.trial_end),
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId: string | undefined =
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        console.log("[stripe-webhook] invoice.payment_failed:", invoice?.id);
        if (customerId) {
          const uid = await userIdFromCustomer(admin, customerId);
          if (uid) {
            await sendEmail(supabaseUrl, serviceKey, "payment_failed", uid);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        console.log("[stripe-webhook] invoice.payment_succeeded:", event.data.object?.id);
        break;
      }

      default:
        console.log("[stripe-webhook] unhandled event:", event.type);
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[stripe-webhook] processing error:", reason);
    try {
      Sentry.captureException(err, { tags: { function: "stripe-webhook" } });
    } catch {}
    // Still ack so Stripe doesn't retry indefinitely on app bugs.
  }

  return new Response("ok", { status: 200 });
});
