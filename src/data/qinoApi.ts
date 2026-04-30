// =====================================================================
// QINO — Supabase Data Access Layer (iteration 9)
// All reads/writes derive user_id from the live Supabase auth session.
// Each call resolves the auth user and short-circuits if unauthenticated.
// =====================================================================

import { supabase } from "../integrations/supabase/client";
import type { OnboardingAnswers } from "../types";

const requireUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

// =====================================================================
// PROFILES
// =====================================================================

export interface ProfileRow {
  user_id: string;
  name: string;
  email: string | null;
}

export const fetchProfile = async (): Promise<ProfileRow | null> => {
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, name, email")
    .eq("user_id", userId)
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

export const saveOnboardingAnswers = async (
  answers: OnboardingAnswers
): Promise<{ ok: boolean; error?: string }> => {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "not_authenticated" };
  const { error } = await supabase.from("onboarding_answers").upsert(
    {
      user_id: userId,
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
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("onboarding_answers")
    .select("goals, personalization, comfort, budget, routine, body, skin, hair")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn("[qinoApi] fetchOnboardingAnswers error:", error.message);
    return null;
  }
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

export const createScanSession = async (): Promise<string | null> => {
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("scan_sessions")
    .insert({ user_id: userId, status: "pending" })
    .select("id")
    .single();
  if (error || !data) {
    if (error) console.warn("[qinoApi] createScanSession error:", error.message);
    return null;
  }
  return data.id;
};

export const markScanSessionUploaded = async (
  sessionId: string
): Promise<{ ok: boolean }> => {
  const userId = await requireUserId();
  if (!userId) return { ok: false };
  const { error } = await supabase
    .from("scan_sessions")
    .update({ status: "uploaded" })
    .eq("id", sessionId)
    .eq("user_id", userId);
  if (error) {
    console.warn("[qinoApi] markScanSessionUploaded error:", error.message);
    return { ok: false };
  }
  return { ok: true };
};

export const fetchLatestScanSession = async (): Promise<{
  id: string;
  status: string;
} | null> => {
  const userId = await requireUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("scan_sessions")
    .select("id, status")
    .eq("user_id", userId)
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

export const insertScanPhotos = async (
  photos: ScanPhotoInsert[]
): Promise<{ ok: boolean; error?: string }> => {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "not_authenticated" };
  const rows = photos.map((p) => ({ ...p, user_id: userId }));
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

export const fetchLatestAnalysisReport = async (): Promise<{
  report: AnalysisReportRow;
  findings: FeatureFindingRow[];
  priorities: PriorityItemRow[];
} | null> => {
  const userId = await requireUserId();
  if (!userId) return null;

  const { data: reportRow, error: reportErr } = await supabase
    .from("analysis_reports")
    .select(
      "id, user_id, scan_session_id, status, headline, insight, current_phase, scores, strengths, opportunities, priorities, created_at, completed_at"
    )
    .eq("user_id", userId)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reportErr || !reportRow) {
    if (reportErr)
      console.warn("[qinoApi] fetchLatestAnalysisReport error:", reportErr.message);
    return null;
  }

  const { data: findingsRows, error: findingsErr } = await supabase
    .from("feature_findings")
    .select("id, group_id, title, icon_key, accent_key, findings, detail, sort_order")
    .eq("analysis_report_id", reportRow.id)
    .order("sort_order", { ascending: true });

  if (findingsErr) {
    console.warn("[qinoApi] fetchLatestAnalysisReport findings error:", findingsErr.message);
    return null;
  }

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

export const pollAnalysisStatus = async (
  scanSessionId: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<"complete" | "failed" | "timeout"> => {
  const intervalMs = options.intervalMs ?? 1500;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const start = Date.now();

  const userId = await requireUserId();
  if (!userId) return "failed";

  while (Date.now() - start < timeoutMs) {
    const { data, error } = await supabase
      .from("analysis_reports")
      .select("status")
      .eq("user_id", userId)
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

// =====================================================================
// COACH (iteration 8B)
// =====================================================================

export interface CoachMessageRow {
  id: string;
  role: "user" | "qino";
  content: string;
  created_at: string;
}

export const fetchCoachHistory = async (
  limit = 50
): Promise<CoachMessageRow[]> => {
  const userId = await requireUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from("coach_messages")
    .select("id, role, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[qinoApi] fetchCoachHistory error:", error.message);
    return [];
  }
  return ((data ?? []) as CoachMessageRow[]).slice().reverse();
};

export const sendCoachMessage = async (
  message: string,
  onDelta: (text: string) => void
): Promise<{ replyId: string; replyText: string }> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const url = `${supabaseUrl}/functions/v1/coach-message`;

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new Error("Sign in to chat with QINO Coach.");
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn("[qinoApi] sendCoachMessage network error:", reason);
    throw new Error("Network error. Please try again.");
  }

  if (!res.ok) {
    let bodyMessage = "Request failed.";
    try {
      const errBody = await res.json();
      if (typeof errBody?.message === "string") bodyMessage = errBody.message;
      else if (typeof errBody?.error === "string") bodyMessage = errBody.error;
    } catch {
      // ignore
    }
    console.warn("[qinoApi] sendCoachMessage non-ok:", res.status, bodyMessage);
    throw new Error(bodyMessage);
  }

  if (!res.body) {
    throw new Error("Empty response from Coach.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";
  let replyId = "";
  let errored: string | null = null;
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (streamDone) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const evtBlock of events) {
      const lines = evtBlock.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload) continue;
        let evt: { type?: string; text?: string; message_id?: string; message?: string };
        try {
          evt = JSON.parse(payload);
        } catch {
          continue;
        }
        if (evt.type === "delta" && typeof evt.text === "string") {
          fullText += evt.text;
          onDelta(evt.text);
        } else if (evt.type === "done" && typeof evt.message_id === "string") {
          replyId = evt.message_id;
          done = true;
        } else if (evt.type === "error") {
          errored = evt.message ?? "Coach is briefly unavailable.";
          done = true;
        }
      }
    }
  }

  if (errored) throw new Error(errored);
  if (!replyId) throw new Error("Coach response was incomplete.");
  return { replyId, replyText: fullText };
};
