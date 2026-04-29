// =====================================================================
// QINO — Trial Offer Card
// Placeholder paywall surface shown wherever a feature is locked.
// Real paywall UI lands in iteration 9.
//
// Two variants:
//   - "card" — inline section card, blocks a single feature
//   - "screen" — full-screen takeover, used for entire locked tabs
// =====================================================================

import { Lock, ArrowRight, Check, Sparkles } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "./primitives";

interface TrialOfferProps {
  /** Display variant. */
  variant?: "card" | "screen";
  /** Feature label that's locked, e.g. "Daily protocol". */
  featureName: string;
  /** Short context line, e.g. "Check off today's tasks." */
  contextLine?: string;
  /** Called when the user starts the trial. Wires to setSubscriptionStatus. */
  onStartTrial: () => void;
}

const benefits = [
  "Full daily protocol with checkable tasks",
  "Personalized product stack",
  "Treatment pathways at every level",
  "Progress tracking + monthly re-analysis",
  "Unlimited Coach grounded in your report",
];

export const TrialOfferCard = ({
  variant = "card",
  featureName,
  contextLine,
  onStartTrial,
}: TrialOfferProps) => {
  if (variant === "card") {
    return (
      <div
        className="rounded-[22px] p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${palette.softLavender} 0%, ${palette.softBlush} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
        }}
      >
        <div className="relative">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.65)" }}
            >
              <Lock size={13} color={palette.midnight} strokeWidth={1.8} />
            </div>
            <Eyebrow>{featureName} · Locked</Eyebrow>
          </div>
          {contextLine && (
            <p
              className="mt-3 text-[14px] leading-snug"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: palette.ink,
              }}
            >
              {contextLine}
            </p>
          )}
          <p
            className="mt-2 text-[12px] leading-relaxed"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
          >
            Start your 3-day free trial to unlock the full QINO daily system.
          </p>
          <button
            onClick={onStartTrial}
            className="w-full mt-4 py-3 rounded-full transition-all active:scale-[0.99]"
            style={{
              background: palette.midnight,
              boxShadow: "0 8px 20px rgba(15,27,38,0.20)",
            }}
          >
            <span
              className="flex items-center justify-center gap-2 text-[13px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
            >
              Start 3-day free trial
              <ArrowRight size={14} strokeWidth={2} />
            </span>
          </button>
          <p
            className="mt-2 text-[10px] text-center"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textDim }}
          >
            Card on file required. Cancel anytime in settings.
          </p>
        </div>
      </div>
    );
  }

  // Screen variant — used for locked tabs
  return (
    <div className="px-5 py-12">
      <div
        className="rounded-[28px] p-7 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.hero,
        }}
      >
        <div className="relative">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4"
            style={{ background: "rgba(255,255,255,0.65)" }}
          >
            <Sparkles size={17} color={palette.midnight} strokeWidth={1.6} />
          </div>
          <Eyebrow color={palette.textMuted}>{featureName}</Eyebrow>
          <h2
            className="mt-3 text-[22px]"
            style={{
              fontFamily: fonts.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              color: palette.ink,
            }}
          >
            Unlock your full daily system
          </h2>
          <p
            className="mt-3 text-[13px] leading-[1.55]"
            style={{
              fontFamily: fonts.body,
              fontWeight: 400,
              color: palette.ink,
              opacity: 0.78,
            }}
          >
            Your report is just the beginning. The daily execution is what
            actually changes how your face looks.
          </p>

          <div className="mt-5 space-y-2.5">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(15,27,38,0.10)" }}
                >
                  <Check size={11} color={palette.midnight} strokeWidth={2.5} />
                </div>
                <span
                  className="flex-1 text-[12.5px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
                >
                  {b}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onStartTrial}
            className="w-full mt-6 py-4 rounded-full transition-all active:scale-[0.99]"
            style={{
              background: palette.midnight,
              boxShadow: "0 8px 20px rgba(15,27,38,0.20)",
            }}
          >
            <span
              className="flex items-center justify-center gap-2 text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
            >
              Start 3-day free trial
              <ArrowRight size={15} strokeWidth={2} />
            </span>
          </button>
          <p
            className="mt-3 text-[11px] text-center leading-relaxed"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textDim }}
          >
            Card on file required. After trial: $19/month. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
