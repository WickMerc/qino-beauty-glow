import { useState, useEffect } from "react";
import {
  Home, Scan, Beaker, BarChart3, MessageCircle, Bell,
  Pencil, Camera, MessageSquare, Layers, Sun, Sparkles, Moon,
  ChevronRight, ArrowRight, Check, Lock,
  Activity, Droplet, Scissors, Eye, Lightbulb,
  Stethoscope, ArrowUpRight, Minus,
} from "lucide-react";
import QinoApp from "../App";
import { mockAnalysisReport } from "../data/mockAnalysis";
import { mockUser } from "../data/mockUser";
import { getIcon } from "../iconRegistry";
import { accentByKey } from "../theme";

/* =========================================================
   QINO — Post-onboarding states + Mock Report
   States: pre-scan → processing → report → complete dashboard
   Mock data only. Frontend only.
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
// MOCK REPORT DATA (single source of truth, drives dashboard)
// =====================================================================
const MOCK_REPORT = {
  user: { name: "Hadley", initial: "H" },
  phase: { name: "Foundation Phase", day: 12, total: 90, percent: 13 },
  headline: "Lower-face definition is priority #1",
  insight:
    "Your strongest gains will come from improving lower-face definition, skin consistency, and grooming frame before chasing advanced refinements.",

  // Score overview
  scores: [
    { label: "Symmetry", value: 86, status: "Good", color: "#8AA8B5", bg: C.paleBlue },
    { label: "Skin Quality", value: 72, status: "Fair", color: "#E8B894", bg: C.softPeach },
    { label: "Structure", value: 78, status: "Good", color: "#0F1B26", bg: C.softLavender },
    { label: "Grooming Frame", value: 81, status: "Good", color: "#9DB8A6", bg: C.softSage },
  ],

  // Top strengths (3)
  strengths: [
    { label: "Strong facial symmetry", sub: "Above population average", icon: Sparkles, accent: C.softSage },
    { label: "Defined nose bridge", sub: "Reads as a focal asset", icon: Activity, accent: C.paleBlue },
    { label: "Clear undertone", sub: "Olive, even base color", icon: Sun, accent: C.softPeach },
  ],

  // Top improvement opportunities (3)
  opportunities: [
    { label: "Lower-face definition", sub: "Reduce facial softness", impact: "High", icon: Activity, accent: C.softBlush },
    { label: "Skin texture & evenness", sub: "Daily protocol leverage", impact: "High", icon: Droplet, accent: C.softPeach },
    { label: "Grooming & frame", sub: "Hair shape, brow cleanup", impact: "Medium", icon: Scissors, accent: C.softLavender },
  ],

  // Priority map (high/medium/low)
  priorities: {
    high: ["Lower-face definition", "Skin evenness", "Hair framing"],
    medium: ["Smile brightness", "Brow cleanup", "Under-eye health"],
    low: ["Ear proportion", "Minor symmetry details", "Advanced procedures"],
  },

  // Feature breakdown (grouped)
  featureGroups: [
    {
      title: "Facial Structure",
      icon: Sparkles,
      accent: C.paleBlue,
      rows: [
        ["Face shape", "Oval"],
        ["Symmetry", "High"],
        ["Proportions", "High"],
        ["Averageness", "Above Average"],
      ],
    },
    {
      title: "Jaw, Chin & Neck",
      icon: Activity,
      accent: C.softBlush,
      rows: [
        ["Jaw definition", "Soft"],
        ["Chin shape", "Square"],
        ["Neck definition", "Slightly Defined"],
        ["Submental softness", "Mild"],
      ],
    },
    {
      title: "Skin",
      icon: Droplet,
      accent: C.softPeach,
      rows: [
        ["Undertone", "Olive"],
        ["Blemishing", "Minimal"],
        ["Evenness", "Slightly Uneven"],
        ["Texture", "Slightly Textured"],
        ["Oiliness", "Low"],
      ],
    },
    {
      title: "Hair & Frame",
      icon: Scissors,
      accent: C.softLavender,
      rows: [
        ["Hairline", "Rounded"],
        ["Hair density", "Medium"],
        ["Hair volume", "Medium"],
        ["Brows", "Arched / Moderate"],
      ],
    },
    {
      title: "Eyes, Nose & Lips",
      icon: Eye,
      accent: C.softSage,
      rows: [
        ["Eyes", "Almond"],
        ["Nose", "Straight / Strong"],
        ["Lips", "Full / Slightly top-heavy"],
        ["Smile", "Full teeth exposure"],
      ],
    },
  ],

  // Product stack
  productStack: {
    essentials: [
      { name: "Gentle cleanser", category: "Cleanser", priority: "High" },
      { name: "Hydrating moisturizer", category: "Moisturizer", priority: "High" },
      { name: "SPF 50", category: "SPF", priority: "High" },
      { name: "Lip repair", category: "Lip care", priority: "Medium" },
    ],
    targeted: [
      { name: "Texture serum", category: "Texture", priority: "Medium" },
      { name: "Barrier support", category: "Barrier", priority: "Medium" },
    ],
  },

  // Treatment pathways
  pathways: {
    setting: "Open to: Products + Clinics",
    levels: [
      { n: 1, title: "At Home", count: 4, accent: C.softSage },
      { n: 2, title: "Products", count: 5, accent: C.paleBlue },
      { n: 3, title: "Clinic Consult", count: 5, accent: C.softLavender },
    ],
    locked: { n: 4, title: "Injectables / Surgery" },
  },

  // 90-day protocol preview
  protocolPreview: [
    { phase: "Foundation", days: "1–30", state: "active", focus: "Skin basics, grooming, body composition" },
    { phase: "Refinement", days: "31–60", state: "locked", focus: "Targeted skin, frame work, consistency" },
    { phase: "Optimization", days: "61–90", state: "locked", focus: "Polish, advanced steps, re-analysis" },
  ],

  // What to ignore
  ignore: [
    "Advanced facial exercises",
    "Expensive procedures",
    "Minor ear concerns",
    "Small symmetry details",
    "Overly complex routines",
  ],
};

// =====================================================================
// LOGO
// =====================================================================
const QinoMark = ({ size = 28, color = C.midnight }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="qmStateG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="32" rx="17" ry="25" stroke="url(#qmStateG)" strokeWidth="2.4" fill="none" />
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

const ProgressBar = ({ value, height = 4, fill = C.midnight, track = "rgba(15,27,38,0.08)" }) => (
  <div className="w-full rounded-full overflow-hidden" style={{ height, background: track }}>
    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: fill }} />
  </div>
);

const Donut = ({ value, size = 44, stroke = 4, color = C.midnight, track = "rgba(15,27,38,0.10)" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 600ms ease" }}
      />
    </svg>
  );
};

// =====================================================================
// TOP BAR + BOTTOM NAV (used across dashboard states)
// =====================================================================
const TopBar = ({ onSettings, userInitial = "H" }) => (
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
        <span className="text-[12px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}>
          {userInitial}
        </span>
      </div>
    </div>
  </header>
);

const tabs = [
  { id: "today", label: "Today", icon: Home },
  { id: "analysis", label: "Analysis", icon: Scan },
  { id: "protocol", label: "Protocol", icon: Beaker },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "coach", label: "Coach", icon: MessageCircle },
];

const BottomNav = ({ active = "today", onChange, lockedTabs = [] }) => (
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
        const isLocked = lockedTabs.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => !isLocked && onChange && onChange(t.id)}
            disabled={isLocked}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 flex-1 relative"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2 : 1.5}
              color={isLocked ? C.hairlineMid : isActive ? C.midnight : C.textDim}
            />
            <span
              className="text-[10.5px]"
              style={{
                fontFamily: FONTS.subtitle,
                fontWeight: 500,
                color: isLocked ? C.hairlineMid : isActive ? C.midnight : C.textDim,
              }}
            >
              {t.label}
            </span>
            {isLocked && (
              <Lock
                size={8}
                color={C.textDim}
                strokeWidth={2}
                className="absolute top-0 right-3"
              />
            )}
          </button>
        );
      })}
    </div>
  </nav>
);

/* =========================================================
   STATE 1 — PRE-SCAN DASHBOARD
   ========================================================= */
