// =====================================================================
// QINO — Supabase Data Access Layer
// Thin functions that read/write directly against Supabase.
// Used by the useQinoData hook; can also be called directly from
// flow components (e.g. onboarding submit, scan submit).
//
// Each function returns either real data or null/error — never throws.
// Callers decide whether to fall back to mock data.
// =====================================================================

import { supabase } from "../integrations/supabase/client";
import { CURRENT_USER_ID } from "./currentUser";
import type { OnboardingAnswers } from "../types";

// =====================================================================
// PROFILES
// =====================================================================

export interface ProfileRow {
  user_id: string;
  name: string;
  email: string | null;
}

export const fetchProfile = async (): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("user_id", CURRENT_USER_ID)
    .maybeSingle();
  if (error) {
    console.warn("[qinoApi] fetchProfile error:", error.message);
    return null;
  }
  return data;
};

// =====================================================================
// ONBOARDING
// =====================================================================

/**
 * Save onboarding answers. Uses upsert so calling this multiple times
 * (e.g. on resume) overwrites cleanly.
 */
export const saveOnboardingAnswers = async (
  answers: OnboardingAnswers
): Promise<{ ok: boolean; error?: string }> => {
  // Cast typed answers → Json for Supabase. The auto-generated `Json` type
  // is conservative and doesn't accept arbitrary typed objects without a cast.
  const { error } = await supabase.from("onboarding_answers").upsert(
    {
      user_id: CURRENT_USER_ID,
      goals: answers.goals as unknown as never,
      personalization: answers.personalization as unknown as never,
      comfort: answers.comfort as unknown as never,
      budget: answers.budget,
      routine: answers.routine,
      body: answers.body as unknown as never,
      skin: answers.skin as unknown as never,
      hair: answers.hair as unknown as never,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) {
    console.warn("[qinoApi] saveOnboardingAnswers error:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
};

export const fetchOnboardingAnswers = async (): Promise<OnboardingAnswers | null> => {
  const { data, error } = await supabase
    .from("onboarding_answers")
    .select("goals, personalization, comfort, budget, routine, body, skin, hair")
    .eq("user_id", CURRENT_USER_ID)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn("[qinoApi] fetchOnboardingAnswers error:", error.message);
    return null;
  }
  // Cast JSONB → typed answers. Real schema validation lands later.
  return {
    goals: (data.goals as unknown as OnboardingAnswers["goals"]) ?? [],
    personalization:
      (data.personalization as unknown as OnboardingAnswers["personalization"]) ?? {
        gender: null,
        direction: null,
      },
    comfort: (data.comfort as unknown as OnboardingAnswers["comfort"]) ?? [],
    budget: data.budget as OnboardingAnswers["budget"],
    routine: data.routine as OnboardingAnswers["routine"],
    body: (data.body as unknown as OnboardingAnswers["body"]) ?? {
      height: 178,
      weight: 78,
      target: 75,
      composition: null,
    },
    skin: (data.skin as unknown as OnboardingAnswers["skin"]) ?? [],
    hair: (data.hair as unknown as OnboardingAnswers["hair"]) ?? {
      hairline: null,
      density: null,
      styleGoal: "",
      facialHair: null,
      framing: null,
      neutralPrefs: [],
    },
  };
};

// =====================================================================
// SCAN SESSIONS
// =====================================================================

/**
 * Create a new scan session in pending state and return its id.
 * Called when user starts the guided scan.
 */
export const createScanSession = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("scan_sessions")
    .insert({ user_id: CURRENT_USER_ID, status: "pending" })
    .select("id")
    .single();
  if (error || !data) {
    if (error) console.warn("[qinoApi] createScanSession error:", error.message);
    return null;
  }
  return data.id;
};

/**
 * Mark a scan session as uploaded (all 6 photos submitted).
 * The processing → complete transitions happen server-side later.
 */
export const markScanSessionUploaded = async (
  sessionId: string
): Promise<{ ok: boolean }> => {
  const { error } = await supabase
    .from("scan_sessions")
    .update({ status: "uploaded" })
    .eq("id", sessionId)
    .eq("user_id", CURRENT_USER_ID);
  if (error) {
    console.warn("[qinoApi] markScanSessionUploaded error:", error.message);
    return { ok: false };
  }
  return { ok: true };
};

/**
 * Returns the user's most recent scan session, if any.
 */
export const fetchLatestScanSession = async (): Promise<{
  id: string;
  status: string;
} | null> => {
  const { data, error } = await supabase
    .from("scan_sessions")
    .select("id, status")
    .eq("user_id", CURRENT_USER_ID)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn("[qinoApi] fetchLatestScanSession error:", error.message);
    return null;
  }
  return data;
};

// =====================================================================
// SCAN PHOTOS
// =====================================================================

export interface ScanPhotoInsert {
  scan_session_id: string;
  angle_type: "front" | "smile" | "left" | "right" | "fortyfive" | "skin";
  storage_path: string;
}

