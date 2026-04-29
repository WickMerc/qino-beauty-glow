// =====================================================================
// QINO — Progress, Scan, and Coach types
// =====================================================================

// ---------- Progress ---------------------------------------------------
export type TrendDirection = "up" | "flat" | "down";

export interface TrendMetric {
  id: string;
  label: string;               // "Skin Clarity"
  value: string;               // "Improving"
  delta: string;               // "↑ 4" | "→" | "—"
  direction: TrendDirection;
  accentKey: string;
  bgAccentKey: string;
}

export interface ProgressPhotoEntry {
  id: string;
  day: string;                 // "Day 1"
  uploaded: boolean;
  bgAccentKey: string;
}

export interface ProgressState {
  currentDay: number;
  totalDays: number;
  executionPercent: number;
  photosUploaded: number;
  photosRequired: number;
  streakDays: number;
  nextReviewLabel: string;     // "Friday"
  reanalysisInDays: number;
  reanalysisDateLabel: string; // "Jun 14, 2025"
  overallProgressPercent: number;
  onTrack: boolean;
  trends: TrendMetric[];
  photos: ProgressPhotoEntry[];
}

// ---------- Scan -------------------------------------------------------
export type ValidationState = "good" | "warn" | "bad";

export interface ScanAngle {
  id: string;                  // "front"
  label: string;               // "Front neutral"
  instruction: string;
  angleHint: string;
  uploaded: boolean;
  approved?: boolean;
}

export interface ScanValidation {
  lighting: ValidationState;
  sharpness: ValidationState;
  centered: ValidationState;
  angle: ValidationState;
}

export interface ScanProcessingPhase {
  id: string;
  label: string;
  accentKey: string;
}

export interface ScanState {
  angles: ScanAngle[];
  currentAngleIndex: number;
  validation: ScanValidation;
  processingPhases: ScanProcessingPhase[];
}

// ---------- Coach ------------------------------------------------------
export type CoachRole = "user" | "qino";

export interface CoachMessage {
  id: string;
  role: CoachRole;
  text: string;
  createdAt?: string;          // ISO
}

export interface CoachPrompt {
  id: string;
  text: string;
  iconKey: string;
  accentKey: string;
}

export interface CoachState {
  messages: CoachMessage[];
  suggestedPrompts: CoachPrompt[];
}
