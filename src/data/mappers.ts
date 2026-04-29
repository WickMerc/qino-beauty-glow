// =====================================================================
// QINO — DB → Frontend mappers
// Converts Supabase row shapes into the frontend domain types.
// Keeps the API layer dumb and the screens fully decoupled from DB shape.
// =====================================================================

import type {
  AnalysisReport,
  ScoreDimension,
  StrengthOrOpportunity,
  PriorityMap,
  FeatureGroup,
  CurrentPhaseSummary,
} from "../types";
import type {
  AnalysisReportRow,
  FeatureFindingRow,
  PriorityItemRow,
} from "./qinoApi";

/**
 * Build a fully-formed AnalysisReport from the three DB row sets.
 * Defensive: any missing/malformed JSONB falls back to safe defaults
 * so a partial database row doesn't blow up the UI.
 */
export const mapAnalysisReport = (
  report: AnalysisReportRow,
  findings: FeatureFindingRow[],
  priorities: PriorityItemRow[]
): AnalysisReport => {
  const priorityMap: PriorityMap = {
    high: priorities.filter((p) => p.priority_level === "high").map((p) => p.title),
    medium: priorities.filter((p) => p.priority_level === "medium").map((p) => p.title),
    low: priorities.filter((p) => p.priority_level === "low").map((p) => p.title),
  };

  return {
    id: report.id,
    generatedAt: report.completed_at ?? report.created_at,
    headline: report.headline ?? "",
    insight: report.insight ?? "",
    currentPhase: (report.current_phase as CurrentPhaseSummary) ?? {
      name: "",
      mainFocus: "",
      explanation: "",
    },
    scores: (report.scores as ScoreDimension[]) ?? [],
    strengths: (report.strengths as StrengthOrOpportunity[]) ?? [],
    opportunities: (report.opportunities as StrengthOrOpportunity[]) ?? [],
    priorities: priorityMap,
    featureGroups: findings.map(
      (f): FeatureGroup => ({
        id: f.group_id,
        title: f.title,
        iconKey: f.icon_key,
        accentKey: f.accent_key,
        findings:
          (f.findings as FeatureGroup["findings"]) ?? [],
        detail:
          (f.detail as FeatureGroup["detail"]) ?? {
            whyItMatters: "",
            atHomeActions: [],
            productCategories: [],
            treatmentRelevance: null,
            priorityLevel: "low",
          },
      })
    ),
  };
};
