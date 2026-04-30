// =====================================================================
// QINO — SettingsScreen (iteration 10)
// Account info + subscription management + sign out.
// =====================================================================

import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Mail, Check, LogOut, Crown } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useAuth, signOut } from "../hooks/useAuth";
import { useQinoData } from "../data/useQinoData";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal } from "../data/qinoApi";
import { supabase } from "../integrations/supabase/client";

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useQinoData();
  const sub = useSubscription();
  const [busy, setBusy] = useState(false);
  const [resend, setResend] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  };

  const onResend = async () => {
    if (!user?.email) return;
    setResend("sending");
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) {
      setResend("error");
      setTimeout(() => setResend("idle"), 2500);
    } else {
      setResend("sent");
      setTimeout(() => setResend("idle"), 2500);
    }
  };

  const onManage = async () => {
    setBusy(true);
    try {
      await openCustomerPortal();
    } catch (e) {
      console.warn("[Settings] portal error:", e);
      setBusy(false);
    }
  };

  const onUpgrade = () => navigate({ to: "/pricing" });

  const subSection = (() => {
    switch (sub.status) {
      case "trialing": {
        const end = sub.trialEndsAt ? new Date(sub.trialEndsAt) : null;
        const days = end
          ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : null;
        return {
          title: "QINO Premium · Trial",
          subtitle: days != null ? `Trial ends in ${days} day${days === 1 ? "" : "s"} (${fmtDate(sub.trialEndsAt)})` : "Trial active",
          cta: { label: "Manage subscription", onClick: onManage },
        };
      }
      case "active":
        return {
          title: `QINO Premium · ${sub.currentPlan === "annual" ? "$149/year" : "$19/month"}`,
          subtitle: `Renews ${fmtDate(sub.currentPeriodEnd)}`,
          cta: { label: "Manage subscription", onClick: onManage },
        };
      case "past_due":
        return {
          title: "Payment issue",
          subtitle: "Update your card to keep access.",
          cta: { label: "Manage subscription", onClick: onManage },
        };
      case "canceled":
        return {
          title: "Subscription canceled",
          subtitle: sub.currentPeriodEnd
            ? `Access ends ${fmtDate(sub.currentPeriodEnd)}`
            : "No active subscription.",
          cta: { label: "Resubscribe", onClick: onUpgrade },
        };
      default:
        return {
          title: "QINO Free",
          subtitle: "Upgrade for the daily protocol, products, and Coach.",
          cta: { label: "Upgrade to Premium", onClick: onUpgrade },
        };
    }
  })();

  const needsVerify = !!user && !user.email_confirmed_at && !!user.email;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-16">
        <header className="flex items-center justify-between px-5 pt-3 pb-2">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
            aria-label="Back"
          >
            <ArrowLeft size={16} color={palette.midnight} strokeWidth={1.7} />
          </button>
          <QinoMark size={36} />
          <div className="w-9 h-9" />
        </header>

        <div className="px-5 pt-4">
          <h1
            className="text-[24px]"
            style={{ fontFamily: fonts.title, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Settings
          </h1>
        </div>

        {/* Account */}
        <Section label="Account">
          <Row label="Name" value={data.user.name} />
          <Row label="Email" value={user?.email ?? "—"} />
          {needsVerify && (
            <button
              onClick={onResend}
              disabled={resend === "sending" || resend === "sent"}
              className="w-full mt-3 py-2.5 rounded-full flex items-center justify-center gap-2"
              style={{
                background: palette.white,
                border: `1px solid ${palette.hairline}`,
              }}
            >
              {resend === "sent" ? (
                <Check size={13} color={palette.midnight} strokeWidth={2} />
              ) : (
                <Mail size={13} color={palette.midnight} strokeWidth={1.8} />
              )}
              <span
                className="text-[12.5px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {resend === "sending"
                  ? "Sending…"
                  : resend === "sent"
                    ? "Sent ✓"
                    : resend === "error"
                      ? "Try again"
                      : "Verify email"}
              </span>
            </button>
          )}
        </Section>

        {/* Subscription */}
        <Section label="Subscription">
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center"
              style={{ background: palette.softLavender }}
            >
              <Crown size={15} color={palette.midnight} strokeWidth={1.7} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[14px]"
                style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.ink }}
              >
                {subSection.title}
              </div>
              <p
                className="mt-0.5 text-[12px]"
                style={{ color: palette.textMuted, fontFamily: fonts.body }}
              >
                {subSection.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={subSection.cta.onClick}
            disabled={busy}
            className="w-full mt-4 py-3 rounded-full"
            style={{ background: palette.midnight, opacity: busy ? 0.6 : 1 }}
          >
            <span
              className="text-[13px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
            >
              {busy ? "Opening…" : subSection.cta.label}
            </span>
          </button>
        </Section>

        {/* Sign out */}
        <Section label="Session">
          <button
            onClick={() => signOut()}
            className="w-full py-3 rounded-full flex items-center justify-center gap-2"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <LogOut size={14} color={palette.ink} strokeWidth={1.8} />
            <span
              className="text-[13px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              Sign out
            </span>
          </button>
        </Section>

        {/* Account deletion placeholder */}
        <Section label="Danger zone">
          <p className="text-[12px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
            Need to delete your account? Contact support — full account deletion is coming soon.
          </p>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="px-5 mt-5">
    <Eyebrow>{label}</Eyebrow>
    <div
      className="mt-2 rounded-[18px] p-4"
      style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
    >
      {children}
    </div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-[12px]" style={{ color: palette.textMuted }}>
      {label}
    </span>
    <span
      className="text-[13px] truncate ml-3"
      style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.ink }}
    >
      {value}
    </span>
  </div>
);
