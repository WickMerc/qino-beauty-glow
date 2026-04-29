// =====================================================================
// QINO — Analysis Screen
// Props-driven. Consumes AnalysisReport.
// =====================================================================

import { ArrowUpRight } from "lucide-react";
import type { AnalysisReport } from "../types";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, SectionHeading, Card, QinoMark, resolveAccent } from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface AnalysisScreenProps {
  report: AnalysisReport;
  subtitle: string;
  onCategoryClick?: (groupId: string) => void;
}

export const AnalysisScreen = ({
  report,
  subtitle,
  onCategoryClick,
}: AnalysisScreenProps) => {
  // Derive a top-row summary from scores
  const summary = [
    { label: "Harmony", value: "High" },
    { label: "Symmetry", value: report.scores.find((s) => s.id === "symmetry")?.statusLabel ?? "—" },
    { label: "Skin", value: "Slightly Uneven" },
    { label: "Jaw / Neck", value: "Needs Definition" },
  ];

  return (
    <div className="px-5 space-y-5 pb-8">
      <div className="pt-1">
        <Eyebrow>QINO Analysis</Eyebrow>
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
        <p
          className="text-[12.5px] mt-1.5"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {subtitle}
        </p>
      </div>

      {/* Summary */}
      <div>
        <Eyebrow className="px-1 mb-3 block">Summary</Eyebrow>
        <div className="grid grid-cols-2 gap-2.5">
          {summary.map((s) => (
            <Card key={s.label} padding="p-4" radius="rounded-[20px]">
              <p
                className="text-[10px] uppercase"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: palette.steel,
                }}
              >
                {s.label}
              </p>
              <p
                className="mt-2 text-[15px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {s.value}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* QINO Insight */}
      <div
        className="rounded-[22px] p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.hero,
        }}
      >
        <div className="flex items-center gap-2">
          <QinoMark size={14} color={palette.midnight} />
          <Eyebrow>QINO Insight</Eyebrow>
        </div>
        <p
          className="mt-3 text-[15px] leading-snug"
          style={{
            fontFamily: fonts.title,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: palette.ink,
          }}
        >
          {report.insight}
        </p>
      </div>

      {/* Categories */}
      <div>
        <SectionHeading>Categories</SectionHeading>
        <div className="space-y-2.5">
          {report.featureGroups.map((g) => {
            const Icon = getIcon(g.iconKey);
            const accent = resolveAccent(g.accentKey, palette.paleBlue);
            return (
              <Card
                key={g.id}
                padding="p-4"
                radius="rounded-[20px]"
                onClick={() => onCategoryClick?.(g.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accent }}
                  >
                    <Icon size={16} strokeWidth={1.5} color={palette.midnight} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13.5px]"
                      style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                    >
                      {g.title}
                    </p>
                    <div className="mt-2 space-y-1">
                      {g.findings.map((f) => (
                        <p
                          key={f.key}
                          className="text-[11.5px]"
                          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                        >
                          · {f.label}: {f.value}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 text-[11.5px]"
                  style={{
                    background: "rgba(15,27,38,0.04)",
                    fontFamily: fonts.subtitle,
                    fontWeight: 600,
                    color: palette.midnight,
                    border: `1px solid ${palette.hairline}`,
                  }}
                >
                  View details <ArrowUpRight size={12} strokeWidth={1.6} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
