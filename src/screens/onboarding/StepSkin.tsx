// =====================================================================
// QINO Onboarding — Step 7: Skin concerns
// =====================================================================

import type { SkinConcernId } from "../../types";
import { skinConcernOptions } from "../../data/mockOnboarding";
import { resolveAccent } from "../../components/primitives";
import { Eyebrow, Title, Subtitle, Chip, Footer } from "./_primitives";

interface StepSkinProps {
  value: SkinConcernId[];
  onChange: (v: SkinConcernId[]) => void;
  onContinue: () => void;
  content: { eyebrow: string; title: string; subtitle: string };
}

export const StepSkin = ({ value, onChange, onContinue, content }: StepSkinProps) => {
  const toggle = (id: SkinConcernId) => {
    if (id === "none") {
      onChange(value.includes("none") ? [] : ["none"]);
      return;
    }
    const cleaned = value.filter((v) => v !== "none");
    onChange(cleaned.includes(id) ? cleaned.filter((v) => v !== id) : [...cleaned, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <Subtitle>{content.subtitle}</Subtitle>

      <div className="mt-6 flex flex-wrap gap-2">
        {skinConcernOptions.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={value.includes(c.id)}
            onClick={() => toggle(c.id)}
            accent={resolveAccent(c.accentKey)}
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};
