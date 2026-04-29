// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   POST /api/coach/messages   → send user message, receive QINO reply
//   GET  /api/me/coach/history → CoachMessage[]
//
// Each suggested prompt has a `responseKey` matching a real grounded
// reply in `coachResponses` below. When backend lands, this mock library
// is replaced by an LLM grounded in the user's report + protocol.
// =====================================================================

import type { CoachState, CoachPrompt } from "../types";

export interface CoachPromptWithResponse extends CoachPrompt {
  /** Key into `coachResponses` for the canned grounded reply. */
  responseKey: string;
}

export const coachSuggestedPrompts: CoachPromptWithResponse[] = [
  {
    id: "prompt_priority",
    text: "Why is lower-face definition my priority?",
    iconKey: "sparkles",
    accentKey: "softBlush",
    responseKey: "priority",
  },
  {
    id: "prompt_uneven_skin",
    text: "What products should I use for uneven skin?",
    iconKey: "layers",
    accentKey: "softPeach",
    responseKey: "uneven_skin",
  },
  {
    id: "prompt_clinic",
    text: "What clinic treatments are worth discussing?",
    iconKey: "stethoscope",
    accentKey: "softLavender",
    responseKey: "clinic",
  },
  {
    id: "prompt_ignore",
    text: "What should I ignore for now?",
    iconKey: "minus",
    accentKey: "softSage",
    responseKey: "ignore",
  },
];

/**
 * Canned grounded responses, keyed by `responseKey` on the prompt above.
 * Written to feel like the coach is reading the user's actual report.
 * When real LLM lands, these are replaced by generation grounded in
 * the user's analysis + protocol + comfort level + progress.
 */
export const coachResponses: Record<string, string> = {
  priority:
    "Your scan showed strong symmetry and structure, but lower-face definition came up as the highest-impact lever. Sharpening the jaw and submental area will visibly change how your whole face reads — more than any skin or grooming work alone. That's why it leads your priority map.",

  uneven_skin:
    "Your skin came back as low-oil, slightly textured, slightly uneven. Start with daily SPF (highest leverage), a non-stripping cleanser, and a hydrating moisturizer. Add a texture serum at week two if your barrier is calm. Skip aggressive exfoliation for now — it can make uneven skin look worse before it looks better.",

  clinic:
    "Based on your comfort level (open to clinics), three are worth discussing with a qualified professional: a chemical peel for skin evenness, microneedling for texture, and a teeth-whitening consultation to polish your smile frame. None of these are required — they're potential pathways if you want to compound on top of your home routine.",

  ignore:
    "For the next 30 days, ignore: advanced facial exercises, expensive procedures, minor ear concerns, small symmetry details, and overly complex routines. None of these would move the needle on your top priorities right now. Revisit after re-analysis if you want to.",
};

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

export const QINO_COACH_FALLBACK_REPLY =
  "I'd answer this with full grounding when QINO is connected to your analysis. For now, try one of the suggested prompts above — those are wired to real responses.";

export const QINO_SAFETY_NOTE =
  "QINO provides educational aesthetic guidance. Medical treatments should be discussed with a qualified professional.";
