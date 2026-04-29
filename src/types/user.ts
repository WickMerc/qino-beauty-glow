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

export interface AppUserState {
  profile: UserProfile;
  stage: AppStage;
  scanStatus: ScanStatus;
  onboardingCompleted: boolean;
  reportGenerated: boolean;
}
