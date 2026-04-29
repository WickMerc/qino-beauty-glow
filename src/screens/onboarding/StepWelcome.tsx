// =====================================================================
// QINO Onboarding — Step 0: Welcome
// All copy lives in /src/data/mockDashboard.ts and via props.
// =====================================================================

import { Target, Sparkles, Camera } from "lucide-react";
import { palette, fonts, shadows } from "../../theme";
import { QinoMark } from "../../components/primitives";
import { Eyebrow, Footer } from "./_primitives";

interface WelcomeContent {
  eyebrow: string;
  title: string;
  intro: string;
  promises: { iconKey: string; label: string; sub: string; bgKey: string }[];
  safetyDisclaimer: string;
  ctaLabel: string;
}

interface StepWelcomeProps {
  content: WelcomeContent;
  onContinue: () => void;
}

const iconMap = { target: Target, sparkles: Sparkles, camera: Camera } as const;
const accentMap: Record<string, string> = {
  softBlush: palette.softBlush,
  softPeach: palette.softPeach,
  softSage: palette.softSage,
};

export const StepWelcome = ({ content, onContinue }: StepWelcomeProps) => (
  <div
    className="px-5 pt-2 pb-32 flex flex-col"
    style={{ minHeight: "calc(100vh - 120px)" }}
  >
    <div
      className="rounded-[28px] p-8 relative overflow-hidden mb-6"
      style={{
        background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
        border: `1px solid ${palette.hairline}`,
        boxShadow: shadows.hero,
        minHeight: 280,
      }}
    >
      <div className="relative h-full flex flex-col justify-end" style={{ minHeight: 240 }}>
        <Eyebrow color={palette.textMuted}>{content.eyebrow}</Eyebrow>
        <h1
          className="mt-3 text-[34px]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: palette.ink,
          }}
        >
          {content.title}
        </h1>
      </div>
    </div>

    <p
      className="text-[14px] leading-[1.55]"
      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
    >
      {content.intro}
    </p>

    <div className="mt-6 space-y-2.5">
      {content.promises.map((p) => {
        const Icon = iconMap[p.iconKey as keyof typeof iconMap] ?? Sparkles;
        const bg = accentMap[p.bgKey] ?? palette.softBlush;
        return (
          <div
            key={p.label}
            className="rounded-[18px] p-3.5 flex items-center gap-3"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}
            >
              <Icon size={16} strokeWidth={1.6} color={palette.midnight} />
            </div>
            <div>
              <p
                className="text-[13px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {p.label}
              </p>
              <p
                className="text-[11.5px] mt-0.5"
                style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
              >
                {p.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    <p
      className="mt-6 text-[11px] leading-relaxed text-center px-4"
      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textDim }}
    >
      {content.safetyDisclaimer}
    </p>

    <Footer onContinue={onContinue} label={content.ctaLabel} />
  </div>
);
