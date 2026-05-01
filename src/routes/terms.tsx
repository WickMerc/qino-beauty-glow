// =====================================================================
// QINO — Terms of Service
// ⚠️ PLACEHOLDER — REQUIRES LEGAL REVIEW BEFORE LAUNCH ⚠️
// All copy below is a working draft. Replace with attorney-approved
// language before publishing to production.
// =====================================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { palette, fonts, shadows } from "@/theme";
import { QinoMark } from "@/components/primitives";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — QINO" },
      {
        name: "description",
        content:
          "The terms governing your use of QINO, including subscription, refunds, and acceptable use.",
      },
    ],
  }),
});

function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-1 text-[12px]" style={{ color: palette.textDim }}>
          Last updated: May 1, 2026 (draft)
        </p>

        <Section title="Using QINO">
          <p>
            QINO provides aesthetic guidance, daily protocols, and an AI
            Coach grounded in the report we generate from your photos and
            onboarding answers. QINO is for informational and lifestyle
            use only — it is not a medical service and does not replace
            professional medical advice, diagnosis, or treatment.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You must be at least 18 to use QINO. You're responsible for
            keeping your password safe and for activity under your
            account. Provide accurate information when signing up.
          </p>
        </Section>

        <Section title="Subscription & billing">
          <p>
            QINO Premium is billed monthly or annually via Stripe. A
            payment method is required to start your free trial. You may
            cancel anytime in settings — your access continues until the
            end of the current billing period. Subscriptions auto-renew
            unless canceled.
          </p>
        </Section>

        <Section title="Refunds">
          <p>
            Monthly subscriptions are non-refundable for time already
            elapsed. Annual subscriptions may be refunded on a prorated
            basis within the first 14 days. Email
            <span> support@qinoapp.com</span> to request a refund.
          </p>
        </Section>

        <Section title="Acceptable use">
          <p>
            Don't use QINO to harass others, upload images that aren't of
            yourself, attempt to reverse-engineer the service, or violate
            applicable laws.
          </p>
        </Section>

        <Section title="No medical advice">
          <p>
            <strong>Important:</strong> QINO is not a medical device.
            Always consult a qualified clinician before starting any new
            treatment, especially injectables, prescription topicals, or
            in-clinic procedures referenced in your protocol.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email
            <span> support@qinoapp.com</span>.
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
