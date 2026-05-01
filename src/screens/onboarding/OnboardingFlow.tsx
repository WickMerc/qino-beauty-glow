// =====================================================================
// QINO Onboarding — Flow Container
// Coordinates all 10 steps, manages answers state, calls onComplete.
//
// BACKEND REPLACEMENT POINT:
// Replace `useState(emptyOnboardingAnswers)` with a hook that loads
// in-progress answers from /api/me/onboarding so users can resume.
// On `onComplete`, POST the final answers to /api/onboarding.
// =====================================================================

import { useEffect, useState } from "react";
import type { OnboardingAnswers } from "../../types";
import { emptyOnboardingAnswers, onboardingContent } from "../../data/mockOnboarding";
import { palette, fonts } from "../../theme";
import { track } from "../../lib/analytics";

import { OnboardingHeader } from "./_primitives";
import { StepWelcome } from "./StepWelcome";
import { StepGoals } from "./StepGoals";
import { StepPersonalization } from "./StepPersonalization";
import { StepComfort } from "./StepComfort";
import { StepBudget } from "./StepBudget";
import { StepRoutine } from "./StepRoutine";
import { StepBody } from "./StepBody";
import { StepSkin } from "./StepSkin";
import { StepHair } from "./StepHair";
import { StepScanHandoff } from "./StepScanHandoff";

export type OnboardingResult =
  | { startScan: true; answers: OnboardingAnswers }
  | { startScan: false; answers: OnboardingAnswers };

interface OnboardingFlowProps {
  initialAnswers?: OnboardingAnswers;
  onComplete: (result: OnboardingResult) => void;
  onClose: () => void;
}

export const OnboardingFlow = ({
  initialAnswers = emptyOnboardingAnswers,
  onComplete,
  onClose,
}: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingAnswers>(initialAnswers);

  // Steps 1–9 are "questions"; step 0 is welcome (no header).
  // Header total reflects the questionnaire count, not including welcome.
  const totalQuestionSteps = 9;

  const update = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Track step views (skip welcome=0; questions are 1..9)
  useEffect(() => {
    track("onboarding_step_viewed", { step });
  }, [step]);

  const finish = (startScan: boolean) => {
    track("onboarding_completed", { startScan });
    onComplete({ startScan, answers: data } as OnboardingResult);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto min-h-screen relative">
        {step > 0 && (
          <OnboardingHeader
            step={step - 1}
            total={totalQuestionSteps}
            onBack={back}
            onClose={onClose}
          />
        )}

        {step === 0 && (
          <StepWelcome content={onboardingContent.welcome} onContinue={next} />
        )}
        {step === 1 && (
          <StepGoals
            value={data.goals}
            onChange={(v) => update("goals", v)}
            onContinue={next}
            content={onboardingContent.goals}
          />
        )}
        {step === 2 && (
          <StepPersonalization
            value={data.personalization}
            onChange={(v) => update("personalization", v)}
            onContinue={next}
            content={onboardingContent.personalization}
          />
        )}
        {step === 3 && (
          <StepComfort
            value={data.comfort}
            onChange={(v) => update("comfort", v)}
            onContinue={next}
            content={onboardingContent.comfort}
          />
        )}
        {step === 4 && (
          <StepBudget
            value={data.budget}
            onChange={(v) => update("budget", v)}
            onContinue={next}
            content={onboardingContent.budget}
          />
        )}
        {step === 5 && (
          <StepRoutine
            value={data.routine}
            onChange={(v) => update("routine", v)}
            onContinue={next}
            content={onboardingContent.routine}
          />
        )}
        {step === 6 && (
          <StepBody
            value={data.body}
            onChange={(v) => update("body", v)}
            onContinue={next}
            content={onboardingContent.body}
          />
        )}
        {step === 7 && (
          <StepSkin
            value={data.skin}
            onChange={(v) => update("skin", v)}
            onContinue={next}
            content={onboardingContent.skin}
          />
        )}
        {step === 8 && (
          <StepHair
            value={data.hair}
            personalization={data.personalization}
            onChange={(v) => update("hair", v)}
            onContinue={next}
            content={onboardingContent.hair}
          />
        )}
        {step === 9 && (
          <StepScanHandoff
            content={onboardingContent.scanHandoff}
            onStartScan={() => finish(true)}
            onSkipToDashboard={() => finish(false)}
          />
        )}
      </div>
    </div>
  );
};
