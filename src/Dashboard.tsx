// =====================================================================
// QINO — Dashboard
// The live 5-tab app, shown after onboarding + scan + report are done.
//
// Iteration 4 additions:
// - Coach screen wired to grounded responses + context card
// - Progress screen wired to monthly photo upload flow
// - Protocol screen has today's tasks
//
// All overlays still managed by useDashboardOverlays.
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
  coachResponses,
  coachContext,
  QINO_SAFETY_NOTE,
  QINO_COACH_FALLBACK_REPLY,
} from "./data";

import { palette, fonts } from "./theme";
import { TopBar, BottomNav, type TabId } from "./components/Chrome";
import {
  useDashboardOverlays,
  DashboardOverlays,
} from "./components/DashboardOverlays";
import { MonthlyPhotoUpload } from "./components/MonthlyPhotoUpload";
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
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const overlays = useDashboardOverlays();

  const productCount =
    data.productStack.essentials.length + data.productStack.targeted.length;

  const photoAngles = [
    { id: "front", label: "Front neutral", uploaded: true, accentKey: "softBlush" },
    { id: "smile", label: "Front smile", uploaded: true, accentKey: "softPeach" },
    { id: "left", label: "Left profile", uploaded: false, accentKey: "softLavender" },
    { id: "right", label: "Right profile", uploaded: false, accentKey: "softSage" },
    { id: "fortyfive", label: "45-degree", uploaded: false, accentKey: "paleBlue" },
    { id: "skin", label: "Skin close-up", uploaded: false, accentKey: "softBlush" },
  ];

  // Monthly photo upload overlay takes precedence over tabs
  if (uploadingPhotos) {
    return (
      <MonthlyPhotoUpload
        title="Day 30 photos"
        subtitle="Upload your six angles in the same lighting as your initial scan for the most accurate comparison."
        angles={photoAngles.map(({ id, label, accentKey }) => ({ id, label, accentKey }))}
        initialUploaded={photoAngles.filter((p) => p.uploaded).map((p) => p.id)}
        onClose={() => setUploadingPhotos(false)}
        onSubmit={() => setUploadingPhotos(false)}
        submitCtaLabel="Submit photos"
      />
    );
  }

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
            photoAngles={photoAngles.map(({ id, label, uploaded }) => ({ id, label, uploaded }))}
            isEmpty={data.progress.photosUploaded === 0}
            onStartUpload={() => setUploadingPhotos(true)}
            nextCheckInEyebrow="Next check-in"
            nextCheckInHeadline={`Day 30 photos · ${data.progress.nextReviewLabel}`}
            nextCheckInSub="Same six angles, same lighting. Takes about three minutes."
            uploadCtaLabel="Upload photos"
          />
        )}

        {tab === "coach" && (
          <CoachScreen
            state={data.coach}
            responses={coachResponses}
            contextEyebrow={coachContext.eyebrow}
            contextItems={coachContext.items}
            safetyNote={QINO_SAFETY_NOTE}
            fallbackReply={QINO_COACH_FALLBACK_REPLY}
            subtitle="Grounded in your analysis, protocol, and goals."
          />
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {/* Centralized overlays — modals and feature detail screens */}
      <DashboardOverlays state={overlays} />
    </div>
  );
}
