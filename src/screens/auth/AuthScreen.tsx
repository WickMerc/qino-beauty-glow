// =====================================================================
// QINO — AuthScreen (iteration 9)
// Combined sign up / log in / forgot password.
// Email + password (with confirmation) + Google OAuth.
// =====================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "../../integrations/supabase/client";
import { lovable } from "../../integrations/lovable";
import { palette, fonts } from "../../theme";
import { QinoMark } from "../../components/primitives";
import { track } from "../../lib/analytics";

type Mode = "signup" | "login" | "forgot";

export const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setInfo(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }
        const { error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signErr) {
          setError(signErr.message);
          track("auth_signup_failed", { reason: signErr.message });
          return;
        }
        track("auth_signup_submitted", { method: "email" });
        // Auth state listener will hand off; no manual nav needed.
      } else if (mode === "login") {
        const { error: signErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signErr) {
          setError(signErr.message);
          track("auth_login_failed", { reason: signErr.message });
          return;
        }
        track("auth_login_submitted", { method: "email" });
      } else {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${window.location.origin}/reset-password` }
        );
        if (resetErr) {
          setError(resetErr.message);
          return;
        }
        track("auth_password_reset_requested");
        setInfo("Check your inbox for a password reset link.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    reset();
    setBusy(true);
    try {
      track("auth_google_clicked", { mode });
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(
          result.error instanceof Error ? result.error.message : "Google sign-in failed."
        );
      }
    } finally {
      setBusy(false);
    }
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
            className="mt-6 text-[26px] leading-tight text-center"
            style={{ fontFamily: fonts.title, fontWeight: 600, color: palette.midnight }}
          >
            {mode === "signup" && "Create your QINO account"}
            {mode === "login" && "Welcome back"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p
            className="mt-2 text-[14px] text-center"
            style={{ color: palette.textDim }}
          >
            {mode === "signup" && "Your personalized aesthetics protocol starts here."}
            {mode === "login" && "Sign in to continue your protocol."}
            {mode === "forgot" && "We'll send you a link to set a new password."}
          </p>
        </div>

        {mode !== "forgot" && (
          <>
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="w-full h-12 rounded-xl flex items-center justify-center gap-2 mb-3 transition-opacity disabled:opacity-60"
              style={{
                background: palette.white,
                border: `1px solid ${palette.hairline}`,
                color: palette.midnight,
                fontFamily: fonts.subtitle,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <GoogleGlyph />
              Continue with Google
            </button>
            <Divider />
          </>
        )}

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
          <Field
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          {mode !== "forgot" && (
            <Field
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={8}
            />
          )}

          {error && (
            <p className="text-[13px]" style={{ color: "#B45151" }}>
              {error}
            </p>
          )}
          {info && (
            <p className="text-[13px]" style={{ color: palette.midnight }}>
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl mt-2 transition-opacity disabled:opacity-60"
            style={{
              background: palette.midnight,
              color: palette.white,
              fontFamily: fonts.subtitle,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "login"
                  ? "Sign in"
                  : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 items-center text-[13px]"
          style={{ color: palette.textDim }}
        >
          {mode === "login" && (
            <>
              <button onClick={() => { reset(); setMode("forgot"); }} className="underline">
                Forgot password?
              </button>
              <button onClick={() => { reset(); setMode("signup"); }}>
                New here? <span style={{ color: palette.midnight, fontWeight: 600 }}>Create account</span>
              </button>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => { reset(); setMode("login"); }}>
              Already have an account? <span style={{ color: palette.midnight, fontWeight: 600 }}>Sign in</span>
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => { reset(); setMode("login"); }}>
              ← Back to sign in
            </button>
          )}
        </div>

        {mode === "signup" && (
          <p
            className="mt-5 text-center text-[11.5px] leading-relaxed px-4"
            style={{ color: palette.textDim, fontFamily: fonts.body }}
          >
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="underline" style={{ color: palette.midnight }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline" style={{ color: palette.midnight }}>
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
};

const Field = ({
  type,
  placeholder,
  value,
  onChange,
  ...rest
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "placeholder">) => (
  <input
    {...rest}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-12 rounded-xl px-4 text-[14px] outline-none"
    style={{
      background: palette.white,
      border: `1px solid ${palette.hairline}`,
      color: palette.ink,
      fontFamily: fonts.body,
    }}
  />
);

const Divider = () => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-px" style={{ background: palette.hairline }} />
    <span className="text-[11px] uppercase tracking-wider" style={{ color: palette.textDim }}>
      or
    </span>
    <div className="flex-1 h-px" style={{ background: palette.hairline }} />
  </div>
);

const GoogleGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.5l6.2 5.3C41 35 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);
