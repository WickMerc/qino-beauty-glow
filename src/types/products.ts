// =====================================================================
// QINO — Product Stack types
// Drives Product Stack modal and dashboard preview cards.
// =====================================================================

export type ProductCategory =
  | "cleanser"
  | "moisturizer"
  | "spf"
  | "lip"
  | "texture_serum"
  | "barrier"
  | "exfoliant"
  | "retinoid"
  | "hair"
  | "oral"
  | "grooming";

export type PriorityLevel = "high" | "medium" | "low";
export type ProductTier = "budget" | "standard" | "premium";

export interface ProductRecommendation {
  id: string;
  name: string;                // e.g. "Gentle cleanser"
  category: ProductCategory;
  categoryLabel: string;       // "Cleanser"
  priority: PriorityLevel;
  why: string;                 // recommendation rationale
  tierAvailable: ProductTier[];
  /** Optional affiliate placeholder — handled by URL builder, never hard-link. */
  affiliateRef?: string;
  /** Soft palette key for the visual chip behind the bottle illustration. */
  accentKey?: string;
}

export interface ProductStack {
  essentials: ProductRecommendation[];
  targeted: ProductRecommendation[];
}
