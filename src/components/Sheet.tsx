// =====================================================================
// QINO — Sheet (bottom-sheet modal)
// Used for Product Stack and Pathways modals from the Analysis Report.
// Slides up from bottom on mobile; dismissible by tapping backdrop.
// =====================================================================

import { ReactNode } from "react";
import { X } from "lucide-react";
import { palette, fonts, shadows } from "../theme";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  /** Optional sticky footer (e.g. CTA button row). */
  footer?: ReactNode;
}

export const Sheet = ({ open, onClose, title, eyebrow, children, footer }: SheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0"
        style={{
          background: "rgba(15, 27, 38, 0.45)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[440px] rounded-t-[28px] qino-sheet-rise"
        style={{
          background: palette.ivory,
          boxShadow: "0 -20px 50px rgba(15, 27, 38, 0.20)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{`
          @keyframes qinoSheetRise {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .qino-sheet-rise { animation: qinoSheetRise 280ms cubic-bezier(0.16, 1, 0.3, 1); }
        `}</style>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: palette.hairlineMid }}
          />
        </div>

        {/* Header */}
        <header className="px-5 pb-4 flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0">
            {eyebrow && (
              <p
                className="text-[11px] uppercase"
                style={{
                  fontFamily: fonts.subtitle,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: palette.textMuted,
                }}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="mt-1 text-[22px]"
                style={{
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.15,
                  color: palette.ink,
                }}
              >
                {title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ml-3"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
          >
            <X size={15} color={palette.midnight} strokeWidth={1.8} />
          </button>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {children}
        </div>

        {/* Sticky footer */}
        {footer && (
          <div
            className="flex-shrink-0 px-5 pt-3 border-t"
            style={{
              borderColor: palette.hairline,
              background: palette.ivory,
              paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
