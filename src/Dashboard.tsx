// =====================================================================
// QINO — Dashboard
// The live 5-tab app, shown after onboarding + scan + report are done.
//
// Iteration 6B: profile is hydrated from Supabase via useQinoData.
// Other data (protocol, report, products, pathways, progress, coach)
// remains mock-driven until iteration 7-8 generate them server-side.
// =====================================================================

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SubscriptionBanner } from "./components/SubscriptionBanner";
import {
  reportContent,
  coachContext,
  QINO_SAFETY_NOTE,
} from "./data";
import { useQinoData } from "./data/useQinoData";

import { palette, fonts } from "./theme";
import { TopBar, BottomNav, type TabId } from "./components/Chrome";
import {
  useDashboardOverlays,
  DashboardOverlays,
} from "./components/DashboardOverlays";
import { MonthlyPhotoUpload } from "./components/MonthlyPhotoUpload";
import { TrialOfferCard } from "./components/TrialOfferCard";
import { useSubscription } from "./hooks/useSubscription";
import { TodayScreen } from "./screens/TodayScreen";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { ProtocolScreen } from "./screens/ProtocolScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { CoachScreen } from "./screens/CoachScreen";

export default function Dashboard() {
  const { data, loading, reportIsReal } = useQinoData();
  const [tab, setTab] = useState<TabId>("today");
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const overlays = useDashboardOverlays();
  const subscription = useSubscription();
  const navigate = useNavigate();

  // Defense in depth: never render Dashboard with mock/missing report.
  // IMPORTANT: must come AFTER all hooks above to satisfy Rules of Hooks.
  if (!reportIsReal || !data.report) return null;
  const report = data.report;

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

  // Gating helpers — route to /pricing instead of locally flipping state.
  const startTrial = () => navigate({ to: "/pricing" });

  // Tab access — only Today and Analysis fully free.
  // Locked tabs show TrialOfferCard "screen" variant.
  // Modal/upload features check `canAccess` before opening.

  // Monthly photo upload overlay takes precedence over tabs (gated)
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

  // Gated tab content — replaces the real screen with the trial offer
  const renderProtocol = () => {
    if (subscription.isLocked("daily_protocol")) {
      return (
        <TrialOfferCard
          variant="screen"
          featureName="Daily Protocol"
          onStartTrial={startTrial}
        />
      );
    }
    return (
      <ProtocolScreen
        protocol={data.protocol}
        subtitle="Your daily system for visible improvement"
        heroHeadline="Build the visible-change baseline"
        heroSub="Facial softness · skin basics · grooming consistency"
      />
    );
  };

  const renderProgress = () => {
    if (subscription.isLocked("progress_tracking")) {
      return (
        <TrialOfferCard
          variant="screen"
          featureName="Progress Tracking"
          onStartTrial={startTrial}
        />
      );
    }
    return (
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
    );
  };

  const renderCoach = () => {
    if (subscription.isLocked("coach")) {
      return (
        <TrialOfferCard
          variant="screen"
          featureName="QINO Coach"
          onStartTrial={startTrial}
        />
      );
    }
    return (
      <CoachScreen
        state={data.coach}
        contextEyebrow={coachContext.eyebrow}
        contextItems={coachContext.items}
        safetyNote={QINO_SAFETY_NOTE}
        subtitle="Grounded in your analysis, protocol, and goals."
      />
    );
  };

  // Today's gated quick actions: route through subscription
  const handleOpenProducts = () => {
    if (subscription.isLocked("product_stack")) {
      // For prototype: just trigger trial state. Real version: show paywall sheet.
      startTrial();
      return;
    }
    overlays.openProducts();
  };
  const handleOpenPathways = () => {
    if (subscription.isLocked("treatment_pathways")) {
      startTrial();
      return;
    }
    overlays.openPathways();
  };

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
        <SubscriptionBanner />
        <TopBar user={data.user} />

        {tab === "today" && (
          <TodayScreen
            user={data.user}
            protocol={data.protocol}
            report={report}
            todayFocusLine={data.todayFocusLine}
            comingUp={data.comingUp}
            greetingPrefix={data.greetingPrefix}
            productCount={productCount}
            pathwaysSummary={reportContent.pathwaysSummary.replace("Open to: ", "")}
            onTab={setTab}
            onOpenProducts={handleOpenProducts}
            onOpenPathways={handleOpenPathways}
          />
        )}

        {tab === "analysis" && (
          <AnalysisScreen
            report={report}
            onOpenFeatureGroup={overlays.openFeatureGroup}
            onOpenFullReport={overlays.openFullReport}
          />
        )}

        {tab === "protocol" && renderProtocol()}
        {tab === "progress" && renderProgress()}
        {tab === "coach" && renderCoach()}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      {/* Centralized overlays — modals and feature detail screens */}
      <DashboardOverlays state={overlays} />
    </div>
  );
}
