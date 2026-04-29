// =====================================================================
// QINO Onboarding — Step 4: Budget
// =====================================================================

import type { BudgetTier } from "../../types";
import { budgetOptions } from "../../data/mockOnboarding";
import { getIcon } from "../../iconRegistry";
import { resolveAccent } from "../../components/primitives";
import { Eyebrow, Title, Subtitle, OptionCard, Footer } from "./_primitives";

interface StepBudgetProps {
  value: BudgetTier | null;
  onChange: (v: BudgetTier) => void;
  onContinue: () => void;
  content: { eyebrow: string; title: string; subtitle: string };
}

export const StepBudget = ({ value, onChange, onContinue, content }: StepBudgetProps) => (
  <div className="px-5 pt-2 pb-32">
    <Eyebrow>{content.eyebrow}</Eyebrow>
    <Title>{content.title}</Title>
    <Subtitle>{content.subtitle}</Subtitle>

    <div className="mt-6 space-y-2.5">
      {budgetOptions.map((t) => (
        <OptionCard
          key={t.id}
          icon={getIcon(t.iconKey)}
          label={t.label}
          sub={t.sub}
          selected={value === t.id}
          onClick={() => onChange(t.id)}
          accent={resolveAccent(t.accentKey)}
        />
      ))}
    </div>

    <Footer onContinue={onContinue} disabled={!value} />
  </div>
);
