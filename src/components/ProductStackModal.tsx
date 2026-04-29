// =====================================================================
// QINO — Product Stack Modal
// Shows essentials and targeted products, both reading from mockProductStack.
// Opens from the Analysis Report's Product Stack preview card.
// =====================================================================

import { Sparkle } from "lucide-react";
import type { ProductStack, ProductRecommendation, BudgetTier } from "../types";
import { palette, fonts } from "../theme";
import {
  SectionHeading,
  Card,
  Pill,
  resolveAccent,
} from "./primitives";
import { getIcon } from "../iconRegistry";
import { Sheet } from "./Sheet";

interface ProductStackModalProps {
  open: boolean;
  onClose: () => void;
  stack: ProductStack;
  /** Currently active tier. Pre-checked from onboarding answer. */
  activeTier: BudgetTier;
  safetyNote: string;
}

const tierLabels: Record<BudgetTier, string> = {
  budget: "Budget",
  standard: "Standard",
  premium: "Premium",
  none: "Best fit",
};

const priorityChipColor = (p: ProductRecommendation["priority"]) =>
  p === "high"
    ? { bg: palette.midnight, color: palette.stone }
    : p === "medium"
      ? { bg: palette.softLavender, color: palette.midnight }
      : { bg: palette.stone, color: palette.textMuted };

export const ProductStackModal = ({
  open,
  onClose,
  stack,
  activeTier,
  safetyNote,
}: ProductStackModalProps) => {
  const totalCount = stack.essentials.length + stack.targeted.length;

  const renderProduct = (p: ProductRecommendation) => {
    const Icon = getIcon(p.category === "spf" ? "sun" : "droplet");
    const accent = resolveAccent(p.accentKey);
    const chip = priorityChipColor(p.priority);
    return (
      <Card key={p.id} padding="p-4" radius="rounded-[20px]">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ background: accent }}
          >
            <Icon size={16} strokeWidth={1.6} color={palette.midnight} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[10.5px] uppercase"
              style={{
                fontFamily: fonts.subtitle,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: palette.textMuted,
              }}
            >
              {p.categoryLabel}
            </p>
            <p
              className="mt-0.5 text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              {p.name}
            </p>
          </div>
          <Pill bg={chip.bg} color={chip.color}>
            {p.priority === "high" ? "High" : p.priority === "medium" ? "Medium" : "Low"}
          </Pill>
        </div>

        <p
          className="text-[12px] leading-relaxed"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {p.why}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {p.tierAvailable.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{
                  background: t === activeTier ? palette.paleBlue : palette.stone,
                  color: t === activeTier ? palette.midnight : palette.textMuted,
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  border:
                    t === activeTier
                      ? `1px solid ${palette.hairlineMid}`
                      : `1px solid transparent`,
                }}
              >
                {tierLabels[t]}
              </span>
            ))}
          </div>
          <button
            className="px-3 py-1.5 rounded-full text-[11px]"
            style={{
              background: palette.midnight,
              fontFamily: fonts.subtitle,
              fontWeight: 600,
              color: palette.stone,
            }}
          >
            View options
          </button>
        </div>
      </Card>
    );
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Your Product Stack"
      title={`${totalCount} products tied to your priorities`}
    >
      <div className="space-y-5 pt-2">
        <div>
          <SectionHeading>Essentials</SectionHeading>
          <div className="space-y-2.5">{stack.essentials.map(renderProduct)}</div>
        </div>

        <div>
          <SectionHeading>Targeted</SectionHeading>
          <div className="space-y-2.5">{stack.targeted.map(renderProduct)}</div>
        </div>

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
