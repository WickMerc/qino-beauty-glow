// =====================================================================
// QINO — SettingsScreen (iteration 11)
// Section-based: Account, Subscription (state-aware), Notifications
// (placeholder toggles), Privacy (placeholder), Account actions.
// =====================================================================

import { useState } from "react";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Mail,
  Check,
  LogOut,
  Crown,
  AlertCircle,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useAuth, signOut } from "../hooks/useAuth";
import { useQinoData } from "../data/useQinoData";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal } from "../data/qinoApi";
import { supabase } from "../integrations/supabase/client";

const fmtDate = (iso: string | null | undefined) => {
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
  const [notif, setNotif] = useState({ protocol: true, coach: true, billing: true });
  const [showDelete, setShowDelete] = useState(false);

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
    } catch {
      setBusy(false);
    }
  };

  const onSeePlans = () => navigate({ to: "/pricing" });

  // ---------- Subscription card content ----------
  const renderSubscription = () => {
    const status = sub.status;
    const planLabel =
      sub.currentPlan === "annual"
        ? "Annual · $149/year"
        : sub.currentPlan === "monthly"
          ? "Monthly · $19/month"
          : "";

    if (status === "trialing") {
      const days = sub.trialEndsAt
        ? Math.max(
            0,
            Math.ceil((new Date(sub.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          )
        : null;
      const planName = sub.currentPlan === "annual" ? "annual" : "monthly";
      return (
        <SubBlock
          tint={palette.softLavender}
          title="Trial active"
          sub={
            days != null
              ? `${days} day${days === 1 ? "" : "s"} remaining. Auto-converts to ${planName} on ${fmtDate(sub.trialEndsAt)}.`
              : "Trial active."
          }
          primary={{ label: busy ? "Opening…" : "Manage subscription", onClick: onManage, busy }}
          secondary={{ label: "See plans", onClick: onSeePlans }}
        />
      );
    }

    if (status === "active") {
      const isAnnual = sub.currentPlan === "annual";
      return (
        <>
          <SubBlock
            tint={palette.softSage}
            title={`QINO Premium · ${planLabel}`}
            sub={`Next billing: ${fmtDate(sub.currentPeriodEnd)}.`}
            primary={{ label: busy ? "Opening…" : "Manage subscription", onClick: onManage, busy }}
            secondary={
              isAnnual
                ? { label: "Switch to monthly", onClick: onManage }
                : { label: "Switch to annual", onClick: onManage }
            }
          />
          {!isAnnual && (
            <div
              className="mt-3 rounded-[14px] px-4 py-3 flex items-center justify-between gap-3"
              style={{ background: palette.paleBlue, border: `1px solid ${palette.hairline}` }}
            >
              <div className="min-w-0">
                <div
                  className="text-[12.5px]"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                >
                  Switch to annual and save 35%
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: palette.textMuted, fontFamily: fonts.body }}
                >
                  $149/year — that’s $12.42/month equivalent.
                </div>
              </div>
              <button
                onClick={onManage}
                disabled={busy}
                className="text-[11.5px] underline shrink-0"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
              >
                Switch plan
              </button>
            </div>
          )}
        </>
      );
    }

    if (status === "past_due") {
      return (
        <SubBlock
          tint={palette.softBlush}
          warning
          title="Payment issue"
          sub="Your last payment failed. Update your card to keep access."
          primary={{ label: busy ? "Opening…" : "Update payment", onClick: onManage, busy }}
        />
      );
    }

    if (
      status === "canceled" &&
      sub.currentPeriodEnd &&
      new Date(sub.currentPeriodEnd).getTime() > Date.now()
    ) {
      return (
        <SubBlock
          tint={palette.softPeach}
          title="Subscription canceled"
          sub={`Access continues until ${fmtDate(sub.currentPeriodEnd)}, then drops to free tier.`}
          primary={{ label: "Resubscribe", onClick: onSeePlans, busy: false }}
        />
      );
    }

    // free / canceled-expired
    return (
      <SubBlock
        tint={palette.stone}
        title="QINO Free"
        sub="Upgrade to unlock your daily system."
        primary={{ label: "See plans", onClick: onSeePlans, busy: false }}
      />
    );
  };

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
            className="text-[26px]"
            style={{ fontFamily: fonts.title, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Settings
          </h1>
        </div>

        {/* Account */}
        <Section label="Account">
          <Row label="Display name" value={data.user.name} hint="Edit coming soon" />
          <Row
            label="Email"
            value={user?.email ?? "—"}
            badge={
              user?.email_confirmed_at ? (
                <span
                  className="inline-flex items-center gap-1 text-[11px]"
                  style={{ color: palette.sageAccent, fontFamily: fonts.subtitle, fontWeight: 600 }}
                >
                  <Check size={11} strokeWidth={2.4} /> Verified
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[11px]"
                  style={{ color: palette.blushAccent, fontFamily: fonts.subtitle, fontWeight: 600 }}
                >
                  <AlertCircle size={11} strokeWidth={2} /> Not verified
                </span>
              )
            }
          />
          <Row
            label="Account created"
            value={fmtDate(user?.created_at ?? null)}
          />
          {needsVerify && (
            <button
              onClick={onResend}
              disabled={resend === "sending" || resend === "sent"}
              className="w-full mt-3 py-2.5 rounded-full flex items-center justify-center gap-2"
              style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
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
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
              style={{ background: palette.softLavender }}
            >
              <Crown size={15} color={palette.midnight} strokeWidth={1.7} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="text-[11px]" style={{ color: palette.textMuted, fontFamily: fonts.subtitle, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                Plan
              </div>
            </div>
          </div>
          {renderSubscription()}

          <Link
            to="/whats-included"
            className="inline-flex items-center gap-1.5 mt-4 text-[12px] underline"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
          >
            See what’s included
            <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </Section>

        {/* Notifications (placeholder — saves nothing yet) */}
        <Section label="Notifications">
          <Toggle
            label="Email me about my protocol"
            checked={notif.protocol}
            onToggle={() => setNotif((n) => ({ ...n, protocol: !n.protocol }))}
          />
          <Divider />
          <Toggle
            label="Coach replies"
            checked={notif.coach}
            onToggle={() => setNotif((n) => ({ ...n, coach: !n.coach }))}
          />
          <Divider />
          <Toggle
            label="Trial and billing reminders"
            checked={notif.billing}
            onToggle={() => setNotif((n) => ({ ...n, billing: !n.billing }))}
          />
          <p
            className="mt-3 text-[10.5px]"
            style={{ color: palette.textDim, fontFamily: fonts.body }}
          >
            Preferences will sync to your account in a future update.
          </p>
        </Section>

        {/* Privacy */}
        <Section label="Privacy">
          <LinkRow label="Privacy policy" />
          <Divider />
          <LinkRow label="Terms of service" />
          <Divider />
          <LinkRow label="Download my data" disabled hint="Coming soon" />
        </Section>

        {/* Account actions */}
        <Section label="Account actions">
          <button
            onClick={() => signOut()}
            className="w-full py-3 rounded-full flex items-center justify-center gap-2"
            style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
          >
            <LogOut size={14} color={palette.ink} strokeWidth={1.8} />
            <span
              className="text-[13px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              Sign out
            </span>
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="block w-full mt-3 text-center text-[11.5px] underline"
            style={{ color: palette.textDim, fontFamily: fonts.body }}
          >
            Delete account
          </button>
        </Section>
      </div>

      {/* Delete confirm */}
      {showDelete && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center px-4"
          style={{ background: "rgba(15,27,38,0.4)" }}
          onClick={() => setShowDelete(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-[20px] p-5"
            style={{ background: palette.white }}
            onClick={(e) => e.stopPropagation()}
          >
            <Eyebrow>Delete account</Eyebrow>
            <p
              className="mt-2 text-[13px] leading-relaxed"
              style={{ color: palette.ink, fontFamily: fonts.body }}
            >
              Account deletion is in beta. Email{" "}
              <span style={{ fontWeight: 600 }}>support@qinoapp.com</span> to request deletion.
            </p>
            <button
              onClick={() => setShowDelete(false)}
              className="w-full mt-4 py-3 rounded-full"
              style={{ background: palette.midnight }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
              >
                OK
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Building blocks
// =====================================================================

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="px-5 mt-5">
    <Eyebrow>{label}</Eyebrow>
    <div
      className="mt-2 rounded-[22px] p-4"
      style={{
        background: palette.white,
        border: `1px solid ${palette.hairline}`,
        boxShadow: shadows.card,
      }}
    >
      {children}
    </div>
  </div>
);

const Row = ({
  label,
  value,
  badge,
  hint,
}: {
  label: string;
  value: string;
  badge?: React.ReactNode;
  hint?: string;
}) => (
  <div className="flex items-start justify-between py-1.5 gap-3">
    <div className="min-w-0">
      <div className="text-[11px]" style={{ color: palette.textMuted }}>
        {label}
      </div>
      <div
        className="text-[13px] truncate mt-0.5"
        style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.ink }}
      >
        {value}
      </div>
      {hint && (
        <div className="text-[10.5px] mt-0.5" style={{ color: palette.textDim }}>
          {hint}
        </div>
      )}
    </div>
    {badge && <div className="shrink-0 pt-1">{badge}</div>}
  </div>
);

const Toggle = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-[13px]" style={{ color: palette.ink, fontFamily: fonts.body }}>
      {label}
    </span>
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={checked}
      className="w-10 h-6 rounded-full relative transition-colors"
      style={{ background: checked ? palette.midnight : palette.hairlineMid }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
        style={{
          background: palette.white,
          left: checked ? 18 : 2,
          boxShadow: "0 2px 4px rgba(15,27,38,0.15)",
        }}
      />
    </button>
  </div>
);

const Divider = () => (
  <div className="h-px my-1" style={{ background: palette.hairline }} />
);

const LinkRow = ({
  label,
  disabled,
  hint,
}: {
  label: string;
  disabled?: boolean;
  hint?: string;
}) => (
  <button
    disabled={disabled}
    className="w-full flex items-center justify-between py-2.5 text-left"
    style={{ opacity: disabled ? 0.55 : 1 }}
  >
    <div>
      <div className="text-[13px]" style={{ color: palette.ink, fontFamily: fonts.body }}>
        {label}
      </div>
      {hint && (
        <div className="text-[10.5px] mt-0.5" style={{ color: palette.textDim }}>
          {hint}
        </div>
      )}
    </div>
    <ArrowRight size={13} color={palette.textMuted} strokeWidth={1.8} />
  </button>
);

// ---------- Subscription block ----------
const SubBlock = ({
  tint,
  title,
  sub,
  primary,
  secondary,
  warning,
}: {
  tint: string;
  title: string;
  sub: string;
  primary: { label: string; onClick: () => void; busy: boolean };
  secondary?: { label: string; onClick: () => void };
  warning?: boolean;
}) => (
  <div
    className="rounded-[16px] p-4"
    style={{ background: tint, border: `1px solid ${palette.hairline}` }}
  >
    <div className="flex items-center gap-2">
      {warning && <AlertCircle size={13} color={palette.midnight} strokeWidth={2} />}
      <CreditCard size={13} color={palette.midnight} strokeWidth={1.8} />
      <span
        className="text-[13.5px]"
        style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.ink }}
      >
        {title}
      </span>
    </div>
    <p
      className="mt-1.5 text-[12px] leading-relaxed"
      style={{ color: palette.textMuted, fontFamily: fonts.body }}
    >
      {sub}
    </p>
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={primary.onClick}
        disabled={primary.busy}
        className="flex-1 py-2.5 rounded-full"
        style={{ background: palette.midnight, opacity: primary.busy ? 0.6 : 1 }}
      >
        <span
          className="text-[12.5px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
        >
          {primary.label}
        </span>
      </button>
      {secondary && (
        <button
          onClick={secondary.onClick}
          className="px-4 py-2.5 rounded-full"
          style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
        >
          <span
            className="text-[12.5px]"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
          >
            {secondary.label}
          </span>
        </button>
      )}
    </div>
  </div>
);
