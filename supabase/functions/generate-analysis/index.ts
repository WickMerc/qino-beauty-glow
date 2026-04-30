// =====================================================================
// QINO — generate-analysis Edge Function (iteration 8A)
// Generates a personalized analysis report by calling Claude Sonnet
// with tool-use for structured JSON output.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Deno globals (declared for type safety in non-Deno tooling)
declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------- Types ----------
type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[];

interface FindingItem {
  key: string;
  label: string;
  value: string;
}

interface FeatureGroupDetail {
  whyItMatters: string;
  atHomeActions: string[];
  productCategories: string[];
  treatmentRelevance: string | null;
  priorityLevel: "low" | "medium" | "high";
}

interface FeatureGroup {
  group_id: string;
  title: string;
  icon_key: string;
  accent_key: string;
  findings: FindingItem[];
  detail: FeatureGroupDetail;
}

interface OpportunityItem {
  id: string;
  label: string;
  sub: string;
  impact: "low" | "medium" | "high";
  iconKey: string;
  accentKey: string;
}

interface ReportContent {
  headline: string;
  insight: string;
  current_phase: { name: string; mainFocus: string; explanation: string };
  scores: Json[];
  strengths: Json[];
  opportunities: OpportunityItem[];
  priorities: { high: string[]; medium: string[]; low: string[] };
  feature_groups: FeatureGroup[];
}

// ---------- Constants for validation / enums ----------
const SCORE_IDS = ["symmetry", "skin_quality", "structure", "grooming_frame"] as const;
const SCORE_STATUS = ["excellent", "good", "fair", "needs_attention"] as const;
const COLOR_ACCENTS = [
  "midnight",
  "mistAccent",
  "peachAccent",
  "sageAccent",
  "lavenderAccent",
  "blushAccent",
] as const;
const BG_ACCENTS = [
  "paleBlue",
  "softPeach",
  "softLavender",
  "softSage",
  "softBlush",
] as const;
const ITEM_ACCENTS = [
  "softSage",
  "paleBlue",
  "softPeach",
  "softLavender",
  "softBlush",
] as const;
const ICON_KEYS = ["sparkles", "activity", "layers", "scissors", "droplet", "heart", "eye"] as const;
const IMPACT_LEVELS = ["low", "medium", "high"] as const;
const PRIORITY_LEVELS = ["low", "medium", "high"] as const;
const GROUP_IDS = [
  "facial_structure",
  "jaw_chin_neck",
  "skin",
  "hair_frame",
  "eyes_nose_lips",
] as const;
const PRODUCT_CATEGORIES = [
  "cleanser",
  "moisturizer",
  "spf",
  "lip",
  "texture_serum",
  "barrier",
  "exfoliant",
  "retinoid",
  "hair",
  "oral",
  "grooming",
] as const;

