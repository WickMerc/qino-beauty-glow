// =====================================================================
// QINO — WhatsIncludedScreen (iteration 11)
// Vertical premium-feeling page explaining each paid feature.
// Sticky bottom CTA routes to pricing or settings depending on state.
// =====================================================================

import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckSquare,
  Sparkles,
  Stethoscope,
  MessageCircle,
  Camera,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { palette, fonts, shadows } from "../theme";
import { Eyebrow, QinoMark } from "../components/primitives";
import { useSubscription } from "../hooks/useSubscription";
import { openCustomerPortal } from "../data/qinoApi";

interface Feature {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  tint: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    eyebrow: "Daily protocol",
    title: "A checkable system you can run every morning and night",
    body: "QINO turns your report into a focused daily list. You stop guessing what to do; you just check things off.",
    bullets: [
      "Cleanse with a low-pH gel (AM)",
      "Apply tretinoin pea-sized (PM, 3×/week)",
      "Jaw mewing — 2 minutes after brushing",
    ],
    tint: palette.softSage,
    icon: CheckSquare,
  },
  {
    eyebrow: "Personalized product stack",
    title: "Picks chosen for your skin, not for everyone’s skin",
    body: "Every product matches your skin type, sensitivity, and budget tier. No 12-step routine, no random influencer picks.",
    bullets: ["Cleanser", "Active treatment", "Moisturizer", "SPF 50", "Targeted spot care"],
    tint: palette.softBlush,
    icon: Sparkles,
  },
  {
    eyebrow: "Treatment pathways",
    title: "Four levels — pick the one that fits your comfort",
    body: "From at-home to clinical. Each pathway shows what it costs, what it changes, and what to expect.",
    bullets: ["At Home", "Products", "Clinic Consult", "Injectables / Surgery"],
    tint: palette.softLavender,
    icon: Stethoscope,
  },
  {
    eyebrow: "Unlimited Coach",
    title: "A second opinion that already knows your face",
    body: "Coach is grounded in your report. Ask anything — ingredients, timing, swaps — and get answers tied to your priorities.",
    bullets: [
      "“Can I use retinol with niacinamide?”",
      "“What’s the cheapest swap for my moisturizer?”",
    ],
    tint: palette.softPeach,
    icon: MessageCircle,
  },
  {
    eyebrow: "Progress tracking",
    title: "Real photos beat the mirror every time",
    body: "Upload the same six angles each month. QINO compares them so you see real change instead of relying on memory.",
    bullets: ["Monthly photo uploads", "Same six angles, same lighting", "Side-by-side comparison"],
    tint: palette.paleBlue,
    icon: Camera,
  },
  {
    eyebrow: "Quarterly re-analysis",
    title: "Re-scan every 90 days to recalibrate",
    body: "Your protocol updates with your face. As things change, QINO shifts your priorities so you’re always working on what matters now.",
    bullets: ["Updated priority map", "New protocol focus", "Refreshed product picks"],
    tint: palette.softSage,
    icon: RefreshCw,
  },
];

export const WhatsIncludedScreen = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const sub = useSubscription();
  const [busy, setBusy] = useState(false);

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  };

  const onCta = async () => {
    if (sub.isPaid) {
      setBusy(true);
      try {
        await openCustomerPortal();
      } catch {
        setBusy(false);
      }
    } else {
      navigate({ to: "/pricing" });
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[440px] mx-auto pb-32">
        <header
          className="flex items-center justify-between px-5 pt-3 pb-2 sticky top-0 z-10"
          style={{ background: palette.ivory }}
        >
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
            aria-label="Back"
          >
            <ArrowLeft size={16} color={palette.midnight} strokeWidth={1.7} />
          </button>
          <QinoMark size={36} />
          <div className="w-9 h-9" />
        </header>

        <div className="px-5 pt-4">
          <Eyebrow>What’s included</Eyebrow>
          <h1
            className="mt-2 text-[26px]"
            style={{
              fontFamily: fonts.title,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Six things QINO Premium does for you, every day
          </h1>
        </div>

        <div className="mt-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <section key={f.title} className="px-5 py-9">
                <div
                  className="rounded-[24px] p-6"
                  style={{
                    background: f.tint,
                    border: `1px solid ${palette.hairline}`,
                    boxShadow: shadows.card,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.7)" }}
                  >
                    <Icon size={18} color={palette.midnight} strokeWidth={1.7} />
                  </div>
                  <div className="mt-4">
                    <Eyebrow>{f.eyebrow}</Eyebrow>
                  </div>
                  <h2
                    className="mt-2 text-[20px]"
                    style={{
                      fontFamily: fonts.title,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      color: palette.ink,
                    }}
                  >
                    {f.title}
                  </h2>
                  <p
                    className="mt-3 text-[13px] leading-relaxed"
                    style={{ fontFamily: fonts.body, color: palette.ink, opacity: 0.8 }}
                  >
                    {f.body}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {f.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-[12.5px] flex items-start gap-2"
                        style={{ fontFamily: fonts.body, color: palette.ink }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                          style={{ background: palette.midnight }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: palette.ivory,
          borderTop: `1px solid ${palette.hairline}`,
        }}
      >
        <div className="max-w-[440px] mx-auto px-5 py-3">
          <button
            onClick={onCta}
            disabled={busy}
            className="w-full py-3.5 rounded-full"
            style={{ background: palette.midnight, opacity: busy ? 0.6 : 1 }}
          >
            <span
              className="text-[13.5px]"
              style={{ fontFamily: fonts.subtitle, fontWeight: 600, color: palette.stone }}
            >
              {sub.isPaid
                ? busy
                  ? "Opening…"
                  : "Manage subscription"
                : "Start your 3-day free trial"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
