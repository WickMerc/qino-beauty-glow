// =====================================================================
// QINO Onboarding — Step 2: Personalization (gender + aesthetic direction)
// =====================================================================

import { User } from "lucide-react";
import type { Personalization } from "../../types";
import { genderOptions, directionOptions } from "../../data/mockOnboarding";
import { palette, fonts, shadows } from "../../theme";
import { getIcon } from "../../iconRegistry";
import { resolveAccent } from "../../components/primitives";
import {
  Eyebrow,
  Title,
  Subtitle,
  GroupLabel,
  OptionCard,
  Footer,
  SafetyNote,
} from "./_primitives";

interface StepPersonalizationProps {
  value: Personalization;
  onChange: (v: Personalization) => void;
  onContinue: () => void;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    genderQuestion: string;
    directionQuestion: string;
    safetyNote: string;
  };
}

export const StepPersonalization = ({
  value,
  onChange,
  onContinue,
  content,
}: StepPersonalizationProps) => {
  const update = <K extends keyof Personalization>(key: K, v: Personalization[K]) =>
    onChange({ ...value, [key]: v });

  const valid = !!value.gender && !!value.direction;

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6">
        <GroupLabel>{content.genderQuestion}</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((g) => {
            const selected = value.gender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => update("gender", g.id)}
                className="rounded-[18px] p-4 flex flex-col items-start gap-2 active:scale-[0.99] transition-all text-left"
                style={{
                  background: selected ? palette.paleBlue : palette.white,
                  border: `1.5px solid ${selected ? palette.midnight : palette.hairline}`,
                  boxShadow: shadows.card,
                }}
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                  style={{
                    background: selected ? "rgba(255,255,255,0.65)" : palette.stone,
                  }}
                >
                  <User size={15} color={palette.midnight} strokeWidth={1.6} />
                </div>
                <span
                  className="text-[12.5px] leading-snug"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                >
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <GroupLabel>{content.directionQuestion}</GroupLabel>
        <div className="space-y-2">
          {directionOptions.map((d) => (
            <OptionCard
              key={d.id}
              icon={getIcon(d.iconKey)}
              label={d.label}
              selected={value.direction === d.id}
              onClick={() => update("direction", d.id)}
              accent={resolveAccent(d.accentKey)}
            />
          ))}
        </div>
      </div>

      <SafetyNote>{content.safetyNote}</SafetyNote>

      <Footer onContinue={onContinue} disabled={!valid} />
    </div>
  );
};
