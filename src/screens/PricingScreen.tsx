// =====================================================================
// QINO — PricingScreen (iteration 10)
// Two plans, comparison list, FAQ. Tapping CTA starts Stripe Checkout.
// If user is already trialing/active, shows current plan + portal button.
// =====================================================================

import { useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles, X } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal, startCheckout } from "../data/qinoApi";

const FREE_FEATURES = [
  "Full analysis report",
  "Priority map",
  "Feature breakdown (read-only)",
  "One scan",
];

const PAID_FEATURES = [
  "Daily protocol with checkable tasks",
  "Personalized product stack",
  "Treatment pathways",
  "Unlimited Coach",
  "Progress tracking + monthly photos",
  "Quarterly re-analysis",
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What happens after my trial?",
    a: "After 3 days, you’re billed at the plan you chose. We email you 24 hours before. Cancel anytime in settings — no charge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Open Manage subscription and cancel in two taps. You keep access until the end of your billing period.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Switch monthly to annual (or back) anytime in Manage subscription. Stripe prorates the difference automatically.",
  },
];

export const PricingScreen = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const sub = useSubscription();
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") setShowCanceled(true);
  }, []);

  const onStart = async (selected: "monthly" | "annual") => {
    setPlan(selected);
    setBusy(true);
    setErr(null);
    try {
      await startCheckout(selected);
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Could not start checkout");
    }
  };

  const onManage = async () => {
    setBusy(true);
    setErr(null);
    try {
      await openCustomerPortal();
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Could not open subscription manager");
    }
  };

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  };

  const isPaying = sub.isPaid;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-16">
        {/* Header */}
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
          <Eyebrow>Pricing</Eyebrow>
          <h1
            className="mt-2 text-[26px]"
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
            className="mt-2 text-[13px] leading-relaxed"
            style={{ fontFamily: fonts.body, color: palette.textMuted }}
          >
            3-day free trial. Card required. Cancel anytime.
          </p>
        </div>

        {/* Already paying */}
        {isPaying && (
          <div className="px-5 pt-5">
            <div
              className="rounded-[20px] p-5"
              style={{
                background: palette.white,
                border: `1px solid ${palette.hairline}`,
                boxShadow: shadows.card,
              }}
            >
              <Eyebrow>Current plan</Eyebrow>
              <div
                className="mt-2 text-[18px]"
                style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.ink }}
              >
                QINO Premium · {sub.currentPlan === "annual" ? "Annual" : "Monthly"}
              </div>
              <p className="mt-1 text-[12px]" style={{ color: palette.textMuted }}>
                Status: {sub.status}
              </p>
              <button
                onClick={onManage}
                disabled={busy}
                className="w-full mt-4 py-3 rounded-full"
                style={{ background: palette.midnight, opacity: busy ? 0.6 : 1 }}
              >
                <span
                  className="text-[13px]"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
                >
                  {busy ? "Opening…" : "Manage subscription"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Plan cards */}
        {!isPaying && (
          <div className="px-5 pt-5 grid grid-cols-1 gap-3">
            <PlanCard
              title="Monthly"
              price="$19"
              cadence="/month"
              accentBg={palette.softBlush}
              selected={plan === "monthly"}
              onSelect={() => setPlan("monthly")}
              onStart={() => onStart("monthly")}
              busy={busy}
            />
            <PlanCard
              title="Annual"
              price="$149"
              cadence="/year"
              accentBg={palette.softLavender}
              badge="Best value — save 35%"
              selected={plan === "annual"}
              onSelect={() => setPlan("annual")}
              onStart={() => onStart("annual")}
              busy={busy}
              highlight
            />
          </div>
        )}

        {err && (
          <p className="px-5 mt-3 text-[12px]" style={{ color: palette.blushAccent }}>
            {err}
          </p>
        )}

        {/* Comparison */}
        <div className="px-5 mt-7">
          <Eyebrow>What you get</Eyebrow>
          <div
            className="mt-3 rounded-[20px] overflow-hidden"
            style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
          >
            <ComparisonBlock label="Free" items={FREE_FEATURES} muted />
            <div style={{ height: 1, background: palette.hairline }} />
            <ComparisonBlock label="Premium" items={PAID_FEATURES} />
          </div>
        </div>

        {/* FAQ */}
        <div className="px-5 mt-7">
          <Eyebrow>FAQ</Eyebrow>
          <div className="mt-3 space-y-2">
            {FAQS.map((f) => (
              <div
                key={f.q}
                className="rounded-[14px] p-4"
                style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
              >
                <div
                  className="text-[13px]"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                >
                  {f.q}
                </div>
                <p
                  className="mt-1.5 text-[12.5px] leading-relaxed"
                  style={{ fontFamily: fonts.body, color: palette.textMuted }}
                >
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanCardProps {
  title: string;
  price: string;
  cadence: string;
  accentBg: string;
  badge?: string;
  selected: boolean;
  onSelect: () => void;
  onStart: () => void;
  busy: boolean;
  highlight?: boolean;
}

const PlanCard = ({
  title,
  price,
  cadence,
  accentBg,
  badge,
  selected,
  onSelect,
  onStart,
  busy,
  highlight,
}: PlanCardProps) => (
  <button
    onClick={onSelect}
    className="text-left rounded-[22px] p-5 relative overflow-hidden transition-all"
    style={{
      background: highlight
        ? `linear-gradient(140deg, ${accentBg} 0%, ${palette.paleBlue} 100%)`
        : palette.white,
      border: `1px solid ${selected ? palette.midnight : palette.hairline}`,
      boxShadow: selected ? shadows.hero : shadows.card,
    }}
  >
    {badge && (
      <div
        className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px]"
        style={{
          background: palette.midnight,
          color: palette.stone,
          fontFamily: fonts.subtitle,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        {badge}
      </div>
    )}
    <Eyebrow>{title}</Eyebrow>
    <div className="mt-2 flex items-baseline gap-1">
      <span
        className="text-[28px]"
        style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.ink, letterSpacing: "-0.02em" }}
      >
        {price}
      </span>
      <span className="text-[13px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
        {cadence}
      </span>
    </div>
    <p className="mt-1 text-[11.5px]" style={{ color: palette.textMuted, fontFamily: fonts.body }}>
      3-day free trial. Card required. Cancel anytime.
    </p>
    <div
      onClick={(e) => {
        e.stopPropagation();
        onStart();
      }}
      role="button"
      className="w-full mt-4 py-3 rounded-full text-center cursor-pointer"
      style={{ background: palette.midnight, opacity: busy ? 0.6 : 1 }}
    >
      <span
        className="text-[13px]"
        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
      >
        {busy ? "Starting…" : "Start 3-day free trial"}
      </span>
    </div>
  </button>
);

const ComparisonBlock = ({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) => (
  <div className="p-4">
    <div className="flex items-center gap-2">
      <Sparkles size={13} color={muted ? palette.textDim : palette.midnight} strokeWidth={1.7} />
      <Eyebrow color={muted ? palette.textDim : palette.midnight}>{label}</Eyebrow>
    </div>
    <ul className="mt-3 space-y-2">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2">
          <Check
            size={13}
            color={muted ? palette.textDim : palette.midnight}
            strokeWidth={2.2}
            className="mt-0.5 shrink-0"
          />
          <span
            className="text-[12.5px]"
            style={{ color: muted ? palette.textMuted : palette.ink, fontFamily: fonts.body }}
          >
            {it}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
