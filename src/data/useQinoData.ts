// =====================================================================
// QINO — useQinoData hook
// Replaces useMockData. Tries Supabase first, falls back to mock data
// for anything that hasn't been wired to real backend yet.
//
// Iteration 6B scope:
//   - profiles: real (with mock fallback)
//   - everything else: still mock for now
//
// Iteration 7 will swap analysis report from mock → real.
// Iteration 8 will swap protocol/products/pathways/coach.
// =====================================================================

import { useEffect, useState } from "react";
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
} from "./index";
import { fetchProfile } from "./qinoApi";
import type {
  UserProfile,
  Protocol,
  AnalysisReport,
  ProductStack,
  TreatmentPathways,
  ProgressState,
  CoachState,
} from "../types";

export interface QinoData {
  user: UserProfile;
  protocol: Protocol;
  report: AnalysisReport;
  productStack: ProductStack;
  pathways: TreatmentPathways;
  progress: ProgressState;
  coach: CoachState;
  todayFocusLine: string;
  comingUp: typeof mockComingUp;
  greetingPrefix: string;
}

export interface QinoDataState {
  data: QinoData;
  loading: boolean;
  /** True once any real Supabase fetch has completed (success or failure). */
  hasFetched: boolean;
}

export const useQinoData = (): QinoDataState => {
  const [profile, setProfile] = useState<UserProfile>(mockUser);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const real = await fetchProfile();
      if (cancelled) return;
      if (real) {
        setProfile({
          id: real.user_id,
          name: real.name,
          initial: real.name.charAt(0).toUpperCase(),
          email: real.email ?? undefined,
        });
      }
      // If real is null, we silently keep the mockUser — the prototype
      // continues to work even if Supabase is unreachable.
      setLoading(false);
      setHasFetched(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    data: {
      user: profile,
      // Below: still mock until later iterations wire them.
      protocol: mockProtocol,
      report: mockAnalysisReport,
      productStack: mockProductStack,
      pathways: mockTreatmentPathways,
      progress: mockProgress,
      coach: mockCoachState,
      todayFocusLine: mockTodayFocus.focusLine,
      comingUp: mockComingUp,
      greetingPrefix: mockGreeting.morning,
    },
    loading,
    hasFetched,
  };
};
