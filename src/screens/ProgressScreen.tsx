// =====================================================================
// QINO — Progress Screen
// Props-driven. Consumes ProgressState.
// Adds: "Next check-in" card, empty state, upload CTA.
// =====================================================================

import { Camera, Check, ArrowRight, Calendar } from "lucide-react";
import type { ProgressState } from "../types";
import { palette, fonts, shadows } from "../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  Pill,
  resolveAccent,
} from "../components/primitives";

interface ProgressScreenProps {
  progress: ProgressState;
  subtitle: string;
  photoAngles: { id: string; label: string; uploaded: boolean }[];
  /** True when the user has zero progress photos uploaded. */
  isEmpty: boolean;
  /** Triggered by the "Upload" CTA — opens the monthly photo upload flow. */
  onStartUpload: () => void;
  /** Eyebrow label for the next check-in card. */
  nextCheckInEyebrow: string;
  /** Headline for the next check-in card. */
  nextCheckInHeadline: string;
  /** Sub copy for the next check-in card. */
  nextCheckInSub: string;
  uploadCtaLabel: string;
}

export const ProgressScreen = ({
  progress,
  subtitle,
  photoAngles,
  isEmpty,
  onStartUpload,
  nextCheckInEyebrow,
  nextCheckInHeadline,
  nextCheckInSub,
  uploadCtaLabel,
}: ProgressScreenProps) => {
  const stats = [
    {
      label: "Day",
      value: progress.currentDay.toString(),
      suffix: `/ ${progress.totalDays}`,
      accent: palette.paleBlue,
    },
    {
      label: "Execution",
      value: progress.executionPercent.toString(),
      suffix: "%",
      accent: palette.softPeach,
    },
    {
      label: "Photos",
      value: progress.photosUploaded.toString(),
      suffix: `/ ${progress.photosRequired}`,
      accent: palette.softLavender,
    },
    {
      label: "Streak",
      value: progress.streakDays.toString(),
      suffix: "days",
      accent: palette.softSage,
    },
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

      {/* Next check-in hero card */}
      <Card padding="p-5" radius="rounded-[24px]" bg={palette.softLavender}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.65)" }}
          >
            <Calendar size={16} color={palette.midnight} strokeWidth={1.6} />
          </div>
          <div className="flex-1 min-w-0">
            <Eyebrow color={palette.textMuted}>{nextCheckInEyebrow}</Eyebrow>
            <h3
              className="mt-1.5 text-[16px]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: palette.ink,
              }}
            >
              {nextCheckInHeadline}
            </h3>
            <p
              className="text-[12px] mt-1 leading-snug"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              {nextCheckInSub}
            </p>
          </div>
        </div>
        <button
          onClick={onStartUpload}
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
            {uploadCtaLabel}
            <ArrowRight size={14} strokeWidth={2} />
          </span>
        </button>
      </Card>

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

      {/* Photo angles checklist */}
      <div>
        <SectionHeading>Photo angles</SectionHeading>
        {isEmpty ? (
          <Card padding="p-6" radius="rounded-[20px]" bg={palette.stone}>
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3 mx-auto"
              style={{ background: palette.white }}
            >
              <Camera size={17} color={palette.steel} strokeWidth={1.6} />
            </div>
            <p
              className="text-center text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              No photos yet
            </p>
            <p
              className="text-center text-[12px] mt-1"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              Upload your first set to start tracking visible changes.
            </p>
          </Card>
        ) : (
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
        )}
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
