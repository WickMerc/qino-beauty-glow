## Iteration 8A — Real Claude Sonnet analysis pipeline

Scope: replace `buildBaseReport()` in the Edge Function with a real Anthropic Claude call (tool-use for structured output). No DB schema changes. No Coach changes. No frontend changes except 4 message strings. Response shape unchanged on success.

---

### Blocker before implementation: ANTHROPIC_API_KEY

I cannot add a Supabase secret without the value. Please provide the Anthropic API key (`sk-ant-...`) and I'll register it as `ANTHROPIC_API_KEY` via `add_secret` as the first step. Everything else proceeds only after the secret is set.

---

### Step 1 — Edge Function rewrite (`supabase/functions/generate-analysis/index.ts`)

Keep entirely unchanged:
- CORS headers, `Deno.serve` entrypoint, `json()` helper
- Request parsing + `scan_session_id` validation
- `scan_sessions` lookup, `processing` transition
- `onboarding_answers` existence check (extended below to actually fetch the row)
- All DB writes: `analysis_reports` insert (same columns), `feature_findings` insert (same columns), `priority_items` insert (same columns)
- `complete` status transitions on both `analysis_reports` and `scan_sessions`
- Existing `catch` block that marks scan_session and analysis_report as `failed`
- The `ReportContent` TypeScript interface (the contract for downstream writes)
- Success response shape: `{ analysis_report_id, status: "complete" }`

Change:
- Extend the onboarding lookup from a HEAD/count query to a `.select("goals, personalization, comfort, budget, routine, body, skin, hair").eq("user_id", userId).maybeSingle()`. If null → return existing 422 path.
- Replace `const report = buildBaseReport();` with `const report = await generateReportFromLLM(onboardingAnswers, userId);`
- Delete `buildBaseReport()`.
- On uncaught error in the `catch` block, return **HTTP 503** with body `{ error: "high_demand", message: "QINO is experiencing exceptionally high demand right now. Please try again in a few minutes.", user_friendly: true }` (instead of the current 500 / `{ error: message }`). Failure cleanup writes (mark session/report as `failed`) stay exactly as they are.

### Step 2 — `generateReportFromLLM(onboardingAnswers, userId)`

New helper inside the same file. Flow:

1. Build a single user-message prompt string per the spec in Step 5 of the brief, interpolating onboarding fields (goals, personalization.gender, personalization.direction, comfort, budget, routine, skin, hair.hairline / density / styleGoal, body.height / weight / target / composition). Empty/null values render as `"none"` to keep the prompt stable.
2. Call `https://api.anthropic.com/v1/messages` with:
   - Headers: `x-api-key: ANTHROPIC_API_KEY`, `anthropic-version: 2023-06-01`, `content-type: application/json`
   - Body: `model: "claude-sonnet-4-6"`, `max_tokens: 8000`, `tool_choice: { type: "tool", name: "generate_qino_report" }`, `tools: [GENERATE_QINO_REPORT_TOOL]`, `messages: [{ role: "user", content: prompt }]`
3. Locate the `content[]` entry where `type === "tool_use"` and `name === "generate_qino_report"`; extract `.input` as the candidate `ReportContent`.
4. Validate shape with `validateReportContent(input)` — checks: required fields present; `scores.length === 4` and ids exactly `["symmetry","skin_quality","structure","grooming_frame"]`; `strengths.length === 4`; `opportunities.length === 4`; `priorities.high/medium/low.length === 3`; `feature_groups.length === 5` and group_ids in exact order `["facial_structure","jaw_chin_neck","skin","hair_frame","eyes_nose_lips"]`; each group has 4–5 findings; enum values for status / impact / priorityLevel / accent / icon / product categories.
5. Retry policy: any of (non-2xx response, network error, no `tool_use` block, validation failure) triggers exactly **one** retry of the same request. If second attempt also fails → `throw new Error("LLM_FAILED: <reason>")` which propagates to the existing `catch`, triggering the 503 response and failure cleanup.
6. Log all failures with `console.error("[generate-analysis] LLM ...", reason)` so they appear in edge function logs.

### Step 3 — Tool schema (`GENERATE_QINO_REPORT_TOOL`)

JSON Schema with `additionalProperties: false`, every field `required`, enums for: status, impact, priorityLevel, colorAccent, bgAccent, accentKey (strengths/opportunities/feature_groups), iconKey, group_id, productCategories items. Mirrors the existing `ReportContent` interface and the spec in Step 4 of the brief exactly. `current_phase.name` is a free string (the prompt instructs "Foundation Phase").

### Step 4 — Frontend: `src/screens/post-onboarding/ProcessingDashboard.tsx`

Update the 4 strings inside the `showFailure` block only:

| Case | Old | New |
|---|---|---|
| `failed` headline | "We hit a problem generating your report" | "QINO is experiencing high demand right now" |
| `failed` body | "Please try submitting your scan again." | "Thanks for your patience — please try submitting your scan again in a few minutes." |
| `timeout` headline | "This is taking longer than expected" | "We're processing a lot of scans right now" |
| `timeout` body | "Your scan is still processing in the background. You can return shortly." | "Your scan is still in our queue. You can return shortly to see your report." |

No other frontend changes. The existing `pollAnalysisStatus` already maps `failed` correctly; the 503 returned by the function results in `supabase.functions.invoke` returning an error, but the polling loop is what drives the UI state via the `analysis_reports.status = 'failed'` row written by the catch block — so no `qinoApi.ts` changes needed.

### Step 5 — Deploy + verify

1. Deploy `generate-analysis` via `deploy_edge_functions`.
2. Trigger a scan from the preview (existing `user_mock_1`) and wait for processing to finish.
3. Run the verification query and report:
   ```sql
   SELECT id, status, headline, insight, completed_at
   FROM analysis_reports
   WHERE user_id = 'user_mock_1'
   ORDER BY created_at DESC LIMIT 1;
   ```
4. Inspect headline + insight for personalization vs. the user's onboarding answers, and report any console/edge-function warnings tagged `[qinoApi]`, `[PostOnboardingFlow]`, or `[generate-analysis]`.

---

### Out of scope (explicit)
- DB schema, RLS, auth, Coach, mock data, response success shape, qinoApi.ts, any other frontend file.

### Risks / notes
- Claude tool-use occasionally returns extra fields; `additionalProperties: false` + validator handles this with a single retry.
- `claude-sonnet-4-6` model id is used as specified; if Anthropic rejects it, the failure surfaces as the 503 high-demand message and I'll flag it.
- 60s polling timeout on the frontend is unchanged; Sonnet typically responds in 5–20s for an 8k-token tool call, well within budget.
