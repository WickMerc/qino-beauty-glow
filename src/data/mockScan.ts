// =====================================================================
// MOCK DATA ONLY
// This will be replaced by Supabase/API data during backend integration.
// Backend replacement points:
//   POST /api/scan/photos → upload + per-photo validation
//   POST /api/scan/submit → triggers analysis, returns AnalysisReport id
// =====================================================================

import type { ScanState } from "../types";

export const mockScanState: ScanState = {
  currentAngleIndex: 0,
  validation: {
    lighting: "good",
    sharpness: "good",
    centered: "good",
    angle: "warn",
  },
  angles: [
    {
      id: "front",
      label: "Front neutral",
      instruction: "Look straight, soft expression, mouth relaxed.",
      angleHint: "Face camera directly",
      uploaded: false,
    },
    {
      id: "smile",
      label: "Front smile",
      instruction: "Natural smile, full teeth visible.",
      angleHint: "Same angle, smile naturally",
      uploaded: false,
    },
    {
      id: "left",
      label: "Left profile",
      instruction: "Turn fully to your right (your left side faces camera).",
      angleHint: "Turn 90° right",
      uploaded: false,
    },
    {
      id: "right",
      label: "Right profile",
      instruction: "Turn fully to your left (your right side faces camera).",
      angleHint: "Turn 90° left",
      uploaded: false,
    },
    {
      id: "fortyfive",
      label: "45-degree",
      instruction: "Half-turn from front, head straight.",
      angleHint: "Turn slightly left",
      uploaded: false,
    },
    {
      id: "skin",
      label: "Skin close-up",
      instruction: "Cheek area, natural light, no zoom blur.",
      angleHint: "Move closer to cheek",
      uploaded: false,
    },
  ],
  processingPhases: [
    { id: "structure", label: "Analyzing facial structure", accentKey: "mistAccent" },
    { id: "skin", label: "Checking skin texture", accentKey: "peachAccent" },
    { id: "jaw", label: "Mapping jaw, chin & neck", accentKey: "lavenderAccent" },
    { id: "priorities", label: "Building priority map", accentKey: "blushAccent" },
    { id: "protocol", label: "Creating 90-day protocol", accentKey: "sageAccent" },
    { id: "pathways", label: "Preparing product & pathways", accentKey: "mistAccent" },
  ],
};

export const scanPrepChecklist = [
  { iconKey: "sun", text: "Use soft natural light", accentKey: "softPeach" },
  { iconKey: "eye", text: "Remove glasses", accentKey: "paleBlue" },
  { iconKey: "camera", text: "Keep camera at eye level", accentKey: "softSage" },
  { iconKey: "scissors", text: "Pull hair away from face if possible", accentKey: "softLavender" },
  { iconKey: "heart", text: "Use a neutral expression unless asked to smile", accentKey: "softBlush" },
];
