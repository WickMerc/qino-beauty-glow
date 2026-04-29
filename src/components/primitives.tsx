// =====================================================================
// QINO — Shared UI Primitives
// Pure presentational components. No mock data; they receive props.
// =====================================================================

import { ReactNode } from "react";
import { palette, fonts, shadows, accentByKey } from "../theme";

// ---------- Eyebrow / micro label ----------
export const Eyebrow = ({
  children,
  color = palette.textMuted,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) => (
  <span
    className={`text-[11px] uppercase ${className}`}
    style={{
      fontFamily: fonts.subtitle,
      fontWeight: 600,
      letterSpacing: "0.08em",
      color,
    }}
  >
    {children}
  </span>
);

// ---------- Section heading row ----------
export const SectionHeading = ({
  children,
  action,
  actionLabel = "View all",
}: {
  children: ReactNode;
  action?: () => void;
  actionLabel?: string;
}) => (
  <div className="flex items-center justify-between px-1 mb-3">
    <h3
      className="text-[16px]"
      style={{
        fontFamily: fonts.subtitle,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: palette.ink,
      }}
    >
      {children}
    </h3>
    {action && (
      <button
        onClick={action}
        className="text-[12px]"
        style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.textMuted }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// ---------- Card surface ----------
export const Card = ({
  children,
  className = "",
  bg = palette.white,
  onClick,
  padding = "p-5",
  radius = "rounded-[24px]",
}: {
  children: ReactNode;
  className?: string;
  bg?: string;
  onClick?: () => void;
  padding?: string;
  radius?: string;
}) => (
  <div
    onClick={onClick}
    className={`${radius} ${padding} ${className} ${
      onClick ? "active:scale-[0.99] transition-transform cursor-pointer" : ""
    }`}
    style={{
      background: bg,
      border: `1px solid ${palette.hairline}`,
      boxShadow: shadows.card,
    }}
  >
    {children}
  </div>
);

// ---------- Pill tag ----------
export const Pill = ({
  children,
  bg,
  color = palette.ink,
  className = "",
}: {
  children: ReactNode;
  bg: string;
  color?: string;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] ${className}`}
    style={{
      background: bg,
      color,
      fontFamily: fonts.subtitle,
      fontWeight: 600,
      letterSpacing: "0.01em",
    }}
  >
    {children}
  </span>
);

// ---------- Progress bar ----------
export const ProgressBar = ({
  value,
  height = 4,
  fill = palette.midnight,
  track = "rgba(15,27,38,0.08)",
}: {
  value: number;
  height?: number;
  fill?: string;
  track?: string;
}) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: track }}>
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{ width: `${value}%`, background: fill }}
    />
  </div>
);

// ---------- Donut score ring ----------
export const Donut = ({
  value,
  size = 44,
  stroke = 4,
  color = palette.midnight,
  track = "rgba(15,27,38,0.10)",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 600ms ease" }}
      />
    </svg>
  );
};

// ---------- QINO Logo Mark ----------
export const QinoMark = ({
  size = 28,
  color = palette.midnight,
}: {
  size?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id={`qmG-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <ellipse
      cx="32"
      cy="32"
      rx="17"
      ry="25"
      stroke={`url(#qmG-${color.replace("#", "")})`}
      strokeWidth="2.4"
      fill="none"
    />
    <line x1="32" y1="2" x2="32" y2="62" stroke={color} strokeWidth="1.6" />
    <path d="M40 22 Q47 32 40 42" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// ---------- Helper: resolve accent key to color ----------
export const resolveAccent = (key?: string, fallback: string = palette.stone): string => {
  if (!key) return fallback;
  return accentByKey[key] ?? fallback;
};
