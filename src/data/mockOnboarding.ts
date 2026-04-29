// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement points:
//   - Static option catalogs (goals, paths, etc.) may stay in code as enums
//     OR move to a CMS table if marketing wants to edit copy.
//   - The user's actual answers will POST to /api/onboarding and
//     come back from GET /api/me/onboarding → OnboardingAnswers
// =====================================================================

import type {
  OnboardingAnswers,
  GoalId,
  ComfortPathId,
  BudgetTier,
  RoutineTolerance,
  GenderId,
  AestheticDirectionId,
  SkinConcernId,
} from "../types";

// ---------- Static option catalogs (display in UI) ----------

export const goalOptions: {
  id: GoalId;
  label: string;
  iconKey: string;
  accentKey: string;
}[] = [
  { id: "jawline", label: "Sharper jawline & lower-face definition", iconKey: "activity", accentKey: "softBlush" },
  { id: "skin", label: "Clearer skin", iconKey: "droplet", accentKey: "softPeach" },
  { id: "harmony", label: "Better facial harmony", iconKey: "sparkles", accentKey: "softLavender" },
  { id: "frame", label: "Better hair / grooming frame", iconKey: "scissors", accentKey: "softSage" },
  { id: "smile", label: "Better smile", iconKey: "heart", accentKey: "softBlush" },
  { id: "puffiness", label: "Reduce puffiness", iconKey: "droplet", accentKey: "paleBlue" },
  { id: "overall", label: "Look more attractive overall", iconKey: "gem", accentKey: "softLavender" },
];

export const genderOptions: { id: GenderId; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "nonbinary", label: "Non-binary / other" },
  { id: "private", label: "Prefer not to say" },
];

export const directionOptions: {
  id: AestheticDirectionId;
  label: string;
  iconKey: string;
  accentKey: string;
}[] = [
  { id: "masculine", label: "More masculine", iconKey: "activity", accentKey: "paleBlue" },
  { id: "feminine", label: "More feminine", iconKey: "heart", accentKey: "softBlush" },
  { id: "balanced", label: "Balanced / natural", iconKey: "sparkles", accentKey: "softSage" },
  { id: "unsure", label: "Not sure", iconKey: "lightbulb", accentKey: "softLavender" },
];

export const comfortPathOptions: {
  id: ComfortPathId;
  label: string;
  sub: string;
  iconKey: string;
  accentKey: string;
}[] = [
  {
    id: "natural",
    label: "Natural habits",
    sub: "Lifestyle, hydration, sleep, grooming, body composition awareness",
    iconKey: "heart",
    accentKey: "softSage",
  },
  {
    id: "products",
    label: "Products",
    sub: "Skincare, SPF, hair care, oral care, supplements / tools",
    iconKey: "droplet",
    accentKey: "paleBlue",
  },
  {
    id: "clinics",
    label: "Clinic treatments",
    sub: "Facials, peels, microneedling, laser, acne scar consults, whitening",
    iconKey: "stethoscope",
    accentKey: "softLavender",
  },
  {
    id: "injectables",
    label: "Injectables",
    sub: "Filler, neuromodulator discussions, skin boosters",
    iconKey: "syringe",
    accentKey: "softPeach",
  },
  {
    id: "surgery",
    label: "Surgical consults",
    sub: "Educational discussion of surgical paths only",
    iconKey: "gem",
    accentKey: "softBlush",
  },
];

export const budgetOptions: {
  id: BudgetTier;
  label: string;
  sub: string;
  iconKey: string;
  accentKey: string;
}[] = [
  { id: "budget", label: "Budget", sub: "Drugstore essentials, max value", iconKey: "heart", accentKey: "softSage" },
  { id: "standard", label: "Standard", sub: "Mid-tier brands, solid quality", iconKey: "sparkles", accentKey: "paleBlue" },
  { id: "premium", label: "Premium", sub: "High-end formulas and finishes", iconKey: "gem", accentKey: "softLavender" },
  { id: "none", label: "No strict budget", sub: "Show me what works best", iconKey: "zap", accentKey: "softPeach" },
];

