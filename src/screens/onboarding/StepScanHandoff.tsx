// =====================================================================
// QINO Onboarding — Final Step: Scan Handoff
// User chooses between "Start scan now" or "Go to dashboard"
// =====================================================================

import { Camera, Check, ArrowRight } from "lucide-react";
import { palette, fonts, shadows } from "../../theme";
import { Eyebrow, Title, Subtitle } from "./_primitives";

interface StepScanHandoffProps {
  onStartScan: () => void;
  onSkipToDashboard: () => void;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cardEyebrow: string;
    cardHeadline: string;
    promises: string[];
    primaryCta: string;
    secondaryCta: string;
    footnote: string;
  };
}

export const StepScanHandoff = ({
  onStartScan,
  onSkipToDashboard,
  content,
}: StepScanHandoffProps) => (
  <div className="px-5 pt-2 pb-32">
    <Eyebrow>{content.eyebrow}</Eyebrow>
    <Title>{content.title}</Title>
    <Subtitle>{content.subtitle}</Subtitle>

    <div
      className="mt-6 rounded-[24px] p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
        border: `1px solid ${palette.hairline}`,
        boxShadow: shadows.hero,
      }}
    >
      <div className="absolute -right-6 -bottom-6 opacity-15">
        <Camera size={140} color={palette.midnight} strokeWidth={1.4} />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <Camera size={15} color={palette.midnight} strokeWidth={1.6} />
          </div>
          <Eyebrow>{content.cardEyebrow}</Eyebrow>
        </div>

        <h2
          className="mt-4 text-[22px]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            color: palette.ink,
          }}
        >
          {content.cardHeadline}
        </h2>

        <div className="mt-4 space-y-2">
          {content.promises.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(15,27,38,0.10)" }}
              >
                <Check size={11} color={palette.midnight} strokeWidth={2.5} />
              </div>
              <span
                className="text-[12.5px]"
                style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-5 space-y-2.5">
      <button
        onClick={onStartScan}
        className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
        style={{ background: palette.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
      >
        <span
          className="flex items-center justify-center gap-2 text-[14px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
        >
          {content.primaryCta}
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </button>
      <button
        onClick={onSkipToDashboard}
        className="w-full py-3.5 rounded-full transition-all active:scale-[0.99]"
        style={{
          background: palette.white,
          border: `1.5px solid ${palette.hairlineMid}`,
          boxShadow: shadows.card,
        }}
      >
        <span
          className="text-[13.5px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
        >
          {content.secondaryCta}
        </span>
      </button>
    </div>

    <p
      className="mt-5 text-[11px] leading-relaxed text-center px-2"
      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textDim }}
    >
      {content.footnote}
    </p>
  </div>
);
