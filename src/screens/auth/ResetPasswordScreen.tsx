// =====================================================================
// QINO — ResetPasswordScreen
// Mounted at /reset-password. Reads the recovery token from URL,
// lets the user set a new password, then redirects home.
// =====================================================================

import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { palette, fonts } from "../../theme";
import { QinoMark } from "../../components/primitives";

export const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check immediately
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      window.location.replace("/");
    }, 1500);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <QinoMark size={56} />
          <h1
            className="mt-6 text-[24px] text-center"
            style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.midnight }}
          >
            Set a new password
          </h1>
        </div>

        {done ? (
          <p className="text-center" style={{ color: palette.midnight }}>
            Password updated. Redirecting…
          </p>
        ) : !ready ? (
          <p className="text-center text-[13px]" style={{ color: palette.textDim }}>
            Verifying reset link…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full h-12 rounded-xl px-4 text-[14px] outline-none"
              style={{
                background: palette.white,
                border: `1px solid ${palette.hairline}`,
                color: palette.ink,
                fontFamily: fonts.body,
              }}
            />
            {error && (
              <p className="text-[13px]" style={{ color: "#B45151" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-xl mt-2 disabled:opacity-60"
              style={{
                background: palette.midnight,
                color: palette.white,
                fontFamily: fonts.subtitle,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
