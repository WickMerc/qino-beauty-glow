// =====================================================================
// QINO — useQinoData hook
// Fetches user profile and latest analysis report from Supabase.
// Falls back to mock data for anything that hasn't been wired yet.
//
// Iteration 7B scope:
//   - profile: real (with mock fallback)
//   - report: real (with mock fallback if no complete report exists)
//   - everything else: still mock for now
//
// Iteration 8 will swap protocol/products/pathways/coach.
// =====================================================================

import { useEffect, useState, useCallback } from "react";
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
import { fetchProfile, fetchLatestAnalysisReport } from "./qinoApi";
import { mapAnalysisReport } from "./mappers";
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
  /** True when the report came from the database (vs. mock fallback). */
  reportIsReal: boolean;
  /** Force a re-fetch — useful after scan completion. */
  refresh: () => Promise<void>;
}

export const useQinoData = (): QinoDataState => {
  const [profile, setProfile] = useState<UserProfile>(mockUser);
  const [report, setReport] = useState<AnalysisReport>(mockAnalysisReport);
  const [reportIsReal, setReportIsReal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const load = useCallback(async () => {
    const [realProfile, realReport] = await Promise.all([
      fetchProfile(),
      fetchLatestAnalysisReport(),
    ]);

    if (realProfile) {
      setProfile({
        id: realProfile.user_id,
        name: realProfile.name,
        initial: realProfile.name.charAt(0).toUpperCase(),
        email: realProfile.email ?? undefined,
      });
    }

    if (realReport) {
      setReport(
        mapAnalysisReport(realReport.report, realReport.findings, realReport.priorities)
      );
      setReportIsReal(true);
    } else {
      // Keep mock report in state, mark as not-real
      setReportIsReal(false);
    }

    setLoading(false);
    setHasFetched(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return {
    data: {
      user: profile,
      report,
      // Below: still mock until later iterations wire them.
      protocol: mockProtocol,
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
    reportIsReal,
    refresh: load,
  };
};
