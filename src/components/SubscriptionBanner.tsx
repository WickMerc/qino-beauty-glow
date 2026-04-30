// =====================================================================
// QINO — SubscriptionBanner (iteration 11)
// Context-aware banner for trialing/past_due/canceled.
// Day-of-trial messaging + one-time confirmation banners for:
//   - trialing → active (conversion)
//   - active/canceled → free / canceled-after-period (expiration)
// Persists "seen" flags in localStorage so confirmation shows once.
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, X } from "lucide-react";
import { palette, fonts } from "../theme";
import { useSubscription, type SubscriptionStatusReal } from "../hooks/useSubscription";
import { openCustomerPortal } from "../data/qinoApi";

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : "";

const fmtHours = (iso: string | null) => {
  if (!iso) return "soon";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "soon";
  const h = Math.max(1, Math.round(ms / (1000 * 60 * 60)));
  return `${h} hour${h === 1 ? "" : "s"}`;
};

const PREV_STATUS_KEY = "qino.sub.prevStatus";
const SHOW_CONVERTED_KEY = "qino.sub.showConverted";
const SHOW_CANCELED_NOTICE_KEY = "qino.sub.showCanceledNotice";
const SHOW_EXPIRED_KEY = "qino.sub.showExpired";

export const SubscriptionBanner = () => {
  const sub = useSubscription();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [showConverted, setShowConverted] = useState(false);
  const [showCanceledNotice, setShowCanceledNotice] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const initRef = useRef(false);

  // Detect status transitions for one-time confirmation banners.
  useEffect(() => {
    if (sub.loading) return;
    const prev = (typeof window !== "undefined"
      ? window.localStorage.getItem(PREV_STATUS_KEY)
      : null) as SubscriptionStatusReal | null;

    if (!initRef.current) {
      // hydrate one-time flags on first render
      if (window.localStorage.getItem(SHOW_CONVERTED_KEY) === "1") setShowConverted(true);
      if (window.localStorage.getItem(SHOW_CANCELED_NOTICE_KEY) === "1")
        setShowCanceledNotice(true);
      if (window.localStorage.getItem(SHOW_EXPIRED_KEY) === "1") setShowExpired(true);
      initRef.current = true;
    }

    if (prev && prev !== sub.status) {
      // trial → active
      if (prev === "trialing" && sub.status === "active") {
        window.localStorage.setItem(SHOW_CONVERTED_KEY, "1");
        setShowConverted(true);
      }
      // active → canceled (just hit cancel; period likely still valid)
      if (
        (prev === "active" || prev === "trialing") &&
        sub.status === "canceled"
      ) {
        window.localStorage.setItem(SHOW_CANCELED_NOTICE_KEY, "1");
        setShowCanceledNotice(true);
      }
      // canceled/active → free (expiration)
      if ((prev === "active" || prev === "canceled" || prev === "past_due") && sub.status === "free") {
        window.localStorage.setItem(SHOW_EXPIRED_KEY, "1");
        setShowExpired(true);
      }
    }
    window.localStorage.setItem(PREV_STATUS_KEY, sub.status);
  }, [sub.status, sub.loading]);

  const onPortal = async () => {
    setBusy(true);
    try {
      await openCustomerPortal();
    } catch {
      setBusy(false);
    }
  };

  // ---- One-time: trial converted ----
  if (showConverted && sub.status === "active") {
    return (
      <Bar
        bg={palette.softSage}
        headline="Welcome to QINO Premium"
        sub={
          sub.currentPeriodEnd
            ? `Your trial converted. Next billing: ${fmtDate(sub.currentPeriodEnd)}.`
            : "Your trial converted."
        }
        cta="Manage"
        onClick={onPortal}
        busy={busy}
        dismissable
        onDismiss={() => {
          window.localStorage.removeItem(SHOW_CONVERTED_KEY);
          setShowConverted(false);
        }}
      />
    );
  }

  // ---- One-time: subscription expired (period ended after cancel) ----
  if (showExpired && sub.status === "free") {
    return (
      <Bar
        bg={palette.softPeach}
        headline="Your subscription ended"
        sub="Resubscribe to keep your protocol active."
        cta="Resubscribe"
        onClick={() => navigate({ to: "/pricing" })}
        busy={false}
        dismissable
        onDismiss={() => {
          window.localStorage.removeItem(SHOW_EXPIRED_KEY);
          setShowExpired(false);
        }}
      />
    );
  }

  // ---- past_due (priority over trial banner) ----
  if (sub.status === "past_due") {
    return (
      <Bar
        bg={palette.softBlush}
        headline="Payment issue — update your card"
        sub="Your last payment failed. We’ll keep retrying. Update your card to avoid losing access."
        cta="Update payment"
        onClick={onPortal}
        busy={busy}
        warning
      />
    );
  }

  // ---- canceled but still in period ----
  const periodActive =
    sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() > Date.now();

  if (sub.status === "canceled" && periodActive) {
    return (
      <Bar
        bg={palette.softLavender}
        headline="Subscription canceled"
        sub={`Access continues until ${fmtDate(sub.currentPeriodEnd)}.`}
        cta="Resubscribe"
        onClick={() => navigate({ to: "/pricing" })}
        busy={false}
        dismissable={showCanceledNotice}
        onDismiss={
          showCanceledNotice
            ? () => {
                window.localStorage.removeItem(SHOW_CANCELED_NOTICE_KEY);
                setShowCanceledNotice(false);
              }
            : undefined
        }
      />
    );
  }

  // ---- trialing — day-aware ----
  if (sub.status === "trialing" && sub.trialEndsAt) {
    const end = new Date(sub.trialEndsAt);
    const totalDays = 3;
    const msLeft = end.getTime() - Date.now();
    const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
    const dayNum = Math.min(totalDays, Math.max(1, totalDays - daysLeft + 1));

    let bg = palette.softSage;
    let headline = "Welcome to QINO Premium";
    let sub2 = `Your trial is active. Day ${dayNum} of ${totalDays}.`;

    if (dayNum === 2) {
      bg = palette.softPeach;
      headline = "Day 2 of your trial";
      sub2 = "One more day before your card is charged.";
    } else if (dayNum >= 3) {
      bg = palette.softBlush;
      headline = "Trial ends today";
      const planLabel = sub.currentPlan === "annual" ? "annual" : "monthly";
      sub2 = `Your card will be charged for ${planLabel} in ${fmtHours(sub.trialEndsAt)}.`;
    }

    return (
      <Bar
        bg={bg}
        headline={headline}
        sub={sub2}
        cta="Manage"
        onClick={onPortal}
        busy={busy}
      />
    );
  }

  return null;
};

