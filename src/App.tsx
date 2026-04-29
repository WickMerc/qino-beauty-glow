// =====================================================================
// QINO — Top-level App
// Orchestrates the full user journey:
//   onboarding → post-onboarding (pre-scan / scan / processing / report) → dashboard
//
// State machine is local for now. Backend replacement point:
//   Replace `useState<AppStage>` with a hook that derives stage from
//   user.onboardingCompleted, scan_session.status, and analysis_reports.
// =====================================================================

import { useState } from "react";
import type { AppStage } from "./types";
import { mockUser } from "./data";
import { palette, fonts } from "./theme";

import { OnboardingFlow } from "./screens/onboarding/OnboardingFlow";
import { PostOnboardingFlow, type PostOnboardingStage } from "./screens/post-onboarding/PostOnboardingFlow";
import Dashboard from "./Dashboard";

/**
 * Used to decide which post-onboarding stage to start in:
 *  - "scan"      → user clicked "Start scan now" at end of onboarding
 *  - "prescan"   → user clicked "Go to dashboard" (defer scan)
 *  - "complete"  → already done (e.g. returning user)
 */
type EntryStage = Extract<PostOnboardingStage, "scan" | "prescan" | "complete">;

export default function App() {
  // Top-level stage of the journey. In real backend this comes from the user record.
  const [stage, setStage] = useState<AppStage>("onboarding");
  const [postEntryStage, setPostEntryStage] = useState<EntryStage>("prescan");

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { -webkit-font-smoothing: antialiased; background: ${palette.ivory}; }
      `}</style>

      {stage === "onboarding" && (
        <OnboardingFlow
          onClose={() => {
            // User dismissed onboarding mid-flow → drop them on dashboard for now.
            // Real implementation: persist progress, show "Resume onboarding" CTA.
            setStage("complete");
          }}
          onComplete={(result) => {
            setPostEntryStage(result.startScan ? "scan" : "prescan");
            setStage("prescan");
          }}
        />
      )}

      {(stage === "prescan" ||
        stage === "scanning" ||
        stage === "processing" ||
        stage === "report") && (
        <PostOnboardingFlow
          user={mockUser}
          initialStage={postEntryStage}
          onComplete={() => setStage("complete")}
        />
      )}

      {stage === "complete" && <Dashboard />}
    </div>
  );
}
