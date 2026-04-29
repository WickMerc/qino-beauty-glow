// =====================================================================
// QINO — Analysis Screen (browse pattern)
// Tab destination for users returning to look up findings.
// Feature groups are the hero. Small summary up top, priority recap
// below, "View full report" link at the bottom.
// =====================================================================

import { ArrowUpRight, ChevronRight, FileText } from "lucide-react";
import type { AnalysisReport } from "../types";
import { palette, fonts, shadows } from "../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  Pill,
  resolveAccent,
} from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface AnalysisScreenProps {
  report: AnalysisReport;
  onOpenFeatureGroup: (groupId: string) => void;
  onOpenFullReport: () => void;
}

export const AnalysisScreen = ({
  report,
  onOpenFeatureGroup,
  onOpenFullReport,
}: AnalysisScreenProps) => {
  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Calm summary header — not a hero */}
      <div className="pt-1">
        <Eyebrow>Your QINO Analysis</Eyebrow>
        <h1
          className="mt-1 text-[26px] leading-tight"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: palette.ink,
          }}
        >
          Your facial breakdown
        </h1>
      </div>

      {/* Calm summary card — phase + main focus, no big imagery */}
      <Card padding="p-4" radius="rounded-[20px]" bg={palette.softSage}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p
              className="text-[10.5px] uppercase"
              style={{
                fontFamily: fonts.subtitle,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: palette.textMuted,
              }}
            >
              Current Phase
            </p>
            <p
              className="mt-1 text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              {report.currentPhase.name}
            </p>
            <p
              className="mt-1 text-[12px] leading-snug"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              Main focus: {report.currentPhase.mainFocus}
            </p>
          </div>
        </div>
      </Card>

      {/* THE HERO — Feature groups as the main interaction surface */}
      <div>
        <SectionHeading>Feature groups</SectionHeading>
        <p
          className="text-[12px] mb-3 px-1 -mt-2"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          Tap any group to see findings, why it matters, and what to do.
        </p>
        <div className="space-y-2.5">
          {report.featureGroups.map((g) => {
            const Icon = getIcon(g.iconKey);
            const accent = resolveAccent(g.accentKey, palette.paleBlue);
            const priorityChip = priorityChipFor(g.detail.priorityLevel);
            return (
              <Card
                key={g.id}
                padding="p-5"
                radius="rounded-[22px]"
                onClick={() => onOpenFeatureGroup(g.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accent }}
                  >
                    <Icon size={17} strokeWidth={1.6} color={palette.midnight} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className="text-[15px]"
                        style={{
                          fontFamily: fonts.subtitle,
                          fontWeight: 600,
                          color: palette.ink,
                        }}
                      >
                        {g.title}
                      </h3>
                      <Pill bg={priorityChip.bg} color={priorityChip.color}>
                        {priorityChip.label}
                      </Pill>
                    </div>
                    {/* Show first 2 findings as a teaser */}
                    <div className="space-y-0.5">
                      {g.findings.slice(0, 2).map((f) => (
                        <p
                          key={f.key}
                          className="text-[11.5px]"
                          style={{
                            fontFamily: fonts.body,
                            fontWeight: 400,
                            color: palette.textMuted,
                          }}
                        >
                          · {f.label}: {f.value}
                        </p>
                      ))}
                      {g.findings.length > 2 && (
                        <p
                          className="text-[11px] mt-1"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 600,
                            color: palette.steel,
                          }}
                        >
                          +{g.findings.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    color={palette.textMuted}
                    strokeWidth={1.5}
                    className="flex-shrink-0 mt-1"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Priority Map recap */}
      <div>
        <SectionHeading>Priority map</SectionHeading>
        <Card padding="p-5" radius="rounded-[22px]">
          {[
            {
              label: "High Impact",
              items: report.priorities.high,
              color: palette.midnight,
              accent: palette.softBlush,
            },
            {
              label: "Medium Impact",
              items: report.priorities.medium,
              color: palette.steel,
              accent: palette.softPeach,
            },
            {
              label: "Low Priority",
              items: report.priorities.low,
              color: palette.steelLight,
              accent: palette.stone,
            },
          ].map((tier, i, arr) => (
            <div
              key={tier.label}
              className="py-3"
              style={{
                borderBottom:
                  i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tier.color }} />
                <span
                  className="text-[11px] uppercase"
                  style={{
                    fontFamily: fonts.subtitle,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: tier.color,
                  }}
                >
                  {tier.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tier.items.map((item) => (
                  <Pill key={item} bg={tier.accent} color={palette.midnight}>
                    {item}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* View full report link */}
      <button
        onClick={onOpenFullReport}
        className="w-full rounded-[20px] p-4 flex items-center gap-3 active:scale-[0.99] transition-all"
        style={{
          background: palette.white,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
        }}
      >
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
          style={{ background: palette.paleBlue }}
        >
          <FileText size={15} color={palette.midnight} strokeWidth={1.6} />
        </div>
        <div className="flex-1 text-left">
          <p
            className="text-[13.5px]"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
          >
            View full analysis report
          </p>
          <p
            className="text-[11.5px] mt-0.5"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
          >
            The complete write-up from your scan
          </p>
        </div>
        <ArrowUpRight size={15} color={palette.midnight} strokeWidth={1.6} />
      </button>
    </div>
  );
};

// ---------- helpers ----------
const priorityChipFor = (level: "high" | "medium" | "low") => {
  if (level === "high") return { bg: palette.midnight, color: palette.stone, label: "High" };
  if (level === "medium")
    return { bg: palette.softLavender, color: palette.midnight, label: "Medium" };
  return { bg: palette.stone, color: palette.textMuted, label: "Low" };
};
