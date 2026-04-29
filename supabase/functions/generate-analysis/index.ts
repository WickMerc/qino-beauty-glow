// =====================================================================
// QINO — generate-analysis Edge Function (iteration 7A)
// Generates a mock analysis report for a scan session.
// Will be replaced by a real LLM call in a later iteration.
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

// ---------- Base content ----------
function buildBaseReport(): ReportContent {
  return {
    headline: "Lower-face definition is priority #1",
    insight:
      "Your strongest gains will come from improving lower-face definition, skin consistency, and grooming frame before chasing advanced refinements.",
    current_phase: {
      name: "Foundation Phase",
      mainFocus: "Lower-face definition + skin clarity",
      explanation:
        "Your highest-impact path is improving facial softness, skin consistency, and grooming frame before moving into advanced refinements.",
    },
    scores: [
      { id: "symmetry", label: "Symmetry", value: 86, status: "good", statusLabel: "Good", colorAccent: "mistAccent", bgAccent: "paleBlue" },
      { id: "skin_quality", label: "Skin Quality", value: 72, status: "fair", statusLabel: "Fair", colorAccent: "peachAccent", bgAccent: "softPeach" },
      { id: "structure", label: "Structure", value: 78, status: "good", statusLabel: "Good", colorAccent: "midnight", bgAccent: "softLavender" },
      { id: "grooming_frame", label: "Grooming Frame", value: 81, status: "good", statusLabel: "Good", colorAccent: "sageAccent", bgAccent: "softSage" },
    ],
    strengths: [
      { id: "strength_1", label: "High symmetry", sub: "Above population average", iconKey: "sparkles", accentKey: "softSage" },
      { id: "strength_2", label: "Strong facial structure", sub: "Defined nose bridge reads as a focal asset", iconKey: "activity", accentKey: "paleBlue" },
      { id: "strength_3", label: "Good proportions", sub: "Balanced thirds across face", iconKey: "layers", accentKey: "softPeach" },
      { id: "strength_4", label: "Strong hair / frame potential", sub: "Density and hairline in your favor", iconKey: "scissors", accentKey: "softLavender" },
    ],
    opportunities: [
      { id: "opp_1", label: "Lower-face definition", sub: "Reduce facial softness", impact: "high", iconKey: "activity", accentKey: "softBlush" },
      { id: "opp_2", label: "Skin evenness / texture", sub: "Daily protocol leverage", impact: "high", iconKey: "droplet", accentKey: "softPeach" },
      { id: "opp_3", label: "Grooming frame", sub: "Hair shape, brow cleanup", impact: "medium", iconKey: "scissors", accentKey: "softLavender" },
      { id: "opp_4", label: "Smile brightness", sub: "Polish the lower-face frame", impact: "medium", iconKey: "heart", accentKey: "softBlush" },
    ],
    priorities: {
      high: ["Lower-face definition", "Skin evenness", "Hair framing"],
      medium: ["Smile brightness", "Brow cleanup", "Under-eye health"],
      low: ["Ear proportion", "Minor symmetry details", "Advanced procedures"],
    },
    feature_groups: [
      {
        group_id: "facial_structure",
        title: "Facial Structure",
        icon_key: "sparkles",
        accent_key: "paleBlue",
        findings: [
          { key: "face_shape", label: "Face shape", value: "Oval" },
          { key: "symmetry", label: "Symmetry", value: "High" },
          { key: "proportions", label: "Proportions", value: "High" },
          { key: "averageness", label: "Averageness", value: "Above Average" },
        ],
        detail: {
          whyItMatters:
            "Facial structure sets the baseline of how every other feature reads. Your structure is already strong — the work here is preserving it through good skin and grooming, not changing it.",
          atHomeActions: [
            "Maintain consistent sleep position to preserve symmetry",
            "Hydration to reduce day-to-day puffiness",
            "Protect skin to maintain how structure appears over time",
            "Avoid aggressive treatments that don't add value here",
          ],
          productCategories: ["spf", "moisturizer"],
          treatmentRelevance: null,
          priorityLevel: "low",
        },
      },
      {
        group_id: "jaw_chin_neck",
        title: "Jaw, Chin & Neck",
        icon_key: "activity",
        accent_key: "softBlush",
        findings: [
          { key: "jaw_definition", label: "Jaw definition", value: "Soft" },
          { key: "chin_shape", label: "Chin shape", value: "Square" },
          { key: "neck_definition", label: "Neck definition", value: "Slightly Defined" },
          { key: "submental_softness", label: "Submental softness", value: "Mild" },
        ],
        detail: {
          whyItMatters:
            "Lower-face softness is the single highest-impact area for your face. Defining the jaw and submental area will visibly sharpen your overall presentation.",
          atHomeActions: [
            "Reduce facial softness through body composition awareness",
            "Hydration and sodium awareness to limit puffiness",
            "Sleep on back when possible to reduce morning swelling",
            "Posture work — chin tucks and neck alignment",
            "Limit late-night high-sodium meals",
          ],
          productCategories: ["moisturizer", "barrier"],
          treatmentRelevance:
            "If non-surgical paths plateau, jawline contouring options may be worth discussing with a qualified professional.",
          priorityLevel: "high",
        },
      },
      {
        group_id: "skin",
        title: "Skin",
        icon_key: "droplet",
        accent_key: "softPeach",
        findings: [
          { key: "undertone", label: "Undertone", value: "Olive" },
          { key: "blemishing", label: "Blemishing", value: "Minimal" },
          { key: "evenness", label: "Evenness", value: "Slightly Uneven" },
          { key: "texture", label: "Texture", value: "Slightly Textured" },
          { key: "oiliness", label: "Oiliness", value: "Low" },
        ],
        detail: {
          whyItMatters:
            "Skin is the canvas every other feature is read against. Slightly uneven and slightly textured skin is the easiest high-leverage win in your protocol.",
          atHomeActions: [
            "Daily SPF — single highest-leverage step",
            "Gentle non-stripping cleanse morning and night",
            "Hydrating moisturizer to support barrier",
            "Slow introduction of texture serum after week two",
            "Avoid over-exfoliation — barrier first",
          ],
          productCategories: ["cleanser", "moisturizer", "spf", "texture_serum", "barrier"],
          treatmentRelevance:
            "Chemical peels or microneedling may be worth discussing with a qualified professional once your home routine is consistent.",
          priorityLevel: "high",
        },
      },
      {
        group_id: "hair_frame",
        title: "Hair & Frame",
        icon_key: "scissors",
        accent_key: "softLavender",
        findings: [
          { key: "hairline", label: "Hairline", value: "Rounded" },
          { key: "hair_density", label: "Hair density", value: "Medium" },
          { key: "hair_volume", label: "Hair volume", value: "Medium" },
          { key: "brows", label: "Brows", value: "Arched / Moderate" },
        ],
        detail: {
          whyItMatters:
            "Hair and brow framing shape the entire upper face. Small grooming adjustments often produce the most visible week-one improvement.",
          atHomeActions: [
            "Consider a sharper hairstyle that complements face shape",
            "Light brow cleanup — shape, not removal",
            "Use volume-supporting hair product for daily styling",
            "Trim regularly to maintain shape, not length",
          ],
          productCategories: ["hair", "grooming"],
          treatmentRelevance: null,
          priorityLevel: "medium",
        },
      },
      {
        group_id: "eyes_nose_lips",
        title: "Eyes, Nose & Lips",
        icon_key: "eye",
        accent_key: "softSage",
        findings: [
          { key: "eyes", label: "Eyes", value: "Almond" },
          { key: "nose", label: "Nose", value: "Straight / Strong" },
          { key: "lips", label: "Lips", value: "Full / Slightly top-heavy" },
          { key: "smile", label: "Smile", value: "Full teeth exposure" },
        ],
        detail: {
          whyItMatters:
            "These are focal features. Your nose and eyes already read well. The leverage here is in lip care, smile polish, and managing under-eye health.",
          atHomeActions: [
            "Daily lip repair to support smile presentation",
            "Sleep consistency to reduce under-eye darkness",
            "Hydration to soften under-eye shadows",
            "Whitening toothpaste over time for smile polish",
          ],
          productCategories: ["lip", "oral"],
          treatmentRelevance:
            "Teeth whitening consultation may be worth discussing with a qualified professional.",
          priorityLevel: "medium",
        },
      },
    ],
  };
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

    // Read onboarding answers
    const { data: answers, error: ansErr } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (ansErr) throw ansErr;
    if (!answers) {
      return json(422, { error: "onboarding answers not found for user" });
    }

    // Build report
    const baseReport = buildBaseReport();
    const report = applyParameterization(baseReport, answers as OnboardingAnswers);

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

    return json(500, { error: message });
  }
});

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
