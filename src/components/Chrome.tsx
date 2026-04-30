// =====================================================================
// QINO — Chrome (TopBar + BottomNav)
// Props-driven; consumes only UserProfile and tab id. No mock imports.
// =====================================================================

import {
  Home,
  Scan,
  Beaker,
  BarChart3,
  MessageCircle,
  Bell,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserProfile } from "../types";
import { palette, fonts, shadows } from "../theme";
import { QinoMark } from "./primitives";
import { AvatarMenu } from "./AvatarMenu";

// ---------- Top Bar ----------
export const TopBar = ({
  user,
  onBell,
}: {
  user: UserProfile;
  /** @deprecated kept for backwards compat — settings now lives in the avatar menu */
  onSettings?: () => void;
  onBell?: () => void;
}) => (
  <header className="flex items-center justify-between px-5 pt-3 pb-2">
    <div className="flex items-center gap-2">
      <QinoMark size={40} />
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onBell}
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: palette.white,
          border: `1px solid ${palette.hairline}`,
          boxShadow: shadows.card,
        }}
      >
        <Bell size={15} color={palette.midnight} strokeWidth={1.6} />
      </button>
      <AvatarMenu initial={user.initial} />
    </div>
  </header>
);

// ---------- Bottom Nav ----------
export type TabId = "today" | "analysis" | "protocol" | "progress" | "coach";

interface NavTab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const tabs: NavTab[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "analysis", label: "Analysis", icon: Scan },
  { id: "protocol", label: "Protocol", icon: Beaker },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "coach", label: "Coach", icon: MessageCircle },
];

export const BottomNav = ({
  active,
  onChange,
  lockedTabs = [],
}: {
  active: TabId;
  onChange: (id: TabId) => void;
  lockedTabs?: TabId[];
}) => (
  <nav
    className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40"
    style={{
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${palette.hairline}`,
      paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
    }}
  >
    <div className="flex items-center justify-around px-2 pt-2.5">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        const isLocked = lockedTabs.includes(t.id);
        return (
          <button
            key={t.id}
            onClick={() => !isLocked && onChange(t.id)}
            disabled={isLocked}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 flex-1 relative"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2 : 1.5}
              color={
                isLocked
                  ? palette.hairlineMid
                  : isActive
                    ? palette.midnight
                    : palette.textDim
              }
            />
            <span
              className="text-[10.5px]"
              style={{
                fontFamily: fonts.subtitle,
                fontWeight: 500,
                color: isLocked
                  ? palette.hairlineMid
                  : isActive
                    ? palette.midnight
                    : palette.textDim,
              }}
            >
              {t.label}
            </span>
            {isLocked && (
              <Lock
                size={8}
                color={palette.textDim}
                strokeWidth={2}
                className="absolute top-0 right-3"
              />
            )}
          </button>
        );
      })}
    </div>
  </nav>
);