export const PreScanDashboard = ({ onStartScan, onRemindLater, userName = "Hadley" }) => {
  return (
    <div className="min-h-screen w-full" style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}>
      <div className="max-w-[440px] mx-auto pb-24">
        <TopBar />

        <div className="px-5 pt-2 space-y-5">
          <div className="pt-2">
            <h1
              className="text-[34px] leading-[1.05]"
              style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.035em", color: C.ink }}
            >
              Good morning,
              <br />
              <span style={{ fontWeight: 500 }}>{userName}</span>
            </h1>
          </div>

          {/* Hero — Complete your scan */}
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
                {["6 photos", "3–5 minutes", "Natural light"].map((t) => (
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
            <SectionHeading>Unlocks after scan</SectionHeading>
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
                    style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD, opacity: 0.85 }}
                  >
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
                      style={{ background: p.bg }}
                    >
                      <Icon size={16} strokeWidth={1.6} color={C.midnight} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                        {p.label}
                      </p>
                      <p
                        className="text-[11.5px] mt-0.5"
                        style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
                      >
                        {p.sub}
                      </p>
                    </div>
                    <Pill bg={C.stone} color={C.textMuted}>{p.state}</Pill>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="today" lockedTabs={["analysis", "protocol", "progress"]} />
    </div>
  );
};

