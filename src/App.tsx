// =====================================================================
// QINO — Top-level App (iteration 9)
// Auth-aware orchestration:
//   - Unauthenticated + onboarding incomplete → onboarding flow
//   - Onboarding done + no user yet → AuthScreen
//   - Authenticated → persist pending onboarding answers, then continue
//   - Authenticated + has report → Dashboard, else post-onboarding flow
// =====================================================================

import { useEffect, useRef, useState } from "react";
import type { AppStage, OnboardingAnswers } from "./types";
import { saveOnboardingAnswers } from "./data/qinoApi";
import { useQinoData } from "./data/useQinoData";
import { useAuth } from "./hooks/useAuth";
import { palette, fonts } from "./theme";

import { OnboardingFlow } from "./screens/onboarding/OnboardingFlow";
import { PostOnboardingFlow, type PostOnboardingStage } from "./screens/post-onboarding/PostOnboardingFlow";
import { AuthScreen } from "./screens/auth/AuthScreen";
import { EmailVerificationBanner } from "./components/EmailVerificationBanner";
import Dashboard from "./Dashboard";

type EntryStage = Extract<PostOnboardingStage, "scan" | "prescan" | "complete">;

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { data, refresh, reportIsReal, hasFetched } = useQinoData();

  // Pre-auth onboarding state
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<OnboardingAnswers | null>(null);
  const [pendingStartScan, setPendingStartScan] = useState(false);
  const persistedRef = useRef(false);

  // Post-auth flow state
  const [stage, setStage] = useState<AppStage>("onboarding");
  const [postEntryStage, setPostEntryStage] = useState<EntryStage>("prescan");

  // After sign-in, persist any pending onboarding answers exactly once
  useEffect(() => {
    if (!user || persistedRef.current) return;
    if (pendingAnswers) {
      persistedRef.current = true;
      saveOnboardingAnswers(pendingAnswers)
        .catch((err) => console.warn("[App] saveOnboardingAnswers failed:", err))
        .finally(() => {
          setPendingAnswers(null);
          setPostEntryStage(pendingStartScan ? "scan" : "prescan");
          setStage("prescan");
        });
    }
  }, [user, pendingAnswers, pendingStartScan]);

  // After auth + initial data fetch, route to correct stage
  useEffect(() => {
    if (!user || !hasFetched || pendingAnswers) return;
    if (reportIsReal) {
      setStage("complete");
    } else if (stage === "onboarding") {
      // Returning user with no report → start in prescan
      setStage("prescan");
      setPostEntryStage("prescan");
    }
  }, [user, hasFetched, reportIsReal, pendingAnswers, stage]);

  const wrap = (children: React.ReactNode) => (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { -webkit-font-smoothing: antialiased; background: ${palette.ivory}; }
      `}</style>
      {user && <EmailVerificationBanner user={user} />}
      {children}
    </div>
  );

  if (authLoading) {
    return wrap(
      <div className="min-h-screen flex items-center justify-center text-[13px]" style={{ color: palette.textDim }}>
        Loading…
      </div>
    );
  }

  // No user yet
  if (!user) {
    if (!onboardingDone) {
      return wrap(
        <OnboardingFlow
          onClose={() => {
            // Keep them in onboarding — no app access until completion.
          }}
          onComplete={(result) => {
            setPendingAnswers(result.answers);
            setPendingStartScan(result.startScan);
            setOnboardingDone(true);
          }}
        />
      );
    }
    return wrap(<AuthScreen />);
  }

  // Authenticated — but data not yet hydrated
  if (!hasFetched) {
    return wrap(
      <div className="min-h-screen flex items-center justify-center text-[13px]" style={{ color: palette.textDim }}>
        Loading your QINO…
      </div>
    );
  }

  return wrap(
    <>
      {(stage === "onboarding" || stage === "prescan" ||
        stage === "scanning" ||
        stage === "processing" ||
        stage === "report") && (
        <PostOnboardingFlow
          user={data.user}
          initialStage={postEntryStage}
          onComplete={async () => {
            await refresh();
            setStage("complete");
          }}
        />
      )}

      {stage === "complete" && <Dashboard />}
    </>
  );
}
