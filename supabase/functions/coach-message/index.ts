// =====================================================================
// QINO — coach-message Edge Function (iteration 8B)
// Streams a Claude Haiku response grounded in the user's analysis report
// + onboarding profile + recent chat history. Persists both sides of
// the conversation to coach_messages.
// =====================================================================

// @ts-ignore - Deno remote import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
// @ts-ignore - npm import via Deno
import * as Sentry from "npm:@sentry/deno";

declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const SENTRY_DSN_VAL = Deno.env.get("SENTRY_DSN");
if (SENTRY_DSN_VAL) {
  try {
    Sentry.init({ dsn: SENTRY_DSN_VAL, tracesSampleRate: 0.1, environment: "edge-function" });
  } catch (e) {
    console.warn("[coach-message] Sentry init failed:", e);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RATE_LIMIT_PER_24H = 100;
const HISTORY_WINDOW = 6;
const MODEL = "claude-haiku-4-5";

// ---------- System prompt ----------
function fmtList(arr: unknown): string {
  if (!Array.isArray(arr) || arr.length === 0) return "none";
  return arr.map((x) => String(x)).join(", ");
}
function fmtVal(v: unknown): string {
  if (v === null || v === undefined || v === "") return "none";
  return String(v);
}

function buildSystemPrompt(
  report: any,
  findings: any[],
  priorities: any[],
  answers: any
): string {
  const cp = report?.current_phase ?? {};
  const scores: any[] = Array.isArray(report?.scores) ? report.scores : [];
  const strengths: any[] = Array.isArray(report?.strengths) ? report.strengths : [];
  const opportunities: any[] = Array.isArray(report?.opportunities)
    ? report.opportunities
    : [];
  const pri = report?.priorities ?? { high: [], medium: [], low: [] };

  const scoresStr = scores
    .map((s) => `- ${s.label}: ${s.value}/100 (${s.statusLabel})`)
    .join("\n");
  const strengthsStr = strengths
    .map((s) => `- ${s.label} — ${s.sub}`)
    .join("\n");
  const opportunitiesStr = opportunities
    .map((o) => `- ${o.label} (${o.impact} impact) — ${o.sub}`)
    .join("\n");

  const featureStr = findings
    .map((g) => {
      const findingsArr = Array.isArray(g.findings) ? g.findings : [];
      const findingsLine = findingsArr
        .map((f: any) => `${f.label}: ${f.value}`)
        .join(", ");
      const detail = g.detail ?? {};
      const cats = Array.isArray(detail.productCategories)
        ? detail.productCategories.join(", ")
        : "none";
      const treatment = detail.treatmentRelevance ?? "none";
      return `${g.title} (priority: ${detail.priorityLevel ?? "unknown"}):
  Findings: ${findingsLine}
  Why it matters: ${detail.whyItMatters ?? ""}
  Relevant product categories: ${cats}
  Treatment relevance: ${treatment}`;
    })
    .join("\n\n");

  const hair = answers?.hair ?? {};

  return `You are QINO Coach — a premium AI facial aesthetics coach grounded in this user's analysis report and onboarding profile.

CRITICAL GROUNDING RULES:
1. Only answer questions that map to the user's actual report, protocol, products, or pathways. If asked about something outside that scope, redirect gracefully — never refuse harshly.
2. If asked about a treatment path the user opted out of (e.g. asks about filler when comfort doesn't include "injectables"), explain that it's not in their pathway and offer the closest in-scope alternative.
3. Reference specific findings from their report when relevant (their actual scores, priorities, feature findings).
4. Use safe educational language only. Never claim QINO can diagnose. Never say the user "needs" surgery, injections, or any medical procedure. Phrases like "worth discussing with a qualified professional" and "potential pathway" are good. Never make medical claims.
5. Tone: premium, intelligent, calm, confident, gender-neutral, direct, aspirational. No cheap beauty-app energy. Never sycophantic.

RESPONSE LENGTH:
- Default: 2-3 sentences. Mobile-native concise replies.
- Longer replies (one short paragraph) only when the question genuinely requires nuance — e.g. explaining why something is a priority, or comparing two options the user mentioned.
- Use bullet lists only for explicit list questions ("what products...?", "what steps...?").
- Never use headers, never use bold for emphasis. Plain prose.

OFF-TOPIC HANDLING:
If the user asks something unrelated to their facial aesthetics protocol (weather, general life advice, etc.), gracefully redirect: "I'm focused on helping you execute your QINO protocol — try asking me about your priorities, products, or pathways."

USER REPORT:
Headline: ${fmtVal(report?.headline)}
Insight: ${fmtVal(report?.insight)}
Current phase: ${fmtVal(cp.name)} — ${fmtVal(cp.mainFocus)}
Phase explanation: ${fmtVal(cp.explanation)}

Scores:
${scoresStr || "(none)"}

Top strengths:
${strengthsStr || "(none)"}

Top opportunities:
${opportunitiesStr || "(none)"}

Priority map:
- High: ${fmtList(pri.high)}
- Medium: ${fmtList(pri.medium)}
- Low: ${fmtList(pri.low)}

Feature breakdown:
${featureStr || "(none)"}

USER ONBOARDING:
Goals: ${fmtList(answers?.goals)}
Comfort level (treatment paths user is open to): ${fmtList(answers?.comfort)}
Budget: ${fmtVal(answers?.budget)}
Routine commitment: ${fmtVal(answers?.routine)}
Skin concerns: ${fmtList(answers?.skin)}
Hair: hairline ${fmtVal(hair.hairline)}, density ${fmtVal(hair.density)}, style goal "${fmtVal(hair.styleGoal)}"`;
}

// ---------- Helpers ----------
function sseEvent(obj: unknown): string {
  return `data: ${JSON.stringify(obj)}\n\n`;
}

function jsonResponse(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ---------- Handler ----------
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // ----- Manual JWT validation -----
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";
  if (!token) {
    return jsonResponse(401, { error: "unauthorized" });
  }
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return jsonResponse(401, { error: "unauthorized" });
  }
  const userId = userData.user.id;

  // ----- Parse + validate body -----
  let body: { message?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  if (typeof body?.message !== "string" || body.message.trim().length === 0) {
    return jsonResponse(400, { error: "message required" });
  }

  const userMessage = body.message.trim().slice(0, 4000); // hard cap

  if (!anthropicKey) {
    return jsonResponse(500, { error: "ANTHROPIC_API_KEY not configured" });
  }

  // ----- Fetch latest complete analysis report -----
  const { data: report, error: reportErr } = await supabase
    .from("analysis_reports")
    .select(
      "id, headline, insight, current_phase, scores, strengths, opportunities, priorities"
    )
    .eq("user_id", userId)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reportErr) {
    console.error("[coach-message] report fetch error:", reportErr.message);
    return jsonResponse(500, { error: "internal_error" });
  }
  if (!report) {
    return jsonResponse(422, {
      error: "no_report",
      message: "Complete your scan to start chatting with QINO Coach.",
    });
  }

  // ----- Fetch findings + priorities for that report (parallel) -----
  const [findingsRes, prioritiesRes, answersRes] = await Promise.all([
    supabase
      .from("feature_findings")
      .select("group_id, title, findings, detail, sort_order")
      .eq("analysis_report_id", report.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("priority_items")
      .select("title, priority_level, sort_order")
      .eq("analysis_report_id", report.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("onboarding_answers")
      .select("goals, comfort, budget, routine, skin, hair")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (answersRes.error) {
    console.error("[coach-message] onboarding fetch error:", answersRes.error.message);
    return jsonResponse(500, { error: "internal_error" });
  }
  if (!answersRes.data) {
    return jsonResponse(422, {
      error: "no_report",
      message: "Complete your scan to start chatting with QINO Coach.",
    });
  }

  const findings = findingsRes.data ?? [];
  const priorities = prioritiesRes.data ?? [];

  // ----- Rate limit (last 24h) -----
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recentCount, error: countErr } = await supabase
    .from("coach_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gt("created_at", since);

  if (countErr) {
    console.error("[coach-message] rate-limit count error:", countErr.message);
  } else if ((recentCount ?? 0) >= RATE_LIMIT_PER_24H) {
    return jsonResponse(429, {
      error: "rate_limit",
      message: "You've reached today's chat limit. Resets in 24 hours.",
    });
  }

  // ----- Fetch last 6 messages of history (oldest first) -----
  const { data: historyDesc, error: historyErr } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_WINDOW);

  if (historyErr) {
    console.error("[coach-message] history fetch error:", historyErr.message);
  }
  const history = (historyDesc ?? []).slice().reverse();

  // ----- Persist the new user message immediately -----
  const { error: insertUserErr } = await supabase
    .from("coach_messages")
    .insert({ user_id: userId, role: "user", content: userMessage });

  if (insertUserErr) {
    console.error("[coach-message] insert user msg error:", insertUserErr.message);
    return jsonResponse(500, { error: "internal_error" });
  }

  // ----- Build Anthropic request -----
  const systemPrompt = buildSystemPrompt(
    report as any,
    findings as any[],
    priorities as any[],
    answersRes.data
  );

  const anthropicMessages = [
    ...history.map((m: any) => ({
      role: m.role === "qino" ? "assistant" : "user",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  // ----- Stream Anthropic response back as SSE -----
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullText = "";

      try {
        const upstream = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 600,
            stream: true,
            system: systemPrompt,
            messages: anthropicMessages,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const errText = await upstream.text().catch(() => "");
          console.error(
            "[coach-message] anthropic non-ok:",
            upstream.status,
            errText.slice(0, 300)
          );
          controller.enqueue(
            encoder.encode(
              sseEvent({
                type: "error",
                message: "QINO Coach is briefly unavailable. Please try again.",
              })
            )
          );
          controller.close();
          return;
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Anthropic sends SSE: lines starting with "data: "
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload) continue;
            let evt: any;
            try {
              evt = JSON.parse(payload);
            } catch {
              continue;
            }
            if (
              evt?.type === "content_block_delta" &&
              evt?.delta?.type === "text_delta" &&
              typeof evt.delta.text === "string"
            ) {
              const text: string = evt.delta.text;
              fullText += text;
              controller.enqueue(
                encoder.encode(sseEvent({ type: "delta", text }))
              );
            }
            // Other event types (message_start, message_stop, ping) ignored.
          }
        }

        // Persist assistant reply
        const { data: insertedReply, error: insertReplyErr } = await supabase
          .from("coach_messages")
          .insert({ user_id: userId, role: "qino", content: fullText })
          .select("id")
          .single();

        if (insertReplyErr) {
          console.error(
            "[coach-message] insert reply error:",
            insertReplyErr.message
          );
          controller.enqueue(
            encoder.encode(
              sseEvent({
                type: "error",
                message: "QINO Coach is briefly unavailable. Please try again.",
              })
            )
          );
          controller.close();
          return;
        }

        controller.enqueue(
          encoder.encode(
            sseEvent({ type: "done", message_id: insertedReply.id })
          )
        );
        controller.close();
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        console.error("[coach-message] stream error:", reason);
        try {
          controller.enqueue(
            encoder.encode(
              sseEvent({
                type: "error",
                message: "QINO Coach is briefly unavailable. Please try again.",
              })
            )
          );
        } catch {
          // already closed
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
});
