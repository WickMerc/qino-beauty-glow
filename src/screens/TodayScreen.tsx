// =====================================================================
// QINO — Today Screen
// Props-driven. Consumes Protocol + AnalysisReport.priorities + dashboard copy.
// All previously hardcoded strings (greeting, "Foundation Phase", "Day 12 / 90",
// "Lower-face definition is priority #1", routine names, etc.) now flow in.
// =====================================================================

import { useState } from "react";
import {
  Pencil, Camera, MessageSquare, Layers, ChevronRight, ArrowRight,
  Sparkles,
} from "lucide-react";
import type { Protocol, AnalysisReport, UserProfile } from "../types";
import type { ComingUpRow } from "../data/mockDashboard";
import { palette, fonts, shadows } from "../theme";
import {
  Eyebrow,
  SectionHeading,
  Card,
  Pill,
  ProgressBar,
  QinoMark,
  resolveAccent,
} from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface TodayScreenProps {
  user: UserProfile;
  protocol: Protocol;
  report: AnalysisReport;
  todayFocusLine: string;
  comingUp: ComingUpRow[];
  greetingPrefix: string;
  productCount: number;
  pathwaysSummary: string;
  onTab: (id: "today" | "analysis" | "protocol" | "progress" | "coach") => void;
  onOpenProducts: () => void;
  onOpenPathways: () => void;
}

