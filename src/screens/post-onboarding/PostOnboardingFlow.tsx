// =====================================================================
// QINO — Post-onboarding state machine
// Coordinates the 4 states between onboarding and the live dashboard.
//
// States: prescan → scan → processing → report → complete
// Overlays (modals + feature detail) handled by useDashboardOverlays.
//
// Iteration 7B: scan submission triggers real analysis pipeline.
//   1. Create scan_session row
//   2. Insert 6 scan_photos rows (placeholder paths)
//   3. Mark scan_session uploaded
//   4. Invoke generate-analysis Edge Function
//   5. Processing screen polls for completion
//   6. Report screen displays real data via useQinoData
// =====================================================================

import { useState } from "react";
import type { UserProfile } from "../../types";
import {
  mockProductStack,
  preScanContent,
  processingContent,
  guidedScanContent,
  reportContent,
} from "../../data";
import {
  createScanSession,
  insertScanPhotos,
  markScanSessionUploaded,
  generateAnalysisReport,
} from "../../data/qinoApi";
import { useQinoData } from "../../data/useQinoData";
import { palette } from "../../theme";

import { PreScanDashboard } from "./PreScanDashboard";
import { GuidedScan } from "./GuidedScan";
import { ProcessingDashboard } from "./ProcessingDashboard";
import { AnalysisReportScreen } from "./AnalysisReportScreen";
import {
  useDashboardOverlays,
  DashboardOverlays,
} from "../../components/DashboardOverlays";

export type PostOnboardingStage = "prescan" | "scan" | "processing" | "report" | "complete";

interface PostOnboardingFlowProps {
  user: UserProfile;
  initialStage?: PostOnboardingStage;
  onComplete: () => void;
}

export const PostOnboardingFlow = ({
  user,
  initialStage = "prescan",
  onComplete,
}: PostOnboardingFlowProps) => {
  const [stage, setStage] = useState<PostOnboardingStage>(initialStage);
  /** Session id of the scan currently being processed; passed to ProcessingDashboard for polling. */
  const [activeScanSessionId, setActiveScanSessionId] = useState<string | null>(null);
  const overlays = useDashboardOverlays();
  const qinoData = useQinoData();

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

  // Handle scan submission: persist + invoke + transition
  const handleScanSubmit = async () => {
    setStage("processing");

    try {
      const sessionId = await createScanSession();
      if (!sessionId) {
        console.warn("[PostOnboardingFlow] createScanSession returned null");
        return;
      }
      setActiveScanSessionId(sessionId);

      const angles: Array<"front" | "smile" | "left" | "right" | "fortyfive" | "skin"> = [
        "front",
        "smile",
        "left",
        "right",
        "fortyfive",
        "skin",
      ];
      await insertScanPhotos(
        angles.map((a) => ({
          scan_session_id: sessionId,
          angle_type: a,
          // Placeholder paths — real upload comes when camera capture lands.
          storage_path: `mock/${sessionId}/${a}.jpg`,
        }))
      );
      await markScanSessionUploaded(sessionId);

      // Fire the analysis pipeline. We do not await the return here because
      // the processing screen polls for completion independently.
      generateAnalysisReport(sessionId).catch((err) =>
        console.warn("[PostOnboardingFlow] generateAnalysisReport failed:", err)
      );
    } catch (err) {
      console.warn("[PostOnboardingFlow] scan submission failed:", err);
    }
  };

  // When processing finishes, refresh data so the report screen has real data
  const handleProcessingComplete = async () => {
    await qinoData.refresh();
    setStage("report");
  };

  // Wire report card clicks to overlays
  const handleReportCardClick = (cardId: string) => {
    if (cardId === "productStack") return overlays.openProducts();
    if (cardId === "pathways") return overlays.openPathways();
    if (cardId === "protocol") return setStage("complete");
    if (cardId.startsWith("feature:")) {
      const id = cardId.split(":")[1];
      return overlays.openFeatureGroup(id);
    }
    console.log("[QINO Report] Card clicked:", cardId);
  };

  // When user reaches `complete`, hand off to parent
  if (stage === "complete") {
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
        />
      )}

      {stage === "scan" && (
        <GuidedScan
          prepContent={guidedScanContent.prep}
          reviewContent={guidedScanContent.review}
          onClose={() => setStage("prescan")}
          onSubmit={handleScanSubmit}
        />
      )}

      {stage === "processing" && (
        <ProcessingDashboard
          user={user}
          {...processingContent}
          scanSessionId={activeScanSessionId}
          onComplete={handleProcessingComplete}
        />
      )}

      {stage === "report" && (
        <AnalysisReportScreen
          user={user}
          report={qinoData.data.report}
          productCount={productCount}
          {...reportContent}
          onContinue={() => setStage("complete")}
          onCardClick={handleReportCardClick}
        />
      )}

      {/* Overlays: modals and feature detail screens */}
      <DashboardOverlays state={overlays} />
    </div>
  );
};
