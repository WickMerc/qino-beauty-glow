import { useState, useEffect } from "react";
import {
  ChevronLeft, Check, X, Sparkles, Camera, Target, Heart, Clock,
  Activity, Droplet, Scissors, ArrowRight, Sun, User,
  Zap, Gem, Layers, Stethoscope, Syringe, Lightbulb, Eye,
} from "lucide-react";

/* =========================================================
   QINO — Onboarding Flow (rebuilt logic)
   - Multi-select comfort/pathways
   - New personalization step (gender + aesthetic direction)
   - Gender-inclusive Hair & Frame step (conditional sections)
   - Scan handoff (NOT mandatory upload)
   ========================================================= */

const C = {
  midnight: "#0F1B26",
  steel: "#536A78",
  steelLight: "#7A8E9B",
  mist: "#B8CFD9",
  stone: "#F2EFEA",
  white: "#FFFFFF",
  ivory: "#F7F4EE",
  paleBlue: "#DDE7EE",
  softBlush: "#F6DAD2",
  softLavender: "#E8DDF7",
  softPeach: "#F8E5D6",
  softSage: "#DCE8E2",
  blushAccent: "#E8A89A",
  lavenderAccent: "#B89DD9",
  peachAccent: "#E8B894",
  sageAccent: "#9DB8A6",
  mistAccent: "#8AA8B5",
  ink: "#0F1B26",
  textMuted: "#536A78",
  textDim: "#7A8E9B",
  hairline: "rgba(15,27,38,0.06)",
  hairlineMid: "rgba(15,27,38,0.10)",
};

const FONTS = {
  title: "'Sora', system-ui, sans-serif",
  subtitle: "'Outfit', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
};

const SHADOW_CARD = "0 12px 28px rgba(15, 27, 38, 0.06)";
const SHADOW_HERO = "0 20px 40px rgba(15, 27, 38, 0.10)";

// =====================================================================
// LOGO
// =====================================================================
const QinoMark = ({ size = 28, color = C.midnight }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="onbQmG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="32" rx="17" ry="25" stroke="url(#onbQmG)" strokeWidth="2.4" fill="none" />
    <line x1="32" y1="2" x2="32" y2="62" stroke={color} strokeWidth="1.6" />
    <path d="M40 22 Q47 32 40 42" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// =====================================================================
// PRIMITIVES
// =====================================================================

const Eyebrow = ({ children, color = C.textMuted, className = "" }) => (
  <span
    className={`text-[11px] uppercase ${className}`}
    style={{
      fontFamily: FONTS.subtitle,
      fontWeight: 600,
      letterSpacing: "0.08em",
      color,
    }}
  >
    {children}
  </span>
);

const Title = ({ children, size = 30 }) => (
  <h1
    style={{
      fontFamily: FONTS.title,
      fontWeight: 600,
      letterSpacing: "-0.035em",
      lineHeight: 1.1,
      color: C.ink,
      fontSize: size,
      marginTop: 8,
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({ children }) => (
  <p
    className="mt-2 text-[14px] leading-[1.5]"
    style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
  >
    {children}
  </p>
);

// Group section label inside a step
const GroupLabel = ({ children, className = "" }) => (
  <p
    className={`text-[12px] mb-2.5 px-1 ${className}`}
    style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
  >
    {children}
  </p>
);

// Selectable option card (works as radio OR checkbox depending on `multi`)
const OptionCard = ({ icon: Icon, label, sub, selected, onClick, accent = C.paleBlue, multi = false }) => (
  <button
    onClick={onClick}
    className="w-full rounded-[20px] p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-all"
    style={{
      background: selected ? accent : C.white,
      border: `1.5px solid ${selected ? C.midnight : C.hairline}`,
      boxShadow: SHADOW_CARD,
    }}
  >
    {Icon && (
      <div
        className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ background: selected ? "rgba(255,255,255,0.65)" : accent }}
      >
        <Icon size={17} strokeWidth={1.6} color={C.midnight} />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p
        className="text-[14px]"
        style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
      >
        {label}
      </p>
      {sub && (
        <p
          className="text-[12px] mt-0.5 leading-snug"
          style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
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
        background: selected ? C.midnight : "transparent",
        border: selected ? "none" : `1.5px solid ${C.hairlineMid}`,
      }}
    >
      {selected && <Check size={13} color={C.stone} strokeWidth={2.5} />}
    </div>
  </button>
);

// Compact chip selector
const Chip = ({ label, selected, onClick, accent = C.paleBlue }) => (
  <button
    onClick={onClick}
    className="px-3.5 py-2 rounded-full text-[12.5px] active:scale-[0.97] transition-all"
    style={{
      background: selected ? accent : C.white,
      border: `1.5px solid ${selected ? C.midnight : C.hairline}`,
      color: C.ink,
      fontFamily: FONTS.subtitle,
      fontWeight: 500,
      boxShadow: SHADOW_CARD,
    }}
  >
    {label}
  </button>
);

// Number stepper
const Stepper = ({ label, unit, value, onChange, min = 0, max = 999, step = 1 }) => (
  <div
    className="rounded-[20px] p-4 flex items-center justify-between"
    style={{
      background: C.white,
      border: `1px solid ${C.hairline}`,
      boxShadow: SHADOW_CARD,
    }}
  >
    <div>
      <p
        className="text-[12px]"
        style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-[22px]"
        style={{
          fontFamily: FONTS.title,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        {value}
        <span
          className="text-[12px] ml-1"
          style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
        >
          {unit}
        </span>
      </p>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: C.stone, border: `1px solid ${C.hairline}` }}
      >
        <span
          className="text-[18px] leading-none"
          style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
        >
          −
        </span>
      </button>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: C.midnight }}
      >
        <span
          className="text-[18px] leading-none"
          style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
        >
          +
        </span>
      </button>
    </div>
  </div>
);

// Safety note callout
const SafetyNote = ({ children }) => (
  <div
    className="mt-5 px-4 py-3 rounded-[14px] flex items-start gap-2.5"
    style={{ background: C.stone, border: `1px solid ${C.hairline}` }}
  >
    <Sparkles size={12} color={C.textMuted} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
    <p
      className="text-[10.5px] leading-relaxed"
      style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
    >
      {children}
    </p>
  </div>
);

// =====================================================================
// HEADER & FOOTER
// =====================================================================
const OnboardingHeader = ({ step, total, onBack, onClose }) => (
  <header className="px-5 pt-3 pb-4">
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
        style={{
          background: C.white,
          border: `1px solid ${C.hairline}`,
          boxShadow: SHADOW_CARD,
          opacity: step === 0 ? 0.35 : 1,
        }}
      >
        <ChevronLeft size={16} color={C.midnight} strokeWidth={1.8} />
      </button>

      <div className="flex items-center gap-2">
        <QinoMark size={20} color={C.midnight} />
        <span
          className="text-[12px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: C.midnight,
          }}
        >
          QINO
        </span>
      </div>

      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
      >
        <X size={15} color={C.midnight} strokeWidth={1.8} />
      </button>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(15,27,38,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%`, background: C.midnight }}
        />
      </div>
      <span
        className="text-[11px]"
        style={{
          fontFamily: FONTS.subtitle,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: C.textMuted,
        }}
      >
        {step + 1} / {total}
      </span>
    </div>
  </header>
);

const Footer = ({ onContinue, label = "Continue", disabled = false, secondary }) => (
  <div
    className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
    style={{
      background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${C.ivory} 35%)`,
      paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
    }}
  >
    {secondary && (
      <button
        onClick={secondary.onClick}
        className="w-full mb-2 py-3 rounded-full text-[13px]"
        style={{
          background: "transparent",
          fontFamily: FONTS.subtitle,
          fontWeight: 500,
          color: C.textMuted,
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
        background: disabled ? C.stone : C.midnight,
        opacity: disabled ? 0.55 : 1,
        boxShadow: disabled ? "none" : "0 8px 20px rgba(15,27,38,0.20)",
      }}
    >
      <span
        className="flex items-center justify-center gap-2 text-[14px]"
        style={{
          fontFamily: FONTS.subtitle,
          fontWeight: 600,
          color: disabled ? C.textMuted : C.stone,
        }}
      >
        {label}
        <ArrowRight size={15} strokeWidth={2} />
      </span>
    </button>
  </div>
);

/* =========================================================
   STEP 0 — WELCOME
   ========================================================= */
const StepWelcome = ({ onContinue }) => (
  <div className="px-5 pt-2 pb-32 flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
    <div
      className="rounded-[28px] p-8 relative overflow-hidden mb-6"
      style={{
        background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
        border: `1px solid ${C.hairline}`,
        boxShadow: SHADOW_HERO,
        minHeight: 280,
      }}
    >
      <div className="absolute -right-8 -bottom-8 opacity-20">
        <QinoMark size={220} color={C.midnight} />
      </div>
      <div className="relative h-full flex flex-col justify-end" style={{ minHeight: 240 }}>
        <Eyebrow color={C.textMuted}>Welcome to QINO</Eyebrow>
        <h1
          className="mt-3 text-[34px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: C.ink,
          }}
        >
          Your personal aesthetics command center
        </h1>
      </div>
    </div>

    <p
      className="text-[14px] leading-[1.55]"
      style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
    >
      QINO analyzes your face, identifies your highest-impact priorities, and turns
      that into a daily protocol you can actually follow.
    </p>

    <div className="mt-6 space-y-2.5">
      {[
        { icon: Target, label: "Personalized priority map", sub: "What matters most for your face", bg: C.softBlush },
        { icon: Sparkles, label: "Daily execution system", sub: "Skin, frame, foundation — all in one place", bg: C.softPeach },
        { icon: Camera, label: "Visual progress tracking", sub: "See changes with periodic re-analysis", bg: C.softSage },
      ].map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.label}
            className="rounded-[18px] p-3.5 flex items-center gap-3"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
              style={{ background: p.bg }}
            >
              <Icon size={16} strokeWidth={1.6} color={C.midnight} />
            </div>
            <div>
              <p className="text-[13px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                {p.label}
              </p>
              <p className="text-[11.5px] mt-0.5" style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}>
                {p.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    <p
      className="mt-6 text-[11px] leading-relaxed text-center px-4"
      style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textDim }}
    >
      QINO provides educational aesthetic guidance only. Medical treatments should
      be discussed with a qualified professional.
    </p>

    <Footer onContinue={onContinue} label="Get Started" />
  </div>
);

