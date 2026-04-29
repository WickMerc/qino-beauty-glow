// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point: GET /api/me  →  UserProfile
// =====================================================================

import type { UserProfile, AppUserState } from "../types";

export const mockUser: UserProfile = {
  id: "user_mock_1",
  name: "Hadley",
  initial: "H",
  email: "hadley@example.com",
  createdAt: "2025-04-17T08:00:00.000Z",
};

export const mockAppUserState: AppUserState = {
  profile: mockUser,
  stage: "complete",
  scanStatus: "completed",
  subscriptionStatus: "free",
  trialEndsAt: null,
  onboardingCompleted: true,
  reportGenerated: true,
};
