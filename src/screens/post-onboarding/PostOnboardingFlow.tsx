// =====================================================================
// QINO — Post-onboarding state machine
// Coordinates the 4 states between onboarding and the live dashboard.
//
// States: prescan → scan → processing → report → complete
// On "complete", parent should swap in the live dashboard (App.tsx).
// =====================================================================

import { useState } from "react";
import type { UserProfile } from "../../types";
import {
  mockAnalysisReport,
  mockProductStack,
  preScanContent,
  processingContent,
  guidedScanContent,
  reportContent,
} from "../../data";
import { palette } from "../../theme";

import { PreScanDashboard } from "./PreScanDashboard";
import { GuidedScan } from "./GuidedScan";
import { ProcessingDashboard } from "./ProcessingDashboard";
import { AnalysisReportScreen } from "./AnalysisReportScreen";

export type PostOnboardingStage = "prescan" | "scan" | "processing" | "report" | "complete";

interface PostOnboardingFlowProps {
  user: UserProfile;
  /** Initial state, useful for testing or resuming. */
  initialStage?: PostOnboardingStage;
  /** Called once user reaches `complete` so parent can show the live dashboard. */
  onComplete: () => void;
}

export const PostOnboardingFlow = ({
  user,
  initialStage = "prescan",
  onComplete,
}: PostOnboardingFlowProps) => {
  const [stage, setStage] = useState<PostOnboardingStage>(initialStage);

  // Animations for the processing screen
  const animationStyles = `
    @keyframes qinoAxisPulse { 0%, 100% { opacity: 0.20; } 50% { opacity: 0.55; } }
    .qino-axis-pulse { animation: qinoAxisPulse 2.5s ease-in-out infinite; }
    @keyframes qinoMarkSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .qino-mark-spin { animation: qinoMarkSpin 32s linear infinite; }
    @keyframes qinoPulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.6); opacity: 0.5; } }
    .qino-pulse-dot { animation: qinoPulseDot 1s ease-in-out infinite; }
    @keyframes qinoBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-3px); opacity: 1; } }
    .qino-bounce-1 { animation: qinoBounce 1.2s ease-in-out infinite; }
    .qino-bounce-2 { animation: qinoBounce 1.2s ease-in-out infinite 0.15s; }
    .qino-bounce-3 { animation: qinoBounce 1.2s ease-in-out infinite 0.3s; }
  `;

  const productCount =
    mockProductStack.essentials.length + mockProductStack.targeted.length;

  // When user reaches `complete`, hand off to parent immediately.
  if (stage === "complete") {
    // Defer to parent on next tick so React doesn't trigger render loops.
    queueMicrotask(onComplete);
    return null;
  }

  return (
    <div style={{ background: palette.ivory, minHeight: "100vh" }}>
      <style>{animationStyles}</style>

      {stage === "prescan" && (
        <PreScanDashboard
          user={user}
          {...preScanContent}
          onStartScan={() => setStage("scan")}
          onRemindLater={() => onComplete()}
        />
      )}

      {stage === "scan" && (
        <GuidedScan
          prepContent={guidedScanContent.prep}
          reviewContent={guidedScanContent.review}
          onClose={() => setStage("prescan")}
          onSubmit={() => setStage("processing")}
        />
      )}

      {stage === "processing" && (
        <ProcessingDashboard
          user={user}
          {...processingContent}
          onComplete={() => setStage("report")}
        />
      )}

      {stage === "report" && (
        <AnalysisReportScreen
          user={user}
          report={mockAnalysisReport}
          productCount={productCount}
          {...reportContent}
          onContinue={() => setStage("complete")}
          onCardClick={(id) => console.log("[QINO Report] Card clicked:", id)}
        />
      )}
    </div>
  );
};
