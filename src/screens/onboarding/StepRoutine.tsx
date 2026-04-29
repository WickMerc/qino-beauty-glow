// =====================================================================
// QINO Onboarding — Step 5: Routine tolerance
// =====================================================================

import type { RoutineTolerance } from "../../types";
import { routineOptions } from "../../data/mockOnboarding";
import { getIcon } from "../../iconRegistry";
import { resolveAccent } from "../../components/primitives";
import { Eyebrow, Title, Subtitle, OptionCard, Footer } from "./_primitives";

interface StepRoutineProps {
  value: RoutineTolerance | null;
  onChange: (v: RoutineTolerance) => void;
  onContinue: () => void;
  content: { eyebrow: string; title: string; subtitle: string };
}

export const StepRoutine = ({ value, onChange, onContinue, content }: StepRoutineProps) => (
  <div className="px-5 pt-2 pb-32">
    <Eyebrow>{content.eyebrow}</Eyebrow>
    <Title>{content.title}</Title>
    <Subtitle>{content.subtitle}</Subtitle>

    <div className="mt-6 space-y-2.5">
      {routineOptions.map((o) => (
        <OptionCard
          key={o.id}
          icon={getIcon(o.iconKey)}
          label={o.label}
          sub={o.sub}
          selected={value === o.id}
          onClick={() => onChange(o.id)}
          accent={resolveAccent(o.accentKey)}
        />
      ))}
    </div>

    <Footer onContinue={onContinue} disabled={!value} />
  </div>
);
