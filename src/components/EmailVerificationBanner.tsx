// =====================================================================
// QINO — Email verification banner
// Persistent, non-blocking. Shows for users whose email is not yet
// confirmed. Lets them resend the verification email.
// =====================================================================

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { palette, fonts } from "../theme";

export const EmailVerificationBanner = ({ user }: { user: User }) => {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (user.email_confirmed_at) return null;
  if (!user.email) return null;

  const resend = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email!,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (!error) setSent(true);
  };

  return (
    <div
      className="px-4 py-2 text-[12px] flex items-center justify-between gap-3"
      style={{
        background: palette.softPeach,
        color: palette.midnight,
        fontFamily: fonts.body,
        borderBottom: `1px solid ${palette.hairline}`,
      }}
    >
      <span>
        Verify your email to secure your account.
      </span>
      <button
        onClick={resend}
        disabled={busy || sent}
        className="text-[12px] underline disabled:opacity-60"
        style={{ fontWeight: 600 }}
      >
        {sent ? "Sent ✓" : busy ? "Sending…" : "Resend"}
      </button>
    </div>
  );
};
