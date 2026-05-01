// =====================================================================
// QINO — send-transactional-email Edge Function (iteration 12)
// Server-only sender. Rejects all non-service-role callers.
// Renders one of three templates and ships via Resend.
// Returns 200 on success, 500 on failure. Fire-and-forget by callers.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
// @ts-ignore - npm import via Deno (Sentry edge SDK)
import * as Sentry from "npm:@sentry/deno";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

// ---- Sentry init (no-op if DSN missing) ----
const SENTRY_DSN = Deno.env.get("SENTRY_DSN");
if (SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: "edge-function",
    });
  } catch (e) {
    console.warn("[send-transactional-email] Sentry init failed:", e);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type TemplateName = "welcome" | "trial_ending" | "payment_failed";

interface RequestBody {
  template?: TemplateName;
  to_user_id?: string;
  data?: Record<string, unknown>;
}

// ---- Brand tokens (kept inline, mirrored from src/theme.ts) ----
const BRAND = {
  midnight: "#0F1B26",
  stone: "#F2EFEA",
  ivory: "#F7F4EE",
  white: "#FFFFFF",
  ink: "#0F1B26",
  textMuted: "#536A78",
  hairline: "rgba(15,27,38,0.10)",
};
const FONT_TITLE = `'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const FONT_BODY = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const APP_URL = "https://qinoapp.com";

function shell(opts: {
  preheader: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>QINO</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.ivory};font-family:${FONT_BODY};color:${BRAND.ink};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${opts.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.ivory};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:${BRAND.white};border-radius:20px;overflow:hidden;border:1px solid ${BRAND.hairline};">
          <tr>
            <td style="padding:32px 36px 8px 36px;">
              <div style="font-family:${FONT_TITLE};font-weight:700;letter-spacing:0.18em;color:${BRAND.midnight};font-size:14px;">QINO</div>
            </td>
          </tr>
          <tr><td style="padding:8px 36px 36px 36px;">${opts.body}</td></tr>
        </table>
        <p style="margin:18px auto 0;max-width:520px;color:${BRAND.textMuted};font-size:11px;line-height:1.5;text-align:center;">
          You're receiving this because you have a QINO account. Manage preferences in
          <a href="${APP_URL}/settings" style="color:${BRAND.textMuted};">Settings</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
    <tr>
      <td style="background:${BRAND.midnight};border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:14px 28px;color:${BRAND.stone};text-decoration:none;font-family:${FONT_BODY};font-weight:600;font-size:14px;letter-spacing:0.01em;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildWelcome(args: { firstName: string; topPriority: string }): {
  subject: string;
  html: string;
} {
  const fn = escapeHtml(args.firstName || "there");
  const tp = escapeHtml(args.topPriority || "your highest-impact priority");
  const body = `
    <h1 style="margin:8px 0 16px;font-family:${FONT_TITLE};font-weight:600;font-size:24px;letter-spacing:-0.02em;color:${BRAND.ink};">Your QINO analysis is ready</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Hi ${fn},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Your facial analysis is complete. Your top priority right now is <strong style="color:${BRAND.midnight};">${tp}</strong>.</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Open your QINO Dashboard to see your full report, daily protocol preview, and the path forward.</p>
    ${ctaButton("Open QINO", APP_URL)}
    <p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:${BRAND.textMuted};">The QINO Team</p>
  `;
  return {
    subject: "Your QINO analysis is ready",
    html: shell({ preheader: `Your top priority: ${args.topPriority}`, body }),
  };
}

function buildTrialEnding(args: {
  firstName: string;
  trialEndDate: string;
  plan: string;
  price: string;
}): { subject: string; html: string } {
  const fn = escapeHtml(args.firstName || "there");
  const date = escapeHtml(args.trialEndDate);
  const plan = escapeHtml(args.plan);
  const price = escapeHtml(args.price);
  const body = `
    <h1 style="margin:8px 0 16px;font-family:${FONT_TITLE};font-weight:600;font-size:22px;letter-spacing:-0.02em;color:${BRAND.ink};">Your QINO trial wraps up tomorrow</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Hi ${fn},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Your 3-day trial ends on <strong>${date}</strong>, and your card will be charged for <strong>${plan}</strong> (${price}) the next day.</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">If you'd like to continue, no action needed — your protocol stays active.</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">If you'd like to cancel, you can manage your subscription anytime.</p>
    ${ctaButton("Manage subscription", `${APP_URL}/settings`)}
    <p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:${BRAND.textMuted};">The QINO Team</p>
  `;
  return {
    subject: "Your QINO trial wraps up tomorrow",
    html: shell({
      preheader: `Trial ends ${args.trialEndDate}. Manage anytime.`,
      body,
    }),
  };
}

function buildPaymentFailed(args: { firstName: string }): {
  subject: string;
  html: string;
} {
  const fn = escapeHtml(args.firstName || "there");
  const body = `
    <h1 style="margin:8px 0 16px;font-family:${FONT_TITLE};font-weight:600;font-size:22px;letter-spacing:-0.02em;color:${BRAND.ink};">We couldn't charge your card</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">Hi ${fn},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.ink};">We tried to renew your QINO subscription but your card was declined.</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">We'll automatically retry over the next few days. To avoid losing access, please update your payment method.</p>
    ${ctaButton("Update payment", `${APP_URL}/settings`)}
    <p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:${BRAND.textMuted};">The QINO Team</p>
  `;
  return {
    subject: "We couldn't charge your card",
    html: shell({
      preheader: "Update your payment method to keep your access.",
      body,
    }),
  };
}

function firstNameFrom(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim().length > 0) return name.trim().split(/\s+/)[0];
  if (email) return email.split("@")[0];
  return "there";
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "soon";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "soon";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!resendKey) {
    console.error("[send-transactional-email] RESEND_API_KEY not configured");
    return json(500, { error: "not_configured" });
  }

  // ---- Service-role gate: only callable by trusted server contexts ----
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token || token !== serviceKey) {
    return json(403, { error: "forbidden" });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const template = body.template;
  const toUserId = body.to_user_id;
  const extra = (body.data ?? {}) as Record<string, any>;

  if (!template || !["welcome", "trial_ending", "payment_failed"].includes(template)) {
    return json(400, { error: "invalid_template" });
  }
  if (!toUserId || typeof toUserId !== "string") {
    return json(400, { error: "to_user_id required" });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    // Fetch profile (name) and auth user (email)
    const [{ data: profile }, { data: authUser }] = await Promise.all([
      admin.from("profiles").select("name, email").eq("user_id", toUserId).maybeSingle(),
      admin.auth.admin.getUserById(toUserId),
    ]);

    const email = authUser?.user?.email ?? profile?.email ?? null;
    const name = profile?.name ?? null;

    if (!email) {
      console.warn("[send-transactional-email] no email for user", toUserId);
      return json(404, { error: "no_email_for_user" });
    }

    const firstName = firstNameFrom(name, email);

    let rendered: { subject: string; html: string };

    if (template === "welcome") {
      // Best-effort fetch top priority from latest complete report
      let topPriority = "your highest-impact priority";
      try {
        const { data: report } = await admin
          .from("analysis_reports")
          .select("priorities")
          .eq("user_id", toUserId)
          .eq("status", "complete")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        const high = (report?.priorities as any)?.high;
        if (Array.isArray(high) && typeof high[0] === "string" && high[0].length > 0) {
          topPriority = high[0];
        }
      } catch (e) {
        console.warn("[send-transactional-email] priorities fetch failed:", e);
      }
      rendered = buildWelcome({ firstName, topPriority });
    } else if (template === "trial_ending") {
      const planRaw =
        typeof extra.plan === "string" && extra.plan.length > 0 ? extra.plan : null;
      const trialEnd = typeof extra.trial_ends_at === "string" ? extra.trial_ends_at : null;

      let plan = planRaw === "annual" ? "Annual" : "Monthly";
      let price = planRaw === "annual" ? "$149/year" : "$19/month";
      if (!planRaw) {
        try {
          const { data: sub } = await admin
            .from("subscriptions")
            .select("current_plan, trial_ends_at")
            .eq("user_id", toUserId)
            .maybeSingle();
          if (sub?.current_plan === "annual") {
            plan = "Annual";
            price = "$149/year";
          } else if (sub?.current_plan === "monthly") {
            plan = "Monthly";
            price = "$19/month";
          }
          rendered = buildTrialEnding({
            firstName,
            trialEndDate: fmtDate(trialEnd ?? sub?.trial_ends_at ?? null),
            plan,
            price,
          });
        } catch {
          rendered = buildTrialEnding({
            firstName,
            trialEndDate: fmtDate(trialEnd),
            plan,
            price,
          });
        }
      } else {
        rendered = buildTrialEnding({
          firstName,
          trialEndDate: fmtDate(trialEnd),
          plan,
          price,
        });
      }
    } else {
      rendered = buildPaymentFailed({ firstName });
    }

    // ---- Send via Resend ----
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "QINO <onboarding@resend.dev>",
        to: [email],
        subject: rendered.subject,
        html: rendered.html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      console.error(
        "[send-transactional-email] Resend non-ok:",
        resendRes.status,
        errText.slice(0, 300)
      );
      Sentry.captureException(new Error(`resend_${resendRes.status}: ${errText.slice(0, 200)}`), {
        tags: { function: "send-transactional-email", template },
        user: { id: toUserId },
      });
      return json(500, { error: "send_failed" });
    }

    const respJson = await resendRes.json().catch(() => ({}));
    return json(200, { ok: true, id: (respJson as any)?.id ?? null });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error("[send-transactional-email] error:", reason);
    Sentry.captureException(err, {
      tags: { function: "send-transactional-email", template: String(template) },
      user: { id: toUserId },
    });
    return json(500, { error: "internal_error" });
  }
});