/**
 * Bulk-insert scan photo metadata after files have been uploaded
 * to the scan-photos storage bucket.
 */
export const insertScanPhotos = async (
  photos: ScanPhotoInsert[]
): Promise<{ ok: boolean; error?: string }> => {
  const rows = photos.map((p) => ({
    ...p,
    user_id: CURRENT_USER_ID,
  }));
  const { error } = await supabase.from("scan_photos").insert(rows);
  if (error) {
    console.warn("[qinoApi] insertScanPhotos error:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
};

// =====================================================================
// ANALYSIS REPORTS
// =====================================================================

/**
 * Invoke the generate-analysis Edge Function for a given scan session.
 * The function reads the user's onboarding + scan_session, generates a
 * report (currently placeholder content; real LLM in iteration 8), and
 * writes analysis_reports + feature_findings + priority_items rows.
 *
 * Returns the new analysis_report id on success, null on failure.
 */
export const generateAnalysisReport = async (
  scanSessionId: string
): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke("generate-analysis", {
    body: { scan_session_id: scanSessionId },
  });
  if (error) {
    console.warn("[qinoApi] generateAnalysisReport error:", error.message);
    return null;
  }
  if (!data || typeof data !== "object" || !("analysis_report_id" in data)) {
    console.warn("[qinoApi] generateAnalysisReport: unexpected response", data);
    return null;
  }
  return (data as { analysis_report_id: string }).analysis_report_id;
};

/**
 * Fetch the latest complete analysis report for the current user,
 * including all feature_findings and priority_items child rows.
 * Returns null if no complete report exists (caller falls back to mock).
 */
export const fetchLatestAnalysisReport = async (): Promise<{
  report: AnalysisReportRow;
  findings: FeatureFindingRow[];
  priorities: PriorityItemRow[];
} | null> => {
  // 1. Find the latest complete report
  const { data: reportRow, error: reportErr } = await supabase
    .from("analysis_reports")
    .select(
      "id, user_id, scan_session_id, status, headline, insight, current_phase, scores, strengths, opportunities, priorities, created_at, completed_at"
    )
    .eq("user_id", CURRENT_USER_ID)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reportErr || !reportRow) {
    if (reportErr)
      console.warn("[qinoApi] fetchLatestAnalysisReport error:", reportErr.message);
    return null;
  }

  // 2. Fetch its feature findings
  const { data: findingsRows, error: findingsErr } = await supabase
    .from("feature_findings")
    .select("id, group_id, title, icon_key, accent_key, findings, detail, sort_order")
    .eq("analysis_report_id", reportRow.id)
    .order("sort_order", { ascending: true });

  if (findingsErr) {
    console.warn("[qinoApi] fetchLatestAnalysisReport findings error:", findingsErr.message);
    return null;
  }

  // 3. Fetch its priority items
  const { data: prioritiesRows, error: prioritiesErr } = await supabase
    .from("priority_items")
    .select("id, title, priority_level, sort_order")
    .eq("analysis_report_id", reportRow.id)
    .order("sort_order", { ascending: true });

  if (prioritiesErr) {
    console.warn(
      "[qinoApi] fetchLatestAnalysisReport priorities error:",
      prioritiesErr.message
    );
    return null;
  }

  return {
    report: reportRow as unknown as AnalysisReportRow,
    findings: (findingsRows ?? []) as unknown as FeatureFindingRow[],
    priorities: (prioritiesRows ?? []) as unknown as PriorityItemRow[],
  };
};

/**
 * Poll the analysis_reports row for the given scan_session until it
 * reaches `complete` or `failed` status. Used by the processing screen.
 *
 * Returns "complete" | "failed" | "timeout".
 */
export const pollAnalysisStatus = async (
  scanSessionId: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<"complete" | "failed" | "timeout"> => {
  const intervalMs = options.intervalMs ?? 1500;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const { data, error } = await supabase
      .from("analysis_reports")
      .select("status")
      .eq("user_id", CURRENT_USER_ID)
      .eq("scan_session_id", scanSessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      if (data.status === "complete") return "complete";
      if (data.status === "failed") return "failed";
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return "timeout";
};

// Row shapes for the fetcher above. Kept loose since the real shapes
// are mapped to AnalysisReport in useQinoData.
export interface AnalysisReportRow {
  id: string;
  user_id: string;
  scan_session_id: string;
  status: "generating" | "complete" | "failed";
  headline: string | null;
  insight: string | null;
  current_phase: unknown;
  scores: unknown;
  strengths: unknown;
  opportunities: unknown;
  priorities: unknown;
  created_at: string;
  completed_at: string | null;
}

export interface FeatureFindingRow {
  id: string;
  group_id: string;
  title: string;
  icon_key: string;
  accent_key: string;
  findings: unknown;
  detail: unknown;
  sort_order: number;
}

export interface PriorityItemRow {
  id: string;
  title: string;
  priority_level: "high" | "medium" | "low";
  sort_order: number;
}
