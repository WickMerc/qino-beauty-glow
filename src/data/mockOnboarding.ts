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
