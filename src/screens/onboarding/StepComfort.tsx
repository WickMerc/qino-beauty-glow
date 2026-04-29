// =====================================================================
// QINO Onboarding — Step 3: Comfort / Pathways (multi-select)
// =====================================================================

import type { ComfortPathId } from "../../types";
import { comfortPathOptions } from "../../data/mockOnboarding";
import { getIcon } from "../../iconRegistry";
import { resolveAccent } from "../../components/primitives";
import {
  Eyebrow,
  Title,
  Subtitle,
  OptionCard,
  Footer,
  SafetyNote,
} from "./_primitives";

interface StepComfortProps {
  value: ComfortPathId[];
  onChange: (v: ComfortPathId[]) => void;
  onContinue: () => void;
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    safetyNote: string;
  };
}

export const StepComfort = ({ value, onChange, onContinue, content }: StepComfortProps) => {
  const toggle = (id: ComfortPathId) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6 space-y-2.5">
        {comfortPathOptions.map((p) => (
          <OptionCard
            key={p.id}
            icon={getIcon(p.iconKey)}
            label={p.label}
            sub={p.sub}
            selected={value.includes(p.id)}
            onClick={() => toggle(p.id)}
            accent={resolveAccent(p.accentKey)}
            multi
          />
        ))}
      </div>

      <SafetyNote>{content.safetyNote}</SafetyNote>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};
