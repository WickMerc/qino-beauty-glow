// =====================================================================
// QINO — Onboarding types
// These match the questions collected during the onboarding flow.
// =====================================================================

export type GoalId =
  | "jawline"
  | "skin"
  | "harmony"
  | "frame"
  | "smile"
  | "puffiness"
  | "overall";

export type GenderId = "male" | "female" | "nonbinary" | "private";

export type AestheticDirectionId = "masculine" | "feminine" | "balanced" | "unsure";

export type ComfortPathId =
  | "natural"
  | "products"
  | "clinics"
  | "injectables"
  | "surgery";

export type BudgetTier = "budget" | "standard" | "premium" | "none";

export type RoutineTolerance = "5min" | "15min" | "serious";

export type SkinConcernId =
  | "acne"
  | "scarring"
  | "texture"
  | "dryness"
  | "oiliness"
  | "pigmentation"
  | "undereye"
  | "wrinkles"
  | "sensitivity"
  | "none";

export interface BodyContext {
  height: number;            // cm
  weight: number;            // kg
  target: number | null;     // kg, optional
  composition: string | null;
}

export interface HairAndFrame {
  hairline: string | null;
  density: string | null;
  styleGoal: string;
  facialHair: string | null;     // shown only for masculine direction
  framing: string | null;        // shown only for feminine direction
  neutralPrefs: string[];        // shown for non-binary / balanced
}

export interface Personalization {
  gender: GenderId | null;
  direction: AestheticDirectionId | null;
}

export interface OnboardingAnswers {
  goals: GoalId[];
  personalization: Personalization;
  comfort: ComfortPathId[];
  budget: BudgetTier | null;
  routine: RoutineTolerance | null;
  body: BodyContext;
  skin: SkinConcernId[];
  hair: HairAndFrame;
}
