// =====================================================================
// QINO — Observability bootstrap (client-only)
// Initializes Sentry + PostHog once on the client. Mounted from the
// root layout via useEffect so SSR is unaffected.
// =====================================================================

import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { SENTRY_DSN, isRealValue } from "../config/observability";
import { initPostHog } from "../lib/analytics";

let sentryInitialized = false;

export const initSentry = () => {
  if (sentryInitialized) return;
  if (typeof window === "undefined") return;
  if (!isRealValue(SENTRY_DSN)) return;
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
    sentryInitialized = true;
  } catch (e) {
    console.warn("[observability] Sentry init failed:", e);
  }
};

export const ObservabilityBootstrap = () => {
  useEffect(() => {
    initSentry();
    initPostHog();
  }, []);
  return null;
};
