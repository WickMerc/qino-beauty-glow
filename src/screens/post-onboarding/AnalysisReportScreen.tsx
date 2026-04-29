// =====================================================================
// QINO — Analysis Report Screen
// The bridge between processing and the live dashboard.
// All values from /src/data/mockAnalysis.ts → mockAnalysisReport.
// =====================================================================

import {
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Lock,
  Minus,
} from "lucide-react";
import type { AnalysisReport, UserProfile } from "../../types";
import { palette, fonts, shadows } from "../../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  Pill,
  Donut,
  QinoMark,
  resolveAccent,
} from "../../components/primitives";
import { getIcon } from "../../iconRegistry";

interface AnalysisReportScreenProps {
  user: UserProfile;
  report: AnalysisReport;
  /** Number of products in stack (drives "X products recommended" line). */
  productCount: number;
  /** "Open to: Products + Clinics" — comes from pathways data. */
  pathwaysSummary: string;
  /** "3 levels active · 1 locked" */
  pathwaysSubLine: string;
  /** Active levels for the 3-up grid: `[ {n, title, count, accentKey} ]` */
  pathwaysLevels: { n: number; title: string; count: number; accentKey: string }[];
  /** Locked level label */
  lockedLevelLabel: string;
  /** "What to ignore" list */
  ignoreItems: string[];
  /** Protocol preview — 3 phases */
  protocolPhases: {
    name: string;
    days: string;
    state: "active" | "locked" | "completed";
  }[];
  protocolPreviewBody: string;
  /** Bottom CTA label, e.g. "Start Foundation Phase" */
  ctaLabel: string;
  /** Safety disclaimer */
  safetyNote: string;
  onContinue: () => void;
  onCardClick?: (cardId: string) => void;
}

