// =====================================================================
// QINO — Post-onboarding state machine
// Coordinates the 4 states between onboarding and the live dashboard.
//
// States: prescan → scan → processing → report → complete
// Plus overlays from the report:
//   - Product Stack modal
//   - Treatment Pathways modal
//   - Feature group detail screen (by group id)
// =====================================================================

import { useState } from "react";
import type { UserProfile } from "../../types";
import {
  mockAnalysisReport,
  mockProductStack,
  mockTreatmentPathways,
  preScanContent,
  processingContent,
  guidedScanContent,
  reportContent,
  QINO_SAFETY_NOTE,
} from "../../data";
import { palette } from "../../theme";

import { PreScanDashboard } from "./PreScanDashboard";
import { GuidedScan } from "./GuidedScan";
import { ProcessingDashboard } from "./ProcessingDashboard";
import { AnalysisReportScreen } from "./AnalysisReportScreen";
import { ProductStackModal } from "../../components/ProductStackModal";
import { PathwaysModal } from "../../components/PathwaysModal";
import { FeatureGroupDetailScreen } from "../../components/FeatureGroupDetailScreen";

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

  // Modal & detail navigation state
  const [productsOpen, setProductsOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);
  const [openFeatureGroupId, setOpenFeatureGroupId] = useState<string | null>(null);

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

  // Resolve open feature group from the report
  const openFeatureGroup = openFeatureGroupId
    ? mockAnalysisReport.featureGroups.find((g) => g.id === openFeatureGroupId)
    : null;

  // Handle clicks on the report's interactive cards
  const handleReportCardClick = (cardId: string) => {
    if (cardId === "productStack") {
      setProductsOpen(true);
      return;
    }
    if (cardId === "pathways") {
      setPathwaysOpen(true);
      return;
    }
    if (cardId === "protocol") {
      // Continue to live dashboard; user lands on Today and can navigate to Protocol tab.
      setStage("complete");
      return;
    }
    if (cardId.startsWith("feature:")) {
      const id = cardId.split(":")[1];
      setOpenFeatureGroupId(id);
      return;
    }
    // strength: / opportunity: / score: clicks fall through to console for now.
    console.log("[QINO Report] Card clicked:", cardId);
  };

  // When user reaches `complete`, hand off to parent immediately.
  if (stage === "complete") {
    queueMicrotask(onComplete);
    return null;
  }

  // Feature detail screen overlays the report when active
  if (openFeatureGroup) {
    return (
      <div style={{ background: palette.ivory, minHeight: "100vh" }}>
        <FeatureGroupDetailScreen
          group={openFeatureGroup}
          onBack={() => setOpenFeatureGroupId(null)}
          onOpenProducts={() => {
            setOpenFeatureGroupId(null);
            setProductsOpen(true);
          }}
          onOpenPathways={() => {
            setOpenFeatureGroupId(null);
            setPathwaysOpen(true);
          }}
          safetyNote={QINO_SAFETY_NOTE}
        />
        <ProductStackModal
          open={productsOpen}
          onClose={() => setProductsOpen(false)}
          stack={mockProductStack}
          activeTier="standard"
          safetyNote={QINO_SAFETY_NOTE}
        />
        <PathwaysModal
          open={pathwaysOpen}
          onClose={() => setPathwaysOpen(false)}
          pathways={mockTreatmentPathways}
          safetyNote={QINO_SAFETY_NOTE}
          level4Unlocked={false}
        />
      </div>
    );
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
          onCardClick={handleReportCardClick}
        />
      )}

      {/* Modals — available from any stage once they're requested */}
      <ProductStackModal
        open={productsOpen}
        onClose={() => setProductsOpen(false)}
        stack={mockProductStack}
        activeTier="standard"
        safetyNote={QINO_SAFETY_NOTE}
      />
      <PathwaysModal
        open={pathwaysOpen}
        onClose={() => setPathwaysOpen(false)}
        pathways={mockTreatmentPathways}
        safetyNote={QINO_SAFETY_NOTE}
        level4Unlocked={false}
      />
    </div>
  );
};
