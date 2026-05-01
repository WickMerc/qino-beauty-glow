// =====================================================================
// QINO — useAuth hook (iteration 12)
// Adds Sentry + PostHog user identify/reset on auth transitions.
// =====================================================================

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import * as Sentry from "@sentry/react";
import { supabase } from "../integrations/supabase/client";
import { identify as phIdentify, reset as phReset, track } from "../lib/analytics";

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const applyIdentity = (user: User | null) => {
  if (user) {
    try {
      Sentry.setUser({ id: user.id, email: user.email ?? undefined });
    } catch {}
    phIdentify(user.id, {
      email: user.email,
      signup_at: user.created_at,
    });
  } else {
    try {
      Sentry.setUser(null);
    } catch {}
    phReset();
  }
};

export const useAuth = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setLoading(false);
      applyIdentity(newSession?.user ?? null);
      if (event === "SIGNED_IN") {
        track("signup_completed");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      applyIdentity(data.session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
  };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
