// =====================================================================
// QINO — Dashboard
// The live 5-tab app, shown after onboarding + scan + report are done.
//
// All overlays (Product Stack modal, Pathways modal, feature detail
// screen, full-report re-open) are managed by useDashboardOverlays.
// Any tab can call into them.
//
// BACKEND REPLACEMENT POINT:
// Replace the `useMockData()` hook below with real data fetching.
// =====================================================================

import { useState } from "react";
import {
  mockUser,
  mockProtocol,
  mockAnalysisReport,
  mockProductStack,
  mockTreatmentPathways,
  mockProgress,
  mockCoachState,
  mockTodayFocus,
  mockComingUp,
  mockGreeting,
  reportContent,
  QINO_SAFETY_NOTE,
  QINO_COACH_FALLBACK_REPLY,
} from "./data";

import { palette, fonts } from "./theme";
import { TopBar, BottomNav, type TabId } from "./components/Chrome";
import {
  useDashboardOverlays,
  DashboardOverlays,
} from "./components/DashboardOverlays";
import { TodayScreen } from "./screens/TodayScreen";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { ProtocolScreen } from "./screens/ProtocolScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { CoachScreen } from "./screens/CoachScreen";

const useMockData = () => ({
  user: mockUser,
  protocol: mockProtocol,
  report: mockAnalysisReport,
  productStack: mockProductStack,
  pathways: mockTreatmentPathways,
  progress: mockProgress,
  coach: mockCoachState,
  todayFocusLine: mockTodayFocus.focusLine,
  comingUp: mockComingUp,
  greetingPrefix: mockGreeting.morning,
});

export default function Dashboard() {
  const data = useMockData();
  const [tab, setTab] = useState<TabId>("today");
  const overlays = useDashboardOverlays();

  const productCount =
    data.productStack.essentials.length + data.productStack.targeted.length;

  const photoAngles = [
    { id: "front", label: "Front neutral", uploaded: true },
    { id: "smile", label: "Front smile", uploaded: true },
    { id: "left", label: "Left profile", uploaded: false },
    { id: "right", label: "Right profile", uploaded: false },
    { id: "fortyfive", label: "45-degree", uploaded: false },
    { id: "skin", label: "Skin close-up", uploaded: false },
  ];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: palette.ivory,
        fontFamily: fonts.body,
        color: palette.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { -webkit-font-smoothing: antialiased; background: ${palette.ivory}; }
      `}</style>

      <div className="max-w-[440px] mx-auto min-h-screen pb-24 relative">
        <TopBar user={data.user} />

        {tab === "today" && (
          <TodayScreen
            user={data.user}
            protocol={data.protocol}
            report={data.report}
            todayFocusLine={data.todayFocusLine}
            comingUp={data.comingUp}
            greetingPrefix={data.greetingPrefix}
            productCount={productCount}
            pathwaysSummary={reportContent.pathwaysSummary.replace("Open to: ", "")}
            onTab={setTab}
            onOpenProducts={overlays.openProducts}
            onOpenPathways={overlays.openPathways}
          />
        )}

        {tab === "analysis" && (
          <AnalysisScreen
            report={data.report}
            onOpenFeatureGroup={overlays.openFeatureGroup}
            onOpenFullReport={overlays.openFullReport}
          />
        )}

        {tab === "protocol" && (
          <ProtocolScreen
            protocol={data.protocol}
            subtitle="Your daily system for visible improvement"
            heroHeadline="Build the visible-change baseline"
            heroSub="Facial softness · skin basics · grooming consistency"
          />
        )}

        {tab === "progress" && (
          <ProgressScreen
            progress={data.progress}
            subtitle="Visible changes over time"
            photoAngles={photoAngles}
          />
        )}

        {tab === "coach" && (
          <CoachScreen
            state={data.coach}
            safetyNote={QINO_SAFETY_NOTE}
            fallbackReply={QINO_COACH_FALLBACK_REPLY}
            subtitle="Your protocol, products, or treatment paths"
          />
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {/* Centralized overlays — modals and feature detail screens */}
      <DashboardOverlays state={overlays} />
    </div>
  );
}
