// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   POST /api/coach/messages   → send user message, receive QINO reply
//   GET  /api/me/coach/history → CoachMessage[]
// =====================================================================

import type { CoachState } from "../types";

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
  suggestedPrompts: [
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
  ],
};

export const QINO_COACH_FALLBACK_REPLY =
  "This is a prototype response. QINO would generate a personalized answer grounded in your analysis and current phase.";

export const QINO_SAFETY_NOTE =
  "QINO provides educational aesthetic guidance. Medical treatments should be discussed with a qualified professional.";
