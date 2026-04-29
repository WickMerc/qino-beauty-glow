// =====================================================================
// QINO Onboarding — Step 1: Goals
// Reads goalOptions from /src/data/mockOnboarding.
// =====================================================================

import type { GoalId } from "../../types";
import { goalOptions } from "../../data/mockOnboarding";
import { getIcon } from "../../iconRegistry";
import { resolveAccent } from "../../components/primitives";
import { Eyebrow, Title, Subtitle, OptionCard, Footer } from "./_primitives";

interface StepGoalsProps {
  value: GoalId[];
  onChange: (v: GoalId[]) => void;
  onContinue: () => void;
  content: { eyebrow: string; title: string; subtitle: string };
}

export const StepGoals = ({ value, onChange, onContinue, content }: StepGoalsProps) => {
  const toggle = (id: GoalId) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6 space-y-2.5">
        {goalOptions.map((g) => (
          <OptionCard
            key={g.id}
            icon={getIcon(g.iconKey)}
            label={g.label}
            selected={value.includes(g.id)}
            onClick={() => toggle(g.id)}
            accent={resolveAccent(g.accentKey)}
            multi
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};
