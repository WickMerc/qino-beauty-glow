// =====================================================================
// QINO — useSubscription hook (iteration 10)
// Reads live subscription state from public.subscriptions for the auth user.
// Subscribes to realtime so trial/active flips show instantly.
// Exposes gating helpers used across the app.
// State changes only via Stripe webhooks — read-only from frontend.
// =====================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./useAuth";

export type SubscriptionStatusReal =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

export type GatedFeature =
  | "coach"
  | "daily_protocol"
  | "product_stack"
  | "treatment_pathways"
  | "progress_tracking"
  | "monthly_upload"
  | "reanalysis";

const PAID_STATUSES: SubscriptionStatusReal[] = ["trialing", "active"];

export interface SubscriptionState {
  status: SubscriptionStatusReal;
  isPaid: boolean;
  currentPlan: "monthly" | "annual" | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isLocked: (feature: GatedFeature) => boolean;
  canAccess: (feature: GatedFeature) => boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

interface SubRow {
  status: string;
  current_plan: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

const DEFAULT: Omit<SubscriptionState, "isLocked" | "canAccess" | "refresh"> = {
  status: "free",
  isPaid: false,
  currentPlan: null,
  trialEndsAt: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  loading: true,
};

// Backwards-compat: hook accepted a single positional `initial` arg in the
// old mock version. We accept and ignore it so existing call sites keep working.
export const useSubscription = (
  _initial?: unknown,
  _initialTrialEnd?: unknown
): SubscriptionState => {
  void _initial;
  void _initialTrialEnd;

  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] =
    useState<Omit<SubscriptionState, "isLocked" | "canAccess" | "refresh">>(DEFAULT);
  const userIdRef = useRef<string | null>(null);

  const applyRow = useCallback((row: SubRow | null) => {
    if (!row) {
      setState({ ...DEFAULT, loading: false });
      return;
    }
    const status = row.status as SubscriptionStatusReal;
    setState({
      status,
      isPaid: PAID_STATUSES.includes(status),
      currentPlan: (row.current_plan as "monthly" | "annual" | null) ?? null,
      trialEndsAt: row.trial_ends_at,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: !!row.cancel_at_period_end,
      loading: false,
    });
  }, []);

  const refresh = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) {
      setState({ ...DEFAULT, loading: false });
      return;
    }
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "status, current_plan, trial_ends_at, current_period_end, cancel_at_period_end"
      )
      .eq("user_id", uid)
      .maybeSingle();
    if (error) {
      console.warn("[useSubscription] fetch error:", error.message);
      setState({ ...DEFAULT, loading: false });
      return;
    }
    applyRow((data as unknown as SubRow) ?? null);
  }, [applyRow]);

  useEffect(() => {
    userIdRef.current = userId;
    if (!userId) {
      setState({ ...DEFAULT, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    void refresh();

    const channelName = `subscriptions:${userId}:${crypto.randomUUID()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const next = (payload.new as unknown as SubRow) ?? null;
          if (next) applyRow(next);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refresh, applyRow]);

  const isLocked = useCallback(
    (_feature: GatedFeature) => !PAID_STATUSES.includes(state.status),
    [state.status]
  );
  const canAccess = useCallback(
    (_feature: GatedFeature) => PAID_STATUSES.includes(state.status),
    [state.status]
  );

  return { ...state, isLocked, canAccess, refresh };
};
