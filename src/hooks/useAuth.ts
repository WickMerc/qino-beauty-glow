// =====================================================================
// QINO — useAuth hook (iteration 9)
// Subscribes to Supabase auth state. Exposes session/user/loading.
// IMPORTANT: onAuthStateChange listener is set up BEFORE getSession
// to avoid missing events.
// =====================================================================

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener FIRST so we don't miss the initial SIGNED_IN event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    // Then hydrate from existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
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