export const AnalysisReportScreen = ({
  user,
  report,
  productCount,
  pathwaysSummary,
  pathwaysSubLine,
  pathwaysLevels,
  lockedLevelLabel,
  ignoreItems,
  protocolPhases,
  protocolPreviewBody,
  ctaLabel,
  safetyNote,
  onContinue,
  onCardClick,
}: AnalysisReportScreenProps) => {
  const click = (cardId: string) => onCardClick?.(cardId);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-32">
        {/* Minimal header */}
        <header className="flex items-center justify-between px-5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <QinoMark size={24} />
            <span
              className="text-[13px]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: palette.midnight,
              }}
            >
              REPORT
            </span>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${palette.softBlush} 0%, ${palette.softLavender} 100%)`,
              border: `1px solid ${palette.hairline}`,
            }}
          >
            <span
              className="text-[12px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
            >
              {user.initial}
            </span>
          </div>
        </header>

        <div className="px-5 pt-2 space-y-5">
          {/* Title */}
          <div className="pt-2">
            <Eyebrow>Your QINO Analysis</Eyebrow>
            <h1
              className="mt-2 text-[32px] leading-[1.05]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: palette.ink,
              }}
            >
              Here's what
              <br />
              we see, {user.name}.
            </h1>
          </div>

          {/* Hero — top priority */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.softLavender} 100%)`,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.hero,
            }}
          >
            <div className="relative">
              <Eyebrow color={palette.textMuted}>Top Priority</Eyebrow>
              <h2
                className="mt-3 text-[22px]"
                style={{
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  color: palette.ink,
                }}
              >
                {report.headline}
              </h2>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 400,
                  color: palette.ink,
                  opacity: 0.78,
                }}
              >
                {report.insight}
              </p>
            </div>
          </div>

          {/* Current phase block */}
          <div>
            <SectionHeading>Your starting point</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]" bg={palette.softSage}>
              <Eyebrow color={palette.textMuted}>Current Phase</Eyebrow>
              <h3
                className="mt-2 text-[18px]"
                style={{
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: palette.ink,
                }}
              >
                {report.currentPhase.name}
              </h3>
              <p
                className="mt-3 text-[10.5px] uppercase"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: palette.textMuted,
                }}
              >
                Main Focus
              </p>
              <p
                className="mt-1 text-[14px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {report.currentPhase.mainFocus}
              </p>
              <p
                className="mt-3 text-[12.5px] leading-relaxed"
                style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
              >
                {report.currentPhase.explanation}
              </p>
            </Card>
          </div>

          {/* Scores 2x2 */}
          <div>
            <SectionHeading>Score overview</SectionHeading>
            <div className="grid grid-cols-2 gap-2.5">
              {report.scores.map((s) => {
                const bg = resolveAccent(s.bgAccent);
                const color = resolveAccent(s.colorAccent, palette.midnight);
                return (
                  <Card
                    key={s.id}
                    bg={bg}
                    padding="p-4"
                    radius="rounded-[20px]"
                    onClick={() => click(`score:${s.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p
                          className="text-[10.5px]"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 500,
                            color: palette.textMuted,
                          }}
                        >
                          {s.label}
                        </p>
                        <p
                          className="text-[24px] leading-none mt-1.5"
                          style={{
                            fontFamily: fonts.title,
                            fontWeight: 600,
                            letterSpacing: "-0.025em",
                            color: palette.ink,
                          }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="text-[10px] mt-0.5"
                          style={{
                            fontFamily: fonts.subtitle,
                            fontWeight: 600,
                            color,
                          }}
                        >
                          {s.statusLabel}
                        </p>
                      </div>
                      <Donut value={s.value} size={36} stroke={3.5} color={color} track="rgba(255,255,255,0.55)" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Top strengths */}
          <div>
            <SectionHeading>Top strengths</SectionHeading>
            <div className="space-y-2">
              {report.strengths.map((s) => {
                const Icon = getIcon(s.iconKey);
                const accent = resolveAccent(s.accentKey);
                return (
                  <Card
                    key={s.id}
                    padding="p-4"
                    radius="rounded-[18px]"
                    onClick={() => click(`strength:${s.id}`)}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: accent }}
                    >
                      <Icon size={15} strokeWidth={1.6} color={palette.midnight} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13.5px]"
                        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-[11.5px] mt-0.5"
                        style={{
                          fontFamily: fonts.body,
                          fontWeight: 400,
                          color: palette.textMuted,
                        }}
                      >
                        {s.sub}
                      </p>
                    </div>
                    <ChevronRight size={16} color={palette.textMuted} strokeWidth={1.6} />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <SectionHeading>Improvement opportunities</SectionHeading>
            <div className="space-y-2">
              {report.opportunities.map((o) => {
                const Icon = getIcon(o.iconKey);
                const accent = resolveAccent(o.accentKey);
                return (
                  <Card
                    key={o.id}
                    padding="p-4"
                    radius="rounded-[18px]"
                    onClick={() => click(`opportunity:${o.id}`)}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: accent }}
                    >
                      <Icon size={15} strokeWidth={1.6} color={palette.midnight} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13.5px]"
                        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                      >
                        {o.label}
                      </p>
                      <p
                        className="text-[11.5px] mt-0.5"
                        style={{
                          fontFamily: fonts.body,
                          fontWeight: 400,
                          color: palette.textMuted,
                        }}
                      >
                        {o.sub}
                      </p>
                    </div>
                    <Pill
                      bg={o.impact === "high" ? palette.midnight : palette.stone}
                      color={o.impact === "high" ? palette.stone : palette.textMuted}
                    >
                      {o.impact === "high" ? "High" : o.impact === "medium" ? "Medium" : "Low"}
                    </Pill>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Priority Map */}
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

          {/* Feature breakdown */}
          <div>
            <SectionHeading>Feature breakdown</SectionHeading>
            <div className="space-y-2.5">
              {report.featureGroups.map((g) => {
                const Icon = getIcon(g.iconKey);
                const accent = resolveAccent(g.accentKey);
                return (
                  <Card
                    key={g.id}
                    padding="p-5"
                    radius="rounded-[22px]"
                    onClick={() => click(`feature:${g.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                        style={{ background: accent }}
                      >
                        <Icon size={15} strokeWidth={1.6} color={palette.midnight} />
                      </div>
                      <h3
                        className="flex-1 text-[14px]"
                        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                      >
                        {g.title}
                      </h3>
                      <ChevronRight size={16} color={palette.textMuted} strokeWidth={1.6} />
                    </div>
                    <div className="space-y-0">
                      {g.findings.map((f, idx) => (
                        <div
                          key={f.key}
                          className="flex items-center justify-between py-2"
                          style={{
                            borderTop: idx === 0 ? `1px solid ${palette.hairline}` : "none",
                            borderBottom: `1px solid ${palette.hairline}`,
                          }}
                        >
                          <span
                            className="text-[12.5px]"
                            style={{
                              fontFamily: fonts.body,
                              fontWeight: 400,
                              color: palette.textMuted,
                            }}
                          >
                            {f.label}
                          </span>
                          <span
                            className="text-[12.5px]"
                            style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
                          >
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Product stack preview */}
          <div>
            <SectionHeading>Your product stack</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]" onClick={() => click("productStack")}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: palette.softSage }}
                >
                  {(() => {
                    const Layers = getIcon("layers");
                    return <Layers size={16} strokeWidth={1.6} color={palette.midnight} />;
                  })()}
                </div>
                <div className="flex-1">
                  <p
                    className="text-[13.5px]"
                    style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                  >
                    {productCount} products recommended
                  </p>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                  >
                    Tied to your priority areas
                  </p>
                </div>
                <ArrowUpRight size={15} color={palette.midnight} strokeWidth={1.8} />
              </div>
            </Card>
          </div>

          {/* Treatment pathways preview */}
          <div>
            <SectionHeading>Treatment pathways</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]" onClick={() => click("pathways")}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{ background: palette.softLavender }}
                >
                  {(() => {
                    const Stethoscope = getIcon("stethoscope");
                    return <Stethoscope size={16} strokeWidth={1.6} color={palette.midnight} />;
                  })()}
                </div>
                <div className="flex-1">
                  <p
                    className="text-[13.5px]"
                    style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                  >
                    {pathwaysSummary}
                  </p>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                  >
                    {pathwaysSubLine}
                  </p>
                </div>
                <ArrowUpRight size={15} color={palette.midnight} strokeWidth={1.8} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {pathwaysLevels.map((l) => {
                  const accent = resolveAccent(l.accentKey);
                  return (
                    <div
                      key={l.n}
                      className="rounded-[14px] p-3"
                      style={{ background: accent, border: `1px solid ${palette.hairline}` }}
                    >
                      <p
                        className="text-[18px] leading-none"
                        style={{
                          fontFamily: fonts.title,
                          fontWeight: 600,
                          color: palette.midnight,
                        }}
                      >
                        0{l.n}
                      </p>
                      <p
                        className="text-[11px] mt-1.5"
                        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                      >
                        {l.title}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                      >
                        {l.count} options
                      </p>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-2 rounded-[14px] p-3 flex items-center gap-2"
                style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
              >
                <Lock size={11} color={palette.textMuted} strokeWidth={1.6} />
                <span
                  className="text-[11px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
                >
                  {lockedLevelLabel}
                </span>
              </div>
            </Card>
          </div>

          {/* 90-day protocol preview */}
          <div>
            <SectionHeading>90-day protocol preview</SectionHeading>
            <Card padding="p-3" radius="rounded-[22px]" onClick={() => click("protocol")}>
              <div className="grid grid-cols-3 gap-2">
                {protocolPhases.map((p, i) => {
                  const active = p.state === "active";
                  return (
                    <div
                      key={p.name}
                      className="rounded-[16px] p-3"
                      style={{
                        background: active ? palette.paleBlue : "transparent",
                        border: active ? `1px solid ${palette.hairlineMid}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: active ? palette.midnight : palette.stone }}
                        >
                          <span
                            className="text-[10px]"
                            style={{
                              fontFamily: fonts.subtitle,
                              fontWeight: 600,
                              color: active ? palette.stone : palette.textMuted,
                            }}
                          >
                            {i + 1}
                          </span>
                        </div>
                        {p.state === "locked" && (
                          <Lock size={9} color={palette.textMuted} strokeWidth={1.8} />
                        )}
                      </div>
                      <p
                        className="text-[11.5px] mt-2"
                        style={{
                          fontFamily: fonts.subtitle,
                          fontWeight: 600,
                          color: active ? palette.ink : palette.textMuted,
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        className="text-[9.5px] mt-0.5"
                        style={{
                          fontFamily: fonts.body,
                          fontWeight: 400,
                          color: palette.textMuted,
                        }}
                      >
                        {p.days}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p
                className="text-[11.5px] leading-relaxed px-2 pt-3"
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 400,
                  color: palette.textMuted,
                }}
              >
                {protocolPreviewBody}
              </p>
            </Card>
          </div>

          {/* Ignore for now */}
          <div>
            <SectionHeading>What to ignore for now</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]" bg={palette.stone}>
              <div className="space-y-2">
                {ignoreItems.map((item, i, arr) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 py-1.5"
                    style={{
                      borderBottom:
                        i !== arr.length - 1 ? `1px solid rgba(15,27,38,0.06)` : "none",
                      paddingBottom: i !== arr.length - 1 ? 10 : 0,
                    }}
                  >
                    <Minus size={12} color={palette.steel} strokeWidth={2} />
                    <span
                      className="text-[12.5px]"
                      style={{
                        fontFamily: fonts.body,
                        fontWeight: 500,
                        color: palette.textMuted,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Safety */}
          <div
            className="px-4 py-3 rounded-[14px] flex items-start gap-2.5"
            style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
          >
            <Sparkles
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

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
          style={{
            background: palette.midnight,
            boxShadow: "0 8px 20px rgba(15,27,38,0.20)",
          }}
        >
          <span
            className="flex items-center justify-center gap-2 text-[14px]"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
          >
            {ctaLabel}
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  );
};