// ---------- Anthropic tool schema ----------
const GENERATE_QINO_REPORT_TOOL = {
  name: "generate_qino_report",
  description:
    "Return the user's personalized QINO facial analysis report as a structured object.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "headline",
      "insight",
      "current_phase",
      "scores",
      "strengths",
      "opportunities",
      "priorities",
      "feature_groups",
    ],
    properties: {
      headline: { type: "string" },
      insight: { type: "string" },
      current_phase: {
        type: "object",
        additionalProperties: false,
        required: ["name", "mainFocus", "explanation"],
        properties: {
          name: { type: "string" },
          mainFocus: { type: "string" },
          explanation: { type: "string" },
        },
      },
      scores: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "label", "value", "status", "statusLabel", "colorAccent", "bgAccent"],
          properties: {
            id: { type: "string", enum: [...SCORE_IDS] },
            label: { type: "string" },
            value: { type: "number", minimum: 0, maximum: 100 },
            status: { type: "string", enum: [...SCORE_STATUS] },
            statusLabel: { type: "string" },
            colorAccent: { type: "string", enum: [...COLOR_ACCENTS] },
            bgAccent: { type: "string", enum: [...BG_ACCENTS] },
          },
        },
      },
      strengths: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "label", "sub", "iconKey", "accentKey"],
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            sub: { type: "string" },
            iconKey: { type: "string", enum: [...ICON_KEYS] },
            accentKey: { type: "string", enum: [...ITEM_ACCENTS] },
          },
        },
      },
      opportunities: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "label", "sub", "impact", "iconKey", "accentKey"],
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            sub: { type: "string" },
            impact: { type: "string", enum: [...IMPACT_LEVELS] },
            iconKey: { type: "string", enum: [...ICON_KEYS] },
            accentKey: { type: "string", enum: [...ITEM_ACCENTS] },
          },
        },
      },
      priorities: {
        type: "object",
        additionalProperties: false,
        required: ["high", "medium", "low"],
        properties: {
          high: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
          medium: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
          low: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
        },
      },
      feature_groups: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["group_id", "title", "icon_key", "accent_key", "findings", "detail"],
          properties: {
            group_id: { type: "string", enum: [...GROUP_IDS] },
            title: { type: "string" },
            icon_key: { type: "string", enum: [...ICON_KEYS] },
            accent_key: { type: "string", enum: [...ITEM_ACCENTS] },
            findings: {
              type: "array",
              minItems: 4,
              maxItems: 5,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["key", "label", "value"],
                properties: {
                  key: { type: "string" },
                  label: { type: "string" },
                  value: { type: "string" },
                },
              },
            },
            detail: {
              type: "object",
              additionalProperties: false,
              required: [
                "whyItMatters",
                "atHomeActions",
                "productCategories",
                "treatmentRelevance",
                "priorityLevel",
              ],
              properties: {
                whyItMatters: { type: "string" },
                atHomeActions: {
                  type: "array",
                  minItems: 4,
                  maxItems: 5,
                  items: { type: "string" },
                },
                productCategories: {
                  type: "array",
                  items: { type: "string", enum: [...PRODUCT_CATEGORIES] },
                },
                treatmentRelevance: { type: ["string", "null"] },
                priorityLevel: { type: "string", enum: [...PRIORITY_LEVELS] },
              },
            },
          },
        },
      },
    },
  },
};

// ---------- Prompt builder ----------
function fmtList(arr: unknown): string {
  if (!Array.isArray(arr) || arr.length === 0) return "none";
  return arr.map((x) => String(x)).join(", ");
}
function fmtVal(v: unknown): string {
  if (v === null || v === undefined || v === "") return "none";
  return String(v);
}

