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
  const { error } = await supabase.from("onboarding_answers").upsert(
    {
      user_id: CURRENT_USER_ID,
      goals: answers.goals,
      personalization: answers.personalization,
      comfort: answers.comfort,
      budget: answers.budget,
      routine: answers.routine,
      body: answers.body,
      skin: answers.skin,
      hair: answers.hair,
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
    goals: (data.goals as OnboardingAnswers["goals"]) ?? [],
    personalization:
      (data.personalization as OnboardingAnswers["personalization"]) ?? {
        gender: null,
        direction: null,
      },
    comfort: (data.comfort as OnboardingAnswers["comfort"]) ?? [],
    budget: data.budget as OnboardingAnswers["budget"],
    routine: data.routine as OnboardingAnswers["routine"],
    body: (data.body as OnboardingAnswers["body"]) ?? {
      height: 178,
      weight: 78,
      target: 75,
      composition: null,
    },
    skin: (data.skin as OnboardingAnswers["skin"]) ?? [],
    hair: (data.hair as OnboardingAnswers["hair"]) ?? {
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
//
// Reports are not generated yet — that's iteration 7. For 6B, this
// fetcher returns null whenever a real report doesn't exist, and the
// frontend falls back to mockAnalysisReport.
// =====================================================================

export const fetchLatestAnalysisReport = async (): Promise<unknown | null> => {
  // Schema mapping happens in iteration 7 when real reports are generated.
  // For now we just check if any row exists; if so, the frontend can
  // attempt to use it. Otherwise return null → fallback to mock.
  const { data, error } = await supabase
    .from("analysis_reports")
    .select("id")
    .eq("user_id", CURRENT_USER_ID)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn("[qinoApi] fetchLatestAnalysisReport error:", error.message);
    return null;
  }
  return data;
};
