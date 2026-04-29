// =====================================================================
// QINO — Processing Dashboard
// Shown while analysis is being generated. Mock animation.
// Phases come from /src/data/mockScan.ts → processingPhases.
// =====================================================================

import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import type { UserProfile } from "../../types";
import { mockScanState } from "../../data/mockScan";
import { palette, fonts, shadows } from "../../theme";
import {
  Eyebrow,
  ProgressBar,
  QinoMark,
  resolveAccent,
} from "../../components/primitives";
import { TopBar, BottomNav } from "../../components/Chrome";

interface ProcessingDashboardProps {
  user: UserProfile;
  greetingTitleA: string;        // "Building your"
  greetingTitleB: string;        // "QINO analysis"
  heroEyebrow: string;
  heroHeadlineA: string;         // "Reading your face,"
  heroHeadlineB: string;         // "building your plan."
  heroBody: string;
  ctaLabel: string;
  /** Time in ms between phase auto-advances. Defaults to 1800 for a more deliberate feel. */
  phaseStepMs?: number;
  onComplete: () => void;
}

export const ProcessingDashboard = ({
  user,
  greetingTitleA,
  greetingTitleB,
  heroEyebrow,
  heroHeadlineA,
  heroHeadlineB,
  heroBody,
  ctaLabel,
  phaseStepMs = 1800,
  onComplete,
}: ProcessingDashboardProps) => {
  const [phase, setPhase] = useState(0);
  const phases = mockScanState.processingPhases;

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p >= phases.length - 1) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, phaseStepMs);
    return () => clearInterval(interval);
  }, [phases.length, phaseStepMs]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-24">
        <TopBar user={user} />

        <div className="px-5 pt-2 space-y-5">
          <div className="pt-2">
            <h1
              className="text-[34px] leading-[1.05]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: palette.ink,
              }}
            >
              {greetingTitleA}
              <br />
              <span style={{ fontWeight: 500 }}>{greetingTitleB}</span>
            </h1>
          </div>

          {/* Hero */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.mist} 100%)`,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.hero,
              minHeight: 240,
            }}
          >
            <div
              className="absolute top-0 right-12 bottom-0 w-px qino-axis-pulse"
              style={{
                background: `linear-gradient(180deg, transparent, ${palette.midnight}, transparent)`,
              }}
            />

            <div className="relative">
              <Eyebrow color={palette.textMuted}>{heroEyebrow}</Eyebrow>
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
                {heroHeadlineA}
                <br />
                {heroHeadlineB}
              </h2>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
              >
                {heroBody}
              </p>
              <div className="mt-4">
                <ProgressBar value={((phase + 1) / phases.length) * 100} height={5} />
                <p
                  className="mt-2 text-[11px]"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.textMuted }}
                >
                  {phase + 1} of {phases.length}
                </p>
              </div>
            </div>
          </div>

          {/* Phase checklist */}
          <div className="space-y-2.5">
            {phases.map((p, i) => {
              const done = i < phase;
              const active = i === phase;
              const accentColor = resolveAccent(p.accentKey);
              return (
                <div
                  key={p.id}
                  className="rounded-[18px] p-4 flex items-center gap-3 transition-all"
                  style={{
                    background: active || done ? palette.white : palette.stone,
                    border: `1px solid ${palette.hairline}`,
                    boxShadow: active || done ? shadows.card : "none",
                    opacity: active || done ? 1 : 0.55,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: done ? palette.midnight : active ? accentColor : palette.stone,
                    }}
                  >
                    {done ? (
                      <Check size={14} color={palette.stone} strokeWidth={2.5} />
                    ) : active ? (
                      <div
                        className="w-3 h-3 rounded-full qino-pulse-dot"
                        style={{ background: palette.white }}
                      />
                    ) : (
                      <span
                        className="text-[11px]"
                        style={{
                          fontFamily: fonts.subtitle,
                          fontWeight: 600,
                          color: palette.textMuted,
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <p
                    className="flex-1 text-[12.5px]"
                    style={{
                      fontFamily: fonts.subtitle,
                      fontWeight: active ? 600 : 500,
                      color: active || done ? palette.ink : palette.textMuted,
                    }}
                  >
                    {p.label}
                  </p>
                  {active && (
                    <div className="flex gap-1">
                      <div
                        className="w-1 h-1 rounded-full qino-bounce-1"
                        style={{ background: palette.midnight }}
                      />
                      <div
                        className="w-1 h-1 rounded-full qino-bounce-2"
                        style={{ background: palette.midnight }}
                      />
                      <div
                        className="w-1 h-1 rounded-full qino-bounce-3"
                        style={{ background: palette.midnight }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {phase >= phases.length - 1 && (
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
              style={{
                background: palette.midnight,
                boxShadow: "0 8px 20px rgba(15,27,38,0.20)",
              }}
            >
              <span
                className="flex items-center justify-center gap-2 text-[14px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
              >
                {ctaLabel}
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </button>
          )}
        </div>
      </div>

      <BottomNav
        active="today"
        onChange={() => {}}
        lockedTabs={["analysis", "protocol", "progress", "coach"]}
      />
    </div>
  );
};
