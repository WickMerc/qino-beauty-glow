// =====================================================================
// QINO — Monthly Photo Upload
// Simpler than GuidedScan — just 6 angles, no prep checklist, no
// validation steps. For routine progress photos, not initial scans.
//
// BACKEND REPLACEMENT POINT:
//   POST /api/me/progress/photos
// =====================================================================

import { useState } from "react";
import { ChevronLeft, Camera, Check, ArrowRight } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, resolveAccent } from "./primitives";

interface PhotoAngle {
  id: string;
  label: string;
  /** Soft accent for the placeholder card. */
  accentKey: string;
}

interface MonthlyPhotoUploadProps {
  /** Title shown at top, e.g. "Day 30 photos" */
  title: string;
  subtitle: string;
  angles: PhotoAngle[];
  /** Already-uploaded angle ids (for resume / partial sessions). */
  initialUploaded?: string[];
  onClose: () => void;
  /** Called once all 6 angles are uploaded and the user submits. */
  onSubmit: () => void;
  submitCtaLabel?: string;
}

export const MonthlyPhotoUpload = ({
  title,
  subtitle,
  angles,
  initialUploaded = [],
  onClose,
  onSubmit,
  submitCtaLabel = "Submit photos",
}: MonthlyPhotoUploadProps) => {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set(initialUploaded));

  const toggle = (id: string) => {
    setUploaded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allDone = uploaded.size === angles.length;
  const progress = uploaded.size;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-32">
        {/* Header */}
        <header className="px-5 pt-3 pb-2 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <ChevronLeft size={16} color={palette.midnight} strokeWidth={1.8} />
          </button>
          <Eyebrow>Monthly check-in</Eyebrow>
          <div style={{ width: 36 }} />
        </header>

        <div className="px-5 pt-2 space-y-5">
          {/* Title */}
          <div>
            <h1
              className="text-[26px] leading-[1.1]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: palette.ink,
              }}
            >
              {title}
            </h1>
            <p
              className="mt-2 text-[13px] leading-[1.5]"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              {subtitle}
            </p>
          </div>

          {/* Progress strip */}
          <div
            className="rounded-[20px] px-5 py-4"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[11px] uppercase"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: palette.textMuted,
                }}
              >
                Progress
              </span>
              <span
                className="text-[12px]"
                style={{ fontFamily: fonts.body, fontWeight: 600, color: palette.ink }}
              >
                {progress} / {angles.length}
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 4, background: "rgba(15,27,38,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(progress / angles.length) * 100}%`,
                  background: palette.midnight,
                }}
              />
            </div>
          </div>

          {/* Photo angles grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {angles.map((angle) => {
              const done = uploaded.has(angle.id);
              const accent = resolveAccent(angle.accentKey, palette.paleBlue);
              return (
                <button
                  key={angle.id}
                  onClick={() => toggle(angle.id)}
                  className="rounded-[20px] aspect-[3/4] relative overflow-hidden active:scale-[0.98] transition-all text-left"
                  style={{
                    background: done ? palette.midnight : accent,
                    border: `1.5px solid ${done ? palette.midnight : palette.hairline}`,
                    boxShadow: shadows.card,
                  }}
                >
                  {/* Face silhouette guide */}
                  {!done && (
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                      <defs>
                        <radialGradient id={`mu-${angle.id}`} cx="50%" cy="40%" r="45%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                        </radialGradient>
                      </defs>
                      <ellipse cx="50" cy="50" rx="26" ry="34" fill={`url(#mu-${angle.id})`} />
                    </svg>
                  )}

                  {/* Status badge */}
                  <div
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      background: done ? "rgba(255,255,255,0.95)" : "rgba(15,27,38,0.85)",
                    }}
                  >
                    {done ? (
                      <>
                        <Check size={10} color={palette.midnight} strokeWidth={2.5} />
                        <span
                          className="text-[9px]"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 600,
                            color: palette.midnight,
                            letterSpacing: "0.04em",
                          }}
                        >
                          Uploaded
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera size={10} color={palette.stone} strokeWidth={2} />
                        <span
                          className="text-[9px]"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 600,
                            color: palette.stone,
                            letterSpacing: "0.04em",
                          }}
                        >
                          Tap to add
                        </span>
                      </>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2"
                    style={{
                      background: done
                        ? "linear-gradient(180deg, transparent 0%, rgba(15,27,38,0.55) 100%)"
                        : "linear-gradient(180deg, transparent 0%, rgba(15,27,38,0.20) 100%)",
                    }}
                  >
                    <span
                      className="text-[11.5px]"
                      style={{
                        fontFamily: fonts.subtitle,
                        fontWeight: 600,
                        color: done ? palette.stone : palette.ink,
                      }}
                    >
                      {angle.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky CTA */}
        <div
          className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
          style={{
            background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
            paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
          }}
        >
          <button
            onClick={allDone ? onSubmit : undefined}
            disabled={!allDone}
            className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
            style={{
              background: allDone ? palette.midnight : palette.stone,
              opacity: allDone ? 1 : 0.6,
              boxShadow: allDone ? "0 8px 20px rgba(15,27,38,0.20)" : "none",
            }}
          >
            <span
              className="flex items-center justify-center gap-2 text-[14px]"
              style={{
                fontFamily: fonts.subtitle,
                fontWeight: 600,
                color: allDone ? palette.stone : palette.textMuted,
              }}
            >
              {allDone ? submitCtaLabel : `Upload ${angles.length - progress} more`}
              {allDone && <ArrowRight size={15} strokeWidth={2} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
