// =====================================================================
// QINO — Guided Scan Flow
// 3 internal stages: prep → capture (×6) → review.
// On submit, calls onSubmit() to let parent transition to processing.
// All scan data from /src/data/mockScan.ts.
// =====================================================================

import { useState } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  X,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import type { ScanAngle, ScanValidation } from "../../types";
import { mockScanState, scanPrepChecklist } from "../../data/mockScan";
import { palette, fonts, shadows } from "../../theme";
import {
  Eyebrow,
  QinoMark,
  resolveAccent,
} from "../../components/primitives";
import { Title, Subtitle, SafetyNote } from "../onboarding/_primitives";
import { getIcon } from "../../iconRegistry";

interface GuidedScanProps {
  onClose: () => void;
  onSubmit: () => void;
  prepContent: {
    eyebrow: string;
    title: string;
    subtitle: string;
    safetyNote: string;
    beginCta: string;
  };
  reviewContent: {
    eyebrow: string;
    title: string;
    subtitle: string;
    submitCta: string;
  };
}

type Stage = "prep" | "capture" | "review";

export const GuidedScan = ({
  onClose,
  onSubmit,
  prepContent,
  reviewContent,
}: GuidedScanProps) => {
  const angles = mockScanState.angles;
  const [stage, setStage] = useState<Stage>("prep");
  const [captureIndex, setCaptureIndex] = useState(0);
  const [photos, setPhotos] = useState<Record<string, boolean>>({});
  const [validation] = useState<ScanValidation>(mockScanState.validation);

  const handleCapture = () => {
    setPhotos((p) => ({ ...p, [angles[captureIndex].id]: true }));
    if (captureIndex < angles.length - 1) {
      setCaptureIndex(captureIndex + 1);
    } else {
      setStage("review");
    }
  };

  const handleBack = () => {
    if (captureIndex > 0) setCaptureIndex(captureIndex - 1);
    else setStage("prep");
  };

  const handleRetake = (idx: number) => {
    setCaptureIndex(idx);
    setStage("capture");
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      {/* Mini header */}
      <header className="px-5 pt-3 pb-3 flex items-center justify-between max-w-[440px] mx-auto">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: palette.white,
            border: `1px solid ${palette.hairline}`,
            boxShadow: shadows.card,
          }}
        >
          <X size={15} color={palette.midnight} strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <QinoMark size={22} />
          <span
            className="text-[12px]"
            style={{
              fontFamily: fonts.title,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: palette.midnight,
            }}
          >
            SCAN
          </span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      <div className="max-w-[440px] mx-auto">
        {stage === "prep" && (
          <ScanPrepStage
            content={prepContent}
            onBegin={() => setStage("capture")}
          />
        )}
        {stage === "capture" && (
          <ScanCaptureStage
            angle={angles[captureIndex]}
            onCapture={handleCapture}
            onBack={handleBack}
            currentIndex={captureIndex}
            total={angles.length}
            validation={validation}
          />
        )}
        {stage === "review" && (
          <ScanReviewStage
            angles={angles}
            content={reviewContent}
            onSubmit={onSubmit}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  );
};

// ---------- Prep stage ----------
const ScanPrepStage = ({
  content,
  onBegin,
}: {
  content: GuidedScanProps["prepContent"];
  onBegin: () => void;
}) => (
  <div className="px-5 pt-2 pb-32">
    <Eyebrow>{content.eyebrow}</Eyebrow>
    <Title>{content.title}</Title>
    <Subtitle>{content.subtitle}</Subtitle>

    <div className="mt-6 space-y-2.5">
      {scanPrepChecklist.map((c, i) => {
        const Icon = getIcon(c.iconKey);
        const accent = resolveAccent(c.accentKey);
        return (
          <div
            key={i}
            className="rounded-[18px] p-4 flex items-center gap-3"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: accent }}
            >
              <Icon size={15} color={palette.midnight} strokeWidth={1.6} />
            </div>
            <span
              className="flex-1 text-[13px]"
              style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
            >
              {c.text}
            </span>
          </div>
        );
      })}
    </div>

    <SafetyNote>{content.safetyNote}</SafetyNote>

    <div
      className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
      style={{
        background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}
    >
      <button
        onClick={onBegin}
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
          {content.beginCta}
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </button>
    </div>
  </div>
);