export const routineOptions: {
  id: RoutineTolerance;
  label: string;
  sub: string;
  iconKey: string;
  accentKey: string;
}[] = [
  { id: "5min", label: "5 minutes / day", sub: "Bare essentials only", iconKey: "clock", accentKey: "softSage" },
  { id: "15min", label: "15 minutes / day", sub: "Balanced morning + evening", iconKey: "sparkles", accentKey: "paleBlue" },
  { id: "serious", label: "Serious protocol", sub: "Full multi-step routine", iconKey: "zap", accentKey: "softLavender" },
];

export const skinConcernOptions: { id: SkinConcernId; label: string; accentKey: string }[] = [
  { id: "acne", label: "Acne", accentKey: "softBlush" },
  { id: "scarring", label: "Acne scarring", accentKey: "softBlush" },
  { id: "texture", label: "Texture", accentKey: "softPeach" },
  { id: "dryness", label: "Dryness", accentKey: "paleBlue" },
  { id: "oiliness", label: "Oiliness", accentKey: "softPeach" },
  { id: "pigmentation", label: "Hyperpigmentation", accentKey: "softLavender" },
  { id: "undereye", label: "Under-eye darkness", accentKey: "softLavender" },
  { id: "wrinkles", label: "Wrinkles", accentKey: "paleBlue" },
  { id: "sensitivity", label: "Sensitivity", accentKey: "softSage" },
  { id: "none", label: "None of these", accentKey: "stone" },
];

export const hairlineOptions = [
  "No concern",
  "Recession",
  "Thinning at temples",
  "Crown thinning",
  "Forehead framing",
  "Not sure",
];

export const densityOptions = ["High", "Medium", "Low", "Variable", "Not sure"];

export const facialHairOptions = [
  "Clean shave",
  "Light stubble",
  "Trimmed beard",
  "Full beard",
  "Not applicable",
];

export const framingOptions = [
  "Face-framing layers",
  "More volume",
  "Sleeker look",
  "Natural texture",
  "Color / shine",
  "Not sure",
];

export const neutralGroomingOptions = [
  { id: "facialHair", label: "Facial hair guidance" },
  { id: "framing", label: "Hair framing guidance" },
  { id: "brows", label: "Brow shaping guidance" },
  { id: "color", label: "Color / shine guidance" },
  { id: "unsure", label: "Not sure" },
];

export const compositionOptions = ["Lean", "Average", "Soft", "Higher BF", "Prefer not to say"];

// ---------- Default empty answers (used to seed onboarding state) ----------

export const emptyOnboardingAnswers: OnboardingAnswers = {
  goals: [],
  personalization: { gender: null, direction: null },
  comfort: [],
  budget: null,
  routine: null,
  body: { height: 178, weight: 78, target: 75, composition: null },
  skin: [],
  hair: {
    hairline: null,
    density: null,
    styleGoal: "",
    facialHair: null,
    framing: null,
    neutralPrefs: [],
  },
};

// ---------- Sample completed answers (for prototype demos) ----------

export const mockCompletedOnboarding: OnboardingAnswers = {
  goals: ["jawline", "skin", "frame"],
  personalization: { gender: "male", direction: "masculine" },
  comfort: ["natural", "products", "clinics"],
  budget: "standard",
  routine: "15min",
  body: { height: 178, weight: 78, target: 75, composition: "Average" },
  skin: ["texture", "oiliness"],
  hair: {
    hairline: "No concern",
    density: "Medium",
    styleGoal: "Sharper frame, modern crop",
    facialHair: "Light stubble",
    framing: null,
    neutralPrefs: [],
  },
};

// =====================================================================
// Onboarding screen content — titles, subtitles, button labels
// All user-facing copy in one place, easy to swap or A/B test later.
// =====================================================================

