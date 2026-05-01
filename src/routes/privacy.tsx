// =====================================================================
// QINO — Privacy Policy
// ⚠️ PLACEHOLDER — REQUIRES LEGAL REVIEW BEFORE LAUNCH ⚠️
// All copy below is a working draft. Replace with attorney-approved
// language before publishing to production.
// =====================================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { palette, fonts, shadows } from "@/theme";
import { QinoMark } from "@/components/primitives";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — QINO" },
      {
        name: "description",
        content:
          "How QINO collects, uses, and protects your personal data, photos, and aesthetic profile.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.ivory, fontFamily: fonts.body, color: palette.ink }}
    >
      <div className="max-w-[680px] mx-auto px-5 pt-3 pb-16">
        <header className="flex items-center justify-between pt-2 pb-4">
          <Link
            to="/"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: palette.white,
              border: `1px solid ${palette.hairline}`,
              boxShadow: shadows.card,
            }}
            aria-label="Home"
          >
            <ArrowLeft size={16} color={palette.midnight} strokeWidth={1.7} />
          </Link>
          <QinoMark size={36} />
          <div className="w-9 h-9" />
        </header>

        <ReviewBanner />

        <h1
          className="mt-4 text-[28px]"
          style={{
            fontFamily: fonts.title,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: palette.ink,
          }}
        >
          Privacy Policy
        </h1>
        <p className="mt-1 text-[12px]" style={{ color: palette.textDim }}>
          Last updated: May 1, 2026 (draft)
        </p>

        <Section title="What we collect">
          <p>
            When you use QINO we collect: account info (email, name), the
            answers you provide during onboarding, photos you upload for
            analysis and progress tracking, and the aesthetic reports we
            generate from them. We also collect basic usage analytics
            (pages viewed, features used) and error reports.
          </p>
        </Section>

        <Section title="How we use it">
          <p>
            Your data powers your personalized protocol and Coach. Photos
            are sent to our AI analysis providers strictly to generate your
            report and progress comparisons. We do not sell your data and
            we do not use your photos for training third-party models.
          </p>
        </Section>

        <Section title="Who can see your data">
          <p>
            Only you, and the QINO systems acting on your behalf. Our
            payment processor (Stripe) handles billing data — we never see
            or store your full card details. Our analytics provider
            (PostHog) receives anonymized usage events.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can delete your account at any time by emailing
            <span> support — </span>
            this removes your profile, answers, photos, and reports from
            our systems within 30 days. You can also request a copy of
            your data.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email
            <span> privacy@qinoapp.com</span>.
          </p>
        </Section>
      </div>
    </div>
  );
}

const ReviewBanner = () => (
  <div
    className="rounded-[14px] px-4 py-3 text-[12px] leading-relaxed"
    style={{
      background: palette.softPeach,
      border: `1px solid ${palette.hairline}`,
      color: palette.ink,
      fontFamily: fonts.body,
    }}
  >
    ⚠️ <strong>Draft — pending legal review.</strong> This page is a working
    placeholder. Replace with attorney-approved language before launch.
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-7">
    <h2
      className="text-[16px]"
      style={{
        fontFamily: fonts.subtitle,
        fontWeight: 600,
        color: palette.midnight,
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </h2>
    <div
      className="mt-2 text-[13.5px] leading-relaxed"
      style={{ color: palette.textMuted, fontFamily: fonts.body }}
    >
      {children}
    </div>
  </section>
);
