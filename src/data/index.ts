// =====================================================================
// MOCK DATA — central re-exports
// Backend replacement: each named export below maps to a real API endpoint
// (see comments in the individual files for the endpoint contracts).
// =====================================================================

export { mockUser, mockAppUserState } from "./mockUser";
export {
  goalOptions,
  genderOptions,
  directionOptions,
  comfortPathOptions,
  budgetOptions,
  routineOptions,
  skinConcernOptions,
  hairlineOptions,
  densityOptions,
  facialHairOptions,
  framingOptions,
  neutralGroomingOptions,
  compositionOptions,
  emptyOnboardingAnswers,
  mockCompletedOnboarding,
  onboardingContent,
} from "./mockOnboarding";
export { mockAnalysisReport } from "./mockAnalysis";
export { mockProtocol } from "./mockProtocol";
export { mockProductStack } from "./mockProducts";
export { mockTreatmentPathways } from "./mockTreatmentPathways";
export { mockProgress } from "./mockProgress";
export { mockScanState, scanPrepChecklist } from "./mockScan";
export {
  mockCoachState,
  coachSuggestedPrompts,
  coachContext,
  QINO_COACH_FALLBACK_REPLY,
  QINO_SAFETY_NOTE,
} from "./mockCoach";
export {
  mockTodayFocus,
  mockComingUp,
  mockGreeting,
  mockLockedPreviews,
  mockScanPromises,
  mockScanMetaPills,
  preScanContent,
  processingContent,
  guidedScanContent,
  reportContent,
} from "./mockDashboard";
