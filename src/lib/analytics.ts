// =====================================================================
// QINO — Analytics helper (PostHog wrapper)
// Thin shim so business code can call `track("event")` without caring
// whether PostHog is initialized (e.g. in dev / SSR / placeholder mode).
//
// PRIVACY-TODO: before public launch, add a cookie consent banner and
// gate `posthog.init` behind explicit consent. Today autocapture runs
// without explicit consent — acceptable for invite-only / test users.
// =====================================================================

import posthog from "posthog-js";
import { POSTHOG_HOST, POSTHOG_PROJECT_KEY, isRealValue } from "../config/observability";

let initialized = false;

export const initPostHog = () => {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!isRealValue(POSTHOG_PROJECT_KEY)) return;

  try {
    posthog.init(POSTHOG_PROJECT_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "[data-sensitive]",
      },
      autocapture: {
        dom_event_allowlist: ["click", "submit"],
        element_allowlist: ["a", "button", "input"],
      },
      loaded: () => {
        initialized = true;
      },
    });
    initialized = true;
  } catch (e) {
    console.warn("[analytics] PostHog init failed:", e);
  }
};

export const isReady = () => initialized;

export const identify = (
  distinctId: string,
  properties?: Record<string, unknown>
) => {
  if (!initialized) return;
  try {
    posthog.identify(distinctId, properties);
  } catch (e) {
    console.warn("[analytics] identify failed:", e);
  }
};

export const reset = () => {
  if (!initialized) return;
  try {
    posthog.reset();
  } catch (e) {
    console.warn("[analytics] reset failed:", e);
  }
};

export const track = (event: string, properties?: Record<string, unknown>) => {
  if (!initialized) return;
  try {
    posthog.capture(event, properties);
  } catch (e) {
    console.warn("[analytics] capture failed:", event, e);
  }
};