/* =========================================================
   STEP 1 — GOAL
   ========================================================= */
const StepGoal = ({ value, onChange, onContinue }) => {
  const goals = [
    { id: "jawline", label: "Sharper jawline & lower-face definition", icon: Activity, accent: C.softBlush },
    { id: "skin", label: "Clearer skin", icon: Droplet, accent: C.softPeach },
    { id: "harmony", label: "Better facial harmony", icon: Sparkles, accent: C.softLavender },
    { id: "frame", label: "Better hair / grooming frame", icon: Scissors, accent: C.softSage },
    { id: "smile", label: "Better smile", icon: Heart, accent: C.softBlush },
    { id: "puffiness", label: "Reduce puffiness", icon: Droplet, accent: C.paleBlue },
    { id: "overall", label: "Look more attractive overall", icon: Gem, accent: C.softLavender },
  ];

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 1 · Goals</Eyebrow>
      <Title>What matters most to you?</Title>
      <Subtitle>Pick one or more. We'll weight your protocol around these.</Subtitle>

      <div className="mt-6 space-y-2.5">
        {goals.map((g) => (
          <OptionCard
            key={g.id}
            icon={g.icon}
            label={g.label}
            selected={value.includes(g.id)}
            onClick={() => toggle(g.id)}
            accent={g.accent}
            multi
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};

/* =========================================================
   STEP 2 — PERSONALIZATION (gender + aesthetic direction)
   ========================================================= */
const StepPersonalization = ({ value, onChange, onContinue }) => {
  const update = (key, v) => onChange({ ...value, [key]: v });

  const genders = [
    { id: "male", label: "Male", icon: User },
    { id: "female", label: "Female", icon: User },
    { id: "nonbinary", label: "Non-binary / other", icon: User },
    { id: "private", label: "Prefer not to say", icon: User },
  ];
  const directions = [
    { id: "masculine", label: "More masculine", icon: Activity, accent: C.paleBlue },
    { id: "feminine", label: "More feminine", icon: Heart, accent: C.softBlush },
    { id: "balanced", label: "Balanced / natural", icon: Sparkles, accent: C.softSage },
    { id: "unsure", label: "Not sure", icon: Lightbulb, accent: C.softLavender },
  ];

  const valid = !!value.gender && !!value.direction;

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 2 · Personalization</Eyebrow>
      <Title>Personalize your analysis</Title>
      <Subtitle>
        This helps QINO compare the right reference ranges and tailor the language
        of your protocol.
      </Subtitle>

      <div className="mt-6">
        <GroupLabel>How should QINO personalize your analysis?</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          {genders.map((g) => {
            const selected = value.gender === g.id;
            return (
              <button
                key={g.id}
                onClick={() => update("gender", g.id)}
                className="rounded-[18px] p-4 flex flex-col items-start gap-2 active:scale-[0.99] transition-all text-left"
                style={{
                  background: selected ? C.paleBlue : C.white,
                  border: `1.5px solid ${selected ? C.midnight : C.hairline}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                  style={{ background: selected ? "rgba(255,255,255,0.65)" : C.stone }}
                >
                  <User size={15} color={C.midnight} strokeWidth={1.6} />
                </div>
                <span
                  className="text-[12.5px] leading-snug"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <GroupLabel>What aesthetic direction fits your goal?</GroupLabel>
        <div className="space-y-2">
          {directions.map((d) => (
            <OptionCard
              key={d.id}
              icon={d.icon}
              label={d.label}
              selected={value.direction === d.id}
              onClick={() => update("direction", d.id)}
              accent={d.accent}
            />
          ))}
        </div>
      </div>

      <SafetyNote>
        QINO uses these inputs to set baseline references — never to assume a specific
        identity or outcome. You can update any of this from your settings.
      </SafetyNote>

      <Footer onContinue={onContinue} disabled={!valid} />
    </div>
  );
};

/* =========================================================
   STEP 3 — COMFORT / PATHWAYS (multi-select)
   ========================================================= */
const StepComfort = ({ value, onChange, onContinue }) => {
  const paths = [
    {
      id: "natural",
      label: "Natural habits",
      sub: "Lifestyle, hydration, sleep, grooming, body composition awareness",
      icon: Heart,
      accent: C.softSage,
    },
    {
      id: "products",
      label: "Products",
      sub: "Skincare, SPF, hair care, oral care, supplements / tools",
      icon: Droplet,
      accent: C.paleBlue,
    },
    {
      id: "clinics",
      label: "Clinic treatments",
      sub: "Facials, peels, microneedling, laser, acne scar consults, whitening",
      icon: Stethoscope,
      accent: C.softLavender,
    },
    {
      id: "injectables",
      label: "Injectables",
      sub: "Filler, neuromodulator discussions, skin boosters",
      icon: Syringe,
      accent: C.softPeach,
    },
    {
      id: "surgery",
      label: "Surgical consults",
      sub: "Educational discussion of surgical paths only",
      icon: Gem,
      accent: C.softBlush,
    },
  ];

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 3 · Pathways</Eyebrow>
      <Title>Which improvement paths are you open to?</Title>
      <Subtitle>
        Select all that apply. QINO will only show recommendations within your
        comfort zone. You can change this anytime.
      </Subtitle>

      <div className="mt-6 space-y-2.5">
        {paths.map((p) => (
          <OptionCard
            key={p.id}
            icon={p.icon}
            label={p.label}
            sub={p.sub}
            selected={value.includes(p.id)}
            onClick={() => toggle(p.id)}
            accent={p.accent}
            multi
          />
        ))}
      </div>

      <SafetyNote>
        QINO provides educational aesthetic guidance. Medical treatments,
        prescriptions, injections, and procedures should be discussed with qualified
        professionals.
      </SafetyNote>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};

/* =========================================================
   STEP 4 — BUDGET
   ========================================================= */
const StepBudget = ({ value, onChange, onContinue }) => {
  const tiers = [
    { id: "budget", label: "Budget", sub: "Drugstore essentials, max value", icon: Heart, accent: C.softSage },
    { id: "standard", label: "Standard", sub: "Mid-tier brands, solid quality", icon: Sparkles, accent: C.paleBlue },
    { id: "premium", label: "Premium", sub: "High-end formulas and finishes", icon: Gem, accent: C.softLavender },
    { id: "none", label: "No strict budget", sub: "Show me what works best", icon: Zap, accent: C.softPeach },
  ];

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 4 · Budget</Eyebrow>
      <Title>What's your spending range?</Title>
      <Subtitle>Product recommendations will match this tier.</Subtitle>

      <div className="mt-6 space-y-2.5">
        {tiers.map((t) => (
          <OptionCard
            key={t.id}
            icon={t.icon}
            label={t.label}
            sub={t.sub}
            selected={value === t.id}
            onClick={() => onChange(t.id)}
            accent={t.accent}
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={!value} />
    </div>
  );
};

/* =========================================================
   STEP 5 — ROUTINE TOLERANCE
   ========================================================= */
const StepRoutine = ({ value, onChange, onContinue }) => {
  const options = [
    { id: "5min", label: "5 minutes / day", sub: "Bare essentials only", icon: Clock, accent: C.softSage },
    { id: "15min", label: "15 minutes / day", sub: "Balanced morning + evening", icon: Sparkles, accent: C.paleBlue },
    { id: "serious", label: "Serious protocol", sub: "Full multi-step routine", icon: Zap, accent: C.softLavender },
  ];

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 5 · Time</Eyebrow>
      <Title>How much time can you commit?</Title>
      <Subtitle>Be honest — consistency beats complexity every time.</Subtitle>

      <div className="mt-6 space-y-2.5">
        {options.map((o) => (
          <OptionCard
            key={o.id}
            icon={o.icon}
            label={o.label}
            sub={o.sub}
            selected={value === o.id}
            onClick={() => onChange(o.id)}
            accent={o.accent}
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={!value} />
    </div>
  );
};

/* =========================================================
   STEP 6 — BODY COMPOSITION
   ========================================================= */
const StepBody = ({ value, onChange, onContinue }) => {
  const update = (key, v) => onChange({ ...value, [key]: v });
  const composition = ["Lean", "Average", "Soft", "Higher BF", "Prefer not to say"];

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 6 · Body Context</Eyebrow>
      <Title>Body composition context</Title>
      <Subtitle>
        QINO uses this only to assess facial softness and leanness — never to become
        a fitness app.
      </Subtitle>

      <div className="mt-6 space-y-2.5">
        <Stepper label="Height" unit="cm" value={value.height} onChange={(v) => update("height", v)} min={120} max={220} />
        <Stepper label="Current weight" unit="kg" value={value.weight} onChange={(v) => update("weight", v)} min={35} max={200} />
        <Stepper label="Target weight (optional)" unit="kg" value={value.target} onChange={(v) => update("target", v)} min={35} max={200} />
      </div>

      <div className="mt-5">
        <GroupLabel>Composition (optional)</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {composition.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={value.composition === c}
              onClick={() => update("composition", value.composition === c ? null : c)}
              accent={C.softLavender}
            />
          ))}
        </div>
      </div>

      <SafetyNote>
        Used only to inform facial softness, jaw definition, cheek fullness, and
        overall facial leanness. Never to track macros or build workout plans.
      </SafetyNote>

      <Footer onContinue={onContinue} secondary={{ label: "Skip this step", onClick: onContinue }} />
    </div>
  );
};

/* =========================================================
   STEP 7 — SKIN CONCERNS
   ========================================================= */
const StepSkin = ({ value, onChange, onContinue }) => {
  const concerns = [
    { id: "acne", label: "Acne", accent: C.softBlush },
    { id: "scarring", label: "Acne scarring", accent: C.softBlush },
    { id: "texture", label: "Texture", accent: C.softPeach },
    { id: "dryness", label: "Dryness", accent: C.paleBlue },
    { id: "oiliness", label: "Oiliness", accent: C.softPeach },
    { id: "pigmentation", label: "Hyperpigmentation", accent: C.softLavender },
    { id: "undereye", label: "Under-eye darkness", accent: C.softLavender },
    { id: "wrinkles", label: "Wrinkles", accent: C.paleBlue },
    { id: "sensitivity", label: "Sensitivity", accent: C.softSage },
    { id: "none", label: "None of these", accent: C.stone },
  ];

  const toggle = (id) => {
    if (id === "none") {
      onChange(value.includes("none") ? [] : ["none"]);
      return;
    }
    const cleaned = value.filter((v) => v !== "none");
    onChange(cleaned.includes(id) ? cleaned.filter((v) => v !== id) : [...cleaned, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 7 · Skin</Eyebrow>
      <Title>Any skin concerns?</Title>
      <Subtitle>Select all that apply. We'll prioritize accordingly.</Subtitle>

      <div className="mt-6 flex flex-wrap gap-2">
        {concerns.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={value.includes(c.id)}
            onClick={() => toggle(c.id)}
            accent={c.accent}
          />
        ))}
      </div>

      <Footer onContinue={onContinue} disabled={value.length === 0} />
    </div>
  );
};

/* =========================================================
   STEP 8 — HAIR & FACIAL FRAME (gender-inclusive)
   ========================================================= */
const StepHair = ({ value, onChange, personalization, onContinue }) => {
  const update = (key, v) => onChange({ ...value, [key]: v });

  const hairlineOptions = [
    "No concern",
    "Recession",
    "Thinning at temples",
    "Crown thinning",
    "Forehead framing",
    "Not sure",
  ];
  const densityOptions = ["High", "Medium", "Low", "Variable", "Not sure"];

  // Conditional logic
  const showFacialHair =
    personalization?.gender === "male" || personalization?.direction === "masculine";
  const showFraming =
    personalization?.gender === "female" || personalization?.direction === "feminine";
  const showNeutral = !showFacialHair && !showFraming;

  const facialHairOptions = ["Clean shave", "Light stubble", "Trimmed beard", "Full beard", "Not applicable"];
  const framingOptions = [
    "Face-framing layers",
    "More volume",
    "Sleeker look",
    "Natural texture",
    "Color / shine",
    "Not sure",
  ];
  const neutralOptions = [
    { id: "facialHair", label: "Facial hair guidance" },
    { id: "framing", label: "Hair framing guidance" },
    { id: "brows", label: "Brow shaping guidance" },
    { id: "color", label: "Color / shine guidance" },
    { id: "unsure", label: "Not sure" },
  ];

  const toggleNeutral = (id) => {
    const current = value.neutralPrefs || [];
    update("neutralPrefs", current.includes(id) ? current.filter((v) => v !== id) : [...current, id]);
  };

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Step 8 · Hair & Frame</Eyebrow>
      <Title>Hair & facial frame</Title>
      <Subtitle>
        Helps QINO tailor hairstyle, hairline, brow, and grooming recommendations.
      </Subtitle>

      <div className="mt-6">
        <GroupLabel>Hairline concern</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {hairlineOptions.map((h) => (
            <Chip
              key={h}
              label={h}
              selected={value.hairline === h}
              onClick={() => update("hairline", value.hairline === h ? null : h)}
              accent={C.paleBlue}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <GroupLabel>Hair density</GroupLabel>
        <div className="flex flex-wrap gap-2">
          {densityOptions.map((d) => (
            <Chip
              key={d}
              label={d}
              selected={value.density === d}
              onClick={() => update("density", value.density === d ? null : d)}
              accent={C.softLavender}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <GroupLabel>Style / grooming goal</GroupLabel>
        <input
          value={value.styleGoal || ""}
          onChange={(e) => update("styleGoal", e.target.value)}
          placeholder="e.g. sharper frame, more volume, better hairline balance"
          className="w-full px-4 py-3.5 rounded-[16px] text-[13.5px] outline-none"
          style={{
            background: C.white,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW_CARD,
            fontFamily: FONTS.body,
            fontWeight: 400,
            color: C.ink,
          }}
        />
      </div>

      {/* Conditional: Facial hair (Male / Masculine) */}
      {showFacialHair && (
        <div className="mt-5">
          <GroupLabel>Facial hair preference</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {facialHairOptions.map((g) => (
              <Chip
                key={g}
                label={g}
                selected={value.facialHair === g}
                onClick={() => update("facialHair", value.facialHair === g ? null : g)}
                accent={C.softPeach}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conditional: Framing (Female / Feminine) */}
      {showFraming && (
        <div className="mt-5">
          <GroupLabel>Hair framing preference</GroupLabel>
          <div className="flex flex-wrap gap-2">
            {framingOptions.map((f) => (
              <Chip
                key={f}
                label={f}
                selected={value.framing === f}
                onClick={() => update("framing", value.framing === f ? null : f)}
                accent={C.softBlush}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conditional: Neutral / multi-checkbox */}
      {showNeutral && (
        <div className="mt-5">
          <GroupLabel>Additional grooming preferences</GroupLabel>
          <div className="space-y-2">
            {neutralOptions.map((n) => {
              const selected = (value.neutralPrefs || []).includes(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => toggleNeutral(n.id)}
                  className="w-full rounded-[16px] p-3.5 flex items-center gap-3 active:scale-[0.99] transition-all text-left"
                  style={{
                    background: selected ? C.softLavender : C.white,
                    border: `1.5px solid ${selected ? C.midnight : C.hairline}`,
                    boxShadow: SHADOW_CARD,
                  }}
                >
                  <span
                    className="flex-1 text-[13px]"
                    style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.ink }}
                  >
                    {n.label}
                  </span>
                  <div
                    className="w-5 h-5 rounded-[6px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: selected ? C.midnight : "transparent",
                      border: selected ? "none" : `1.5px solid ${C.hairlineMid}`,
                    }}
                  >
                    {selected && <Check size={11} color={C.stone} strokeWidth={2.8} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Footer onContinue={onContinue} secondary={{ label: "Skip this step", onClick: onContinue }} />
    </div>
  );
};

/* =========================================================
   STEP 9 — SCAN HANDOFF (NOT mandatory upload)
   ========================================================= */
const StepScanHandoff = ({ onStartScan, onSkipToDashboard }) => (
  <div className="px-5 pt-2 pb-32">
    <Eyebrow>Final Step · Scan</Eyebrow>
    <Title>You're ready for your QINO scan</Title>
    <Subtitle>
      For the most accurate analysis, complete your guided photo scan when you have
      3–5 minutes, natural light, and privacy.
    </Subtitle>

    {/* Hero scan card */}
    <div
      className="mt-6 rounded-[24px] p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
        border: `1px solid ${C.hairline}`,
        boxShadow: SHADOW_HERO,
      }}
    >
      <div className="absolute -right-6 -bottom-6 opacity-15">
        <Camera size={140} color={C.midnight} strokeWidth={1.4} />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.6)" }}
          >
            <Camera size={15} color={C.midnight} strokeWidth={1.6} />
          </div>
          <Eyebrow>Guided Face Scan</Eyebrow>
        </div>

        <h2
          className="mt-4 text-[22px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            color: C.ink,
          }}
        >
          Six angles. About four minutes.
        </h2>

        <div className="mt-4 space-y-2">
          {[
            "6 required angles",
            "Lighting and blur checks",
            "Retake any photo before submitting",
            "Unlocks analysis, protocol, products, pathways",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(15,27,38,0.10)" }}
              >
                <Check size={11} color={C.midnight} strokeWidth={2.5} />
              </div>
              <span
                className="text-[12.5px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTAs */}
    <div className="mt-5 space-y-2.5">
      <button
        onClick={onStartScan}
        className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
        style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
      >
        <span
          className="flex items-center justify-center gap-2 text-[14px]"
          style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
        >
          Start scan now
          <ArrowRight size={15} strokeWidth={2} />
        </span>
      </button>
      <button
        onClick={onSkipToDashboard}
        className="w-full py-3.5 rounded-full transition-all active:scale-[0.99]"
        style={{ background: C.white, border: `1.5px solid ${C.hairlineMid}`, boxShadow: SHADOW_CARD }}
      >
        <span
          className="text-[13.5px]"
          style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
        >
          Go to dashboard
        </span>
      </button>
    </div>

    <p
      className="mt-5 text-[11px] leading-relaxed text-center px-2"
      style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textDim }}
    >
      You can start your scan anytime from the Today screen. Your dashboard will be
      in pre-scan mode until photos are submitted.
    </p>
  </div>
);

/* =========================================================
   PRE-SCAN TODAY DASHBOARD
   ========================================================= */
const PreScanDashboard = ({ onStartScan, onRemindLater }) => {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-3 pb-2 max-w-[440px] mx-auto">
        <div className="flex items-center gap-2">
          <QinoMark size={26} color={C.midnight} />
          <span
            className="text-[16px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.midnight,
            }}
          >
            QINO
          </span>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${C.softBlush} 0%, ${C.softLavender} 100%)`,
            border: `1px solid ${C.hairline}`,
          }}
        >
          <span
            className="text-[12px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
          >
            H
          </span>
        </div>
      </header>

      <div className="max-w-[440px] mx-auto px-5 pt-2 pb-8 space-y-5">
        {/* Greeting */}
        <div className="pt-2">
          <h1
            className="text-[34px] leading-[1.05]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              color: C.ink,
            }}
          >
            Good morning,
            <br />
            <span style={{ fontWeight: 500 }}>Hadley</span>
          </h1>
        </div>

        {/* HERO — Complete your scan */}
        <div
          className="rounded-[28px] p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW_HERO,
          }}
        >
          <div className="absolute -right-8 -bottom-8 opacity-15">
            <QinoMark size={180} color={C.midnight} />
          </div>

          <div className="relative">
            <Eyebrow color={C.textMuted}>Pre-Scan Mode</Eyebrow>
            <h2
              className="mt-3 text-[24px]"
              style={{
                fontFamily: FONTS.title,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                color: C.ink,
              }}
            >
              Complete your QINO Face Scan
            </h2>
            <p
              className="mt-3 text-[13.5px] leading-[1.55]"
              style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.ink, opacity: 0.78 }}
            >
              Your profile is ready. Finish your guided scan to unlock your facial
              priority map, 90-day protocol, product stack, and treatment pathways.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {["6 photos", "3–5 minutes", "Natural light recommended"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    fontFamily: FONTS.body,
                    fontWeight: 500,
                    color: C.midnight,
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
                style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
              >
                <span
                  className="flex items-center justify-center gap-2 text-[13.5px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
                >
                  Start guided scan
                  <ArrowRight size={14} strokeWidth={2} />
                </span>
              </button>
              <button
                onClick={onRemindLater}
                className="w-full py-3 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  fontFamily: FONTS.subtitle,
                  fontWeight: 500,
                  color: C.midnight,
                  fontSize: 12.5,
                }}
              >
                Remind me later
              </button>
            </div>
          </div>
        </div>

        {/* Locked previews */}
        <div>
          <p
            className="text-[16px] mb-3"
            style={{
              fontFamily: FONTS.subtitle,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Unlocks after scan
          </p>

          <div className="space-y-2.5">
            {[
              { label: "Analysis", sub: "Facial breakdown & priority ranking", state: "Locked", bg: C.softBlush, icon: Sparkles },
              { label: "Protocol", sub: "Your 90-day execution plan", state: "Locked", bg: C.softPeach, icon: Layers },
              { label: "Product Stack", sub: "Personalized recommendations", state: "Locked", bg: C.softSage, icon: Droplet },
              { label: "Coach", sub: "Limited until scan is complete", state: "Limited", bg: C.softLavender, icon: Lightbulb },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className="rounded-[20px] p-4 flex items-center gap-3"
                  style={{
                    background: C.white,
                    border: `1px solid ${C.hairline}`,
                    boxShadow: SHADOW_CARD,
                    opacity: 0.85,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ background: p.bg }}
                  >
                    <Icon size={16} strokeWidth={1.6} color={C.midnight} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                    >
                      {p.label}
                    </p>
                    <p
                      className="text-[11.5px] mt-0.5"
                      style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
                    >
                      {p.sub}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10.5px]"
                    style={{
                      background: C.stone,
                      fontFamily: FONTS.subtitle,
                      fontWeight: 600,
                      color: C.textMuted,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {p.state}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav (visual only here — navigation is handled by parent) */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40"
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(20px)",
          borderTop: `1px solid ${C.hairline}`,
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        }}
      >
        <div className="flex items-center justify-around px-2 pt-2.5 pb-2">
          {["Today", "Analysis", "Protocol", "Progress", "Coach"].map((label, i) => (
            <button
              key={label}
              className="flex flex-col items-center justify-center gap-1 py-1 px-3 flex-1"
              disabled={i !== 0}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ background: i === 0 ? C.midnight : C.hairlineMid }}
                />
              </div>
              <span
                className="text-[10.5px]"
                style={{
                  fontFamily: FONTS.subtitle,
                  fontWeight: 500,
                  color: i === 0 ? C.midnight : C.textDim,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

/* =========================================================
   GUIDED SCAN — PREP
   ========================================================= */
const ScanPrep = ({ onBegin, onClose }) => {
  const checklist = [
    { icon: Sun, text: "Use soft natural light" },
    { icon: Eye, text: "Remove glasses" },
    { icon: Camera, text: "Keep camera at eye level" },
    { icon: Scissors, text: "Pull hair away from face if possible" },
    { icon: Heart, text: "Use a neutral expression unless asked to smile" },
  ];

  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Guided Scan · Prep</Eyebrow>
      <Title>Before you start</Title>
      <Subtitle>A few quick checks to get a clean, accurate scan.</Subtitle>

      <div className="mt-6 space-y-2.5">
        {checklist.map((c, i) => {
          const Icon = c.icon;
          const accents = [C.softPeach, C.paleBlue, C.softSage, C.softLavender, C.softBlush];
          return (
            <div
              key={i}
              className="rounded-[18px] p-4 flex items-center gap-3"
              style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
            >
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: accents[i % accents.length] }}
              >
                <Icon size={15} color={C.midnight} strokeWidth={1.6} />
              </div>
              <span
                className="flex-1 text-[13px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
              >
                {c.text}
              </span>
            </div>
          );
        })}
      </div>

      <SafetyNote>
        Your photos stay private. Only used to generate your QINO analysis and track
        progress over time.
      </SafetyNote>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${C.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <button
          onClick={onBegin}
          className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
          style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
        >
          <span
            className="flex items-center justify-center gap-2 text-[14px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
          >
            Begin scan
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   GUIDED SCAN — CAPTURE STEP (mock)
   ========================================================= */
const ScanCapture = ({ angle, onCapture, onBack, currentIndex, total }) => {
  // Mock validation states cycle on tap
  const [validation, setValidation] = useState({
    lighting: "good",
    sharpness: "good",
    centered: "good",
    angle: "warn",
  });

  const messages = {
    lighting: { good: "Good lighting", warn: "Too dark", bad: "Too dark" },
    sharpness: { good: "Sharp", warn: "Hold still", bad: "Too blurry" },
    centered: { good: "Face centered", warn: "Move slightly", bad: "Off-center" },
    angle: { good: "Correct angle", warn: angle.angleHint || "Adjust angle", bad: "Wrong angle" },
  };

  const allGood = Object.values(validation).every((v) => v === "good");

  const dotColor = (v) =>
    v === "good" ? C.sageAccent : v === "warn" ? C.peachAccent : C.blushAccent;

  return (
    <div className="px-5 pt-2 pb-32">
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>
          Scan {currentIndex + 1} of {total}
        </Eyebrow>
        <span
          className="text-[11px]"
          style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
        >
          {angle.id}
        </span>
      </div>
      <Title size={26}>{angle.label}</Title>
      <Subtitle>{angle.instruction}</Subtitle>

      {/* Camera placeholder */}
      <div
        className="mt-5 rounded-[24px] aspect-[3/4] relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
          border: `1px solid ${C.hairline}`,
          boxShadow: SHADOW_CARD,
        }}
      >
        {/* Face outline guide */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="faceGuide" cx="50%" cy="42%" r="42%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="130" rx="58" ry="80" fill="url(#faceGuide)" />
          <ellipse
            cx="100"
            cy="130"
            rx="58"
            ry="80"
            stroke="rgba(15,27,38,0.45)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
            fill="none"
          />
          {/* center crosshair */}
          <line x1="100" y1="118" x2="100" y2="142" stroke="rgba(15,27,38,0.40)" strokeWidth="1" />
          <line x1="88" y1="130" x2="112" y2="130" stroke="rgba(15,27,38,0.40)" strokeWidth="1" />
          {/* corner brackets */}
          {[
            "M30 30 L30 50 M30 30 L50 30",
            "M170 30 L170 50 M170 30 L150 30",
            "M30 250 L30 230 M30 250 L50 250",
            "M170 250 L170 230 M170 250 L150 250",
          ].map((d, i) => (
            <path key={i} d={d} stroke="rgba(15,27,38,0.55)" strokeWidth="2" fill="none" />
          ))}
        </svg>

        {/* angle hint badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10.5px] flex items-center gap-1.5"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            fontFamily: FONTS.subtitle,
            fontWeight: 600,
            color: C.midnight,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.peachAccent }} />
          {angle.angleHint || "Position face inside guide"}
        </div>
      </div>

      {/* Validation row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { key: "lighting", label: "Lighting" },
          { key: "sharpness", label: "Sharpness" },
          { key: "centered", label: "Centered" },
          { key: "angle", label: "Angle" },
        ].map((row) => (
          <div
            key={row.key}
            className="rounded-[14px] px-3 py-2.5 flex items-center gap-2"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: dotColor(validation[row.key]) }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-[10px]"
                style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}
              >
                {row.label}
              </p>
              <p
                className="text-[11.5px] truncate"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
              >
                {messages[row.key][validation[row.key]]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Capture button — large */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${C.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              // toggle the "angle" validation between warn and good as a demo
              setValidation((v) => ({ ...v, angle: v.angle === "good" ? "warn" : "good" }));
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <Lightbulb size={16} color={C.midnight} strokeWidth={1.6} />
          </button>

          <button
            onClick={onCapture}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-[0.95]"
            style={{
              background: C.midnight,
              boxShadow: "0 12px 28px rgba(15,27,38,0.30)",
              border: `4px solid ${C.white}`,
              outline: `2px solid ${allGood ? C.midnight : "rgba(15,27,38,0.20)"}`,
            }}
          >
            <Camera size={26} color={C.stone} strokeWidth={1.6} />
          </button>

          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <ChevronLeft size={16} color={C.midnight} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   GUIDED SCAN — REVIEW
   ========================================================= */
const ScanReview = ({ photos, angles, onSubmit, onRetake }) => {
  return (
    <div className="px-5 pt-2 pb-32">
      <Eyebrow>Guided Scan · Review</Eyebrow>
      <Title>Review your scan</Title>
      <Subtitle>
        All six photos look ready. Retake any if you'd like a cleaner shot.
      </Subtitle>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {angles.map((a, i) => {
          const accents = [C.paleBlue, C.softBlush, C.softLavender, C.softPeach, C.softSage, C.paleBlue];
          return (
            <div
              key={a.id}
              className="rounded-[20px] aspect-[3/4] relative overflow-hidden"
              style={{
                background: accents[i],
                border: `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              {/* Face silhouette */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id={`rg${a.id}`} cx="50%" cy="40%" r="45%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </radialGradient>
                </defs>
                <ellipse cx="50" cy="50" rx="28" ry="36" fill={`url(#rg${a.id})`} />
              </svg>

              <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: "rgba(15,27,38,0.85)" }}
              >
                <Check size={10} color={C.stone} strokeWidth={2.5} />
                <span
                  className="text-[9px]"
                  style={{
                    fontFamily: FONTS.subtitle,
                    fontWeight: 600,
                    color: C.stone,
                    letterSpacing: "0.04em",
                  }}
                >
                  Approved
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 flex items-center justify-between"
                style={{ background: "linear-gradient(180deg, transparent 0%, rgba(15,27,38,0.20) 100%)" }}>
                <span
                  className="text-[10.5px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {a.label}
                </span>
                <button
                  onClick={() => onRetake(i)}
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    fontFamily: FONTS.subtitle,
                    fontWeight: 600,
                    fontSize: 9.5,
                    color: C.midnight,
                  }}
                >
                  Retake
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${C.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <button
          onClick={onSubmit}
          className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
          style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
        >
          <span
            className="flex items-center justify-center gap-2 text-[14px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
          >
            Submit for analysis
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   GUIDED SCAN — PROCESSING
   ========================================================= */
const ScanProcessing = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: "Analyzing facial structure", color: C.mistAccent },
    { label: "Checking skin texture", color: C.peachAccent },
    { label: "Mapping jaw, chin, and neck", color: C.lavenderAccent },
    { label: "Building priority map", color: C.blushAccent },
    { label: "Creating 90-day protocol", color: C.sageAccent },
    { label: "Preparing product & treatment pathways", color: C.mistAccent },
  ];

  // Auto-advance phases (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => {
        if (p >= phases.length - 1) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="px-5 pt-2 pb-32 flex flex-col"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <div
        className="rounded-[28px] p-7 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
          border: `1px solid ${C.hairline}`,
          boxShadow: SHADOW_HERO,
          minHeight: 280,
        }}
      >
        <div
          className="absolute top-0 right-12 bottom-0 w-px qino-axis-pulse"
          style={{ background: `linear-gradient(180deg, transparent, ${C.midnight}, transparent)` }}
        />
        <div className="absolute -right-8 top-10 opacity-25 qino-mark-spin">
          <QinoMark size={160} color={C.midnight} />
        </div>

        <div className="relative">
          <Eyebrow color={C.textMuted}>Building your QINO analysis</Eyebrow>
          <h1
            className="mt-3 text-[26px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: C.ink,
            }}
          >
            Reading your face,
            <br />
            building your plan.
          </h1>
          <p
            className="mt-3 text-[13px] leading-relaxed"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
          >
            This usually takes about a minute.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {phases.map((p, i) => {
          const done = i < phase;
          const active = i === phase;
          return (
            <div
              key={p.label}
              className="rounded-[18px] p-4 flex items-center gap-3 transition-all"
              style={{
                background: active || done ? C.white : C.stone,
                border: `1px solid ${C.hairline}`,
                boxShadow: active || done ? SHADOW_CARD : "none",
                opacity: active || done ? 1 : 0.55,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: done ? C.midnight : active ? p.color : C.stone }}
              >
                {done ? (
                  <Check size={14} color={C.stone} strokeWidth={2.5} />
                ) : active ? (
                  <div className="w-3 h-3 rounded-full qino-pulse-dot" style={{ background: C.white }} />
                ) : (
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <p
                className="flex-1 text-[12.5px]"
                style={{
                  fontFamily: FONTS.subtitle,
                  fontWeight: active ? 600 : 500,
                  color: active || done ? C.ink : C.textMuted,
                }}
              >
                {p.label}
              </p>
              {active && (
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full qino-bounce-1" style={{ background: C.midnight }} />
                  <div className="w-1 h-1 rounded-full qino-bounce-2" style={{ background: C.midnight }} />
                  <div className="w-1 h-1 rounded-full qino-bounce-3" style={{ background: C.midnight }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phase >= phases.length - 1 && (
        <div className="mt-6">
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
            style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
          >
            <span
              className="flex items-center justify-center gap-2 text-[14px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
            >
              View your dashboard
              <ArrowRight size={15} strokeWidth={2} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   GUIDED SCAN — Container
   ========================================================= */
const GuidedScan = ({ onClose, onComplete }) => {
  const angles = [
    { id: "front", label: "Front neutral", instruction: "Look straight, soft expression, mouth relaxed.", angleHint: "Face camera directly" },
    { id: "smile", label: "Front smile", instruction: "Natural smile, full teeth visible.", angleHint: "Same angle, smile naturally" },
    { id: "left", label: "Left profile", instruction: "Turn fully to your right (your left side faces camera).", angleHint: "Turn 90° right" },
    { id: "right", label: "Right profile", instruction: "Turn fully to your left (your right side faces camera).", angleHint: "Turn 90° left" },
    { id: "fortyfive", label: "45-degree", instruction: "Half-turn from front, head straight.", angleHint: "Turn slightly left" },
    { id: "skin", label: "Skin close-up", instruction: "Cheek area, natural light, no zoom blur.", angleHint: "Move closer to cheek" },
  ];

  const [stage, setStage] = useState("prep"); // prep | capture | review | processing
  const [captureIndex, setCaptureIndex] = useState(0);
  const [photos, setPhotos] = useState({});

  const handleCapture = () => {
    setPhotos((p) => ({ ...p, [angles[captureIndex].id]: true }));
    if (captureIndex < angles.length - 1) {
      setCaptureIndex(captureIndex + 1);
    } else {
      setStage("review");
    }
  };

  const handleBack = () => {
    if (captureIndex > 0) setCaptureIndex(captureIndex - 1);
    else setStage("prep");
  };

  const handleRetake = (idx) => {
    setCaptureIndex(idx);
    setStage("capture");
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}
    >
      {/* Mini header */}
      <header className="px-5 pt-3 pb-3 flex items-center justify-between max-w-[440px] mx-auto">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
        >
          <X size={15} color={C.midnight} strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2">
          <QinoMark size={20} color={C.midnight} />
          <span
            className="text-[12px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.midnight,
            }}
          >
            QINO SCAN
          </span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      <div className="max-w-[440px] mx-auto">
        {stage === "prep" && (
          <ScanPrep onBegin={() => setStage("capture")} onClose={onClose} />
        )}
        {stage === "capture" && (
          <ScanCapture
            angle={angles[captureIndex]}
            onCapture={handleCapture}
            onBack={handleBack}
            currentIndex={captureIndex}
            total={angles.length}
          />
        )}
        {stage === "review" && (
          <ScanReview
            photos={photos}
            angles={angles}
            onSubmit={() => setStage("processing")}
            onRetake={handleRetake}
          />
        )}
        {stage === "processing" && <ScanProcessing onComplete={onComplete} />}
      </div>
    </div>
  );
};

/* =========================================================
   ROOT — Onboarding + Pre-Scan + Scan flow
   ========================================================= */
export default function QinoOnboarding({ onComplete }) {
  // appStage: "onboarding" | "prescan" | "scan" | "complete"
  const [appStage, setAppStage] = useState("onboarding");
  const [step, setStep] = useState(0);

  // 9 onboarding steps total: 0 welcome, 1-8 questions, 9 scan handoff
  // Question count for header: steps 1-9 => 9 visible "1/9"-style indicators
  const totalSteps = 10;

  const [data, setData] = useState({
    goals: [],
    personalization: { gender: null, direction: null },
    comfort: [], // multi-select
    budget: null,
    routine: null,
    body: { height: 178, weight: 78, target: 75, composition: null },
    skin: [],
    hair: { hairline: null, density: null, styleGoal: "", facialHair: null, framing: null, neutralPrefs: [] },
  });

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const close = () => onComplete && onComplete(data);

  // After onboarding completes → pre-scan dashboard or scan
  if (appStage === "scan") {
    return (
      <GuidedScan
        onClose={() => setAppStage("prescan")}
        onComplete={() => {
          setAppStage("complete");
          onComplete && onComplete({ ...data, scanCompleted: true });
        }}
      />
    );
  }

  if (appStage === "prescan") {
    return (
      <PreScanDashboard
        onStartScan={() => setAppStage("scan")}
        onRemindLater={() => onComplete && onComplete({ ...data, scanCompleted: false })}
      />
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { -webkit-font-smoothing: antialiased; background: ${C.ivory}; }
        @keyframes qinoAxisPulse { 0%, 100% { opacity: 0.20; } 50% { opacity: 0.55; } }
        .qino-axis-pulse { animation: qinoAxisPulse 2.5s ease-in-out infinite; }
        @keyframes qinoMarkSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .qino-mark-spin { animation: qinoMarkSpin 32s linear infinite; }
        @keyframes qinoPulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.6); opacity: 0.5; } }
        .qino-pulse-dot { animation: qinoPulseDot 1s ease-in-out infinite; }
        @keyframes qinoBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }
        .qino-bounce-1 { animation: qinoBounce 1.2s ease-in-out infinite; }
        .qino-bounce-2 { animation: qinoBounce 1.2s ease-in-out infinite 0.15s; }
        .qino-bounce-3 { animation: qinoBounce 1.2s ease-in-out infinite 0.3s; }
      `}</style>

      <div className="max-w-[440px] mx-auto min-h-screen relative">
        {step > 0 && (
          <OnboardingHeader
            step={step - 1}
            total={9}
            onBack={back}
            onClose={close}
          />
        )}

        {step === 0 && <StepWelcome onContinue={next} />}
        {step === 1 && (
          <StepGoal value={data.goals} onChange={(v) => update("goals", v)} onContinue={next} />
        )}
        {step === 2 && (
          <StepPersonalization
            value={data.personalization}
            onChange={(v) => update("personalization", v)}
            onContinue={next}
          />
        )}
        {step === 3 && (
          <StepComfort value={data.comfort} onChange={(v) => update("comfort", v)} onContinue={next} />
        )}
        {step === 4 && (
          <StepBudget value={data.budget} onChange={(v) => update("budget", v)} onContinue={next} />
        )}
        {step === 5 && (
          <StepRoutine value={data.routine} onChange={(v) => update("routine", v)} onContinue={next} />
        )}
        {step === 6 && (
          <StepBody value={data.body} onChange={(v) => update("body", v)} onContinue={next} />
        )}
        {step === 7 && (
          <StepSkin value={data.skin} onChange={(v) => update("skin", v)} onContinue={next} />
        )}
        {step === 8 && (
          <StepHair
            value={data.hair}
            personalization={data.personalization}
            onChange={(v) => update("hair", v)}
            onContinue={next}
          />
        )}
        {step === 9 && (
          <StepScanHandoff
            onStartScan={() => setAppStage("scan")}
            onSkipToDashboard={() => setAppStage("prescan")}
          />
        )}
      </div>
    </div>
  );
}