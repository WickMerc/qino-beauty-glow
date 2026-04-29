// =====================================================================
// QINO — Protocol Screen
// Props-driven. Consumes Protocol.
// =====================================================================

import { ChevronRight, Lock, Minus } from "lucide-react";
import type { Protocol } from "../types";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, SectionHeading, Card, ProgressBar, resolveAccent } from "../components/primitives";
import { getIcon } from "../iconRegistry";

interface ProtocolScreenProps {
  protocol: Protocol;
  subtitle: string;
  heroHeadline: string;
  heroSub: string;
  onModuleClick?: (moduleId: string) => void;
}

export const ProtocolScreen = ({
  protocol,
  subtitle,
  heroHeadline,
  heroSub,
  onModuleClick,
}: ProtocolScreenProps) => {
  return (
    <div className="px-5 space-y-5 pb-8">
      <div className="pt-1">
        <Eyebrow>Daily System</Eyebrow>
        <h1
          className="mt-1 text-[26px] leading-tight"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: palette.ink,
          }}
        >
          {protocol.totalDays}-Day Protocol
        </h1>
        <p
          className="text-[12.5px] mt-1.5"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {subtitle}
        </p>
      </div>

      {/* Hero — active phase */}
      <div
        className="rounded-[26px] p-6"
        style={{
          background: `linear-gradient(140deg, ${palette.paleBlue} 0%, ${palette.mist} 100%)`,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.hero,
        }}
      >
        <Eyebrow color={palette.textMuted}>Foundation Active</Eyebrow>
        <h2
          className="mt-4 text-[22px] leading-tight"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: palette.ink,
          }}
        >
          {heroHeadline}
        </h2>
        <p
          className="mt-2 text-[12.5px]"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {heroSub}
        </p>
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10.5px] uppercase"
              style={{
                fontFamily: fonts.subtitle,
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: palette.textMuted,
              }}
            >
              Day {protocol.currentDay} / {protocol.totalDays}
            </span>
            <span
              className="text-[11px]"
              style={{ fontFamily: fonts.body, fontWeight: 600, color: palette.midnight }}
            >
              {protocol.percentComplete}%
            </span>
          </div>
          <ProgressBar value={protocol.percentComplete} height={4} />
        </div>
      </div>

      {/* Phases */}
      <div>
        <SectionHeading>Phases</SectionHeading>
        <div className="grid grid-cols-3 gap-2">
          {protocol.phases.map((p) => {
            const active = p.state === "active";
            return (
              <Card
                key={p.id}
                padding="p-3.5"
                radius="rounded-[18px]"
                bg={active ? palette.paleBlue : palette.white}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[18px]"
                    style={{
                      fontFamily: fonts.title,
                      fontWeight: 600,
                      color: active ? palette.midnight : palette.steel,
                    }}
                  >
                    {String(p.number).padStart(2, "0")}
                  </span>
                  {p.state === "locked" && (
                    <Lock size={11} color={palette.steel} strokeWidth={1.5} />
                  )}
                </div>
                <p
                  className="mt-2 text-[12px]"
                  style={{
                    fontFamily: fonts.subtitle,
                    fontWeight: 600,
                    color: active ? palette.ink : palette.textMuted,
                  }}
                >
                  {p.name}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.steel }}
                >
                  {p.dayRange}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modules */}
      <div>
        <SectionHeading>Modules</SectionHeading>
        <div className="space-y-2.5">
          {protocol.modules.map((m) => {
            const Icon = getIcon(m.iconKey);
            const accent = resolveAccent(m.accentKey, palette.paleBlue);
            const pct = (m.completedItems / m.totalItems) * 100;
            return (
              <Card
                key={m.id}
                padding="p-4"
                radius="rounded-[20px]"
                onClick={() => onModuleClick?.(m.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accent }}
                  >
                    <Icon size={16} strokeWidth={1.5} color={palette.midnight} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p
                        className="text-[13.5px]"
                        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                      >
                        {m.title}
                      </p>
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
                      >
                        {m.completedItems}/{m.totalItems}
                      </span>
                    </div>
                    <ProgressBar value={pct} />
                  </div>
                  <ChevronRight size={16} color={palette.steel} strokeWidth={1.5} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ignore for now */}
      <div>
        <SectionHeading>What to Ignore For Now</SectionHeading>
        <Card padding="p-4" radius="rounded-[20px]" bg={palette.stone}>
          <div className="space-y-2.5">
            {protocol.ignoreForNow.map((item, i, arr) => (
              <div
                key={item}
                className="flex items-center gap-3 pb-2.5"
                style={{
                  borderBottom: i !== arr.length - 1 ? `1px solid ${palette.hairline}` : "none",
                }}
              >
                <Minus size={12} color={palette.steel} strokeWidth={2} />
                <span
                  className="text-[12.5px]"
                  style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
