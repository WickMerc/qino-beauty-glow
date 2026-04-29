import { useState } from "react";
import {
  Home, Scan, Pill as PillIcon, BarChart3, MessageCircle, Bell, Settings,
  Pencil, Camera, MessageSquare, Layers, Sun, Sparkles, Moon,
  ChevronRight, ArrowRight, ArrowDown, Plus, Check, X, Lock,
  Calendar, Star, Send, ListChecks,
} from "lucide-react";

/* =========================================================
   QINO — Light Premium Beauty-Tech Dashboard
   Mobile-first prototype. Mock data only.
   Fonts: Sora (titles) · Outfit (subtitles/labels/buttons) · Inter (body)
   ========================================================= */

const C = {
  // Brand core
  midnight: "#0F1B26",
  steel: "#536A78",
  steelLight: "#7A8E9B",
  mist: "#B8CFD9",
  stone: "#F2EFEA",
  white: "#FFFFFF",
  ivory: "#F7F4EE",         // app bg — slightly warmer than stone
  // Pastel accent palette (varied harmonious cards)
  paleBlue: "#DDE7EE",
  softBlush: "#F6DAD2",
  softLavender: "#E8DDF7",
  softPeach: "#F8E5D6",
  softSage: "#DCE8E2",
  // Deeper accent tones for chart/dot accents
  blushAccent: "#E8A89A",
  lavenderAccent: "#B89DD9",
  peachAccent: "#E8B894",
  sageAccent: "#9DB8A6",
  mistAccent: "#8AA8B5",
  // Text
  ink: "#0F1B26",
  textMuted: "#536A78",
  textDim: "#7A8E9B",
  // System
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
      <linearGradient id="qmG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="32" rx="17" ry="25" stroke="url(#qmG)" strokeWidth="2.4" fill="none" />
    <line x1="32" y1="2" x2="32" y2="62" stroke={color} strokeWidth="1.6" />
    <path d="M40 22 Q47 32 40 42" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// =====================================================================
// PRIMITIVES
// =====================================================================

// Eyebrow / micro label (Outfit, uppercase, tracked)
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

// Section heading (above each module)
const SectionHeading = ({ children, action, actionLabel = "View all" }) => (
  <div className="flex items-center justify-between px-1 mb-3">
    <h3
      className="text-[16px]"
      style={{
        fontFamily: FONTS.subtitle,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: C.ink,
      }}
    >
      {children}
    </h3>
    {action && (
      <button
        onClick={action}
        className="text-[12px]"
        style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Standard surface card (white default)
const Card = ({ children, className = "", bg = C.white, onClick, padding = "p-5", radius = "rounded-[24px]" }) => (
  <div
    onClick={onClick}
    className={`${radius} ${padding} ${className} ${onClick ? "active:scale-[0.99] transition-transform cursor-pointer" : ""}`}
    style={{
      background: bg,
      border: `1px solid ${C.hairline}`,
      boxShadow: SHADOW_CARD,
    }}
  >
    {children}
  </div>
);

// Pill tag
const Pill = ({ children, bg, color = C.ink, className = "" }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] ${className}`}
    style={{
      background: bg,
      color,
      fontFamily: FONTS.subtitle,
      fontWeight: 600,
      letterSpacing: "0.01em",
    }}
  >
    {children}
  </span>
);

// Progress bar
const ProgressBar = ({ value, height = 4, fill = C.midnight, track = "rgba(15,27,38,0.08)" }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: track }}>
    <div
      className="h-full rounded-full transition-all duration-500"
      style={{ width: `${value}%`, background: fill }}
    />
  </div>
);

// Donut score (SVG ring)
const Donut = ({ value, size = 44, stroke = 4, color = C.midnight, track = "rgba(15,27,38,0.10)" }) => {
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

// =====================================================================
// TOP BAR
// =====================================================================
const TopBar = () => (
  <header className="flex items-center justify-between px-5 pt-3 pb-2">
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
    <div className="flex items-center gap-2">
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
      >
        <Bell size={15} color={C.midnight} strokeWidth={1.6} />
      </button>
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
    </div>
  </header>
);

// =====================================================================
// BOTTOM NAV
// =====================================================================
const tabs = [
  { id: "today", label: "Today", icon: Home },
  { id: "analysis", label: "Analysis", icon: Scan },
  { id: "protocol", label: "Protocol", icon: PillIcon },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "coach", label: "Coach", icon: MessageCircle },
];

const BottomNav = ({ active, onChange }) => (
  <nav
    className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40"
    style={{
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.hairline}`,
      paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
    }}
  >
    <div className="flex items-center justify-around px-2 pt-2.5">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 flex-1"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2 : 1.5}
              color={isActive ? C.midnight : C.textDim}
            />
            <span
              className="text-[10.5px]"
              style={{
                fontFamily: FONTS.subtitle,
                fontWeight: 500,
                color: isActive ? C.midnight : C.textDim,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

/* =========================================================
   SCREEN: TODAY
   ========================================================= */
const TodayScreen = ({ onOpenProducts, onOpenPathways, onTab }) => {
  const [routines, setRoutines] = useState({
    morning: { label: "Morning Routine", sub: "7 steps", icon: Sun, total: 7, done: 5, bg: C.softPeach, accent: C.peachAccent },
    foundation: { label: "Aesthetic Foundation", sub: "Core habits & training", icon: Sparkles, total: 6, done: 4, bg: C.softLavender, accent: C.lavenderAccent },
    evening: { label: "Evening Routine", sub: "Recovery & renewal", icon: Moon, total: 5, done: 3, bg: C.paleBlue, accent: C.mistAccent },
  });

  const tickRoutine = (key) => {
    setRoutines((r) => ({
      ...r,
      [key]: { ...r[key], done: Math.min(r[key].done + 1, r[key].total) },
    }));
  };

  return (
    <div className="px-5 space-y-6 pb-8">
      {/* Greeting Title */}
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

      {/* HERO — Foundation Phase (mist/pale blue gradient) */}
      <div
        className="rounded-[28px] p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
          border: `1px solid ${C.hairline}`,
          boxShadow: SHADOW_HERO,
        }}
      >
        {/* decorative axis line */}
        <div
          className="absolute top-0 right-10 bottom-0 w-px opacity-25"
          style={{ background: `linear-gradient(180deg, transparent, ${C.midnight}, transparent)` }}
        />
        <div className="absolute -right-6 top-6 opacity-15">
          <QinoMark size={120} color={C.midnight} />
        </div>

        <div className="relative">
          <h2
            className="text-[24px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            Foundation Phase
          </h2>
          <p
            className="mt-1 text-[14px]"
            style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
          >
            Day 12 / 90
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar value={13} height={5} fill={C.midnight} track="rgba(15,27,38,0.10)" />
            </div>
            <span
              className="text-[13px]"
              style={{ fontFamily: FONTS.body, fontWeight: 600, color: C.ink }}
            >
              13%
            </span>
          </div>

          <p
            className="mt-5 text-[13px] leading-[1.45]"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.ink, opacity: 0.78 }}
          >
            Your focus today: lower-face definition, skin consistency, grooming frame.
          </p>

          <button
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: C.white, boxShadow: "0 4px 12px rgba(15,27,38,0.10)" }}
          >
            <ChevronRight size={16} color={C.midnight} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: "Log", icon: Pencil },
            { label: "Photo", icon: Camera },
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
                  background: C.white,
                  border: `1px solid ${C.hairline}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <Icon size={18} strokeWidth={1.6} color={C.midnight} />
                <span
                  className="text-[12px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TODAY'S MISSION */}
      <div>
        <SectionHeading action={() => {}}>Today's Mission</SectionHeading>
        <div className="space-y-2.5">
          {Object.entries(routines).map(([key, r]) => {
            const Icon = r.icon;
            const pct = (r.done / r.total) * 100;
            return (
              <div
                key={key}
                onClick={() => tickRoutine(key)}
                className="rounded-[22px] p-4 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                style={{
                  background: r.bg,
                  border: `1px solid ${C.hairline}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <div
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <Icon size={17} strokeWidth={1.6} color={C.midnight} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[14px]"
                      style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                    >
                      {r.label}
                    </p>
                    <span
                      className="text-[13px]"
                      style={{ fontFamily: FONTS.body, fontWeight: 600, color: C.ink }}
                    >
                      {r.done} / {r.total}
                    </span>
                  </div>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
                  >
                    {r.sub}
                  </p>
                  <div className="mt-2.5">
                    <ProgressBar
                      value={pct}
                      height={4}
                      fill={r.accent}
                      track="rgba(255,255,255,0.55)"
                    />
                  </div>
                </div>
                <ChevronRight size={16} color={C.midnight} strokeWidth={1.6} />
              </div>
            );
          })}
        </div>
      </div>

      {/* PRIORITY STACK */}
      <div>
        <SectionHeading>Priority Stack</SectionHeading>
        <div className="flex flex-wrap gap-2">
          <Pill bg={C.softBlush} color={C.midnight}>Lower-face definition</Pill>
          <Pill bg={C.paleBlue} color={C.midnight}>Skin evenness</Pill>
          <Pill bg={C.softPeach} color={C.midnight}>Hair framing</Pill>
          <Pill bg={C.softLavender} color={C.midnight}>Smile brightness</Pill>
          <Pill bg={C.softSage} color={C.midnight}>Brow cleanup</Pill>
          <Pill bg={C.stone} color={C.textMuted}>Under-eye health</Pill>
        </div>
      </div>

      {/* PATHWAY CARDS */}
      <div>
        <SectionHeading>Your Pathway</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          <Card bg={C.softSage} onClick={onOpenProducts} padding="p-5" radius="rounded-[22px]">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.65)" }}
            >
              <Layers size={17} strokeWidth={1.6} color={C.midnight} />
            </div>
            <p
              className="text-[14px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
            >
              Product Stack
            </p>
            <p
              className="text-[11.5px] mt-1"
              style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
            >
              5 essentials active
            </p>
            <div
              className="flex items-center gap-1 mt-3 text-[12px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
            >
              View stack <ArrowRight size={13} strokeWidth={1.8} />
            </div>
          </Card>

          <Card bg={C.softBlush} onClick={onOpenPathways} padding="p-5" radius="rounded-[22px]">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.65)" }}
            >
              <Sparkles size={17} strokeWidth={1.6} color={C.midnight} />
            </div>
            <p
              className="text-[14px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
            >
              Pathways
            </p>
            <p
              className="text-[11.5px] mt-1"
              style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
            >
              Products + Clinics
            </p>
            <div
              className="flex items-center gap-1 mt-3 text-[12px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
            >
              View options <ArrowRight size={13} strokeWidth={1.8} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SCREEN: ANALYSIS
   ========================================================= */
