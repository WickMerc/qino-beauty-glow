// =====================================================================
// QINO — Progress Screen
// Props-driven. Consumes ProgressState.
// =====================================================================

import { useState } from "react";
import { Camera, Check, ArrowRight } from "lucide-react";
import type { ProgressState } from "../types";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, SectionHeading, Card, Pill, resolveAccent } from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface ProgressScreenProps {
  progress: ProgressState;
  subtitle: string;
  photoAngles: { id: string; label: string; uploaded: boolean }[];
}

export const ProgressScreen = ({
  progress,
  subtitle,
  photoAngles,
}: ProgressScreenProps) => {
  const [slider, setSlider] = useState(50);

  const stats = [
    { label: "Day", value: progress.currentDay.toString(), suffix: `/ ${progress.totalDays}`, accent: palette.paleBlue },
    { label: "Execution", value: progress.executionPercent.toString(), suffix: "%", accent: palette.softPeach },
    { label: "Photos", value: progress.photosUploaded.toString(), suffix: `/ ${progress.photosRequired}`, accent: palette.softLavender },
    { label: "Streak", value: progress.streakDays.toString(), suffix: "days", accent: palette.softSage },
  ];

  return (
    <div className="px-5 space-y-5 pb-8">
      <div className="pt-1">
        <h1
          className="text-[26px] leading-tight"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: palette.ink,
          }}
        >
          Progress
        </h1>
        <p
          className="text-[12.5px] mt-1"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {subtitle}
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s) => (
          <Card key={s.label} bg={s.accent} padding="p-4" radius="rounded-[20px]">
            <Eyebrow color={palette.textMuted}>{s.label}</Eyebrow>
            <p
              className="mt-2 text-[28px] leading-none"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: palette.ink,
              }}
            >
              {s.value}
              <span
                className="text-[14px] ml-1"
                style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
              >
                {s.suffix}
              </span>
            </p>
          </Card>
        ))}
      </div>

      {/* Photo angles */}
      <div>
        <SectionHeading>Photo Angles</SectionHeading>
        <div className="grid grid-cols-2 gap-2">
          {photoAngles.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-[16px]"
              style={{
                background: p.uploaded ? palette.midnight : palette.white,
                border: p.uploaded ? "none" : `1px solid ${palette.hairline}`,
                boxShadow: shadows.card,
              }}
            >
              {p.uploaded ? (
                <Check size={13} color={palette.mist} strokeWidth={2.5} />
              ) : (
                <Camera size={13} color={palette.textMuted} strokeWidth={1.5} />
              )}
              <span
                className="text-[12px]"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 500,
                  color: p.uploaded ? palette.stone : palette.ink,
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div>
        <SectionHeading>Trends</SectionHeading>
        <div className="space-y-2">
          {progress.trends.map((t) => {
            const accentColor = resolveAccent(t.accentKey);
            const bgAccent = resolveAccent(t.bgAccentKey);
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-[18px]"
                style={{
                  background: palette.white,
                  border: `1px solid ${palette.hairline}`,
                  boxShadow: shadows.card,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: accentColor }}
                />
                <span
                  className="flex-1 text-[13px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
                >
                  {t.label}
                </span>
                <span
                  className="text-[12.5px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
                >
                  {t.value}
                </span>
                <Pill bg={bgAccent} color={accentColor}>
                  {t.delta}
                </Pill>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
