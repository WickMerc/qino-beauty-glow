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

  // Reset pre-auth flow when the user signs out, so a freshly signed-out
  // session lands back in onboarding (not stuck on AuthScreen).
  const wasAuthedRef = useRef(false);
  useEffect(() => {
    if (user) {
      wasAuthedRef.current = true;
      return;
    }
    if (wasAuthedRef.current && !user) {
      wasAuthedRef.current = false;
      setOnboardingDone(false);
      setPendingAnswers(null);
      setPendingStartScan(false);
      persistedRef.current = false;
      setStage("onboarding");
      setPostEntryStage("prescan");
    }
  }, [user]);

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

  // Routing decision runs only when stage is still the initial "onboarding"
  // and there are no pending answers (which the other effect handles).
  // This prevents the routing effect from racing with / overwriting the
  // post-signup transition into "prescan".
  useEffect(() => {
    if (!user || !hasFetched || pendingAnswers) return;
    if (stage !== "onboarding") return;
    if (reportIsReal) {
      setStage("complete");
    } else {
      setStage("prescan");
      setPostEntryStage("prescan");
    }
  }, [user, hasFetched, reportIsReal, pendingAnswers, stage]);

  // Defense in depth: if reportIsReal flips to false at any point while we're
  // sitting on "complete", bounce back to prescan so we never render Dashboard
  // without a real report.
  useEffect(() => {
    if (!user || !hasFetched) return;
    if (stage === "complete" && !reportIsReal) {
      setStage("prescan");
      setPostEntryStage("prescan");
    }
  }, [user, hasFetched, reportIsReal, stage]);

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
      {(!reportIsReal || stage !== "complete") && (
        <PostOnboardingFlow
          user={data.user}
          initialStage={stage === "complete" ? "prescan" : postEntryStage}
          onComplete={async () => {
            await refresh();
            setStage("complete");
          }}
        />
      )}

      {reportIsReal && stage === "complete" && <Dashboard />}
    </>
  );
}
