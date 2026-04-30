// =====================================================================
// QINO — Coach mock data
//
// Iteration 8B: real Claude Haiku-powered Coach now lives behind the
// `coach-message` Edge Function. The canned `coachResponses` map and
// `responseKey` plumbing have been removed.
//
// What stays in this file:
//   - `coachSuggestedPrompts`     → the 4 starter chips shown in the UI
//   - `mockCoachState`            → seed conversation for empty-state users
//                                   (used until they send their first
//                                    message and history is hydrated)
//   - `coachContext`              → the "What I know about you" card
//   - `QINO_SAFETY_NOTE`          → the safety footer string
//   - `QINO_COACH_FALLBACK_REPLY` → DEPRECATED, no longer rendered.
//                                   Kept temporarily to avoid breaking
//                                   any stray imports; will be removed.
// =====================================================================

import type { CoachState, CoachPrompt } from "../types";

export const coachSuggestedPrompts: CoachPrompt[] = [
  {
    id: "prompt_priority",
    text: "Why is lower-face definition my priority?",
    iconKey: "sparkles",
    accentKey: "softBlush",
  },
  {
    id: "prompt_uneven_skin",
    text: "What products should I use for uneven skin?",
    iconKey: "layers",
    accentKey: "softPeach",
  },
  {
    id: "prompt_clinic",
    text: "What clinic treatments are worth discussing?",
    iconKey: "stethoscope",
    accentKey: "softLavender",
  },
  {
    id: "prompt_ignore",
    text: "What should I ignore for now?",
    iconKey: "minus",
    accentKey: "softSage",
  },
];

export const mockCoachState: CoachState = {
  messages: [
    { id: "m1", role: "user", text: "What should I focus on first?" },
    {
      id: "m2",
      role: "qino",
      text:
        "Foundation Phase, in this order: facial softness, skin consistency, hydration, and grooming frame. Advanced refinements come later — they compound better on a solid base.",
    },
  ],
  suggestedPrompts: coachSuggestedPrompts,
};

/**
 * "What I know about you" context card. Shown above the chat to remind
 * the user the coach is grounded in their actual data.
 */
export const coachContext = {
  eyebrow: "What I know about you",
  items: [
    {
      iconKey: "sparkles",
      label: "Your priority",
      value: "Lower-face definition + skin clarity",
      accentKey: "softBlush",
    },
    {
      iconKey: "layers",
      label: "Current phase",
      value: "Foundation — Days 1–30",
      accentKey: "softPeach",
    },
    {
      iconKey: "stethoscope",
      label: "Comfort level",
      value: "Products + Clinics",
      accentKey: "softLavender",
    },
  ],
};

/**
 * @deprecated No longer rendered. The real Coach streams replies from
 * Claude via the `coach-message` Edge Function. Will be removed in a
 * future cleanup once we confirm no other module imports it.
 */
export const QINO_COACH_FALLBACK_REPLY =
  "I'd answer this with full grounding when QINO is connected to your analysis. For now, try one of the suggested prompts above — those are wired to real responses.";

export const QINO_SAFETY_NOTE =
  "QINO provides educational aesthetic guidance. Medical treatments should be discussed with a qualified professional.";
