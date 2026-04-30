// =====================================================================
// QINO — PricingScreen (iteration 11)
// Polished marketing surface. Single column, mobile-first.
// Annual recommended. State-aware: free vs trialing vs active vs past_due
// vs canceled-but-active. No fake social proof or scarcity.
// =====================================================================

import { useEffect, useState } from "react";
import { useNavigate, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Plus, X, AlertCircle } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal, startCheckout } from "../data/qinoApi";

const PAID_FEATURES = [
  { label: "Daily protocol with checkable tasks", accent: palette.softSage },
  { label: "Personalized product stack with picks for your skin", accent: palette.softBlush },
  { label: "Treatment pathways at every comfort level", accent: palette.softLavender },
  { label: "Unlimited Coach grounded in your report", accent: palette.softPeach },
  { label: "Progress tracking with monthly photo uploads", accent: palette.paleBlue },
  { label: "Quarterly re-analysis to measure your progress", accent: palette.softSage },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What happens after my trial?",
    a: "Your card is charged $19/month or $149/year (whichever you chose). Cancel anytime in settings before then.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from settings → manage subscription. You keep access until your current period ends.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Switch between monthly and annual from settings → manage subscription. Stripe handles the prorated math.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All payment processing is handled by Stripe. QINO never sees or stores your card details.",
  },
];

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

export const PricingScreen = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const sub = useSubscription();
  const [busy, setBusy] = useState<null | "monthly" | "annual" | "portal">(null);
  const [err, setErr] = useState<string | null>(null);
  const [showCanceled, setShowCanceled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") setShowCanceled(true);
  }, []);

  const onStart = async (selected: "monthly" | "annual") => {
    setBusy(selected);
    setErr(null);
    try {
      await startCheckout(selected);
    } catch (e) {
      setBusy(null);
      setErr(e instanceof Error ? e.message : "Could not start checkout");
    }
  };

  const onManage = async () => {
    setBusy("portal");
    setErr(null);
    try {
      await openCustomerPortal();
    } catch (e) {
      setBusy(null);
      setErr(e instanceof Error ? e.message : "Could not open subscription manager");
    }
  };

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  };

  // Determine which top status card (if any) to show instead of the cards.
  const renderStatusCard = () => {
    if (sub.loading) return null;

    if (sub.status === "trialing" && sub.trialEndsAt) {
      const end = new Date(sub.trialEndsAt);
      const days = Math.max(
        0,
        Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );
      return (
        <StatusCard
          eyebrow="Active trial"
          title={`Trial — ${days} day${days === 1 ? "" : "s"} remaining`}
          sub={`Auto-converts on ${fmtDate(sub.trialEndsAt)}.`}
          tint={palette.softLavender}
          ctaLabel={busy === "portal" ? "Opening…" : "Manage subscription"}
          onCta={onManage}
          busy={busy === "portal"}
        />
      );
    }

    if (sub.status === "active") {
      return (
        <StatusCard
          eyebrow="Current plan"
          title={`QINO Premium · ${sub.currentPlan === "annual" ? "Annual" : "Monthly"}`}
          sub={
            sub.currentPeriodEnd
              ? `Next billing ${fmtDate(sub.currentPeriodEnd)}.`
              : "Active subscription."
          }
          tint={palette.softSage}
          ctaLabel={busy === "portal" ? "Opening…" : "Manage subscription"}
          onCta={onManage}
          busy={busy === "portal"}
        />
      );
    }

    if (sub.status === "past_due") {
      return (
        <StatusCard
          eyebrow="Action required"
          title="Payment issue"
          sub="Update your card to continue."
          tint={palette.softBlush}
          ctaLabel={busy === "portal" ? "Opening…" : "Update payment"}
          onCta={onManage}
          busy={busy === "portal"}
          warning
        />
      );
    }

    if (
      sub.status === "canceled" &&
      sub.currentPeriodEnd &&
      new Date(sub.currentPeriodEnd).getTime() > Date.now()
    ) {
      return (
        <StatusCard
          eyebrow="Canceled"
          title="Subscription canceled"
          sub={`Access until ${fmtDate(sub.currentPeriodEnd)}.`}
          tint={palette.softPeach}
          ctaLabel="Resubscribe"
          onCta={() => onStart(sub.currentPlan === "annual" ? "annual" : "monthly")}
          busy={busy !== null}
        />
      );
    }

    return null;
  };

  const statusCard = renderStatusCard();
  const showPlans = !statusCard;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-16">
        {/* Sticky header */}
        <header
          className="flex items-center justify-between px-5 pt-3 pb-2 sticky top-0 z-10"
          style={{ background: palette.ivory }}
        >
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

        {/* Cancel banner */}
        {showCanceled && (
          <div
            className="mx-5 mt-3 px-3.5 py-2.5 rounded-[12px] flex items-center justify-between gap-2"
            style={{ background: palette.softPeach, border: `1px solid ${palette.hairline}` }}
          >
            <span className="text-[12px]" style={{ color: palette.ink, fontFamily: fonts.body }}>
              Checkout canceled — start your trial when you’re ready.
            </span>
            <button onClick={() => setShowCanceled(false)} aria-label="Dismiss">
              <X size={14} color={palette.ink} strokeWidth={1.8} />
            </button>
          </div>
        )}

        {/* Hero */}
        <div className="px-5 pt-5">
          <Eyebrow>QINO Premium</Eyebrow>
          <h1
            className="mt-2 text-[28px]"
            style={{
              fontFamily: fonts.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: palette.ink,
            }}
          >
            Unlock your full daily system
          </h1>
          <p
            className="mt-2.5 text-[13.5px] leading-relaxed"
            style={{ fontFamily: fonts.body, color: palette.textMuted }}
          >
            Your report is just the beginning. Daily execution is what changes how your face looks.
          </p>
        </div>

        {/* Status card OR plan cards */}
        {statusCard && <div className="px-5 mt-5">{statusCard}</div>}

        {showPlans && (
          <div className="px-5 mt-6 grid grid-cols-1 gap-3">
            <PlanCard
              kind="annual"
              price="$149"
              cadence="/year"
              equiv="$12.42/month equivalent"
              busy={busy === "annual"}
              disabled={busy !== null}
              onStart={() => onStart("annual")}
            />
            <PlanCard
              kind="monthly"
              price="$19"
              cadence="/month"
              busy={busy === "monthly"}
              disabled={busy !== null}
              onStart={() => onStart("monthly")}
            />
          </div>
        )}

        {err && (
          <p className="px-5 mt-3 text-[12px]" style={{ color: palette.blushAccent }}>
            {err}
          </p>
        )}

        {/* What's included */}
        <div className="px-5 mt-9">
          <Eyebrow>Premium unlocks</Eyebrow>
          <ul className="mt-3 space-y-2.5">
            {PAID_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: f.accent }}
                >
                  <Check size={12} color={palette.midnight} strokeWidth={2.4} />
                </span>
                <span
                  className="text-[13px] leading-snug"
                  style={{ fontFamily: fonts.body, color: palette.ink }}
                >
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/whats-included"
            className="inline-block mt-4 text-[12px] underline"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
          >
            Compare plans →
          </Link>
        </div>

        {/* FAQ */}
        <div className="px-5 mt-9">
          <Eyebrow>Common questions</Eyebrow>
          <div className="mt-3 space-y-2">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="rounded-[14px] overflow-hidden"
                  style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
                  >
                    <span
                      className="text-[13px] leading-snug"
                      style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                    >
                      {f.q}
                    </span>
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: palette.stone,
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 180ms ease",
                      }}
                      aria-hidden
                    >
                      <Plus size={13} color={palette.midnight} strokeWidth={2} />
                    </span>
                  </button>
                  {open && (
                    <div
                      className="px-4 pb-4 -mt-1 text-[12.5px] leading-relaxed"
                      style={{ color: palette.textMuted, fontFamily: fonts.body }}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer microcopy */}
        <p
          className="mt-8 text-center text-[11px]"
          style={{ color: palette.textDim, fontFamily: fonts.body }}
        >
          Cancel anytime · Card on file required for trial
        </p>
      </div>
    </div>
  );
};

