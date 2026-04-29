// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   GET /api/me/progress → ProgressState
//   POST /api/me/progress/photos
// =====================================================================

import type { ProgressState } from "../types";

export const mockProgress: ProgressState = {
  currentDay: 12,
  totalDays: 90,
  executionPercent: 78,
  photosUploaded: 2,
  photosRequired: 6,
  streakDays: 5,
  nextReviewLabel: "Friday",
  reanalysisInDays: 78,
  reanalysisDateLabel: "Jun 14, 2025",
  overallProgressPercent: 27,
  onTrack: true,

  trends: [
    {
      id: "skin_clarity",
      label: "Skin Clarity",
      value: "Improving",
      delta: "↑ 4",
      direction: "up",
      accentKey: "peachAccent",
      bgAccentKey: "softPeach",
    },
    {
      id: "facial_definition",
      label: "Facial Definition",
      value: "Stable",
      delta: "→",
      direction: "flat",
      accentKey: "mistAccent",
      bgAccentKey: "paleBlue",
    },
    {
      id: "grooming_consistency",
      label: "Grooming Consistency",
      value: "High",
      delta: "↑ 8",
      direction: "up",
      accentKey: "sageAccent",
      bgAccentKey: "softSage",
    },
    {
      id: "reanalysis_readiness",
      label: "Re-analysis Ready",
      value: "78 days",
      delta: "—",
      direction: "flat",
      accentKey: "lavenderAccent",
      bgAccentKey: "softLavender",
    },
  ],

  photos: [
    { id: "ph1", day: "Day 1", uploaded: true, bgAccentKey: "softPeach" },
    { id: "ph12", day: "Day 12", uploaded: true, bgAccentKey: "softLavender" },
    { id: "ph30", day: "Day 30", uploaded: false, bgAccentKey: "softSage" },
  ],
};
