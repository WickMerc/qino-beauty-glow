// =====================================================================
// QINO — Dashboard Overlays
// Centralizes modal + feature-detail navigation state so any tab
// (Today, Analysis, Protocol, Progress, Coach) can open them.
//
// Usage:
//   const overlays = useDashboardOverlays();
//   overlays.openProducts();
//   overlays.openPathways();
//   overlays.openFeatureGroup("skin");
//   overlays.openFullReport();
//
//   <DashboardOverlays state={overlays} />  // mount once near the root
// =====================================================================

import { useState, useCallback } from "react";
import {
  mockAnalysisReport,
  mockProductStack,
  mockTreatmentPathways,
  reportContent,
  QINO_SAFETY_NOTE,
} from "../data";
import { ProductStackModal } from "./ProductStackModal";
import { PathwaysModal } from "./PathwaysModal";
import { FeatureGroupDetailScreen } from "./FeatureGroupDetailScreen";
import { AnalysisReportScreen } from "../screens/post-onboarding/AnalysisReportScreen";
import { mockUser } from "../data/mockUser";

export interface DashboardOverlaysState {
  productsOpen: boolean;
  pathwaysOpen: boolean;
  openFeatureGroupId: string | null;
  fullReportOpen: boolean;

  openProducts: () => void;
  closeProducts: () => void;
  openPathways: () => void;
  closePathways: () => void;
  openFeatureGroup: (id: string) => void;
  closeFeatureGroup: () => void;
  openFullReport: () => void;
  closeFullReport: () => void;
}

export const useDashboardOverlays = (): DashboardOverlaysState => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);
  const [openFeatureGroupId, setOpenFeatureGroupId] = useState<string | null>(null);
  const [fullReportOpen, setFullReportOpen] = useState(false);

  return {
    productsOpen,
    pathwaysOpen,
    openFeatureGroupId,
    fullReportOpen,
    openProducts: useCallback(() => setProductsOpen(true), []),
    closeProducts: useCallback(() => setProductsOpen(false), []),
    openPathways: useCallback(() => setPathwaysOpen(true), []),
    closePathways: useCallback(() => setPathwaysOpen(false), []),
    openFeatureGroup: useCallback((id: string) => setOpenFeatureGroupId(id), []),
    closeFeatureGroup: useCallback(() => setOpenFeatureGroupId(null), []),
    openFullReport: useCallback(() => setFullReportOpen(true), []),
    closeFullReport: useCallback(() => setFullReportOpen(false), []),
  };
};

interface DashboardOverlaysProps {
  state: DashboardOverlaysState;
}

/**
 * Renders all dashboard-wide overlays. Mount once near the root of the Dashboard.
 * The feature detail screen renders as a full-screen overlay; modals slide up.
 */
export const DashboardOverlays = ({ state }: DashboardOverlaysProps) => {
  const productCount =
    mockProductStack.essentials.length + mockProductStack.targeted.length;

  // Resolve open feature group from the report
  const openFeatureGroup = state.openFeatureGroupId
    ? mockAnalysisReport.featureGroups.find((g) => g.id === state.openFeatureGroupId)
    : null;

  return (
    <>
      {/* Feature detail screen overlay */}
      {openFeatureGroup && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto"
          style={{ background: "transparent" }}
        >
          <FeatureGroupDetailScreen
            group={openFeatureGroup}
            onBack={state.closeFeatureGroup}
            onOpenProducts={() => {
              state.closeFeatureGroup();
              state.openProducts();
            }}
            onOpenPathways={() => {
              state.closeFeatureGroup();
              state.openPathways();
            }}
            safetyNote={QINO_SAFETY_NOTE}
          />
        </div>
      )}

      {/* Full-report re-open overlay (from "View full report" links) */}
      {state.fullReportOpen && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto"
          style={{ background: "transparent" }}
        >
          <AnalysisReportScreen
            user={mockUser}
            report={mockAnalysisReport}
            productCount={productCount}
            {...reportContent}
            ctaLabel="Back to dashboard"
            onContinue={state.closeFullReport}
            onCardClick={(cardId) => {
              if (cardId === "productStack") {
                state.closeFullReport();
                state.openProducts();
              } else if (cardId === "pathways") {
                state.closeFullReport();
                state.openPathways();
              } else if (cardId.startsWith("feature:")) {
                state.closeFullReport();
                state.openFeatureGroup(cardId.split(":")[1]);
              }
            }}
          />
        </div>
      )}

      {/* Bottom-sheet modals */}
      <ProductStackModal
        open={state.productsOpen}
        onClose={state.closeProducts}
        stack={mockProductStack}
        activeTier="standard"
        safetyNote={QINO_SAFETY_NOTE}
      />
      <PathwaysModal
        open={state.pathwaysOpen}
        onClose={state.closePathways}
        pathways={mockTreatmentPathways}
        safetyNote={QINO_SAFETY_NOTE}
        level4Unlocked={false}
      />
    </>
  );
};