// ---------- Plan card ----------
interface PlanCardProps {
  kind: "monthly" | "annual";
  price: string;
  cadence: string;
  equiv?: string;
  busy: boolean;
  disabled: boolean;
  onStart: () => void;
}

const PlanCard = ({ kind, price, cadence, equiv, busy, disabled, onStart }: PlanCardProps) => {
  const isAnnual = kind === "annual";
  return (
    <div
      className="rounded-[22px] p-5 relative overflow-hidden"
      style={{
        background: isAnnual
          ? `linear-gradient(140deg, ${palette.softLavender} 0%, ${palette.paleBlue} 100%)`
          : palette.white,
        border: `1px solid ${isAnnual ? "rgba(15,27,38,0.10)" : palette.hairline}`,
        boxShadow: isAnnual ? shadows.hero : shadows.card,
      }}
    >
      {isAnnual && (
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px]"
          style={{
            background: palette.midnight,
            color: palette.stone,
            fontFamily: fonts.subtitle,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          BEST VALUE · SAVE 35%
        </div>
      )}
      <Eyebrow>{isAnnual ? "Annual" : "Monthly"}</Eyebrow>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="text-[32px]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            color: palette.ink,
            letterSpacing: "-0.025em",
          }}
        >
          {price}
        </span>
        <span className="text-[14px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
          {cadence}
        </span>
      </div>
      {equiv && (
        <p className="mt-1 text-[12px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
          {equiv}
        </p>
      )}
      <p className="mt-2 text-[11.5px]" style={{ color: palette.textDim, fontFamily: fonts.body }}>
        3-day free trial. Card required.
      </p>
      <button
        onClick={onStart}
        disabled={disabled}
        className="w-full mt-4 py-3 rounded-full"
        style={{
          background: palette.midnight,
          opacity: disabled && !busy ? 0.5 : busy ? 0.7 : 1,
        }}
      >
        <span
          className="text-[13px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
        >
          {busy ? "Starting…" : `Start trial — ${isAnnual ? "Annual" : "Monthly"}`}
        </span>
      </button>
    </div>
  );
};

// ---------- Status card ----------
const StatusCard = ({
  eyebrow,
  title,
  sub,
  tint,
  ctaLabel,
  onCta,
  busy,
  warning,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  tint: string;
  ctaLabel: string;
  onCta: () => void;
  busy: boolean;
  warning?: boolean;
}) => (
  <div
    className="rounded-[22px] p-5"
    style={{
      background: tint,
      border: `1px solid ${palette.hairline}`,
      boxShadow: shadows.card,
    }}
  >
    <div className="flex items-center gap-2">
      {warning && <AlertCircle size={14} color={palette.midnight} strokeWidth={1.8} />}
      <Eyebrow>{eyebrow}</Eyebrow>
    </div>
    <div
      className="mt-2 text-[18px]"
      style={{
        fontFamily: fonts.title,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        color: palette.ink,
      }}
    >
      {title}
    </div>
    <p className="mt-1 text-[12.5px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
      {sub}
    </p>
    <button
      onClick={onCta}
      disabled={busy}
      className="w-full mt-4 py-3 rounded-full"
      style={{ background: palette.midnight, opacity: busy ? 0.6 : 1 }}
    >
      <span
        className="text-[13px]"
        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
      >
        {ctaLabel}
      </span>
    </button>
  </div>
);
