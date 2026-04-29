// =====================================================================
// QINO — Feature Group Detail Screen
// One component, driven by a featureGroup.id.
// Powers the 5 detail screens: Facial Structure, Jaw/Chin/Neck, Skin,
// Hair & Frame, Eyes/Nose/Lips — all from mockAnalysisReport.featureGroups.
// =====================================================================

import { ChevronLeft, Sparkle, Check, Stethoscope } from "lucide-react";
import type { FeatureGroup } from "../types";
import { palette, fonts, shadows } from "../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  Pill,
  resolveAccent,
} from "./primitives";
import { getIcon } from "../iconRegistry";

interface FeatureGroupDetailScreenProps {
  group: FeatureGroup;
  onBack: () => void;
  /** Optional: jump to the Product Stack modal filtered to relevant categories. */
  onOpenProducts?: () => void;
  /** Optional: jump to the Treatment Pathways modal. */
  onOpenPathways?: () => void;
  safetyNote: string;
}

const priorityChip = (level: "high" | "medium" | "low") => {
  if (level === "high") return { bg: palette.midnight, color: palette.stone, label: "High Priority" };
  if (level === "medium")
    return { bg: palette.softLavender, color: palette.midnight, label: "Medium Priority" };
  return { bg: palette.stone, color: palette.textMuted, label: "Low Priority" };
};

export const FeatureGroupDetailScreen = ({
  group,
  onBack,
  onOpenProducts,
  onOpenPathways,
  safetyNote,
}: FeatureGroupDetailScreenProps) => {
  const Icon = getIcon(group.iconKey);
  const accent = resolveAccent(group.accentKey);
  const chip = priorityChip(group.detail.priorityLevel);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-32">
        {/* Header */}
        <header className="px-5 pt-3 pb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <ChevronLeft size={16} color={palette.midnight} strokeWidth={1.8} />
          </button>
          <Eyebrow>Feature detail</Eyebrow>
          <div style={{ width: 36 }} />
        </header>

        <div className="px-5 pt-2 space-y-5">
          {/* Hero */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${accent} 0%, ${palette.softLavender} 100%)`,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.hero,
            }}
          >
            <div className="relative">
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4"
                style={{ background: "rgba(255,255,255,0.65)" }}
              >
                <Icon size={18} strokeWidth={1.6} color={palette.midnight} />
              </div>
              <h1
                className="text-[28px] leading-[1.1]"
                style={{
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: palette.ink,
                }}
              >
                {group.title}
              </h1>
              <div className="mt-3">
                <Pill bg={chip.bg} color={chip.color}>
                  {chip.label}
                </Pill>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div>
            <SectionHeading>Key findings</SectionHeading>
            <Card padding="p-1" radius="rounded-[22px]">
              {group.findings.map((f, i, arr) => (
                <div
                  key={f.key}
                  className="px-4 py-3.5 flex items-center justify-between"
                  style={{
                    borderBottom: i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
                  }}
                >
                  <span
                    className="text-[12.5px]"
                    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                  >
                    {f.label}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          {/* Why it matters */}
          <div>
            <SectionHeading>Why it matters</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]">
              <p
                className="text-[13px] leading-[1.55]"
                style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
              >
                {group.detail.whyItMatters}
              </p>
            </Card>
          </div>

          {/* At-home actions */}
          <div>
            <SectionHeading>At-home actions</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]">
              <div className="space-y-3">
                {group.detail.atHomeActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: accent }}
                    >
                      <Check size={11} color={palette.midnight} strokeWidth={2.5} />
                    </div>
                    <span
                      className="flex-1 text-[12.5px] leading-relaxed"
                      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
                    >
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Product relevance */}
          {group.detail.productCategories.length > 0 && (
            <div>
              <SectionHeading>Product relevance</SectionHeading>
              <Card
                padding="p-5"
                radius="rounded-[22px]"
                onClick={onOpenProducts}
                bg={palette.softSage}
              >
                <p
                  className="text-[12.5px] leading-relaxed mb-3"
                  style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
                >
                  Categories from your stack that apply here:
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {group.detail.productCategories.map((c) => (
                    <Pill key={c} bg="rgba(255,255,255,0.7)" color={palette.midnight}>
                      {c.replace("_", " ")}
                    </Pill>
                  ))}
                </div>
                {onOpenProducts && (
                  <button
                    className="w-full py-2.5 rounded-[12px] text-[12px]"
                    style={{
                      background: palette.midnight,
                      fontFamily: fonts.subtitle,
                      fontWeight: 600,
                      color: palette.stone,
                    }}
                  >
                    View product stack
                  </button>
                )}
              </Card>
            </div>
          )}

          {/* Treatment relevance */}
          {group.detail.treatmentRelevance && (
            <div>
              <SectionHeading>Treatment relevance</SectionHeading>
              <Card
                padding="p-5"
                radius="rounded-[22px]"
                onClick={onOpenPathways}
                bg={palette.softLavender}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.65)" }}
                  >
                    <Stethoscope size={15} strokeWidth={1.6} color={palette.midnight} />
                  </div>
                  <p
                    className="flex-1 text-[12.5px] leading-relaxed"
                    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink }}
                  >
                    {group.detail.treatmentRelevance}
                  </p>
                </div>
                {onOpenPathways && (
                  <button
                    className="w-full py-2.5 rounded-[12px] text-[12px]"
                    style={{
                      background: palette.midnight,
                      fontFamily: fonts.subtitle,
                      fontWeight: 600,
                      color: palette.stone,
                    }}
                  >
                    View treatment pathways
                  </button>
                )}
              </Card>
            </div>
          )}

          {/* Safety note */}
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
      </div>
    </div>
  );
};