// ---------- Capture stage ----------
const ScanCaptureStage = ({
  angle,
  onCapture,
  onBack,
  currentIndex,
  total,
  validation,
}: {
  angle: ScanAngle;
  onCapture: () => void;
  onBack: () => void;
  currentIndex: number;
  total: number;
  validation: ScanValidation;
}) => {
  const messages = {
    lighting: { good: "Good lighting", warn: "Too dark", bad: "Too dark" },
    sharpness: { good: "Sharp", warn: "Hold still", bad: "Too blurry" },
    centered: { good: "Face centered", warn: "Move slightly", bad: "Off-center" },
    angle: { good: "Correct angle", warn: angle.angleHint || "Adjust angle", bad: "Wrong angle" },
  };

  const dotColor = (v: "good" | "warn" | "bad") =>
    v === "good"
      ? palette.sageAccent
      : v === "warn"
        ? palette.peachAccent
        : palette.blushAccent;

  return (
    <div className="px-5 pt-2 pb-32">
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>
          Scan {currentIndex + 1} of {total}
        </Eyebrow>
        <span
          className="text-[11px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.textMuted }}
        >
          {angle.id}
        </span>
      </div>
      <Title size={26}>{angle.label}</Title>
      <Subtitle>{angle.instruction}</Subtitle>

      {/* Camera placeholder */}
      <div
        className="mt-5 rounded-[24px] aspect-[3/4] relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 280"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="faceGuide" cx="50%" cy="42%" r="42%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="130" rx="58" ry="80" fill="url(#faceGuide)" />
          <ellipse
            cx="100"
            cy="130"
            rx="58"
            ry="80"
            stroke="rgba(15,27,38,0.45)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
            fill="none"
          />
          <line x1="100" y1="118" x2="100" y2="142" stroke="rgba(15,27,38,0.40)" strokeWidth="1" />
          <line x1="88" y1="130" x2="112" y2="130" stroke="rgba(15,27,38,0.40)" strokeWidth="1" />
          {[
            "M30 30 L30 50 M30 30 L50 30",
            "M170 30 L170 50 M170 30 L150 30",
            "M30 250 L30 230 M30 250 L50 250",
            "M170 250 L170 230 M170 250 L150 250",
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(15,27,38,0.55)" strokeWidth="2" fill="none" />
          ))}
        </svg>

        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10.5px] flex items-center gap-1.5"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            fontFamily: fonts.subtitle,
            fontWeight: 600,
            color: palette.midnight,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: palette.peachAccent }} />
          {angle.angleHint || "Position face inside guide"}
        </div>
      </div>

      {/* Validation grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {([
          { key: "lighting", label: "Lighting" },
          { key: "sharpness", label: "Sharpness" },
          { key: "centered", label: "Centered" },
          { key: "angle", label: "Angle" },
        ] as const).map((row) => (
          <div
            key={row.key}
            className="rounded-[14px] px-3 py-2.5 flex items-center gap-2"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: dotColor(validation[row.key]) }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.textMuted }}
              >
                {row.label}
              </p>
              <p
                className="text-[11.5px] truncate"
                style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
              >
                {messages[row.key][validation[row.key]]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Capture controls */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <Lightbulb size={16} color={palette.midnight} strokeWidth={1.6} />
          </button>

          <button
            onClick={onCapture}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-[0.95]"
            style={{
              background: palette.midnight,
              boxShadow: "0 12px 28px rgba(15,27,38,0.30)",
              border: `4px solid ${palette.white}`,
              outline: `2px solid rgba(15,27,38,0.20)`,
            }}
          >
            <Camera size={26} color={palette.stone} strokeWidth={1.6} />
          </button>

          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <ChevronLeft size={16} color={palette.midnight} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- Review stage ----------
const ScanReviewStage = ({
  angles,
  content,
  onSubmit,
  onRetake,
}: {
  angles: ScanAngle[];
  content: GuidedScanProps["reviewContent"];
  onSubmit: () => void;
  onRetake: (idx: number) => void;
}) => {
  const accents = [
    palette.paleBlue,
    palette.softBlush,
    palette.softLavender,
    palette.softPeach,
    palette.softSage,
    palette.paleBlue,
  ];

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {angles.map((a, i) => (
          <div
            key={a.id}
            className="rounded-[20px] aspect-[3/4] relative overflow-hidden"
            style={{
              background: accents[i % accents.length],
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <defs>
                <radialGradient id={`rg${a.id}`} cx="50%" cy="40%" r="45%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                </radialGradient>
              </defs>
              <ellipse cx="50" cy="50" rx="28" ry="36" fill={`url(#rg${a.id})`} />
            </svg>

            <div
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: "rgba(15,27,38,0.85)" }}
            >
              <Check size={10} color={palette.stone} strokeWidth={2.5} />
              <span
                className="text-[9px]"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  color: palette.stone,
                  letterSpacing: "0.04em",
                }}
              >
                Approved
              </span>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 px-2.5 py-2 flex items-center justify-between"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(15,27,38,0.20) 100%)",
              }}
            >
              <span
                className="text-[10.5px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {a.label}
              </span>
              <button
                onClick={() => onRetake(i)}
                className="px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  fontSize: 9.5,
                  color: palette.midnight,
                }}
              >
                Retake
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <button
          onClick={onSubmit}
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
            {content.submitCta}
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  );
};