export const onboardingContent = {
  welcome: {
    eyebrow: "Welcome to QINO",
    title: "Your personal aesthetics command center",
    intro:
      "QINO analyzes your face, identifies your highest-impact priorities, and turns that into a daily protocol you can actually follow.",
    promises: [
      {
        iconKey: "target",
        label: "Personalized priority map",
        sub: "What matters most for your face",
        bgKey: "softBlush",
      },
      {
        iconKey: "sparkles",
        label: "Daily execution system",
        sub: "Skin, frame, foundation — all in one place",
        bgKey: "softPeach",
      },
      {
        iconKey: "camera",
        label: "Visual progress tracking",
        sub: "See changes with periodic re-analysis",
        bgKey: "softSage",
      },
    ],
    safetyDisclaimer:
      "QINO provides educational aesthetic guidance only. Medical treatments should be discussed with a qualified professional.",
    ctaLabel: "Get Started",
  },

  goals: {
    eyebrow: "Step 1 · Goals",
    title: "What matters most to you?",
    subtitle: "Pick one or more. We'll weight your protocol around these.",
  },

  personalization: {
    eyebrow: "Step 2 · Personalization",
    title: "Personalize your analysis",
    subtitle:
      "This helps QINO compare the right reference ranges and tailor the language of your protocol.",
    genderQuestion: "How should QINO personalize your analysis?",
    directionQuestion: "What aesthetic direction fits your goal?",
    safetyNote:
      "QINO uses these inputs to set baseline references — never to assume a specific identity or outcome. You can update any of this from your settings.",
  },

  comfort: {
    eyebrow: "Step 3 · Pathways",
    title: "Which improvement paths are you open to?",
    subtitle:
      "Select all that apply. QINO will only show recommendations within your comfort zone. You can change this anytime.",
    safetyNote:
      "QINO provides educational aesthetic guidance. Medical treatments, prescriptions, injections, and procedures should be discussed with qualified professionals.",
  },

  budget: {
    eyebrow: "Step 4 · Budget",
    title: "What's your spending range?",
    subtitle: "Product recommendations will match this tier.",
  },

  routine: {
    eyebrow: "Step 5 · Time",
    title: "How much time can you commit?",
    subtitle: "Be honest — consistency beats complexity every time.",
  },

  body: {
    eyebrow: "Step 6 · Body Context",
    title: "Body composition context",
    subtitle:
      "QINO uses this only to assess facial softness and leanness — never to become a fitness app.",
    compositionLabel: "Composition (optional)",
    safetyNote:
      "Used only to inform facial softness, jaw definition, cheek fullness, and overall facial leanness. Never to track macros or build workout plans.",
    skipLabel: "Skip this step",
  },

  skin: {
    eyebrow: "Step 7 · Skin",
    title: "Any skin concerns?",
    subtitle: "Select all that apply. We'll prioritize accordingly.",
  },

  hair: {
    eyebrow: "Step 8 · Hair & Frame",
    title: "Hair & facial frame",
    subtitle:
      "Helps QINO tailor hairstyle, hairline, brow, and grooming recommendations.",
    hairlineLabel: "Hairline concern",
    densityLabel: "Hair density",
    styleGoalLabel: "Style / grooming goal",
    styleGoalPlaceholder: "e.g. sharper frame, more volume, better hairline balance",
    facialHairLabel: "Facial hair preference",
    framingLabel: "Hair framing preference",
    neutralLabel: "Additional grooming preferences",
    skipLabel: "Skip this step",
  },

  scanHandoff: {
    eyebrow: "Final Step · Scan",
    title: "You're ready for your QINO scan",
    subtitle:
      "For the most accurate analysis, complete your guided photo scan when you have 3–5 minutes, natural light, and privacy.",
    cardEyebrow: "Guided Face Scan",
    cardHeadline: "Six angles. About four minutes.",
    promises: [
      "6 required angles",
      "Lighting and blur checks",
      "Retake any photo before submitting",
      "Unlocks analysis, protocol, products, pathways",
    ],
    primaryCta: "Start scan now",
    secondaryCta: "Go to dashboard",
    footnote:
      "You can start your scan anytime from the Today screen. Your dashboard will be in pre-scan mode until photos are submitted.",
  },
};