function buildPrompt(answers: Record<string, any>): string {
  const goals = fmtList(answers?.goals);
  const personalization = answers?.personalization ?? {};
  const gender = fmtVal(personalization?.gender);
  const direction = fmtVal(personalization?.direction);
  const comfort = fmtList(answers?.comfort);
  const budget = fmtVal(answers?.budget);
  const routine = fmtVal(answers?.routine);
  const skin = fmtList(answers?.skin);
  const hair = answers?.hair ?? {};
  const hairline = fmtVal(hair?.hairline);
  const density = fmtVal(hair?.density);
  const styleGoal = fmtVal(hair?.styleGoal);
  const body = answers?.body ?? {};
  const height = fmtVal(body?.height);
  const weight = fmtVal(body?.weight);
  const target = fmtVal(body?.target);
  const composition = fmtVal(body?.composition);

  return `You are QINO, a premium AI facial aesthetics platform. Generate a personalized analysis report for a user based on their onboarding answers.

USER ONBOARDING ANSWERS:
- Goals: ${goals}
- Personalization: ${gender}, aesthetic direction ${direction}
- Comfort with treatment paths: ${comfort}
- Budget tier: ${budget}
- Routine commitment: ${routine}
- Skin concerns: ${skin}
- Hair concerns: hairline ${hairline}, density ${density}, style goal "${styleGoal}"
- Body context: height ${height}cm, weight ${weight}kg, target ${target}kg, composition ${composition}

INSTRUCTIONS:
1. Generate a complete QINO analysis report grounded in these answers.
2. The "headline" should reflect the user's #1 priority as inferred from their goals and concerns.
3. Score values (0-100) should reflect plausible analysis given their concerns. If they listed acne or texture issues, skin_quality should be lower. If they listed jawline goals, structure may be moderate. Be realistic — most users score 70-85, not 95+.
4. The 4 strengths should highlight what's likely working in their favor based on their answers (or absence of concerns in an area).
5. The 4 opportunities should map to their stated goals and concerns. Lower-face definition stays as a common high-priority opportunity if they listed jawline goals.
6. The priority map (high/medium/low) should drive a coherent 90-day protocol.
7. Feature groups: include all 5 groups in this exact order: facial_structure, jaw_chin_neck, skin, hair_frame, eyes_nose_lips. For each, write findings that align with the user's answers, a "whyItMatters" paragraph specific to their priorities, 4-5 at-home actions, relevant product categories from the user's stack, and treatment relevance using safe educational language only.
8. CRITICAL SAFETY: Use only educational language. Phrases like "worth discussing with a qualified professional" and "potential pathway." Never say the user "needs" surgery or injections, never claim QINO can diagnose, never make medical claims.
9. Tone: premium, intelligent, calm, confident, gender-neutral, direct, aspirational. Avoid cheap beauty-app energy.
10. Return your response by calling the generate_qino_report tool.`;
}

// ---------- Validation ----------
function validateReportContent(input: any): { ok: true } | { ok: false; reason: string } {
  if (!input || typeof input !== "object") return { ok: false, reason: "not an object" };

  const requiredTop = [
    "headline",
    "insight",
    "current_phase",
    "scores",
    "strengths",
    "opportunities",
    "priorities",
    "feature_groups",
  ];
  for (const k of requiredTop) {
    if (!(k in input)) return { ok: false, reason: `missing ${k}` };
  }

  if (typeof input.headline !== "string" || typeof input.insight !== "string") {
    return { ok: false, reason: "headline/insight not strings" };
  }
  const cp = input.current_phase;
  if (!cp || typeof cp.name !== "string" || typeof cp.mainFocus !== "string" || typeof cp.explanation !== "string") {
    return { ok: false, reason: "current_phase malformed" };
  }

  if (!Array.isArray(input.scores) || input.scores.length !== 4) {
    return { ok: false, reason: `scores length ${input.scores?.length}` };
  }
  const scoreIds = input.scores.map((s: any) => s?.id);
  for (const expected of SCORE_IDS) {
    if (!scoreIds.includes(expected)) return { ok: false, reason: `missing score id ${expected}` };
  }
  for (const s of input.scores) {
    if (!SCORE_STATUS.includes(s?.status)) return { ok: false, reason: `bad score.status ${s?.status}` };
    if (typeof s?.value !== "number") return { ok: false, reason: "score.value not number" };
  }

  if (!Array.isArray(input.strengths) || input.strengths.length !== 4) {
    return { ok: false, reason: `strengths length ${input.strengths?.length}` };
  }
  if (!Array.isArray(input.opportunities) || input.opportunities.length !== 4) {
    return { ok: false, reason: `opportunities length ${input.opportunities?.length}` };
  }
  for (const o of input.opportunities) {
    if (!IMPACT_LEVELS.includes(o?.impact)) return { ok: false, reason: `bad impact ${o?.impact}` };
  }

  const p = input.priorities;
  if (!p || !Array.isArray(p.high) || !Array.isArray(p.medium) || !Array.isArray(p.low)) {
    return { ok: false, reason: "priorities malformed" };
  }
  if (p.high.length !== 3 || p.medium.length !== 3 || p.low.length !== 3) {
    return { ok: false, reason: "priorities length not 3/3/3" };
  }

  if (!Array.isArray(input.feature_groups) || input.feature_groups.length !== 5) {
    return { ok: false, reason: `feature_groups length ${input.feature_groups?.length}` };
  }
  for (let i = 0; i < 5; i++) {
    const g = input.feature_groups[i];
    if (!g || g.group_id !== GROUP_IDS[i]) {
      return { ok: false, reason: `feature_groups[${i}] expected ${GROUP_IDS[i]}, got ${g?.group_id}` };
    }
    if (!Array.isArray(g.findings) || g.findings.length < 4 || g.findings.length > 5) {
      return { ok: false, reason: `${g.group_id} findings length ${g.findings?.length}` };
    }
    const d = g.detail;
    if (!d) return { ok: false, reason: `${g.group_id} missing detail` };
    if (!PRIORITY_LEVELS.includes(d.priorityLevel)) {
      return { ok: false, reason: `${g.group_id} bad priorityLevel` };
    }
    if (!Array.isArray(d.atHomeActions) || d.atHomeActions.length < 4 || d.atHomeActions.length > 5) {
      return { ok: false, reason: `${g.group_id} atHomeActions length ${d.atHomeActions?.length}` };
    }
    if (!Array.isArray(d.productCategories)) {
      return { ok: false, reason: `${g.group_id} productCategories not array` };
    }
    if (d.treatmentRelevance !== null && typeof d.treatmentRelevance !== "string") {
      return { ok: false, reason: `${g.group_id} treatmentRelevance type` };
    }
  }

  return { ok: true };
}

