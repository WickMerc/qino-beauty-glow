// =====================================================================
// QINO — Top-level App
// Orchestrates the full user journey:
//   onboarding → post-onboarding (pre-scan / scan / processing / report) → dashboard
//
// Iteration 6B: onboarding answers persist to Supabase on completion.
// User profile is hydrated from Supabase via useQinoData (with mock fallback).
// =====================================================================

import { useState } from "react";
import type { AppStage } from "./types";
import { saveOnboardingAnswers } from "./data/qinoApi";
import { useQinoData } from "./data/useQinoData";
import { palette, fonts } from "./theme";

import { OnboardingFlow } from "./screens/onboarding/OnboardingFlow";
import { PostOnboardingFlow, type PostOnboardingStage } from "./screens/post-onboarding/PostOnboardingFlow";
import Dashboard from "./Dashboard";

type EntryStage = Extract<PostOnboardingStage, "scan" | "prescan" | "complete">;

export default function App() {
  const [stage, setStage] = useState<AppStage>("onboarding");
  const [postEntryStage, setPostEntryStage] = useState<EntryStage>("prescan");
  const { data } = useQinoData();

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
            // For prototype: closing onboarding mid-flow keeps them in onboarding.
            // Real implementation: persist progress, allow exit, show "Resume onboarding"
            // CTA when they reopen the app. Per QINO's design, the user has no app
            // access until a scan is completed — so closing should not unlock anything.
          }}
          onComplete={async (result) => {
            // Fire-and-forget save to Supabase. Failure does not block the user
            // since mock data still drives the UI for now.
            saveOnboardingAnswers(result.answers).catch((err) =>
              console.warn("[App] saveOnboardingAnswers failed:", err)
            );
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
          user={data.user}
          initialStage={postEntryStage}
          onComplete={() => setStage("complete")}
        />
      )}

      {stage === "complete" && <Dashboard />}
    </div>
  );
}