/* =========================================================
   STATE 2 — PROCESSING DASHBOARD
   ========================================================= */
export const ProcessingDashboard = ({ onComplete, userName = "Hadley" }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: "Analyzing facial structure", color: C.mistAccent },
    { label: "Checking skin texture", color: C.peachAccent },
    { label: "Mapping jaw, chin & neck", color: C.lavenderAccent },
    { label: "Building priority map", color: C.blushAccent },
    { label: "Creating 90-day protocol", color: C.sageAccent },
    { label: "Preparing product & pathways", color: C.mistAccent },
  ];

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
    <div className="min-h-screen w-full" style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}>
      <div className="max-w-[440px] mx-auto pb-24">
        <TopBar userInitial={userName.charAt(0)} />

        <div className="px-5 pt-2 space-y-5">
          <div className="pt-2">
            <h1
              className="text-[34px] leading-[1.05]"
              style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.035em", color: C.ink }}
            >
              Building your
              <br />
              <span style={{ fontWeight: 500 }}>QINO analysis</span>
            </h1>
          </div>

          {/* Hero — Processing */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW_HERO,
              minHeight: 240,
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
              <Eyebrow color={C.textMuted}>Processing</Eyebrow>
              <h2
                className="mt-3 text-[22px]"
                style={{
                  fontFamily: FONTS.title,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  color: C.ink,
                }}
              >
                Reading your face,
                <br />
                building your plan.
              </h2>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
              >
                This usually takes about a minute.
              </p>
              <div className="mt-4">
                <ProgressBar value={((phase + 1) / phases.length) * 100} height={5} />
                <p
                  className="mt-2 text-[11px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.textMuted }}
                >
                  {phase + 1} of {phases.length}
                </p>
              </div>
            </div>
          </div>

          {/* Phase checklist */}
          <div className="space-y-2.5">
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
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
              style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
            >
              <span
                className="flex items-center justify-center gap-2 text-[14px]"
                style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
              >
                View your analysis
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </button>
          )}
        </div>
      </div>

      <BottomNav active="today" lockedTabs={["analysis", "protocol", "progress", "coach"]} />
    </div>
  );
};

/* =========================================================
   QINO ANALYSIS REPORT SCREEN
   Reads everything from typed mockAnalysisReport (src/data/mockAnalysis.ts).
   Sections: A Summary · B Strengths · C Opportunities · D Priority Map
             E Feature Breakdown · F Product Stack · G Pathways · H Protocol
   ========================================================= */
const accent = (key, fallback = C.stone) => accentByKey[key] ?? fallback;
const impactPillColors = (impact) => {
  if (impact === "high") return { bg: C.midnight, color: C.stone, label: "High Impact" };
  if (impact === "medium") return { bg: C.softPeach, color: C.midnight, label: "Medium Impact" };
  return { bg: C.stone, color: C.textMuted, label: "Low Impact" };
};