const AnalysisScreen = () => {
  const scores = [
    { label: "Symmetry", value: 86, status: "Good", color: C.mistAccent, bgRing: "rgba(184,207,217,0.20)" },
    { label: "Skin Quality", value: 72, status: "Fair", color: C.peachAccent, bgRing: "rgba(232,184,148,0.18)" },
    { label: "Structure", value: 78, status: "Good", color: C.midnight, bgRing: "rgba(15,27,38,0.08)" },
    { label: "Grooming Frame", value: 81, status: "Good", color: C.sageAccent, bgRing: "rgba(157,184,166,0.20)" },
  ];

  const highImpact = [
    { num: "1", label: "Lower-face definition", level: "High", bg: C.softBlush, color: C.blushAccent },
    { num: "2", label: "Skin texture", level: "Medium", bg: C.softPeach, color: C.peachAccent },
    { num: "3", label: "Under-eye health", level: "Medium", bg: C.softPeach, color: C.peachAccent },
  ];

  const products = [
    { name: "Peptide Firming Serum", tag: "At-home", rating: 4.8, bg: C.paleBlue },
    { name: "Gentle Exfoliant", tag: "At-home", rating: 4.6, bg: C.softPeach },
    { name: "Collagen Support", tag: "At-home", rating: 4.7, bg: C.softLavender },
    { name: "SPF Defender", tag: "At-home", rating: 4.9, bg: C.softSage },
  ];

  return (
    <div className="px-5 space-y-6 pb-8">
      {/* Title row */}
      <div className="pt-2 flex items-center justify-between">
        <h1
          className="text-[28px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          Analysis
        </h1>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
        >
          <Scan size={15} color={C.midnight} strokeWidth={1.6} />
        </button>
      </div>

      {/* Face visual + score donuts */}
      <div className="grid grid-cols-[1.15fr_1fr] gap-3">
        {/* Face card */}
        <div
          className="rounded-[24px] relative overflow-hidden flex items-center justify-center"
          style={{
            background: `linear-gradient(160deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW_CARD,
            minHeight: 280,
          }}
        >
          {/* Abstract face placeholder — refined silhouette + key points */}
          <svg viewBox="0 0 200 280" className="w-full h-full">
            <defs>
              <radialGradient id="faceGrad" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.10" />
              </radialGradient>
            </defs>
            {/* Face oval */}
            <ellipse cx="100" cy="130" rx="62" ry="84" fill="url(#faceGrad)" />
            {/* Symmetry mesh lines */}
            <g stroke="rgba(15,27,38,0.18)" strokeWidth="0.7" fill="none">
              <line x1="100" y1="46" x2="100" y2="214" strokeDasharray="2,3" />
              <path d="M50 110 Q100 100 150 110" />
              <path d="M55 145 Q100 138 145 145" />
              <path d="M60 175 Q100 168 140 175" />
              <ellipse cx="78" cy="120" rx="10" ry="6" />
              <ellipse cx="122" cy="120" rx="10" ry="6" />
              <path d="M88 165 Q100 175 112 165" />
              <path d="M82 195 Q100 205 118 195" />
            </g>
            {/* Highlight points */}
            {[
              { cx: 78, cy: 120 },
              { cx: 122, cy: 120 },
              { cx: 100, cy: 150 },
              { cx: 78, cy: 185 },
              { cx: 122, cy: 185 },
              { cx: 100, cy: 200 },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="6" fill={C.peachAccent} opacity="0.25" />
                <circle cx={p.cx} cy={p.cy} r="2.2" fill={C.peachAccent} />
              </g>
            ))}
          </svg>
        </div>

        {/* Score column */}
        <div className="grid grid-rows-4 gap-2">
          {scores.slice(0, 4).map((s) => (
            <div
              key={s.label}
              className="rounded-[18px] flex items-center gap-3 px-3 py-2.5"
              style={{
                background: C.white,
                border: `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10.5px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}
                >
                  {s.label}
                </p>
                <p
                  className="text-[20px] leading-none mt-0.5"
                  style={{
                    fontFamily: FONTS.title,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: C.ink,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: s.color }}
                >
                  {s.status}
                </p>
              </div>
              <Donut value={s.value} size={36} stroke={3.5} color={s.color} track={s.bgRing} />
            </div>
          ))}
        </div>
      </div>

      {/* HIGH IMPACT AREAS */}
      <Card bg={C.white} padding="p-5" radius="rounded-[24px]">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: C.softBlush }}
          >
            <Sparkles size={13} color={C.blushAccent} strokeWidth={1.8} />
          </div>
          <h3
            className="text-[15px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
          >
            High Impact Areas
          </h3>
        </div>

        <div className="space-y-2">
          {highImpact.map((item) => (
            <div key={item.num} className="flex items-center gap-3 py-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: C.stone }}
              >
                <span
                  className="text-[11px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
                >
                  {item.num}
                </span>
              </div>
              <span
                className="flex-1 text-[13.5px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
              >
                {item.label}
              </span>
              <Pill bg={item.bg} color={item.color}>{item.level}</Pill>
            </div>
          ))}
        </div>
      </Card>

      {/* SUGGESTED PRODUCTS / CARE — horizontal scroller */}
      <div>
        <SectionHeading action={() => {}}>Suggested Products / Care</SectionHeading>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 hide-scrollbar">
          {products.map((p) => (
            <div
              key={p.name}
              className="flex-shrink-0 w-[130px] rounded-[20px] p-3"
              style={{
                background: C.white,
                border: `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              <div
                className="aspect-square rounded-[14px] mb-2.5 flex items-center justify-center"
                style={{ background: p.bg }}
              >
                {/* Bottle silhouette */}
                <svg viewBox="0 0 40 60" width="36" height="54">
                  <rect x="14" y="2" width="12" height="6" rx="2" fill="rgba(15,27,38,0.55)" />
                  <rect x="10" y="10" width="20" height="46" rx="6" fill="rgba(255,255,255,0.85)" stroke="rgba(15,27,38,0.15)" />
                  <rect x="13" y="34" width="14" height="10" rx="2" fill="rgba(15,27,38,0.08)" />
                </svg>
              </div>
              <p
                className="text-[12px] leading-tight"
                style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
              >
                {p.name}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className="text-[10px]"
                  style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
                >
                  {p.tag}
                </span>
                <div className="flex items-center gap-0.5">
                  <Star size={9} fill={C.peachAccent} color={C.peachAccent} strokeWidth={0} />
                  <span
                    className="text-[10.5px]"
                    style={{ fontFamily: FONTS.body, fontWeight: 600, color: C.ink }}
                  >
                    {p.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOUNDATION INSIGHT */}
      <Card bg={C.stone} padding="p-4" radius="rounded-[22px]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: C.white }}
          >
            <ArrowDown size={15} color={C.midnight} strokeWidth={1.8} />
          </div>
          <p
            className="flex-1 text-[13.5px] leading-tight"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
          >
            Foundation first: reducing facial softness improves results.
          </p>
          <ChevronRight size={16} color={C.midnight} strokeWidth={1.8} />
        </div>
      </Card>
    </div>
  );
};

/* =========================================================
   SCREEN: PROTOCOL
   ========================================================= */
const ProtocolScreen = () => {
  const phases = [
    { num: 1, name: "Foundation", days: "Days 1–30", state: "active", bg: C.paleBlue },
    { num: 2, name: "Refinement", days: "Days 31–60", state: "locked" },
    { num: 3, name: "Optimization", days: "Days 61–90", state: "locked" },
  ];

  // weekly chart data (4 series across 7 days)
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const series = [
    { name: "Routine", color: C.mistAccent, values: [60, 80, 50, 75, 95, 70, 85] },
    { name: "Training", color: C.lavenderAccent, values: [45, 65, 35, 80, 70, 60, 55] },
    { name: "Nutrition", color: C.peachAccent, values: [70, 50, 85, 60, 75, 45, 90] },
    { name: "Recovery", color: C.blushAccent, values: [55, 70, 60, 50, 85, 75, 65] },
  ];

  const photos = [
    { day: "Day 1", bg: C.softPeach },
    { day: "Day 12", bg: C.softLavender, current: true },
    { day: "Day 30", bg: C.softSage },
  ];

  return (
    <div className="px-5 space-y-6 pb-8">
      {/* Title */}
      <div className="pt-2 flex items-center justify-between">
        <h1
          className="text-[28px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          Your Protocol
        </h1>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
        >
          <Settings size={14} color={C.midnight} strokeWidth={1.6} />
        </button>
      </div>

      {/* PHASE ROADMAP */}
      <Card bg={C.white} padding="p-3" radius="rounded-[22px]">
        <div className="grid grid-cols-3 gap-2">
          {phases.map((p) => {
            const active = p.state === "active";
            return (
              <div
                key={p.num}
                className="rounded-[16px] p-3 relative"
                style={{
                  background: active ? p.bg : "transparent",
                  border: active ? `1px solid ${C.hairlineMid}` : "none",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: active ? C.midnight : C.stone,
                      color: active ? C.white : C.textMuted,
                    }}
                  >
                    {active ? (
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: FONTS.subtitle, fontWeight: 600 }}
                      >
                        {p.num}
                      </span>
                    ) : (
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
                      >
                        {p.num}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: FONTS.subtitle,
                      fontWeight: 600,
                      color: active ? C.ink : C.textDim,
                    }}
                  >
                    {p.name}
                  </span>
                </div>
                <p
                  className="text-[10px] mt-1.5 ml-8"
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 400,
                    color: active ? C.textMuted : C.textDim,
                  }}
                >
                  {p.days}
                </p>
                {active && (
                  <div className="mt-2">
                    <ProgressBar value={40} height={3} fill={C.midnight} track="rgba(15,27,38,0.08)" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* WEEKLY CONSISTENCY CHART */}
      <Card bg={C.white} padding="p-5" radius="rounded-[24px]">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[15px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
          >
            Weekly Consistency
          </h3>
          <button
            className="text-[11.5px] flex items-center gap-1"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}
          >
            This Week <ChevronRight size={12} strokeWidth={1.8} />
          </button>
        </div>

        {/* Bar chart */}
        <div className="flex items-end justify-between h-[110px] gap-1">
          {days.map((d, dayIdx) => (
            <div key={dayIdx} className="flex-1 flex items-end justify-center gap-[3px] h-full">
              {series.map((s, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-t-full"
                  style={{
                    width: 6,
                    height: `${s.values[dayIdx]}%`,
                    background: s.color,
                    opacity: 0.85,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Day labels */}
        <div className="flex items-center justify-between mt-2 px-0.5">
          {days.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[11px]"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4" style={{ borderTop: `1px solid ${C.hairline}` }}>
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span
                className="text-[11px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* PROGRESS PHOTOS */}
      <div>
        <SectionHeading action={() => {}}>Progress Photos</SectionHeading>
        <div className="flex items-center gap-2.5">
          {photos.map((p) => (
            <div
              key={p.day}
              className="flex-1 rounded-[18px] aspect-square relative overflow-hidden"
              style={{
                background: p.bg,
                border: p.current ? `2px solid ${C.midnight}` : `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              {/* Face silhouette */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id={`pg${p.day}`} cx="50%" cy="40%" r="45%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </radialGradient>
                </defs>
                <ellipse cx="50" cy="55" rx="28" ry="35" fill={`url(#pg${p.day})`} />
              </svg>
              <div
                className="absolute bottom-2 left-2 right-2 text-center text-[10.5px]"
                style={{
                  fontFamily: FONTS.subtitle,
                  fontWeight: p.current ? 600 : 500,
                  color: C.ink,
                }}
              >
                {p.day}
              </div>
            </div>
          ))}
          <button
            className="flex-shrink-0 w-[68px] aspect-square rounded-[18px] flex items-center justify-center"
            style={{
              background: C.white,
              border: `1.5px dashed ${C.hairlineMid}`,
            }}
          >
            <Plus size={18} color={C.textMuted} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* RE-ANALYSIS + OVERALL PROGRESS */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card bg={C.softPeach} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Re-analysis</Eyebrow>
          <p
            className="mt-2 text-[20px] leading-tight"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            in 18 days
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Calendar size={12} color={C.textMuted} strokeWidth={1.6} />
            <span
              className="text-[11px]"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              Jun 14, 2025
            </span>
          </div>
        </Card>

        <Card bg={C.paleBlue} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Overall Progress</Eyebrow>
          <div className="flex items-center justify-between mt-2">
            <p
              className="text-[26px] leading-none"
              style={{
                fontFamily: FONTS.title,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: C.ink,
              }}
            >
              27%
            </p>
            <Donut value={27} size={42} stroke={4} color={C.midnight} track="rgba(15,27,38,0.10)" />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.sageAccent }} />
            <span
              className="text-[11px]"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              On track
            </span>
          </div>
        </Card>
      </div>

      {/* RECOMMENDATIONS */}
      <div>
        <SectionHeading action={() => {}}>Recommendations</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          <Card bg={C.softBlush} padding="p-4" radius="rounded-[22px]">
            <p
              className="text-[14px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
            >
              At-home care
            </p>
            <p
              className="text-[11px] mt-1"
              style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
            >
              Daily essentials
            </p>
            <div
              className="mt-3 aspect-[4/3] rounded-[14px] flex items-center justify-center relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.55)" }}
            >
              <div className="flex gap-1.5">
                {[C.white, C.stone, C.paleBlue].map((c, i) => (
                  <svg key={i} viewBox="0 0 30 50" width="22" height="36">
                    <rect x="10" y="2" width="10" height="5" rx="1.5" fill="rgba(15,27,38,0.55)" />
                    <rect x="6" y="9" width="18" height="38" rx="5" fill={c} stroke="rgba(15,27,38,0.15)" />
                  </svg>
                ))}
              </div>
            </div>
            <button
              className="mt-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: C.white, boxShadow: "0 4px 12px rgba(15,27,38,0.08)" }}
            >
              <ArrowRight size={14} color={C.midnight} strokeWidth={1.8} />
            </button>
          </Card>

          <Card bg={C.softLavender} padding="p-4" radius="rounded-[22px]">
            <p
              className="text-[14px]"
              style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
            >
              Clinic consult
            </p>
            <p
              className="text-[11px] mt-1"
              style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
            >
              Professional treatments
            </p>
            <div
              className="mt-3 aspect-[4/3] rounded-[14px] flex items-center justify-center relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.55)" }}
            >
              {/* Stylized chair */}
              <svg viewBox="0 0 80 60" width="60" height="45">
                <rect x="20" y="10" width="40" height="22" rx="6" fill="rgba(255,255,255,0.85)" stroke="rgba(15,27,38,0.20)" />
                <rect x="14" y="32" width="52" height="10" rx="3" fill="rgba(255,255,255,0.85)" stroke="rgba(15,27,38,0.20)" />
                <line x1="22" y1="42" x2="22" y2="55" stroke="rgba(15,27,38,0.30)" strokeWidth="1.5" />
                <line x1="58" y1="42" x2="58" y2="55" stroke="rgba(15,27,38,0.30)" strokeWidth="1.5" />
              </svg>
            </div>
            <button
              className="mt-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: C.white, boxShadow: "0 4px 12px rgba(15,27,38,0.08)" }}
            >
              <ArrowRight size={14} color={C.midnight} strokeWidth={1.8} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SCREEN: PROGRESS
   ========================================================= */
