// =====================================================================
// QINO Onboarding — Step 8: Hair & Facial Frame (gender-aware)
// Reads conditional logic based on personalization (gender + direction).
// =====================================================================

import { Check } from "lucide-react";
import type { HairAndFrame, Personalization } from "../../types";
import {
  hairlineOptions,
  densityOptions,
  facialHairOptions,
  framingOptions,
  neutralGroomingOptions,
} from "../../data/mockOnboarding";
import { palette, fonts, shadows } from "../../theme";
import { Eyebrow, Title, Subtitle, GroupLabel, Chip, Footer } from "./_primitives";

interface StepHairProps {
  value: HairAndFrame;
  personalization: Personalization;
  onChange: (v: HairAndFrame) => void;
  onContinue: () => void;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    hairlineLabel: string;
    densityLabel: string;
    styleGoalLabel: string;
    styleGoalPlaceholder: string;
    facialHairLabel: string;
    framingLabel: string;
    neutralLabel: string;
    skipLabel: string;
  };
}

export const StepHair = ({
  value,
  personalization,
  onChange,
  onContinue,
  content,
}: StepHairProps) => {
  const update = <K extends keyof HairAndFrame>(key: K, v: HairAndFrame[K]) =>
    onChange({ ...value, [key]: v });

  // Conditional logic: gender or aesthetic direction drives which extra section appears
  const showFacialHair =
    personalization.gender === "male" || personalization.direction === "masculine";
  const showFraming =
    personalization.gender === "female" || personalization.direction === "feminine";
  const showNeutral = !showFacialHair && !showFraming;

  const toggleNeutral = (id: string) => {
    const current = value.neutralPrefs ?? [];
    update(
      "neutralPrefs",
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id]
    );
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      {/* Universal: hairline */}
      <div className="mt-6">
        <GroupLabel>{content.hairlineLabel}</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {hairlineOptions.map((h) => (
            <Chip
              key={h}
              label={h}
              selected={value.hairline === h}
              onClick={() => update("hairline", value.hairline === h ? null : h)}
              accent={palette.paleBlue}
            />
          ))}
        </div>
      </div>

      {/* Universal: density */}
      <div className="mt-5">
        <GroupLabel>{content.densityLabel}</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {densityOptions.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={value.density === d}
              onClick={() => update("density", value.density === d ? null : d)}
              accent={palette.softLavender}
            />
          ))}
        </div>
      </div>

      {/* Universal: free-text style goal */}
      <div className="mt-5">
        <GroupLabel>{content.styleGoalLabel}</GroupLabel>
        <input
          value={value.styleGoal ?? ""}
          onChange={(e) => update("styleGoal", e.target.value)}
          placeholder={content.styleGoalPlaceholder}
          className="w-full px-4 py-3.5 rounded-[16px] text-[13.5px] outline-none"
          style={{
            background: palette.white,
            border: `1px solid ${palette.hairline}`,
            boxShadow: shadows.card,
            fontFamily: fonts.body,
            fontWeight: 400,
            color: palette.ink,
          }}
        />
      </div>

      {/* Conditional: facial hair (male / masculine) */}
      {showFacialHair && (
        <div className="mt-5">
          <GroupLabel>{content.facialHairLabel}</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {facialHairOptions.map((g) => (
              <Chip
                key={g}
                label={g}
                selected={value.facialHair === g}
                onClick={() => update("facialHair", value.facialHair === g ? null : g)}
                accent={palette.softPeach}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conditional: framing (female / feminine) */}
      {showFraming && (
        <div className="mt-5">
          <GroupLabel>{content.framingLabel}</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {framingOptions.map((f) => (
              <Chip
                key={f}
                label={f}
                selected={value.framing === f}
                onClick={() => update("framing", value.framing === f ? null : f)}
                accent={palette.softBlush}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conditional: neutral / multi-checkbox */}
      {showNeutral && (
        <div className="mt-5">
          <GroupLabel>{content.neutralLabel}</GroupLabel>
          <div className="space-y-2">
            {neutralGroomingOptions.map((n) => {
              const selected = (value.neutralPrefs ?? []).includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => toggleNeutral(n.id)}
                  className="w-full rounded-[16px] p-3.5 flex items-center gap-3 active:scale-[0.99] transition-all text-left"
                  style={{
                    background: selected ? palette.softLavender : palette.white,
                    border: `1.5px solid ${selected ? palette.midnight : palette.hairline}`,
                    boxShadow: shadows.card,
                  }}
                >
                  <span
                    className="flex-1 text-[13px]"
                    style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.ink }}
                  >
                    {n.label}
                  </span>
                  <div
                    className="w-5 h-5 rounded-[6px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: selected ? palette.midnight : "transparent",
                      border: selected ? "none" : `1.5px solid ${palette.hairlineMid}`,
                    }}
                  >
                    {selected && <Check size={11} color={palette.stone} strokeWidth={2.8} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Footer
        onContinue={onContinue}
        secondary={{ label: content.skipLabel, onClick: onContinue }}
      />
    </div>
  );
};
