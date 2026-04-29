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
}
