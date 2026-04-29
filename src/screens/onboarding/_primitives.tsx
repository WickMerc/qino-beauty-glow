// =====================================================================
// QINO — Onboarding-specific UI primitives
// Shared across all onboarding step screens.
// =====================================================================

import { ReactNode } from "react";
import { ChevronLeft, X, Check, Sparkles, ArrowRight } from "lucide-react";
import { palette, fonts, shadows } from "../../theme";
import { QinoMark } from "../../components/primitives";

// ---------- Title ----------
export const Title = ({ children, size = 30 }: { children: ReactNode; size?: number }) => (
  <h1
    style={{
      fontFamily: fonts.title,
      fontWeight: 600,
      letterSpacing: "-0.035em",
      lineHeight: 1.1,
      color: palette.ink,
      fontSize: size,
      marginTop: 8,
    }}
  >
    {children}
  </h1>
);

// ---------- Subtitle ----------
export const Subtitle = ({ children }: { children: ReactNode }) => (
  <p
    className="mt-2 text-[14px] leading-[1.5]"
    style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
  >
    {children}
  </p>
);

// ---------- Eyebrow ----------
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

// ---------- Group label (above option groups) ----------
export const GroupLabel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={`text-[12px] mb-2.5 px-1 ${className}`}
    style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.textMuted }}
  >
    {children}
  </p>
);

// ---------- Option card (radio or checkbox) ----------
type IconType = React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;

export const OptionCard = ({
  icon: Icon,
  label,
  sub,
  selected,
  onClick,
  accent = palette.paleBlue,
  multi = false,
}: {
  icon?: IconType;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  accent?: string;
  multi?: boolean;
}) => (
  <button
    onClick={onClick}
    className="w-full rounded-[20px] p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-all"
    style={{
      background: selected ? accent : palette.white,
      border: `1.5px solid ${selected ? palette.midnight : palette.hairline}`,
      boxShadow: shadows.card,
    }}
  >
    {Icon && (
      <div
        className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ background: selected ? "rgba(255,255,255,0.65)" : accent }}
      >
        <Icon size={17} strokeWidth={1.6} color={palette.midnight} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p
        className="text-[14px]"
        style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.ink }}
      >
        {label}
      </p>
      {sub && (
        <p
          className="text-[12px] mt-0.5 leading-snug"
          style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
        >
          {sub}
        </p>
      )}
    </div>
    <div
      className={`flex-shrink-0 flex items-center justify-center transition-all ${
        multi ? "rounded-[7px] w-6 h-6" : "rounded-full w-6 h-6"
      }`}
      style={{
        background: selected ? palette.midnight : "transparent",
        border: selected ? "none" : `1.5px solid ${palette.hairlineMid}`,
      }}
    >
      {selected && <Check size={13} color={palette.stone} strokeWidth={2.5} />}
    </div>
  </button>
);

// ---------- Chip ----------
export const Chip = ({
  label,
  selected,
  onClick,
  accent = palette.paleBlue,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  accent?: string;
}) => (
  <button
    onClick={onClick}
    className="px-3.5 py-2 rounded-full text-[12.5px] active:scale-[0.97] transition-all"
    style={{
      background: selected ? accent : palette.white,
      border: `1.5px solid ${selected ? palette.midnight : palette.hairline}`,
      color: palette.ink,
      fontFamily: fonts.subtitle,
      fontWeight: 500,
      boxShadow: shadows.card,
    }}
  >
    {label}
  </button>
);

// ---------- Number stepper ----------
export const Stepper = ({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <div
    className="rounded-[20px] p-4 flex items-center justify-between"
    style={{
      background: palette.white,
      border: `1px solid ${palette.hairline}`,
      boxShadow: shadows.card,
    }}
  >
    <div>
      <p
        className="text-[12px]"
        style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.textMuted }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-[22px]"
        style={{
          fontFamily: fonts.title,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: palette.ink,
        }}
      >
        {value}
        <span
          className="text-[12px] ml-1"
          style={{ fontFamily: fonts.body, fontWeight: 500, color: palette.textMuted }}
        >
          {unit}
        </span>
      </p>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
      >
        <span
          className="text-[18px] leading-none"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
        >
          −
        </span>
      </button>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: palette.midnight }}
      >
        <span
          className="text-[18px] leading-none"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
        >
          +
        </span>
      </button>
    </div>
  </div>
);

// ---------- Safety note ----------
export const SafetyNote = ({ children }: { children: ReactNode }) => (
  <div
    className="mt-5 px-4 py-3 rounded-[14px] flex items-start gap-2.5"
    style={{ background: palette.stone, border: `1px solid ${palette.hairline}` }}
  >
    <Sparkles
      size={12}
      color={palette.textMuted}
      strokeWidth={1.6}
      className="mt-0.5 flex-shrink-0"
    />
    <p
      className="text-[10.5px] leading-relaxed"
      style={{ fontFamily: fonts.body, fontWeight: 400, color: palette.textMuted }}
    >
      {children}
    </p>
  </div>
);

// ---------- Onboarding header (back, logo, close, progress) ----------
export const OnboardingHeader = ({
  step,
  total,
  onBack,
  onClose,
}: {
  step: number;
  total: number;
  onBack: () => void;
  onClose: () => void;
}) => (
  <header className="px-5 pt-3 pb-4">
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
        style={{
          background: palette.white,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
          opacity: step === 0 ? 0.35 : 1,
        }}
      >
        <ChevronLeft size={16} color={palette.midnight} strokeWidth={1.8} />
      </button>

      <div className="flex items-center gap-2">
        <QinoMark size={20} color={palette.midnight} />
        <span
          className="text-[12px]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: palette.midnight,
          }}
        >
          QINO
        </span>
      </div>

      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: palette.white,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
        }}
      >
        <X size={15} color={palette.midnight} strokeWidth={1.8} />
      </button>
    </div>

    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(15,27,38,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((step + 1) / total) * 100}%`,
            background: palette.midnight,
          }}
        />
      </div>
      <span
        className="text-[11px]"
        style={{
          fontFamily: fonts.subtitle,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: palette.textMuted,
        }}
      >
        {step + 1} / {total}
      </span>
    </div>
  </header>
);

// ---------- Onboarding footer (continue + optional skip) ----------
export const Footer = ({
  onContinue,
  label = "Continue",
  disabled = false,
  secondary,
}: {
  onContinue: () => void;
  label?: string;
  disabled?: boolean;
  secondary?: { label: string; onClick: () => void };
}) => (
  <div
    className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
    style={{
      background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${palette.ivory} 35%)`,
      paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
    }}
  >
    {secondary && (
      <button
        onClick={secondary.onClick}
        className="w-full mb-2 py-3 rounded-full text-[13px]"
        style={{
          background: "transparent",
          fontFamily: fonts.subtitle,
          fontWeight: 500,
          color: palette.textMuted,
        }}
      >
        {secondary.label}
      </button>
    )}
    <button
      onClick={onContinue}
      disabled={disabled}
      className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
      style={{
        background: disabled ? palette.stone : palette.midnight,
        opacity: disabled ? 0.55 : 1,
        boxShadow: disabled ? "none" : "0 8px 20px rgba(15,27,38,0.20)",
      }}
    >
      <span
        className="flex items-center justify-center gap-2 text-[14px]"
        style={{
          fontFamily: fonts.subtitle,
          fontWeight: 600,
          color: disabled ? palette.textMuted : palette.stone,
        }}
      >
        {label}
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </button>
  </div>
);
