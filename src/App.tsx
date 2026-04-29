import { useState } from "react";
import { TopBar, BottomNav, type TabId } from "./components/Chrome";
import { TodayScreen } from "./screens/TodayScreen";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { ProtocolScreen } from "./screens/ProtocolScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { CoachScreen } from "./screens/CoachScreen";
import {
  mockUser,
  mockProtocol,
  mockAnalysisReport,
  mockProgress,
  mockCoachState,
  mockProductStack,
  mockTreatmentPathways,
  mockTodayFocus,
  mockComingUp,
  mockGreeting,
  QINO_COACH_FALLBACK_REPLY,
  QINO_SAFETY_NOTE,
} from "./data";
import { palette } from "./theme";

export default function App() {
  const [tab, setTab] = useState<TabId>("today");

  return (
    <div
      className="max-w-[440px] mx-auto min-h-screen pb-24"
      style={{ background: palette.bg }}
    >
      <TopBar user={mockUser} />

      {tab === "today" && (
        <TodayScreen
          user={mockUser}
          protocol={mockProtocol}
          report={mockAnalysisReport}
          todayFocusLine={mockTodayFocus}
          comingUp={mockComingUp}
          greetingPrefix={mockGreeting}
          productCount={mockProductStack.products.length}
          pathwaysSummary={`${mockTreatmentPathways.pathways.length} pathways`}
          onTab={setTab}
          onOpenProducts={() => {}}
          onOpenPathways={() => {}}
        />
      )}
      {tab === "analysis" && (
        <AnalysisScreen
          report={mockAnalysisReport}
          subtitle="Your full facial breakdown"
        />
      )}
      {tab === "protocol" && (
        <ProtocolScreen
          protocol={mockProtocol}
          subtitle="Your daily system"
          heroHeadline="Foundation Phase"
          heroSub="Build the base for visible change."
        />
      )}
      {tab === "progress" && (
        <ProgressScreen
          progress={mockProgress}
          subtitle="Your transformation over time"
          photoAngles={[
            { id: "front", label: "Front", uploaded: true },
            { id: "left", label: "Left", uploaded: true },
            { id: "right", label: "Right", uploaded: false },
          ]}
        />
      )}
      {tab === "coach" && (
        <CoachScreen
          state={mockCoachState}
          safetyNote={QINO_SAFETY_NOTE}
          fallbackReply={QINO_COACH_FALLBACK_REPLY}
          subtitle="Ask QINO anything about your protocol"
        />
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
