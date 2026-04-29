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