// ---------- Anthropic call ----------
async function callAnthropicOnce(prompt: string, apiKey: string): Promise<ReportContent> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      tools: [GENERATE_QINO_REPORT_TOOL],
      tool_choice: { type: "tool", name: "generate_qino_report" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`anthropic_http_${res.status}: ${text.slice(0, 300)}`);
  }

  const payload = await res.json();
  const content: any[] = Array.isArray(payload?.content) ? payload.content : [];
  const toolBlock = content.find(
    (b) => b?.type === "tool_use" && b?.name === "generate_qino_report"
  );
  if (!toolBlock) {
    throw new Error("no_tool_use_block");
  }
  const input = toolBlock.input;
  const v = validateReportContent(input);
  if (!v.ok) {
    throw new Error(`validation_failed: ${v.reason}`);
  }
  return input as ReportContent;
}

async function generateReportFromLLM(
  onboardingAnswers: Record<string, any>,
  _userId: string
): Promise<ReportContent> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  const prompt = buildPrompt(onboardingAnswers);

  try {
    return await callAnthropicOnce(prompt, apiKey);
  } catch (err1) {
    const reason1 = err1 instanceof Error ? err1.message : String(err1);
    console.error("[generate-analysis] LLM attempt 1 failed:", reason1);
    try {
      return await callAnthropicOnce(prompt, apiKey);
    } catch (err2) {
      const reason2 = err2 instanceof Error ? err2.message : String(err2);
      console.error("[generate-analysis] LLM attempt 2 failed:", reason2);
      throw new Error(`LLM_FAILED: ${reason2}`);
    }
  }
}