export const TodayScreen = ({
  user,
  protocol,
  report,
  todayFocusLine,
  comingUp,
  greetingPrefix,
  productCount,
  pathwaysSummary,
  onTab,
  onOpenProducts,
  onOpenPathways,
}: TodayScreenProps) => {
  // Local UI state for routine completion (mocked; real version POSTs to /api/me/protocol/tasks/:id)
  const [routineProgress, setRoutineProgress] = useState(() =>
    Object.fromEntries(
      protocol.routines.map((r) => [
        r.id,
        { done: r.tasks.filter((t) => t.completed).length, total: r.tasks.length },
      ])
    )
  );

  const tickRoutine = (id: string) => {
    setRoutineProgress((r) => ({
      ...r,
      [id]: { ...r[id], done: Math.min(r[id].done + 1, r[id].total) },
    }));
  };

  const activePhase = protocol.phases.find((p) => p.id === protocol.currentPhaseId);

  return (
    <div className="px-5 space-y-5 pb-8">
      {/* Greeting */}
      <div className="pt-2">
        <h1
          className="text-[34px] leading-[1.05]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.035em",
            color: palette.ink,
          }}
        >
          {greetingPrefix}
          <br />
          <span style={{ fontWeight: 500 }}>{user.name}</span>
        </h1>
      </div>

      {/* Hero — Active phase */}
      <div
        className="rounded-[28px] p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.mist} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.hero,
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{ top: 14, right: 14, opacity: 0.16 }}
          aria-hidden
        >
          <QinoMark size={52} />
        </div>
        <div
          className="absolute top-0 right-10 bottom-0 w-px opacity-25"
          style={{
            background: `linear-gradient(180deg, transparent, ${palette.midnight}, transparent)`,
          }}
        />

        <div className="relative">
          <h2
            className="text-[24px]"
            style={{
              fontFamily: fonts.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: palette.ink,
            }}
          >
            {activePhase?.name ?? "Phase"} Phase
          </h2>
          <p
            className="mt-1 text-[14px]"
            style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
          >
            Day {protocol.currentDay} / {protocol.totalDays}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar
                value={protocol.percentComplete}
                height={5}
                fill={palette.midnight}
                track="rgba(15,27,38,0.10)"
              />
            </div>
            <span
              className="text-[13px]"
              style={{ fontFamily: fonts.body, fontWeight: 600, color: palette.ink }}
            >
              {protocol.percentComplete}%
            </span>
          </div>

          <p
            className="mt-5 text-[13px] leading-[1.45]"
            style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.ink, opacity: 0.78 }}
          >
            {todayFocusLine}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: "Log", icon: Pencil, action: () => {} },
          { label: "Photo", icon: Camera, action: () => {} },
          { label: "Coach", icon: MessageSquare, action: () => onTab("coach") },
          { label: "Stack", icon: Layers, action: onOpenProducts },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="rounded-[20px] py-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
              style={{
                background: palette.white,
                border: `1px solid ${palette.hairline}`,
                boxShadow: shadows.card,
              }}
            >
              <Icon size={18} strokeWidth={1.6} color={palette.midnight} />
              <span
                className="text-[12px]"
                style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
              >
                {a.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Today's Mission — driven by protocol.routines */}
      <div>
        <SectionHeading action={() => {}}>Today's Mission</SectionHeading>
        <div className="space-y-2.5">
          {protocol.routines.map((r) => {
            const Icon = getIcon(r.iconKey);
            const progress = routineProgress[r.id];
            const pct = (progress.done / progress.total) * 100;
            const bg = resolveAccent(r.bgAccentKey);
            const fill = resolveAccent(r.fillAccentKey);
            return (
              <div
                key={r.id}
                onClick={() => tickRoutine(r.id)}
                className="rounded-[22px] p-4 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                style={{
                  background: bg,
                  border: `1px solid ${palette.hairline}`,
                  boxShadow: shadows.card,
                }}
              >
                <div
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <Icon size={17} strokeWidth={1.6} color={palette.midnight} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                    >
                      {r.label}
                    </p>
                    <span
                      className="text-[13px]"
                      style={{ fontFamily: fonts.body, fontWeight: 600, color: palette.ink }}
                    >
                      {progress.done} / {progress.total}
                    </span>
                  </div>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                  >
                    {r.sub}
                  </p>
                  <div className="mt-2.5">
                    <ProgressBar value={pct} height={4} fill={fill} track="rgba(255,255,255,0.55)" />
                  </div>
                </div>
                <ChevronRight size={16} color={palette.midnight} strokeWidth={1.6} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Stack — driven by report.priorities */}
      <div>
        <SectionHeading>Priority Stack</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {report.priorities.high.map((p) => (
            <Pill key={p} bg={palette.softBlush} color={palette.midnight}>
              {p}
            </Pill>
          ))}
          {report.priorities.medium.map((p) => (
            <Pill key={p} bg={palette.softLavender} color={palette.midnight}>
              {p}
            </Pill>
          ))}
          {report.priorities.low.slice(0, 1).map((p) => (
            <Pill key={p} bg={palette.stone} color={palette.textMuted}>
              {p}
            </Pill>
          ))}
        </div>
      </div>

      {/* Pathway tiles */}
      <div>
        <SectionHeading>Your Pathway</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          <Card bg={palette.softSage} onClick={onOpenProducts} padding="p-5" radius="rounded-[22px]">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.65)" }}
            >
              <Layers size={17} strokeWidth={1.6} color={palette.midnight} />
            </div>
            <p
              className="text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              Product Stack
            </p>
            <p
              className="text-[11.5px] mt-1"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              {productCount} active
            </p>
            <div
              className="flex items-center gap-1 mt-3 text-[12px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
            >
              View stack <ArrowRight size={13} strokeWidth={1.8} />
            </div>
          </Card>

          <Card bg={palette.softBlush} onClick={onOpenPathways} padding="p-5" radius="rounded-[22px]">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.65)" }}
            >
              <Sparkles size={17} strokeWidth={1.6} color={palette.midnight} />
            </div>
            <p
              className="text-[14px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
            >
              Pathways
            </p>
            <p
              className="text-[11.5px] mt-1"
              style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
            >
              {pathwaysSummary}
            </p>
            <div
              className="flex items-center gap-1 mt-3 text-[12px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
            >
              View options <ArrowRight size={13} strokeWidth={1.8} />
            </div>
          </Card>
        </div>
      </div>

      {/* Coming up — driven by comingUp prop */}
      <div>
        <SectionHeading>Coming Up</SectionHeading>
        <Card padding="p-1" radius="rounded-[22px]">
          {comingUp.map((row, i, arr) => {
            const Icon = getIcon(row.iconKey);
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 px-3 py-3"
                style={{
                  borderBottom: i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
                }}
              >
                <Icon size={14} strokeWidth={1.5} color={palette.textMuted} />
                <span
                  className="flex-1 text-[12.5px]"
                  style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                >
                  {row.label}
                </span>
                <span
                  className="text-[12.5px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.ink }}
                >
                  {row.value}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};
