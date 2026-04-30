// =====================================================================
// QINO — SubscriptionBanner (iteration 10)
// Persistent top-of-dashboard banner for trialing/past_due/canceled states.
// =====================================================================

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { palette, fonts } from "../theme";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal } from "../data/qinoApi";

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";

export const SubscriptionBanner = () => {
  const sub = useSubscription();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const onPortal = async () => {
    setBusy(true);
    try {
      await openCustomerPortal();
    } catch {
      setBusy(false);
    }
  };

  if (sub.status === "trialing" && sub.trialEndsAt) {
    const end = new Date(sub.trialEndsAt);
    const totalDays = 3;
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
    const dayNum = Math.min(totalDays, totalDays - daysLeft + 1);
    return (
      <Bar
        bg={palette.softLavender}
        text={`Day ${dayNum} of ${totalDays} — Trial ends ${fmtDate(sub.trialEndsAt)}`}
        cta="Manage"
        onClick={onPortal}
        busy={busy}
      />
    );
  }

  if (sub.status === "past_due") {
    return (
      <Bar
        bg={palette.softBlush}
        text="Payment issue — update your card to keep access"
        cta="Update"
        onClick={onPortal}
        busy={busy}
      />
    );
  }

  if (
    sub.status === "canceled" &&
    sub.currentPeriodEnd &&
    new Date(sub.currentPeriodEnd).getTime() > Date.now()
  ) {
    return (
      <Bar
        bg={palette.softPeach}
        text={`Subscription canceled — access until ${fmtDate(sub.currentPeriodEnd)}`}
        cta="Resubscribe"
        onClick={() => navigate({ to: "/pricing" })}
        busy={false}
      />
    );
  }

  return null;
};

const Bar = ({
  bg,
  text,
  cta,
  onClick,
  busy,
}: {
  bg: string;
  text: string;
  cta: string;
  onClick: () => void;
  busy: boolean;
}) => (
  <div
    className="px-4 py-2 flex items-center justify-between gap-3"
    style={{ background: bg, borderBottom: `1px solid ${palette.hairline}` }}
  >
    <span
      className="text-[12px] truncate"
      style={{ fontFamily: fonts.body, color: palette.ink }}
    >
      {text}
    </span>
    <button
      onClick={onClick}
      disabled={busy}
      className="text-[11.5px] underline shrink-0"
      style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
    >
      {busy ? "…" : cta}
    </button>
  </div>
);
