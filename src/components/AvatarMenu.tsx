// =====================================================================
// QINO — AvatarMenu
// Tap-the-avatar contextual popover. Lives in TopBar.
// Items:
//   1. Verify email     (only if user.email_confirmed_at is null)
//   2. Settings         (disabled — coming in iteration 11)
//   3. Sign out         (clears Supabase session)
// Tap outside to close. Defensive against null user.
// =====================================================================

import { useEffect, useRef, useState } from "react";
import { Mail, Settings as SettingsIcon, LogOut, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { palette, fonts, shadows } from "../theme";
import { useAuth, signOut } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";

interface AvatarMenuProps {
  initial: string;
}

export const AvatarMenu = ({ initial }: AvatarMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [resendState, setResendState] =
    useState<"idle" | "sending" | "sent" | "error">("idle");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside tap
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const needsVerify = !!user && !user.email_confirmed_at && !!user.email;

  const handleResend = async () => {
    if (!user?.email || resendState === "sending") return;
    setResendState("sending");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });
    if (error) {
      console.warn("[AvatarMenu] resend failed:", error.message);
      setResendState("error");
      setTimeout(() => setResendState("idle"), 2500);
    } else {
      setResendState("sent");
      setTimeout(() => setResendState("idle"), 2500);
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${palette.softBlush} 0%, ${palette.softLavender} 100%)`,
          border: `1px solid ${palette.hairline}`,
        }}
      >
        <span
          className="text-[12px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.midnight }}
        >
          {initial}
        </span>
      </button>

      {open && user && (
        <div
          className="absolute right-0 top-[44px] z-50 w-[224px] overflow-hidden"
          style={{
            background: palette.white,
            borderRadius: 14,
            border: `1px solid ${palette.hairline}`,
            boxShadow: shadows.card,
          }}
        >
          {/* Email header */}
          <div
            className="px-3.5 pt-3 pb-2.5"
            style={{ borderBottom: `1px solid ${palette.hairline}` }}
          >
            <div
              className="text-[10.5px] uppercase tracking-[0.08em]"
              style={{ fontFamily: fonts.subtitle, color: palette.textDim }}
            >
              Signed in as
            </div>
            <div
              className="text-[12.5px] truncate mt-0.5"
              style={{ fontFamily: fonts.subtitle, fontWeight: 500, color: palette.ink }}
            >
              {user.email ?? "—"}
            </div>
          </div>

          {/* Items */}
          <div className="py-1">
            {needsVerify && (
              <MenuItem
                icon={resendState === "sent" ? Check : Mail}
                label={
                  resendState === "sending"
                    ? "Sending…"
                    : resendState === "sent"
                      ? "Sent ✓"
                      : resendState === "error"
                        ? "Try again"
                        : "Verify email"
                }
                onClick={handleResend}
                disabled={resendState === "sending" || resendState === "sent"}
              />
            )}
            <MenuItem
              icon={SettingsIcon}
              label="Settings"
              onClick={() => {
                setOpen(false);
                navigate({ to: "/settings" });
              }}
            />
            <MenuItem
              icon={LogOut}
              label="Sign out"
              onClick={handleSignOut}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Internal menu item ----------

interface MenuItemProps {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  hint?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItem = ({ icon: Icon, label, hint, onClick, disabled }: MenuItemProps) => {
  const [hover, setHover] = useState(false);
  const color = disabled ? palette.textDim : palette.ink;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left transition-colors"
      style={{
        background: hover && !disabled ? palette.ivory : "transparent",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={15} color={color} strokeWidth={1.7} />
        <span
          className="text-[13px]"
          style={{ fontFamily: fonts.subtitle, fontWeight: 500, color }}
        >
          {label}
        </span>
      </span>
      {hint && (
        <span
          className="text-[10.5px]"
          style={{ fontFamily: fonts.subtitle, color: palette.textDim }}
        >
          {hint}
        </span>
      )}
    </button>
  );
};
