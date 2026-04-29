// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   GET /api/me/dashboard → { todayFocus, comingUp, ... }
//
// Most of the Today screen is composed from mockProtocol + mockAnalysis.
// This file holds the smaller bits that aren't part of the report or
// protocol — primarily the "today's focus" copy and "coming up" rows.
// =====================================================================

export interface TodayFocus {
  /** Short sentence shown under the phase hero. */
  focusLine: string;
}

export interface ComingUpRow {
  id: string;
  label: string;
  value: string;
  iconKey: string;
}

export const mockTodayFocus: TodayFocus = {
  focusLine: "Today's focus: lower-face definition, skin consistency, grooming frame.",
};

export const mockComingUp: ComingUpRow[] = [
  { id: "next_photo", label: "Next photo check-in", value: "Friday", iconKey: "camera" },
  { id: "streak", label: "Current streak", value: "5 days", iconKey: "flame" },
  { id: "reanalysis", label: "Re-analysis", value: "78 days", iconKey: "sparkle" },
];

export const mockGreeting = {
  morning: "Good morning,",
  afternoon: "Good afternoon,",
  evening: "Good evening,",
};

/**
 * Pre-scan dashboard locked-preview tiles.
 * These describe what's hidden until the user finishes their scan.
 */
export const mockLockedPreviews = [
  {
    id: "analysis",
    label: "Analysis",
    sub: "Facial breakdown & priority ranking",
    state: "Locked" as const,
    iconKey: "sparkles",
    accentKey: "softBlush",
  },
  {
    id: "protocol",
    label: "Protocol",
    sub: "Your 90-day execution plan",
    state: "Locked" as const,
    iconKey: "layers",
    accentKey: "softPeach",
  },
  {
    id: "products",
    label: "Product Stack",
    sub: "Personalized recommendations",
    state: "Locked" as const,
    iconKey: "droplet",
    accentKey: "softSage",
  },
  {
    id: "coach",
    label: "Coach",
    sub: "Limited until scan is complete",
    state: "Limited" as const,
    iconKey: "lightbulb",
    accentKey: "softLavender",
  },
];

export const mockScanPromises = [
  "6 required angles",
  "Lighting and blur checks",
  "Retake any photo before submitting",
  "Unlocks analysis, protocol, products, pathways",
];

export const mockScanMetaPills = ["6 photos", "3–5 minutes", "Natural light"];

// =====================================================================
// Post-onboarding screen content
// All copy for pre-scan, processing, report, and guided scan screens.
// =====================================================================

export const preScanContent = {
  greetingPrefix: "Good morning,",
  heroEyebrow: "Pre-Scan Mode",
  heroTitle: "Complete your QINO Face Scan",
  heroBody:
    "Your profile is ready. Finish your guided scan to unlock your facial priority map, 90-day protocol, product stack, and treatment pathways.",
  primaryCtaLabel: "Start guided scan",
  unlocksHeading: "Unlocks after scan",
};

export const processingContent = {
  greetingTitleA: "Building your",
  greetingTitleB: "QINO analysis",
  heroEyebrow: "Processing",
  heroHeadlineA: "Reading your face,",
  heroHeadlineB: "building your plan.",
  heroBody: "This usually takes about a minute.",
  ctaLabel: "View your analysis",
};

export const guidedScanContent = {
  prep: {
    eyebrow: "Guided Scan · Prep",
    title: "Before you start",
    subtitle: "A few quick checks to get a clean, accurate scan.",
    safetyNote:
      "Your photos stay private. Only used to generate your QINO analysis and track progress over time.",
    beginCta: "Begin scan",
  },
  review: {
    eyebrow: "Guided Scan · Review",
    title: "Review your scan",
    subtitle: "All six photos look ready. Retake any if you'd like a cleaner shot.",
    submitCta: "Submit for analysis",
  },
};

export const reportContent = {
  pathwaysSummary: "Open to: Products + Clinics",
  pathwaysSubLine: "3 levels active · 1 locked",
  pathwaysLevels: [
    { n: 1, title: "At Home", count: 4, accentKey: "softSage" },
    { n: 2, title: "Products", count: 5, accentKey: "paleBlue" },
    { n: 3, title: "Clinic Consult", count: 5, accentKey: "softLavender" },
  ],
  lockedLevelLabel: "Level 4 — Injectables / Surgery (locked)",
  ignoreItems: [
    "Advanced facial exercises",
    "Expensive procedures",
    "Minor ear concerns",
    "Small symmetry details",
    "Overly complex routines",
  ],
  protocolPhases: [
    { name: "Foundation", days: "1–30", state: "active" as const },
    { name: "Refinement", days: "31–60", state: "locked" as const },
    { name: "Optimization", days: "61–90", state: "locked" as const },
  ],
  protocolPreviewBody:
    "Foundation phase begins today: skin basics, grooming consistency, and body composition awareness for facial leanness.",
  ctaLabel: "Start Foundation Phase",
  safetyNote:
    "QINO provides educational aesthetic guidance only. Medical treatments, prescriptions, injections, and procedures should be discussed with qualified professionals.",
};