export const AnalysisReport = ({
  onContinue,
  onOpenProducts,
  onOpenPathways,
  onNavigateProtocol,
  onCardClick,
  report = mockAnalysisReport,
  user = mockUser,
}) => {
  const logCard = (id) => {
    console.log("[QINO Report] Card:", id);
    onCardClick && onCardClick(id);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}>
      <div className="max-w-[440px] mx-auto pb-32">
        {/* Minimal header */}
        <header className="flex items-center justify-between px-5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <QinoMark size={22} color={C.midnight} />
            <span
              className="text-[13px]"
              style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "0.18em", color: C.midnight }}
            >
              QINO REPORT
            </span>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.softBlush} 0%, ${C.softLavender} 100%)`,
              border: `1px solid ${C.hairline}`,
            }}
          >
            <span className="text-[12px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.midnight }}>
              {user.initial}
            </span>
          </div>
        </header>

        <div className="px-5 pt-2 space-y-5">
          {/* TITLE */}
          <div className="pt-2">
            <Eyebrow>Your QINO Analysis</Eyebrow>
            <h1
              className="mt-2 text-[32px] leading-[1.05]"
              style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.035em", color: C.ink }}
            >
              Here's what
              <br />
              we see, {user.name}.
            </h1>
          </div>

          {/* HERO — Headline + insight */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.softLavender} 100%)`,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW_HERO,
            }}
          >
            <div className="absolute -right-8 -bottom-8 opacity-15">
              <QinoMark size={180} color={C.midnight} />
            </div>
            <div className="relative">
              <Eyebrow color={C.textMuted}>Top Priority</Eyebrow>
              <h2
                className="mt-3 text-[22px]"
                style={{
                  fontFamily: FONTS.title,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  color: C.ink,
                }}
              >
                {report.headline}
              </h2>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.ink, opacity: 0.78 }}
              >
                {report.insight}
              </p>
            </div>
          </div>

          {/* SCORES — 2x2 grid */}
          <div>
            <SectionHeading>Score overview</SectionHeading>
            <div className="grid grid-cols-2 gap-2.5">
              {report.scores.map((s) => {
                const bg = accent(s.bgAccent, C.paleBlue);
                const stroke = accent(s.colorAccent, C.midnight);
                return (
                  <Card
                    key={s.id}
                    bg={bg}
                    padding="p-4"
                    radius="rounded-[20px]"
                    onClick={() => logCard(`score:${s.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}>
                          {s.label}
                        </p>
                        <p
                          className="text-[24px] leading-none mt-1.5"
                          style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.025em", color: C.ink }}
                        >
                          {s.value}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: stroke }}>
                          {s.statusLabel}
                        </p>
                      </div>
                      <Donut value={s.value} size={36} stroke={3.5} color={stroke} track="rgba(255,255,255,0.55)" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* A. QINO SUMMARY — Current phase */}
          <div>
            <SectionHeading>QINO summary</SectionHeading>
            <Card padding="p-5" radius="rounded-[24px]" bg={C.white}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ background: C.softSage }}
                >
                  <Sparkles size={16} strokeWidth={1.6} color={C.midnight} />
                </div>
                <div className="flex-1 min-w-0">
                  <Eyebrow>Current phase</Eyebrow>
                  <p
                    className="mt-1 text-[16px]"
                    style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.02em", color: C.ink }}
                  >
                    {report.currentPhase.name}
                  </p>
                </div>
              </div>
              <div
                className="rounded-[14px] p-3 mb-3"
                style={{ background: C.paleBlue, border: `1px solid ${C.hairline}` }}
              >
                <Eyebrow color={C.textMuted}>Main focus</Eyebrow>
                <p
                  className="mt-1 text-[13.5px]"
                  style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}
                >
                  {report.currentPhase.mainFocus}
                </p>
              </div>
              <p className="text-[12.5px] leading-relaxed" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                {report.currentPhase.explanation}
              </p>
            </Card>
          </div>

          {/* B. TOP STRENGTHS (4) */}
          <div>
            <SectionHeading>Top strengths</SectionHeading>
            <div className="space-y-2">
              {report.strengths.map((s) => {
                const Icon = getIcon(s.iconKey);
                return (
                  <Card
                    key={s.id}
                    padding="p-4"
                    radius="rounded-[18px]"
                    onClick={() => logCard(`strength:${s.id}`)}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: accent(s.accentKey, C.softSage) }}
                    >
                      <Icon size={15} strokeWidth={1.6} color={C.midnight} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                        {s.label}
                      </p>
                      <p className="text-[11.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                        {s.sub}
                      </p>
                    </div>
                    <ChevronRight size={16} color={C.textMuted} strokeWidth={1.6} />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* C. IMPROVEMENT OPPORTUNITIES (4) */}
          <div>
            <SectionHeading>Improvement opportunities</SectionHeading>
            <div className="space-y-2">
              {report.opportunities.map((o) => {
                const Icon = getIcon(o.iconKey);
                const pill = impactPillColors(o.impact);
                return (
                  <Card
                    key={o.id}
                    padding="p-4"
                    radius="rounded-[18px]"
                    onClick={() => logCard(`opportunity:${o.id}`)}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ background: accent(o.accentKey, C.softBlush) }}
                    >
                      <Icon size={15} strokeWidth={1.6} color={C.midnight} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                        {o.label}
                      </p>
                      <p className="text-[11.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                        {o.sub}
                      </p>
                    </div>
                    <Pill bg={pill.bg} color={pill.color}>{pill.label}</Pill>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* D. PRIORITY MAP */}
          <div>
            <SectionHeading>Priority map</SectionHeading>
            <Card padding="p-5" radius="rounded-[22px]">
              {[
                { label: "High Impact", items: report.priorities.high, color: C.midnight, accent: C.softBlush },
                { label: "Medium Impact", items: report.priorities.medium, color: C.steel, accent: C.softPeach },
                { label: "Low / Ignore", items: report.priorities.low, color: C.steelLight, accent: C.stone },
              ].map((tier, i, arr) => (
                <div
                  key={tier.label}
                  className="py-3"
                  style={{ borderBottom: i !== arr.length - 1 ? `1px solid ${C.hairline}` : "none" }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: tier.color }} />
                    <span
                      className="text-[11px] uppercase"
                      style={{ fontFamily: FONTS.subtitle, fontWeight: 600, letterSpacing: "0.08em", color: tier.color }}
                    >
                      {tier.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.items.map((item) => (
                      <Pill key={item} bg={tier.accent} color={C.midnight}>{item}</Pill>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* E. FEATURE BREAKDOWN */}
          <div>
            <SectionHeading>Feature breakdown</SectionHeading>
            <div className="space-y-2.5">
              {report.featureGroups.map((g) => {
                const Icon = getIcon(g.iconKey);
                return (
                  <Card
                    key={g.id}
                    padding="p-5"
                    radius="rounded-[22px]"
                    onClick={() => logCard(`feature:${g.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0"
                        style={{ background: accent(g.accentKey, C.paleBlue) }}
                      >
                        <Icon size={15} strokeWidth={1.6} color={C.midnight} />
                      </div>
                      <h3 className="flex-1 text-[14px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                        {g.title}
                      </h3>
                      <span className="text-[11px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 500, color: C.textMuted }}>
                        View details
                      </span>
                      <ChevronRight size={16} color={C.textMuted} strokeWidth={1.6} />
                    </div>
                    <div className="space-y-0">
                      {g.findings.slice(0, 5).map((f, idx) => (
                        <div
                          key={f.key}
                          className="flex items-center justify-between py-2"
                          style={{
                            borderTop: idx === 0 ? `1px solid ${C.hairline}` : "none",
                            borderBottom: `1px solid ${C.hairline}`,
                          }}
                        >
                          <span className="text-[12.5px]" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                            {f.label}
                          </span>
                          <span className="text-[12.5px]" style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}>
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

          {/* F. PRODUCT STACK PREVIEW */}
          <div>
            <SectionHeading>Your product stack</SectionHeading>
            <Card
              padding="p-5"
              radius="rounded-[22px]"
              onClick={() => { logCard("open:productStack"); onOpenProducts && onOpenProducts(); }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: C.softSage }}>
                  <Layers size={16} strokeWidth={1.6} color={C.midnight} />
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                    {report.productStackPreview.totalCount} products recommended
                  </p>
                  <p className="text-[11.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                    Tied to your priority areas
                  </p>
                </div>
                <ArrowUpRight size={15} color={C.midnight} strokeWidth={1.8} />
              </div>

              {[
                { label: "Essentials", items: report.productStackPreview.essentials, accent: C.softBlush },
                { label: "Targeted", items: report.productStackPreview.targeted, accent: C.paleBlue },
                { label: "Optional", items: report.productStackPreview.optional, accent: C.stone },
              ].map((bucket) => (
                <div key={bucket.label} className="mt-3">
                  <Eyebrow color={C.textMuted}>{bucket.label}</Eyebrow>
                  <div className="mt-2 space-y-1.5">
                    {bucket.items.map((p) => (
                      <div key={p.id} className="flex items-center justify-between">
                        <span className="text-[12.5px]" style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.ink }}>
                          {p.name}
                        </span>
                        <Pill bg={bucket.accent} color={C.midnight}>{p.categoryLabel}</Pill>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* G. TREATMENT PATHWAYS PREVIEW */}
          <div>
            <SectionHeading>Treatment pathways</SectionHeading>
            <Card
              padding="p-5"
              radius="rounded-[22px]"
              onClick={() => { logCard("open:pathways"); onOpenPathways && onOpenPathways(); }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: C.softLavender }}>
                  <Stethoscope size={16} strokeWidth={1.6} color={C.midnight} />
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                    {report.pathwaysPreview.comfortSummary}
                  </p>
                  <p className="text-[11.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                    Educational guidance only
                  </p>
                </div>
                <ArrowUpRight size={15} color={C.midnight} strokeWidth={1.8} />
              </div>

              <div className="space-y-2">
                {report.pathwaysPreview.levels.map((l) => (
                  <div
                    key={l.number}
                    className="rounded-[14px] p-3 flex items-center gap-3"
                    style={{
                      background: l.locked ? C.stone : accent(l.accentKey, C.paleBlue),
                      border: `1px solid ${C.hairline}`,
                      opacity: l.locked ? 0.85 : 1,
                    }}
                  >
                    <span
                      className="text-[14px]"
                      style={{ fontFamily: FONTS.title, fontWeight: 600, color: C.midnight, minWidth: 22 }}
                    >
                      0{l.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                        {l.title}
                      </p>
                      <p className="text-[10.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                        {l.language}
                      </p>
                    </div>
                    {l.locked && <Lock size={12} color={C.textMuted} strokeWidth={1.8} />}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* H. 90-DAY PROTOCOL PREVIEW */}
          <div>
            <SectionHeading>90-day protocol preview</SectionHeading>
            <Card
              padding="p-3"
              radius="rounded-[22px]"
              onClick={() => { logCard("open:protocol"); onNavigateProtocol && onNavigateProtocol(); }}
            >
              <div className="grid grid-cols-3 gap-2">
                {report.protocolPreview.map((p) => {
                  const active = p.state === "active";
                  return (
                    <div
                      key={p.number}
                      className="rounded-[16px] p-3 relative"
                      style={{
                        background: active ? C.paleBlue : "transparent",
                        border: active ? `1px solid ${C.hairlineMid}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: active ? C.midnight : C.stone }}
                        >
                          <span
                            className="text-[10px]"
                            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: active ? C.stone : C.textMuted }}
                          >
                            {p.number}
                          </span>
                        </div>
                        {p.state === "locked" && <Lock size={9} color={C.textMuted} strokeWidth={1.8} />}
                      </div>
                      <p
                        className="text-[11.5px] mt-2"
                        style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: active ? C.ink : C.textMuted }}
                      >
                        {p.name}
                      </p>
                      <p className="text-[9.5px] mt-0.5" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
                        {p.dayRange}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p
                className="text-[11.5px] leading-relaxed px-2 pt-3"
                style={{ fontFamily: FONTS.body, color: C.textMuted }}
              >
                {report.protocolPreview.find((p) => p.state === "active")?.focus}
              </p>
            </Card>
          </div>

          {/* SAFETY */}
          <div
            className="px-4 py-3 rounded-[14px] flex items-start gap-2.5"
            style={{ background: C.stone, border: `1px solid ${C.hairline}` }}
          >
            <Sparkles size={11} color={C.textMuted} strokeWidth={1.6} className="mt-0.5 flex-shrink-0" />
            <p className="text-[10.5px] leading-relaxed" style={{ fontFamily: FONTS.body, color: C.textMuted }}>
              QINO provides educational aesthetic guidance only. Medical treatments,
              prescriptions, injections, and procedures should be discussed with qualified professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA footer */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pt-3"
        style={{
          background: `linear-gradient(180deg, rgba(247,244,238,0) 0%, ${C.ivory} 35%)`,
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full transition-all active:scale-[0.99]"
          style={{ background: C.midnight, boxShadow: "0 8px 20px rgba(15,27,38,0.20)" }}
        >
          <span
            className="flex items-center justify-center gap-2 text-[14px]"
            style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.stone }}
          >
            Start {report.currentPhase.name}
            <ArrowRight size={15} strokeWidth={2} />
          </span>
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   STATE 3 — COMPLETE DASHBOARD (Today screen, post-analysis)
   ========================================================= */
export const CompleteDashboard = ({ onTab, onOpenProducts, onOpenPathways, report = MOCK_REPORT }) => {
  const [routines, setRoutines] = useState({
    morning: { label: "Morning Routine", sub: "Skin basics", icon: Sun, total: 3, done: 2, bg: C.softPeach, accent: "#E8B894" },
    foundation: { label: "Aesthetic Foundation", sub: "Habits & body composition", icon: Activity, total: 3, done: 1, bg: C.softLavender, accent: "#B89DD9" },
    evening: { label: "Evening Routine", sub: "Recovery & treatment", icon: Moon, total: 4, done: 0, bg: C.paleBlue, accent: "#8AA8B5" },
  });

  const tickRoutine = (key) => {
    setRoutines((r) => ({
      ...r,
      [key]: { ...r[key], done: Math.min(r[key].done + 1, r[key].total) },
    }));
  };

  return (
    <div className="min-h-screen w-full" style={{ background: C.ivory, fontFamily: FONTS.body, color: C.ink }}>
      <div className="max-w-[440px] mx-auto pb-24">
        <TopBar userInitial={report.user.initial} />

        <div className="px-5 pt-2 space-y-5">
          {/* Greeting */}
          <div className="pt-2">
            <h1
              className="text-[34px] leading-[1.05]"
              style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.035em", color: C.ink }}
            >
              Good morning,
              <br />
              <span style={{ fontWeight: 500 }}>{report.user.name}</span>
            </h1>
          </div>

          {/* Hero — Foundation Phase */}
          <div
            className="rounded-[28px] p-6 relative overflow-hidden"
            style={{
              background: `linear-gradient(140deg, ${C.paleBlue} 0%, ${C.mist} 100%)`,
              border: `1px solid ${C.hairline}`,
              boxShadow: SHADOW_HERO,
            }}
          >
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
                style={{ fontFamily: FONTS.title, fontWeight: 600, letterSpacing: "-0.025em", color: C.ink }}
              >
                {report.phase.name}
              </h2>
              <p
                className="mt-1 text-[14px]"
                style={{ fontFamily: FONTS.body, fontWeight: 500, color: C.textMuted }}
              >
                Day {report.phase.day} / {report.phase.total}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar value={report.phase.percent} height={5} fill={C.midnight} track="rgba(15,27,38,0.10)" />
                </div>
                <span
                  className="text-[13px]"
                  style={{ fontFamily: FONTS.body, fontWeight: 600, color: C.ink }}
                >
                  {report.phase.percent}%
                </span>
              </div>

              <p
                className="mt-5 text-[13px] leading-[1.45]"
                style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.ink, opacity: 0.78 }}
              >
                Today's focus: lower-face definition, skin consistency, grooming frame.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Log", icon: Pencil },
              { label: "Photo", icon: Camera },
              { label: "Coach", icon: MessageSquare, action: () => onTab && onTab("coach") },
              { label: "Stack", icon: Layers, action: onOpenProducts },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={a.action}
                  className="rounded-[20px] py-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
                  style={{ background: C.white, border: `1px solid ${C.hairline}`, boxShadow: SHADOW_CARD }}
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

          {/* Today's Mission */}
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
                        <ProgressBar value={pct} height={4} fill={r.accent} track="rgba(255,255,255,0.55)" />
                      </div>
                    </div>
                    <ChevronRight size={16} color={C.midnight} strokeWidth={1.6} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Stack */}
          <div>
            <SectionHeading>Priority Stack</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {report.priorities.high.map((p) => (
                <Pill key={p} bg={C.softBlush} color={C.midnight}>{p}</Pill>
              ))}
              {report.priorities.medium.map((p) => (
                <Pill key={p} bg={C.softLavender} color={C.midnight}>{p}</Pill>
              ))}
              {report.priorities.low.slice(0, 1).map((p) => (
                <Pill key={p} bg={C.stone} color={C.textMuted}>{p}</Pill>
              ))}
            </div>
          </div>

          {/* Pathway cards */}
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
                <p className="text-[14px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
                  Product Stack
                </p>
                <p
                  className="text-[11.5px] mt-1"
                  style={{ fontFamily: FONTS.body, fontWeight: 400, color: C.textMuted }}
                >
                  {report.productStack.essentials.length + report.productStack.targeted.length} active
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
                <p className="text-[14px]" style={{ fontFamily: FONTS.subtitle, fontWeight: 600, color: C.ink }}>
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
      </div>

      <BottomNav active="today" onChange={onTab} />
    </div>
  );
};

/* =========================================================
   ROOT — State machine container
   States: prescan → processing → report → complete
   ========================================================= */
export default function QinoPostOnboarding({ initialState = "prescan", onTabNavigate }) {
  const [state, setState] = useState(initialState);
  const [pendingTab, setPendingTab] = useState(null);

  // Mock log of clicked report cards (visible in browser console)
  const handleCardClick = (cardId) => {
    console.log("[QINO Report] Card clicked:", cardId);
  };

  // Report → Product Stack: open mock modal (logged for now)
  const handleOpenProducts = () => {
    console.log("[QINO Report] Open Product Stack modal");
    alert("Product Stack modal (mock)");
  };
  // Report → Pathways: open mock modal (logged for now)
  const handleOpenPathways = () => {
    console.log("[QINO Report] Open Pathways modal");
    alert("Treatment Pathways modal (mock)");
  };
  // Report → Protocol: jump to complete dashboard, land on Protocol tab
  const handleNavigateProtocol = () => {
    setPendingTab("protocol");
    setState("complete");
  };

  return (
    <div style={{ background: C.ivory, minHeight: "100vh" }}>
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

      {/* Demo state switcher (top-right) — remove for production */}
      <div
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 rounded-full"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${C.hairline}`,
          boxShadow: SHADOW_CARD,
        }}
      >
        {[
          { id: "prescan", label: "Pre-scan" },
          { id: "processing", label: "Processing" },
          { id: "report", label: "Report" },
          { id: "complete", label: "Complete" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setState(s.id)}
            className="px-2.5 py-1 rounded-full transition-all"
            style={{
              background: state === s.id ? C.midnight : "transparent",
              color: state === s.id ? C.stone : C.textMuted,
              fontFamily: FONTS.subtitle,
              fontWeight: 600,
              fontSize: 9.5,
              letterSpacing: "0.04em",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {state === "prescan" && (
        <PreScanDashboard
          onStartScan={() => setState("processing")}
          onRemindLater={() => alert("Reminder set (mock)")}
        />
      )}
      {state === "processing" && (
        <ProcessingDashboard onComplete={() => setState("report")} />
      )}
      {state === "report" && (
        <AnalysisReport
          onContinue={() => setState("complete")}
          onCardClick={handleCardClick}
        />
      )}
      {state === "complete" && <QinoApp />}
    </div>
  );
}