// ---------- Bar ----------
const Bar = ({
  bg,
  headline,
  sub,
  cta,
  onClick,
  busy,
  warning,
  dismissable,
  onDismiss,
}: {
  bg: string;
  headline: string;
  sub: string;
  cta: string;
  onClick: () => void;
  busy: boolean;
  warning?: boolean;
  dismissable?: boolean;
  onDismiss?: () => void;
}) => (
  <div
    className="px-4 py-2.5 flex items-center justify-between gap-3"
    style={{ background: bg, borderBottom: `1px solid ${palette.hairline}` }}
  >
    <div className="flex items-start gap-2 min-w-0">
      {warning && (
        <AlertCircle
          size={14}
          color={palette.midnight}
          strokeWidth={1.9}
          className="mt-0.5 shrink-0"
        />
      )}
      <div className="min-w-0">
        <div
          className="text-[12.5px] truncate"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
        >
          {headline}
        </div>
        <div
          className="text-[11px] truncate"
          style={{ fontFamily: fonts.body, color: palette.textMuted }}
        >
          {sub}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={onClick}
        disabled={busy}
        className="text-[11.5px] underline"
        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
      >
        {busy ? "…" : cta}
      </button>
      {dismissable && onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="w-5 h-5 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          <X size={11} color={palette.midnight} strokeWidth={2} />
        </button>
      )}
    </div>
  </div>
);
