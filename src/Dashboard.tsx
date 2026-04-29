// =====================================================================
// QINO — Main App Container
// Single entry point. Imports mock data, passes it to screens via props.
//
// BACKEND REPLACEMENT POINT:
// Replace the `useMockData()` hook below with real data fetching.
// Each `mock*` import maps 1:1 to a future API endpoint
// (see comments in /src/data/*.ts for endpoint contracts).
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
  QINO_SAFETY_NOTE,
  QINO_COACH_FALLBACK_REPLY,
} from "./data";

import { palette, fonts } from "./theme";
import { TopBar, BottomNav, type TabId } from "./components/Chrome";
import { TodayScreen } from "./screens/TodayScreen";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { ProtocolScreen } from "./screens/ProtocolScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { CoachScreen } from "./screens/CoachScreen";

/**
 * Future replacement: useQinoData() that fetches via API/Supabase.
 * Same return shape, so screens never need to change.
 */
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

  // Modal state — wire your real modals here later
  const [productsOpen, setProductsOpen] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);

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
            pathwaysSummary="Products + Clinics"
            onTab={setTab}
            onOpenProducts={() => setProductsOpen(true)}
            onOpenPathways={() => setPathwaysOpen(true)}
          />
        )}

        {tab === "analysis" && (
          <AnalysisScreen
            report={data.report}
            subtitle="AI-powered analysis with priority ranking"
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

      {/* Product Stack and Pathways modals will be wired here in a follow-up */}
      {productsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl">
            <p>Product Stack modal placeholder ({productCount} items)</p>
            <button onClick={() => setProductsOpen(false)} className="mt-3 underline">
              Close
            </button>
          </div>
        </div>
      )}
      {pathwaysOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl">
            <p>Pathways modal placeholder ({data.pathways.levels.length} levels)</p>
            <button onClick={() => setPathwaysOpen(false)} className="mt-3 underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
