// =====================================================================
// QINO — Frontend observability config
// Public values inlined here (DSNs and PostHog project keys are designed
// to be public, like the Supabase publishable key in .env). Do NOT put
// service-role keys, Sentry auth tokens, or Stripe secrets in this file.
// =====================================================================

export const SENTRY_DSN =
  "https://690a34ec8acd40c71da33107fea4b139@o4511308814483456.ingest.us.sentry.io/4511308822085632";

export const POSTHOG_PROJECT_KEY = "phc_nF8HgbH5fF3XPBoCjx83hKLjPX2pqpvTBwdxiGxSf9Au";
export const POSTHOG_HOST = "https://us.i.posthog.com";

/** Heuristic: real keys never start with "phc_xxxxx" or contain "paste". */
export const isRealValue = (v: string | undefined | null): boolean => {
  if (!v) return false;
  const s = String(v);
  if (s.length < 12) return false;
  if (s.includes("xxxxx") || s.toLowerCase().includes("paste")) return false;
  return true;
};
