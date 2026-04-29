// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement point:
//   POST /api/scan/submit  →  triggers analysis pipeline
//   GET  /api/me/analysis  →  AnalysisReport
// =====================================================================

import type { AnalysisReport } from "../types";

export const mockAnalysisReport: AnalysisReport = {
  id: "report_mock_1",
  generatedAt: "2025-04-29T08:00:00.000Z",
  headline: "Lower-face definition is priority #1",
  insight:
    "Your strongest gains will come from improving lower-face definition, skin consistency, and grooming frame before chasing advanced refinements.",

  currentPhase: {
    name: "Foundation Phase",
    mainFocus: "Lower-face definition + skin clarity",
    explanation:
      "Your highest-impact path is improving facial softness, skin consistency, and grooming frame before moving into advanced refinements.",
  },

  scores: [
    {
      id: "symmetry",
      label: "Symmetry",
      value: 86,
      status: "good",
      statusLabel: "Good",
      colorAccent: "mistAccent",
      bgAccent: "paleBlue",
    },
    {
      id: "skin_quality",
      label: "Skin Quality",
      value: 72,
      status: "fair",
      statusLabel: "Fair",
      colorAccent: "peachAccent",
      bgAccent: "softPeach",
    },
    {
      id: "structure",
      label: "Structure",
      value: 78,
      status: "good",
      statusLabel: "Good",
      colorAccent: "midnight",
      bgAccent: "softLavender",
    },
    {
      id: "grooming_frame",
      label: "Grooming Frame",
      value: 81,
      status: "good",
      statusLabel: "Good",
      colorAccent: "sageAccent",
      bgAccent: "softSage",
    },
  ],

  strengths: [
    {
      id: "strength_1",
      label: "High symmetry",
      sub: "Above population average",
      iconKey: "sparkles",
      accentKey: "softSage",
    },
    {
      id: "strength_2",
      label: "Strong facial structure",
      sub: "Defined nose bridge reads as a focal asset",
      iconKey: "activity",
      accentKey: "paleBlue",
    },
    {
      id: "strength_3",
      label: "Good proportions",
      sub: "Balanced thirds across face",
      iconKey: "layers",
      accentKey: "softPeach",
    },
    {
      id: "strength_4",
      label: "Strong hair / frame potential",
      sub: "Density and hairline in your favor",
      iconKey: "scissors",
      accentKey: "softLavender",
    },
  ],

  opportunities: [
    {
      id: "opp_1",
      label: "Lower-face definition",
      sub: "Reduce facial softness",
      impact: "high",
      iconKey: "activity",
      accentKey: "softBlush",
    },
    {
      id: "opp_2",
      label: "Skin evenness / texture",
      sub: "Daily protocol leverage",
      impact: "high",
      iconKey: "droplet",
      accentKey: "softPeach",
    },
    {
      id: "opp_3",
      label: "Grooming frame",
      sub: "Hair shape, brow cleanup",
      impact: "medium",
      iconKey: "scissors",
      accentKey: "softLavender",
    },
    {
      id: "opp_4",
      label: "Smile brightness",
      sub: "Polish the lower-face frame",
      impact: "medium",
      iconKey: "heart",
      accentKey: "softBlush",
    },
  ],

  priorities: {
    high: ["Lower-face definition", "Skin evenness", "Hair framing"],
    medium: ["Smile brightness", "Brow cleanup", "Under-eye health"],
    low: ["Ear proportion", "Minor symmetry details", "Advanced procedures"],
  },

  featureGroups: [
    {
      id: "facial_structure",
      title: "Facial Structure",
      iconKey: "sparkles",
      accentKey: "paleBlue",
      findings: [
        { key: "face_shape", label: "Face shape", value: "Oval" },
        { key: "symmetry", label: "Symmetry", value: "High" },
        { key: "proportions", label: "Proportions", value: "High" },
        { key: "averageness", label: "Averageness", value: "Above Average" },
      ],
      detail: {
        whyItMatters:
          "Facial structure sets the baseline of how every other feature reads. Your structure is already strong — the work here is preserving it through good skin and grooming, not changing it.",
        atHomeActions: [
          "Maintain consistent sleep position to preserve symmetry",
          "Hydration to reduce day-to-day puffiness",
          "Protect skin to maintain how structure appears over time",
          "Avoid aggressive treatments that don't add value here",
        ],
        productCategories: ["spf", "moisturizer"],
        treatmentRelevance: null,
        priorityLevel: "low",
      },
    },
    {
      id: "jaw_chin_neck",
      title: "Jaw, Chin & Neck",
      iconKey: "activity",
      accentKey: "softBlush",
      findings: [
        { key: "jaw_definition", label: "Jaw definition", value: "Soft" },
        { key: "chin_shape", label: "Chin shape", value: "Square" },
        { key: "neck_definition", label: "Neck definition", value: "Slightly Defined" },
        { key: "submental_softness", label: "Submental softness", value: "Mild" },
      ],
      detail: {
        whyItMatters:
          "Lower-face softness is the single highest-impact area for your face. Defining the jaw and submental area will visibly sharpen your overall presentation.",
        atHomeActions: [
          "Reduce facial softness through body composition awareness",
          "Hydration and sodium awareness to limit puffiness",
          "Sleep on back when possible to reduce morning swelling",
          "Posture work — chin tucks and neck alignment",
          "Limit late-night high-sodium meals",
        ],
        productCategories: ["moisturizer", "barrier"],
        treatmentRelevance:
          "If non-surgical paths plateau, jawline contouring options may be worth discussing with a qualified professional.",
        priorityLevel: "high",
      },
    },
    {
      id: "skin",
      title: "Skin",
      iconKey: "droplet",
      accentKey: "softPeach",
      findings: [
        { key: "undertone", label: "Undertone", value: "Olive" },
        { key: "blemishing", label: "Blemishing", value: "Minimal" },
        { key: "evenness", label: "Evenness", value: "Slightly Uneven" },
        { key: "texture", label: "Texture", value: "Slightly Textured" },
        { key: "oiliness", label: "Oiliness", value: "Low" },
      ],
      detail: {
        whyItMatters:
          "Skin is the canvas every other feature is read against. Slightly uneven and slightly textured skin is the easiest high-leverage win in your protocol.",
        atHomeActions: [
          "Daily SPF — single highest-leverage step",
          "Gentle non-stripping cleanse morning and night",
          "Hydrating moisturizer to support barrier",
          "Slow introduction of texture serum after week two",
          "Avoid over-exfoliation — barrier first",
        ],
        productCategories: ["cleanser", "moisturizer", "spf", "texture_serum", "barrier"],
        treatmentRelevance:
          "Chemical peels or microneedling may be worth discussing with a qualified professional once your home routine is consistent.",
        priorityLevel: "high",
      },
    },
    {
      id: "hair_frame",
      title: "Hair & Frame",
      iconKey: "scissors",
      accentKey: "softLavender",
      findings: [
        { key: "hairline", label: "Hairline", value: "Rounded" },
        { key: "hair_density", label: "Hair density", value: "Medium" },
        { key: "hair_volume", label: "Hair volume", value: "Medium" },
        { key: "brows", label: "Brows", value: "Arched / Moderate" },
      ],
      detail: {
        whyItMatters:
          "Hair and brow framing shape the entire upper face. Small grooming adjustments often produce the most visible week-one improvement.",
        atHomeActions: [
          "Consider a sharper hairstyle that complements face shape",
          "Light brow cleanup — shape, not removal",
          "Use volume-supporting hair product for daily styling",
          "Trim regularly to maintain shape, not length",
        ],
        productCategories: ["hair", "grooming"],
        treatmentRelevance: null,
        priorityLevel: "medium",
      },
    },
    {
      id: "eyes_nose_lips",
      title: "Eyes, Nose & Lips",
      iconKey: "eye",
      accentKey: "softSage",
      findings: [
        { key: "eyes", label: "Eyes", value: "Almond" },
        { key: "nose", label: "Nose", value: "Straight / Strong" },
        { key: "lips", label: "Lips", value: "Full / Slightly top-heavy" },
        { key: "smile", label: "Smile", value: "Full teeth exposure" },
      ],
      detail: {
        whyItMatters:
          "These are focal features. Your nose and eyes already read well. The leverage here is in lip care, smile polish, and managing under-eye health.",
        atHomeActions: [
          "Daily lip repair to support smile presentation",
          "Sleep consistency to reduce under-eye darkness",
          "Hydration to soften under-eye shadows",
          "Whitening toothpaste over time for smile polish",
        ],
        productCategories: ["lip", "oral"],
        treatmentRelevance:
          "Teeth whitening consultation may be worth discussing with a qualified professional.",
        priorityLevel: "medium",
      },
    },
  ],
};
