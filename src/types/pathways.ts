// =====================================================================
// QINO — Treatment Pathway types
// Levels 1–4 with comfort gating.
// =====================================================================

export type PathwayLevelNumber = 1 | 2 | 3 | 4;

export interface PathwayItem {
  id: string;
  label: string;               // "Acne scar consult"
  /**
   * Educational language tag — never claims candidacy.
   * QINO uses phrases like:
   *  - "Worth discussing"
   *  - "Potential pathway"
   *  - "May be relevant"
   *  - "Educational guidance only"
   */
  language: string;
}

export interface PathwayLevel {
  number: PathwayLevelNumber;
  title: string;               // "At Home" | "Products" | "Clinic Consult" | "Injectables / Surgery"
  sub: string;                 // short helper line under the title
  accentKey: string;           // palette key
  items: PathwayItem[];
  /** True if this level requires the user to opt in (Level 4). */
  gated: boolean;
}

export interface TreatmentPathways {
  /** Human-readable comfort summary, e.g. "Open to: Products + Clinics". */
  comfortSummary: string;
  levels: PathwayLevel[];
}