// ---------- Handler ----------
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  let scanSessionId: string | null = null;
  let analysisReportId: string | null = null;

  try {
    let body: { scan_session_id?: unknown };
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "scan_session_id required" });
    }

    if (
      typeof body?.scan_session_id !== "string" ||
      body.scan_session_id.trim().length === 0
    ) {
      return json(400, { error: "scan_session_id required" });
    }
    scanSessionId = body.scan_session_id.trim();

    // Look up scan session
    const { data: session, error: sessionErr } = await supabase
      .from("scan_sessions")
      .select("id, user_id, status")
      .eq("id", scanSessionId)
      .maybeSingle();

    if (sessionErr) throw sessionErr;
    if (!session) {
      return json(404, { error: "scan session not found" });
    }

    const userId: string = session.user_id;

    // Mark scan session as processing
    await supabase
      .from("scan_sessions")
      .update({ status: "processing" })
      .eq("id", scanSessionId);

    // Fetch onboarding answers (full row)
    const { data: onboardingAnswers, error: ansErr } = await supabase
      .from("onboarding_answers")
      .select("goals, personalization, comfort, budget, routine, body, skin, hair")
      .eq("user_id", userId)
      .maybeSingle();

    if (ansErr) throw ansErr;
    if (!onboardingAnswers) {
      return json(422, { error: "onboarding answers not found for user" });
    }

    // Generate report via Claude Sonnet (with one retry, hard-fail otherwise)
    const report = await generateReportFromLLM(onboardingAnswers as any, userId);

    // Insert analysis_reports row (status: generating)
    const { data: inserted, error: reportErr } = await supabase
      .from("analysis_reports")
      .insert({
        user_id: userId,
        scan_session_id: scanSessionId,
        status: "generating",
        headline: report.headline,
        insight: report.insight,
        current_phase: report.current_phase as unknown as Json,
        scores: report.scores as unknown as Json,
        strengths: report.strengths as unknown as Json,
        opportunities: report.opportunities as unknown as Json,
        priorities: report.priorities as unknown as Json,
      })
      .select("id")
      .single();

    if (reportErr) throw reportErr;
    analysisReportId = inserted.id;

    // Insert feature_findings
    const featureRows = report.feature_groups.map((g, idx) => ({
      analysis_report_id: analysisReportId,
      group_id: g.group_id,
      title: g.title,
      icon_key: g.icon_key,
      accent_key: g.accent_key,
      findings: g.findings as unknown as Json,
      detail: g.detail as unknown as Json,
      sort_order: idx,
    }));
    const { error: ffErr } = await supabase
      .from("feature_findings")
      .insert(featureRows);
    if (ffErr) throw ffErr;

    // Insert priority_items
    const priorityRows: Array<{
      analysis_report_id: string;
      priority_level: string;
      title: string;
      sort_order: number;
    }> = [];
    let order = 0;
    for (const lvl of ["high", "medium", "low"] as const) {
      for (const title of report.priorities[lvl]) {
        priorityRows.push({
          analysis_report_id: analysisReportId!,
          priority_level: lvl,
          title,
          sort_order: order++,
        });
      }
    }
    const { error: piErr } = await supabase
      .from("priority_items")
      .insert(priorityRows);
    if (piErr) throw piErr;

    // Mark report complete
    const completedAt = new Date().toISOString();
    const { error: updateErr } = await supabase
      .from("analysis_reports")
      .update({ status: "complete", completed_at: completedAt })
      .eq("id", analysisReportId);
    if (updateErr) throw updateErr;

    // Mark scan session complete
    await supabase
      .from("scan_sessions")
      .update({ status: "complete", completed_at: completedAt })
      .eq("id", scanSessionId);

    return json(200, {
      analysis_report_id: analysisReportId,
      status: "complete",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate-analysis] error:", message, err);

    // Best-effort failure cleanup
    if (scanSessionId) {
      try {
        await supabase
          .from("scan_sessions")
          .update({ status: "failed" })
          .eq("id", scanSessionId);
      } catch (e) {
        console.error("[generate-analysis] failed to mark session failed:", e);
      }
    }
    if (analysisReportId) {
      try {
        await supabase
          .from("analysis_reports")
          .update({ status: "failed" })
          .eq("id", analysisReportId);
      } catch (e) {
        console.error("[generate-analysis] failed to mark report failed:", e);
      }
    }

    return json(503, {
      error: "high_demand",
      message:
        "QINO is experiencing exceptionally high demand right now. Please try again in a few minutes.",
      user_friendly: true,
    });
  }
});

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