const ProgressScreen = () => {
  const [slider, setSlider] = useState(50);
  const trends = [
    { label: "Skin Clarity", value: "Improving", delta: "+4", tone: "up", color: C.peachAccent, bg: C.softPeach },
    { label: "Facial Definition", value: "Stable", delta: "→", tone: "flat", color: C.mistAccent, bg: C.paleBlue },
    { label: "Grooming Consistency", value: "High", delta: "+8", tone: "up", color: C.sageAccent, bg: C.softSage },
    { label: "Re-analysis Ready", value: "78 days", delta: "—", tone: "flat", color: C.lavenderAccent, bg: C.softLavender },
  ];
  const photos = [
    { label: "Front neutral", done: true },
    { label: "Front smile", done: true },
    { label: "Left profile", done: false },
    { label: "Right profile", done: false },
    { label: "45-degree", done: false },
    { label: "Skin close-up", done: false },
  ];

  return (
    <div className="px-5 space-y-6 pb-8">
      <div className="pt-2">
        <h1
          className="text-[28px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          Progress
        </h1>
        <p
          className="text-[13px] mt-1"
          style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
        >
          Visible changes over time
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card bg={C.paleBlue} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Day</Eyebrow>
          <p
            className="mt-2 text-[28px] leading-none"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            12
            <span
              className="text-[14px] ml-1"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              / 90
            </span>
          </p>
        </Card>
        <Card bg={C.softPeach} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Execution</Eyebrow>
          <p
            className="mt-2 text-[28px] leading-none"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            78
            <span
              className="text-[14px] ml-1"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              %
            </span>
          </p>
        </Card>
        <Card bg={C.softLavender} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Photos</Eyebrow>
          <p
            className="mt-2 text-[28px] leading-none"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            2
            <span
              className="text-[14px] ml-1"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              / 6
            </span>
          </p>
        </Card>
        <Card bg={C.softSage} padding="p-4" radius="rounded-[22px]">
          <Eyebrow color={C.textMuted}>Streak</Eyebrow>
          <p
            className="mt-2 text-[28px] leading-none"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            5
            <span
              className="text-[14px] ml-1"
              style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
            >
              days
            </span>
          </p>
        </Card>
      </div>

      {/* PHOTO ANGLES */}
      <div>
        <SectionHeading>Photo Angles</SectionHeading>
        <div className="grid grid-cols-2 gap-2">
          {photos.map((p) => (
            <div
              key={p.label}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-[16px]"
              style={{
                background: p.done ? C.midnight : C.white,
                border: p.done ? "none" : `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              {p.done ? (
                <Check size={13} color={C.mist} strokeWidth={2.5} />
              ) : (
                <Camera size={13} color={C.textMuted} strokeWidth={1.5} />
              )}
              <span
                className="text-[12px]"
                style={{
                  fontFamily: FONTS.subtitle,
                  fontWeight: 500,
                  color: p.done ? C.stone : C.ink,
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <div>
        <SectionHeading>Before / After</SectionHeading>
        <Card padding="p-4" radius="rounded-[22px]">
          <div
            className="relative aspect-[4/3] rounded-[16px] overflow-hidden"
            style={{ background: C.stone }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.softPeach} 0%, ${C.softBlush} 100%)` }}
            >
              <div className="text-center">
                <p
                  className="text-[10px] uppercase"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, letterSpacing: "0.1em", color: C.midnight }}
                >
                  Day 1
                </p>
                <p
                  className="text-[20px] mt-1 opacity-60"
                  style={{ fontFamily: FONTS.title, fontWeight: 600, color: C.midnight }}
                >
                  Baseline
                </p>
              </div>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
                clipPath: `inset(0 0 0 ${slider}%)`,
              }}
            >
              <div className="text-center" style={{ marginLeft: `${(slider - 50) * 1.6}%` }}>
                <p
                  className="text-[10px] uppercase"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, letterSpacing: "0.1em", color: C.midnight }}
                >
                  Day 12
                </p>
                <p
                  className="text-[20px] mt-1"
                  style={{ fontFamily: FONTS.title, fontWeight: 600, color: C.midnight }}
                >
                  Current
                </p>
              </div>
            </div>
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none"
              style={{ left: `${slider}%`, background: C.midnight }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: C.white, boxShadow: "0 4px 14px rgba(15,27,38,0.18)" }}
              >
                <div className="flex gap-0.5">
                  <ArrowRight size={9} color={C.midnight} strokeWidth={2.5} style={{ transform: "rotate(180deg)" }} />
                  <ArrowRight size={9} color={C.midnight} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="w-full mt-3 qino-slider"
          />
        </Card>
      </div>

      {/* TRENDS */}
      <div>
        <SectionHeading>Trends</SectionHeading>
        <div className="space-y-2">
          {trends.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-3 px-4 py-3.5 rounded-[18px]"
              style={{
                background: C.white,
                border: `1px solid ${C.hairline}`,
                boxShadow: SHADOW_CARD,
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: t.color }}
              />
              <span
                className="flex-1 text-[13px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
              >
                {t.label}
              </span>
              <span
                className="text-[12.5px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
              >
                {t.value}
              </span>
              <Pill bg={t.bg} color={t.color}>{t.delta}</Pill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SCREEN: COACH
   ========================================================= */
const CoachScreen = () => {
  const [messages, setMessages] = useState([
    { role: "user", text: "What should I focus on first?" },
    {
      role: "qino",
      text: "Foundation Phase, in this order: facial softness, skin consistency, hydration, and grooming frame. Advanced refinements come later — they compound better on a solid base.",
    },
  ]);
  const [input, setInput] = useState("");

  const prompts = [
    { text: "Why is lower-face definition my priority?", icon: Sparkles, bg: C.softBlush },
    { text: "What products should I use for uneven skin?", icon: Layers, bg: C.softPeach },
    { text: "What clinic treatments are worth discussing?", icon: PillIcon, bg: C.softLavender },
    { text: "What should I ignore for now?", icon: ListChecks, bg: C.softSage },
  ];

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "qino",
        text: "This is a prototype response. QINO would generate a personalized answer grounded in your analysis and current phase.",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 140px)" }}>
      <div className="px-5 pt-2 pb-2">
        <h1
          className="text-[28px]"
          style={{
            fontFamily: FONTS.title,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          Ask QINO
        </h1>
        <p
          className="text-[13px] mt-1"
          style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
        >
          Your protocol, products, or treatment paths
        </p>
      </div>

      {/* Suggested */}
      <div className="px-5 mt-4">
        <SectionHeading>Suggested</SectionHeading>
        <div className="grid grid-cols-2 gap-2.5">
          {prompts.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.text}
                onClick={() => send(p.text)}
                className="rounded-[20px] p-4 text-left active:scale-[0.98] transition-transform"
                style={{
                  background: p.bg,
                  border: `1px solid ${C.hairline}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <div
                  className="w-9 h-9 rounded-[12px] flex items-center justify-center mb-2.5"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <Icon size={15} color={C.midnight} strokeWidth={1.6} />
                </div>
                <p
                  className="text-[12px] leading-snug"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {p.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <div className="px-5 mt-6 space-y-3 flex-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[88%] px-4 py-3 rounded-[20px]"
              style={{
                background: m.role === "user" ? C.midnight : C.white,
                color: m.role === "user" ? C.stone : C.ink,
                border: m.role === "user" ? "none" : `1px solid ${C.hairline}`,
                boxShadow: m.role === "user" ? "none" : SHADOW_CARD,
                borderBottomRightRadius: m.role === "user" ? 6 : 20,
                borderBottomLeftRadius: m.role === "qino" ? 6 : 20,
                fontFamily: FONTS.body,
              }}
            >
              {m.role === "qino" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <QinoMark size={12} color={C.midnight} />
                  <span
                    className="text-[10px] uppercase"
                    style={{ fontFamily: FONTS.subtitle, fontWeight: 600, letterSpacing: "0.1em", color: C.textMuted }}
                  >
                    QINO
                  </span>
                </div>
              )}
              <p className="text-[13.5px] leading-[1.5]" style={{ fontWeight: 400 }}>
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Safety + Input */}
      <div className="px-5 mt-5 space-y-3 pb-2">
        <div
          className="px-4 py-3 rounded-[16px]"
          style={{ background: C.stone, border: `1px solid ${C.hairline}` }}
        >
          <p
            className="text-[10.5px] leading-relaxed"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
          >
            QINO provides educational aesthetic guidance. Medical treatments should be discussed with a qualified professional.
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: C.white, border: `1px solid ${C.hairlineMid}`, boxShadow: SHADOW_CARD }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask QINO..."
            className="flex-1 text-[13.5px] bg-transparent outline-none"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.ink }}
          />
          <button
            onClick={() => send(input)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: C.midnight }}
          >
            <Send size={13} color={C.mist} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MODAL: PRODUCT STACK
   ========================================================= */
const ProductStackModal = ({ open, onClose }) => {
  const [tier, setTier] = useState("Standard");
  const products = {
    essentials: [
      { name: "Gentle cleanser", why: "Low-oil, slightly textured skin reads best with non-stripping cleanse.", bg: C.paleBlue },
      { name: "Hydrating moisturizer", why: "Hydration directly improves perceived skin evenness and lower-face softness.", bg: C.softLavender },
      { name: "SPF", why: "Single highest-leverage skin item — prevents the texture and tone changes you're working to improve.", bg: C.softPeach },
      { name: "Lip repair", why: "Smile polish is on your priority map; healthy lips frame the lower face.", bg: C.softBlush },
    ],
    targeted: [
      { name: "Texture serum", why: "Skin appears slightly uneven and low-oil — barrier support beats aggressive exfoliation.", bg: C.softSage },
      { name: "Barrier support", why: "Pairs with evening routine to maintain resilience as actives are introduced.", bg: C.paleBlue },
      { name: "Optional exfoliant", why: "Only if tolerated. Start at 1×/week and watch for irritation.", bg: C.softLavender },
    ],
  };
  if (!open) return null;

  const renderSection = (items, label) => (
    <div>
      <SectionHeading>{label}</SectionHeading>
      <div className="space-y-2.5">
        {items.map((p, i) => (
          <div
            key={p.name}
            className="rounded-[22px] p-4 flex gap-3"
            style={{
              background: C.white,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW_CARD,
            }}
          >
            <div
              className="w-16 h-20 rounded-[14px] flex items-center justify-center flex-shrink-0"
              style={{ background: p.bg }}
            >
              <svg viewBox="0 0 40 60" width="32" height="48">
                <rect x="14" y="2" width="12" height="6" rx="2" fill="rgba(15,27,38,0.55)" />
                <rect x="10" y="10" width="20" height="46" rx="6" fill="rgba(255,255,255,0.85)" stroke="rgba(15,27,38,0.15)" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className="text-[14px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {p.name}
                </h3>
                <Pill bg={C.stone} color={C.textMuted}>{tier}</Pill>
              </div>
              <p
                className="mt-1.5 text-[11.5px] leading-relaxed"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
              >
                {p.why}
              </p>
              <button
                className="mt-2.5 text-[12px] flex items-center gap-1"
                style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}
              >
                View option <ArrowRight size={12} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 max-w-[440px] mx-auto overflow-y-auto"
      style={{ background: C.ivory }}
    >
      <div
        className="sticky top-0 z-10"
        style={{
          background: "rgba(247,244,238,0.94)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.hairline}`,
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2
            className="text-[22px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            Product Stack
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <X size={15} color={C.midnight} strokeWidth={1.8} />
          </button>
        </div>
      </div>
      <div className="px-5 py-5 space-y-6 pb-8">
        <div
          className="flex p-1 rounded-full"
          style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
        >
          {["Budget", "Standard", "Premium"].map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="flex-1 py-2 rounded-full text-[12px] transition-all"
              style={{
                background: tier === t ? C.midnight : "transparent",
                color: tier === t ? C.stone : C.textMuted,
                fontFamily: FONTS.subtitle,
                fontWeight: 600,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {renderSection(products.essentials, "Essentials")}
        {renderSection(products.targeted, "Targeted")}
      </div>
    </div>
  );
};

/* =========================================================
   MODAL: PATHWAYS
   ========================================================= */
const PathwaysModal = ({ open, onClose }) => {
  const [unlockL4, setUnlockL4] = useState(false);
  const levels = [
    { n: 1, title: "At Home", sub: "Always available", items: ["Daily skincare", "Grooming frame", "Hydration", "Sleep consistency"], bg: C.softSage },
    { n: 2, title: "Products", sub: "Active in your stack", items: ["SPF", "Moisturizer", "Retinol alt.", "Lip care", "Hair product"], bg: C.paleBlue },
    { n: 3, title: "Clinic Consult", sub: "Educational only", items: ["Acne scar consult", "Chemical peel", "Microneedling", "Laser resurfacing", "Teeth whitening"], bg: C.softLavender },
  ];
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 max-w-[440px] mx-auto overflow-y-auto"
      style={{ background: C.ivory }}
    >
      <div
        className="sticky top-0 z-10"
        style={{
          background: "rgba(247,244,238,0.94)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.hairline}`,
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2
            className="text-[22px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            Pathways
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
          >
            <X size={15} color={C.midnight} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-3 pb-8">
        {/* Comfort setting */}
        <div
          className="rounded-[24px] p-5 relative overflow-hidden"
          style={{
            background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW_HERO,
          }}
        >
          <Eyebrow color={C.textMuted}>Comfort Setting</Eyebrow>
          <p
            className="mt-2 text-[20px]"
            style={{
              fontFamily: FONTS.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: C.ink,
            }}
          >
            Open to: Products + Clinics
          </p>
          <p
            className="mt-1 text-[12px]"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
          >
            Levels 1–3 active · Level 4 hidden
          </p>
        </div>

        {levels.map((l) => (
          <div
            key={l.n}
            className="rounded-[22px] p-5"
            style={{
              background: l.bg,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW_CARD,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.65)" }}
              >
                <span
                  className="text-[13px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {l.n}
                </span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-[15px]"
                  style={{
                    fontFamily: FONTS.subtitle,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: C.ink,
                  }}
                >
                  Level {l.n} — {l.title}
                </h3>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
                >
                  {l.sub}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {l.items.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    fontFamily: FONTS.body,
                    fontWeight: 500,
                    color: C.midnight,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Level 4 */}
        <div
          className="rounded-[22px] p-5"
          style={{
            background: C.white,
            border: `1px solid ${C.hairline}`,
            boxShadow: SHADOW_CARD,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: C.stone }}
            >
              <span
                className="text-[13px]"
                style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
              >
                4
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3
                  className="text-[15px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  Level 4 — Injectables / Surgery
                </h3>
                {!unlockL4 && <Lock size={13} color={C.textMuted} strokeWidth={1.5} />}
              </div>
              <p
                className="text-[11px] mt-0.5"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
              >
                {unlockL4 ? "Educational only" : "Locked"}
              </p>
            </div>
          </div>
          {!unlockL4 ? (
            <>
              <p
                className="mt-3 text-[12px] leading-relaxed"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
              >
                Shown only for users who choose this comfort level. QINO never determines candidacy.
              </p>
              <button
                onClick={() => setUnlockL4(true)}
                className="mt-4 w-full py-3 rounded-full text-[12.5px]"
                style={{
                  background: C.midnight,
                  color: C.stone,
                  fontFamily: FONTS.subtitle,
                  fontWeight: 600,
                }}
              >
                Opt in to view
              </button>
            </>
          ) : (
            <div className="mt-3 space-y-2">
              {[
                "Filler consultation",
                "Neuromodulator discussion",
                "Surgical consult — chin/jaw",
                "Surgical consult — rhinoplasty",
              ].map((item, i, arr) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2"
                  style={{
                    borderBottom: i !== arr.length - 1 ? `1px solid ${C.hairline}` : "none",
                  }}
                >
                  <span
                    className="text-[12.5px]"
                    style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}
                  >
                    {item}
                  </span>
                  <span
                    className="text-[10px] uppercase"
                    style={{
                      fontFamily: FONTS.subtitle,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: C.textMuted,
                    }}
                  >
                    Worth discussing
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="px-4 py-3 rounded-[16px]"
          style={{ background: C.stone, border: `1px solid ${C.hairline}` }}
        >
          <p
            className="text-[10.5px] leading-relaxed"
            style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
          >
            QINO uses educational language only — "worth discussing," "potential pathway,"
            "may be relevant depending on provider evaluation." QINO never claims candidacy or prescribes treatment.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ROOT
   ========================================================= */
export default function QinoApp() {
  const [tab, setTab] = useState("today");
  const [productsOpen, setProductsOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);

  const Screen = {
    today: (
      <TodayScreen
        onOpenProducts={() => setProductsOpen(true)}
        onOpenPathways={() => setPathwaysOpen(true)}
        onTab={setTab}
      />
    ),
    analysis: <AnalysisScreen />,
    protocol: <ProtocolScreen />,
    progress: <ProgressScreen />,
    coach: <CoachScreen />,
  }[tab];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: C.ivory,
        fontFamily: FONTS.body,
        color: C.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        :root {
          --font-title: 'Sora', sans-serif;
          --font-subtitle: 'Outfit', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        body { -webkit-font-smoothing: antialiased; background: ${C.ivory}; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .qino-slider { -webkit-appearance: none; height: 3px; background: rgba(15,27,38,0.10); border-radius: 999px; }
        .qino-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${C.midnight}; cursor: pointer; box-shadow: 0 2px 6px rgba(15,27,38,0.20); }
        .qino-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${C.midnight}; cursor: pointer; border: none; }
      `}</style>

      <div className="max-w-[440px] mx-auto min-h-screen pb-24 relative">
        <TopBar />
        {Screen}
      </div>

      <BottomNav active={tab} onChange={setTab} />
      <ProductStackModal open={productsOpen} onClose={() => setProductsOpen(false)} />
      <PathwaysModal open={pathwaysOpen} onClose={() => setPathwaysOpen(false)} />
    </div>
  );
}