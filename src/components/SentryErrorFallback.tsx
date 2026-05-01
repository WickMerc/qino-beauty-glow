// =====================================================================
// QINO — Brand-styled error boundary fallback for Sentry.ErrorBoundary
// =====================================================================

import { palette, fonts } from "../theme";
import { QinoMark } from "./primitives";

interface Props {
  error: unknown;
  resetError: () => void;
}

export const SentryErrorFallback = ({ error: _error, resetError: _resetError }: Props) => {
  const onReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div
        className="max-w-[420px] w-full rounded-[24px] p-7 text-center"
        style={{ background: palette.white, border: `1px solid ${palette.hairline}` }}
      >
        <div className="flex justify-center mb-4">
          <QinoMark size={40} />
        </div>
        <h1
          className="text-[20px] mb-2"
          style={{ fontFamily: fonts.title, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          Something went sideways
        </h1>
        <p
          className="text-[13px] leading-relaxed mb-5"
          style={{ color: palette.textMuted }}
        >
          We've been notified and are looking into it. Refresh the page or reach out to{" "}
          <a
            href="mailto:support@qinoapp.com"
            style={{ color: palette.midnight, textDecoration: "underline" }}
          >
            support@qinoapp.com
          </a>{" "}
          if it persists.
        </p>
        <button
          onClick={onReload}
          className="w-full py-3 rounded-full"
          style={{ background: palette.midnight }}
        >
          <span
            className="text-[13px]"
            style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
          >
            Reload
          </span>
        </button>
      </div>
    </div>
  );
};
