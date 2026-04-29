// =====================================================================
// QINO — Treatment Pathways Modal
// Shows all 4 levels with safe educational language.
// Level 4 is locked unless user has opted in (gated=true).
// =====================================================================

import { Lock, Sparkle, ChevronRight } from "lucide-react";
import type { TreatmentPathways } from "../types";
import { palette, fonts } from "../theme";
import {
  Card,
  resolveAccent,
} from "./primitives";
import { Sheet } from "./Sheet";

interface PathwaysModalProps {
  open: boolean;
  onClose: () => void;
  pathways: TreatmentPathways;
  safetyNote: string;
  /** True if user opted in to Level 4 paths during onboarding. */
  level4Unlocked: boolean;
}

export const PathwaysModal = ({
  open,
  onClose,
  pathways,
  safetyNote,
  level4Unlocked,
}: PathwaysModalProps) => {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Treatment Pathways"
      title={pathways.comfortSummary}
    >
      <div className="space-y-3 pt-2">
        {pathways.levels.map((level) => {
          const accent = resolveAccent(level.accentKey);
          const isLocked = level.gated && !level4Unlocked;

          return (
            <Card
              key={level.number}
              bg={isLocked ? palette.stone : palette.white}
              padding="p-5"
              radius="rounded-[22px]"
              className={isLocked ? "opacity-75" : ""}
            >
              {/* Level header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ background: isLocked ? palette.hairline : accent }}
                >
                  <span
                    className="text-[18px]"
                    style={{
                      fontFamily: fonts.title,
                      fontWeight: 600,
                      color: palette.midnight,
                    }}
                  >
                    0{level.number}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-[15px]"
                      style={{
                        fontFamily: fonts.subtitle,
                        fontWeight: 600,
                        color: palette.ink,
                      }}
                    >
                      Level {level.number} — {level.title}
                    </h3>
                    {isLocked && (
                      <Lock size={11} color={palette.textMuted} strokeWidth={1.8} />
                    )}
                  </div>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{
                      fontFamily: fonts.body,
                      fontWeight: 400,
                      color: palette.textMuted,
                    }}
                  >
                    {level.sub}
                  </p>
                </div>
              </div>

              {/* Items */}
              {!isLocked ? (
                <div className="space-y-2">
                  {level.items.map((item, i, arr) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-start gap-3"
                      style={{
                        borderTop: i === 0 ? `1px solid ${palette.hairline}` : "none",
                        borderBottom:
                          i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px]"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 600,
                            color: palette.ink,
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="text-[10.5px] mt-0.5"
                          style={{
                            fontFamily: fonts.body,
                            fontWeight: 400,
                            color: palette.textMuted,
                          }}
                        >
                          {item.language}
                        </p>
                      </div>
                      <ChevronRight size={14} color={palette.textMuted} strokeWidth={1.6} />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[14px] p-3 flex items-center gap-2"
                  style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
                >
                  <Lock size={11} color={palette.textMuted} strokeWidth={1.8} />
                  <p
                    className="text-[11px]"
                    style={{
                      fontFamily: fonts.body,
                      fontWeight: 500,
                      color: palette.textMuted,
                    }}
                  >
                    Opt in to surgical and injectable discussion in settings to unlock.
                  </p>
                </div>
              )}
            </Card>
          );
        })}

        <div
          className="px-4 py-3 rounded-[14px] flex items-start gap-2.5"
          style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
        >
          <Sparkle
            size={11}
            color={palette.textMuted}
            strokeWidth={1.6}
            className="mt-0.5 flex-shrink-0"
          />
          <p
            className="text-[10.5px] leading-relaxed"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
          >
            {safetyNote}
          </p>
        </div>
      </div>
    </Sheet>
  );
};
