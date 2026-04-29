// =====================================================================
// QINO Onboarding — Step 6: Body composition context
// =====================================================================

import type { BodyContext } from "../../types";
import { compositionOptions } from "../../data/mockOnboarding";
import {
  Eyebrow,
  Title,
  Subtitle,
  GroupLabel,
  Stepper,
  Chip,
  Footer,
  SafetyNote,
} from "./_primitives";
import { palette } from "../../theme";

interface StepBodyProps {
  value: BodyContext;
  onChange: (v: BodyContext) => void;
  onContinue: () => void;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    compositionLabel: string;
    safetyNote: string;
    skipLabel: string;
  };
}

export const StepBody = ({ value, onChange, onContinue, content }: StepBodyProps) => {
  const update = <K extends keyof BodyContext>(key: K, v: BodyContext[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6 space-y-2.5">
        <Stepper
          label="Height"
          unit="cm"
          value={value.height}
          onChange={(v) => update("height", v)}
          min={120}
          max={220}
        />
        <Stepper
          label="Current weight"
          unit="kg"
          value={value.weight}
          onChange={(v) => update("weight", v)}
          min={35}
          max={200}
        />
        <Stepper
          label="Target weight (optional)"
          unit="kg"
          value={value.target ?? 75}
          onChange={(v) => update("target", v)}
          min={35}
          max={200}
        />
      </div>

      <div className="mt-5">
        <GroupLabel>{content.compositionLabel}</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {compositionOptions.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={value.composition === c}
              onClick={() => update("composition", value.composition === c ? null : c)}
              accent={palette.softLavender}
            />
          ))}
        </div>
      </div>

      <SafetyNote>{content.safetyNote}</SafetyNote>

      <Footer
        onContinue={onContinue}
        secondary={{ label: content.skipLabel, onClick: onContinue }}
      />
    </div>
  );
};
