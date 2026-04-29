// =====================================================================
// QINO — Pre-scan Dashboard
// Shown when user has finished onboarding but not yet completed the scan.
// All copy from /src/data/mockDashboard.ts.
// =====================================================================

import { ArrowRight } from "lucide-react";
import type { UserProfile } from "../../types";
import {
  mockLockedPreviews,
  mockScanMetaPills,
} from "../../data/mockDashboard";
import { palette, fonts, shadows } from "../../theme";
import {
  Eyebrow,
  SectionHeading,
  Pill,
  QinoMark,
  resolveAccent,
} from "../../components/primitives";
import { TopBar } from "../../components/Chrome";
import { getIcon } from "../../iconRegistry";

interface PreScanDashboardProps {
  user: UserProfile;
  greetingPrefix: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  primaryCtaLabel: string;
  unlocksHeading: string;
  onStartScan: () => void;
}

export const PreScanDashboard = ({
  user,
  greetingPrefix,
  heroEyebrow,
  heroTitle,
  heroBody,
  primaryCtaLabel,
  unlocksHeading,
  onStartScan,
}: PreScanDashboardProps) => (
  <div
    className="min-h-screen w-full"
    style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
  >
    <div className="max-w-[440px] mx-auto pb-24">
      <TopBar user={user} />

      <div className="px-5 pt-2 space-y-5">
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

        {/* Hero — scan CTA */}
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
            style={{ top: 16, right: 16, opacity: 0.16 }}
            aria-hidden
          >
            <QinoMark size={56} />
          </div>

          <div className="relative">
            <Eyebrow color={palette.textMuted}>{heroEyebrow}</Eyebrow>
            <h2
              className="mt-3 text-[24px]"
              style={{
                fontFamily: fonts.title,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                color: palette.ink,
              }}
            >
              {heroTitle}
            </h2>
            <p
              className="mt-3 text-[13.5px] leading-[1.55]"
              style={{
                fontFamily: fonts.body,
                fontWeight: 400,
                color: palette.ink,
                opacity: 0.78,
              }}
            >
              {heroBody}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {mockScanMetaPills.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    fontFamily: fonts.body,
                    fontWeight: 500,
                    color: palette.midnight,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={onStartScan}
                className="w-full py-3.5 rounded-full transition-all active:scale-[0.99]"
                style={{
                  background: palette.midnight,
                  boxShadow: "0 8px 20px rgba(15,27,38,0.20)",
                }}
              >
                <span
                  className="flex items-center justify-center gap-2 text-[13.5px]"
                  style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
                >
                  {primaryCtaLabel}
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Locked previews — driven by mockLockedPreviews */}
        <div>
          <SectionHeading>{unlocksHeading}</SectionHeading>
          <div className="space-y-2.5">
            {mockLockedPreviews.map((p) => {
              const Icon = getIcon(p.iconKey);
              const bg = resolveAccent(p.accentKey);
              return (
                <div
                  key={p.id}
                  className="rounded-[20px] p-4 flex items-center gap-3"
                  style={{
                    background: palette.white,
                    border: `1px solid ${palette.hairline}`,
                    boxShadow: shadows.card,
                    opacity: 0.85,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon size={16} strokeWidth={1.6} color={palette.midnight} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
                    >
                      {p.label}
                    </p>
                    <p
                      className="text-[11.5px] mt-0.5"
                      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
                    >
                      {p.sub}
                    </p>
                  </div>
                  <Pill bg={palette.stone} color={palette.textMuted}>
                    {p.state}
                  </Pill>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);
