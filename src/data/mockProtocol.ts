// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   GET /api/me/protocol → Protocol
//   PATCH /api/me/protocol/tasks/:id { completed: boolean }
// =====================================================================

import type { Protocol } from "../types";

export const mockProtocol: Protocol = {
  currentPhaseId: "foundation",
  currentDay: 12,
  totalDays: 90,
  percentComplete: 13,

  phases: [
    {
      id: "foundation",
      number: 1,
      name: "Foundation",
      dayRange: "Days 1–30",
      state: "active",
      focus: "Skin basics, grooming, body composition",
    },
    {
      id: "refinement",
      number: 2,
      name: "Refinement",
      dayRange: "Days 31–60",
      state: "locked",
      focus: "Targeted skin, frame work, consistency",
    },
    {
      id: "optimization",
      number: 3,
      name: "Optimization",
      dayRange: "Days 61–90",
      state: "locked",
      focus: "Polish, advanced steps, re-analysis",
    },
  ],

  routines: [
    {
      id: "morning",
      label: "Morning Routine",
      sub: "Skin basics",
      iconKey: "sun",
      bgAccentKey: "softPeach",
      fillAccentKey: "peachAccent",
      tasks: [
        { id: "m1", label: "Gentle cleanse", completed: true },
        { id: "m2", label: "Hydrating moisturizer", completed: true },
        { id: "m3", label: "SPF", completed: false },
      ],
    },
    {
      id: "foundation",
      label: "Aesthetic Foundation",
      sub: "Habits & body composition",
      iconKey: "activity",
      bgAccentKey: "softLavender",
      fillAccentKey: "lavenderAccent",
      tasks: [
        { id: "f1", label: "Weight trend check", completed: true },
        { id: "f2", label: "Hydration target", completed: false },
        { id: "f3", label: "Movement completed", completed: false },
      ],
    },
    {
      id: "evening",
      label: "Evening Routine",
      sub: "Recovery & treatment",
      iconKey: "moon",
      bgAccentKey: "paleBlue",
      fillAccentKey: "mistAccent",
      tasks: [
        { id: "e1", label: "Cleanse", completed: false },
        { id: "e2", label: "Treatment step", completed: false },
        { id: "e3", label: "Moisturizer", completed: false },
        { id: "e4", label: "Lip care", completed: false },
      ],
    },
  ],

  modules: [
    {
      id: "skin_routine",
      title: "Skin Routine",
      iconKey: "sun",
      accentKey: "softPeach",
      totalItems: 5,
      completedItems: 3,
    },
    {
      id: "facial_frame",
      title: "Facial Frame",
      iconKey: "sparkles",
      accentKey: "softLavender",
      totalItems: 4,
      completedItems: 3,
    },
    {
      id: "aesthetic_foundation",
      title: "Aesthetic Foundation",
      iconKey: "activity",
      accentKey: "paleBlue",
      totalItems: 5,
      completedItems: 2,
    },
  ],

  ignoreForNow: [
    "Advanced facial exercises",
    "Expensive procedures",
    "Minor ear concerns",
    "Small symmetry details",
    "Overly complex routines",
  ],
};
