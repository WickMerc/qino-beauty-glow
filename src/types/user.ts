// =====================================================================
// QINO — User-related types
// These define the contract for user identity and app-wide user state.
// =====================================================================

export interface UserProfile {
  id: string;
  name: string;
  initial: string;          // single letter for avatar bubble
  email?: string;
  createdAt?: string;       // ISO date string
}

/**
 * Tracks where the user is in the QINO journey.
 * Drives which dashboard variant renders.
 */
export type AppStage =
  | "onboarding"
  | "prescan"
  | "scanning"
  | "processing"
  | "report"
  | "complete";

export type ScanStatus = "not_started" | "in_progress" | "completed" | "needs_retake";

/**
 * Subscription tier for monetization gating.
 * - free: post-scan with no card, can read report + locked previews
 * - trial: 3-day free trial, card on file, full access
 * - active: paid, full access
 * - expired: trial ended without conversion, downgraded to free
 * - cancelled: paid cancelled, retains access until period ends
 */
export type SubscriptionStatus = "free" | "trial" | "active" | "expired" | "cancelled";

export interface AppUserState {
  profile: UserProfile;
  stage: AppStage;
  scanStatus: ScanStatus;
  subscriptionStatus: SubscriptionStatus;
  /** ISO date string when trial ends, null if not on trial. */
  trialEndsAt: string | null;
  onboardingCompleted: boolean;
  reportGenerated: boolean;
}
