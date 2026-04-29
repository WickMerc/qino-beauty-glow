// =====================================================================
// QINO — Analysis & Report types
// The AnalysisReport is the central object that drives most dashboard cards.
// =====================================================================

export type ImpactLevel = "high" | "medium" | "low";
export type ScoreStatus = "excellent" | "good" | "fair" | "needs_attention";

export interface ScoreDimension {
  id: string;                  // e.g. "symmetry"
  label: string;               // "Symmetry"
  value: number;               // 0–100
  status: ScoreStatus;
  statusLabel: string;         // human-friendly e.g. "Good"
  /** Tailwind/hex color tokens used by the renderer; kept on data so design can vary. */
  colorAccent: string;
  bgAccent: string;
}

export interface FeatureFinding {
  key: string;                 // e.g. "face_shape"
  label: string;               // "Face shape"
  value: string;               // "Oval"
}

export interface FeatureGroup {
  id: string;                  // e.g. "facial_structure"
  title: string;
  iconKey: string;             // string so data is icon-library-agnostic
  accentKey: string;           // palette key, mapped in component
  findings: FeatureFinding[];
}

export interface PriorityMap {
  high: string[];
  medium: string[];
  low: string[];
}

export interface StrengthOrOpportunity {
  id: string;
  label: string;
  sub: string;
  iconKey: string;
  accentKey: string;
  /** Only present on opportunities */
  impact?: ImpactLevel;
}

export interface AnalysisReport {
  id: string;
  generatedAt: string;          // ISO
  headline: string;             // "Lower-face definition is priority #1"
  insight: string;              // short paragraph

  scores: ScoreDimension[];
  strengths: StrengthOrOpportunity[];
  opportunities: StrengthOrOpportunity[];
  priorities: PriorityMap;
  featureGroups: FeatureGroup[];

  /** Current 90-day protocol phase summary, surfaced at the top of the Report. */
  currentPhase: CurrentPhaseSummary;
  /** Lightweight product preview shown on the Report (does not duplicate full ProductStack). */
  productStackPreview: ProductStackPreview;
  /** Lightweight pathways preview shown on the Report (does not duplicate full TreatmentPathways). */
  pathwaysPreview: PathwaysPreview;
  /** 3-phase 90-day protocol preview shown on the Report. */
  protocolPreview: ProtocolPreviewPhase[];
}

// =====================================================================
// Report-only summary types
// =====================================================================

export interface CurrentPhaseSummary {
  name: string;        // "Foundation Phase"
  mainFocus: string;   // "Lower-face definition + skin clarity"
  explanation: string; // short paragraph
}

export interface ProductPreviewItem {
  id: string;
  name: string;
  categoryLabel: string;
  /** Educational language, e.g. "Essential", "Targeted", "Optional" */
  bucketLabel: string;
}

export interface ProductStackPreview {
  essentials: ProductPreviewItem[];
  targeted: ProductPreviewItem[];
  optional: ProductPreviewItem[];
  totalCount: number;
}

export interface PathwayPreviewLevel {
  number: 1 | 2 | 3 | 4;
  title: string;        // "At-home" | "Products" | "Clinic consult" | "Injectables / Surgery"
  /** Safe, educational language only. */
  language: string;     // e.g. "Worth discussing with a qualified professional"
  locked: boolean;      // Level 4 locked unless opted in
  accentKey: string;
}

export interface PathwaysPreview {
  comfortSummary: string;
  levels: PathwayPreviewLevel[];
}

export type ProtocolPreviewState = "active" | "locked" | "completed";

export interface ProtocolPreviewPhase {
  number: 1 | 2 | 3;
  name: string;        // "Foundation"
  dayRange: string;    // "Days 1–30"
  state: ProtocolPreviewState;
  focus: string;       // short description
}
