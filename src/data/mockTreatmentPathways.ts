// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   GET /api/me/pathways → TreatmentPathways
// Comfort gating logic stays client-side; level visibility uses
// the user's onboarding `comfort` answer.
// =====================================================================

import type { TreatmentPathways } from "../types";

export const mockTreatmentPathways: TreatmentPathways = {
  comfortSummary: "Open to: Products + Clinics",
  levels: [
    {
      number: 1,
      title: "At Home",
      sub: "Always available",
      accentKey: "softSage",
      gated: false,
      items: [
        { id: "h1", label: "Daily skincare", language: "Educational guidance only" },
        { id: "h2", label: "Grooming frame", language: "Educational guidance only" },
        { id: "h3", label: "Hydration", language: "Educational guidance only" },
        { id: "h4", label: "Sleep consistency", language: "Educational guidance only" },
      ],
    },
    {
      number: 2,
      title: "Products",
      sub: "Active in your stack",
      accentKey: "paleBlue",
      gated: false,
      items: [
        { id: "p1", label: "SPF", language: "Worth using daily" },
        { id: "p2", label: "Moisturizer", language: "Worth using daily" },
        { id: "p3", label: "Retinoid / retinol alternative", language: "May be relevant" },
        { id: "p4", label: "Lip care", language: "Worth using daily" },
        { id: "p5", label: "Hair product", language: "Worth using daily" },
      ],
    },
    {
      number: 3,
      title: "Clinic Consult",
      sub: "Educational only",
      accentKey: "softLavender",
      gated: false,
      items: [
        { id: "c1", label: "Acne scar consult", language: "Worth discussing with a qualified professional" },
        { id: "c2", label: "Chemical peel discussion", language: "Worth discussing with a qualified professional" },
        { id: "c3", label: "Microneedling discussion", language: "Worth discussing with a qualified professional" },
        { id: "c4", label: "Laser resurfacing discussion", language: "Worth discussing with a qualified professional" },
        { id: "c5", label: "Teeth whitening consultation", language: "Worth discussing with a qualified professional" },
      ],
    },
    {
      number: 4,
      title: "Injectables / Surgery",
      sub: "Educational only",
      accentKey: "softBlush",
      gated: true,
      items: [
        { id: "i1", label: "Filler consultation", language: "Worth discussing with a qualified professional" },
        { id: "i2", label: "Neuromodulator discussion", language: "Worth discussing with a qualified professional" },
        { id: "i3", label: "Surgical consult — chin/jaw", language: "Worth discussing with a qualified professional" },
        { id: "i4", label: "Surgical consult — rhinoplasty", language: "Worth discussing with a qualified professional" },
      ],
    },
  ],
};
