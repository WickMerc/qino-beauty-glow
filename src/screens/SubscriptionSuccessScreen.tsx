// =====================================================================
// QINO — SubscriptionSuccessScreen (iteration 10)
// Polls subscription status after Stripe checkout completes.
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useSubscription } from "../hooks/useSubscription";

export const SubscriptionSuccessScreen = () => {
  const navigate = useNavigate();
  const sub = useSubscription();
  const [tries, setTries] = useState(0);
  const [stalled, setStalled] = useState(false);
  const triedRef = useRef(0);

  useEffect(() => {
    if (sub.isPaid) return;
    if (triedRef.current >= 5) {
      setStalled(true);
      return;
    }
    const t = setTimeout(() => {
      triedRef.current += 1;
      setTries((n) => n + 1);
      sub.refresh();
    }, 1000);
    return () => clearTimeout(t);
  }, [sub, tries]);

  const ready = sub.isPaid;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div
        className="max-w-[400px] w-full rounded-[24px] p-7 text-center"
        style={{
          background: `linear-gradient(140deg, ${palette.softLavender} 0%, ${palette.paleBlue} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.hero,
        }}
      >
        <div className="flex justify-center">
          <QinoMark size={44} />
        </div>

        {ready ? (
          <>
            <div className="mt-5 flex justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: palette.midnight }}
              >
                <Check size={20} color={palette.stone} strokeWidth={2.4} />
              </div>
            </div>
            <Eyebrow>You’re in</Eyebrow>
            <h1
              className="mt-2 text-[22px]"
              style={{ fontFamily: fonts.title, fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              Trial active for 3 days
            </h1>
            <p className="mt-2 text-[13px]" style={{ color: palette.textMuted }}>
              Your daily protocol, product stack, and Coach are unlocked.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full mt-6 py-3 rounded-full"
              style={{ background: palette.midnight }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
              >
                Continue
              </span>
            </button>
          </>
        ) : stalled ? (
          <>
            <Eyebrow>Almost there</Eyebrow>
            <h1
              className="mt-2 text-[20px]"
              style={{ fontFamily: fonts.title, fontWeight: 600 }}
            >
              We’re still syncing your subscription
            </h1>
            <p className="mt-2 text-[13px]" style={{ color: palette.textMuted }}>
              Your payment went through. Try refreshing in a moment — or head back to the dashboard.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full mt-6 py-3 rounded-full"
              style={{ background: palette.midnight }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
              >
                Back to dashboard
              </span>
            </button>
          </>
        ) : (
          <>
            <div className="mt-5 flex justify-center">
              <Loader2 size={28} color={palette.midnight} className="animate-spin" />
            </div>
            <h1
              className="mt-4 text-[18px]"
              style={{ fontFamily: fonts.title, fontWeight: 600 }}
            >
              Setting up your subscription…
            </h1>
            <p className="mt-2 text-[12px]" style={{ color: palette.textMuted }}>
              This usually takes just a few seconds.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
