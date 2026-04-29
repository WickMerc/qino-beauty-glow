// =====================================================================
// QINO — Subscription gating
// Centralizes which features are locked for free users vs paid/trial.
//
// Free tier (no card) gets:
//   - Full analysis report
//   - Priority map
//   - Feature group detail screens (read-only)
//   - "What to ignore" list
//
// Locked behind 3-day trial (card required) / paid:
//   - Daily protocol with checkable tasks
//   - Product stack
//   - Treatment pathways
//   - Coach
//   - Progress tracking + monthly photo uploads
//   - Re-analysis
//
// BACKEND REPLACEMENT POINT:
//   Replace `useSubscription()` with a hook that reads from /api/me
//   → returns the user's real SubscriptionStatus.
// =====================================================================

import { useState, useCallback } from "react";
import type { SubscriptionStatus } from "../types";

/**
 * Feature ids used throughout the app for gating decisions.
 * Add new ids here when introducing a new gated feature.
 */
export type GatedFeature =
  | "coach"
  | "daily_protocol"
  | "product_stack"
  | "treatment_pathways"
  | "progress_tracking"
  | "monthly_upload"
  | "reanalysis";

/**
 * Tiers that have full access. Trial and active see no locks.
 * Cancelled retains access until period ends (handled at backend).
 */
const PAID_STATUSES: SubscriptionStatus[] = ["trial", "active", "cancelled"];

export interface SubscriptionState {
  status: SubscriptionStatus;
  isPaid: boolean;
  trialEndsAt: string | null;

  /** True if the feature is locked for the current user. */
  isLocked: (feature: GatedFeature) => boolean;

  /** True if the user can access the feature. */
  canAccess: (feature: GatedFeature) => boolean;

  /** Programmatically flip status. Used by the prototype paywall stub. */
  setStatus: (s: SubscriptionStatus) => void;
}

/**
 * Hook that exposes the current user's subscription state and gating helpers.
 * Mock-first: status is local React state. Real version reads from /api/me.
 */
export const useSubscription = (
  initial: SubscriptionStatus = "free",
  initialTrialEnd: string | null = null
): SubscriptionState => {
  const [status, setStatus] = useState<SubscriptionStatus>(initial);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(initialTrialEnd);

  const isPaid = PAID_STATUSES.includes(status);

  const isLocked = useCallback(
    (_feature: GatedFeature) => !isPaid,
    [isPaid]
  );
  const canAccess = useCallback(
    (_feature: GatedFeature) => isPaid,
    [isPaid]
  );

  const setStatusWrapper = useCallback((s: SubscriptionStatus) => {
    setStatus(s);
    if (s === "trial") {
      // Mock 3-day trial end
      const ends = new Date();
      ends.setDate(ends.getDate() + 3);
      setTrialEndsAt(ends.toISOString());
    } else if (s === "free" || s === "expired") {
      setTrialEndsAt(null);
    }
  }, []);

  return {
    status,
    isPaid,
    trialEndsAt,
    isLocked,
    canAccess,
    setStatus: setStatusWrapper,
  };
};
