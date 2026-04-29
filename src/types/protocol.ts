// =====================================================================
// QINO — Protocol types
// 90-day plan, phases, daily routines, individual tasks.
// =====================================================================

export type ProtocolPhaseState = "active" | "locked" | "completed";

export interface ProtocolPhase {
  id: string;                  // "foundation"
  number: number;              // 1, 2, 3
  name: string;                // "Foundation"
  dayRange: string;            // "Days 1–30"
  state: ProtocolPhaseState;
  focus: string;               // short description shown in preview
}

export interface DailyTask {
  id: string;
  label: string;               // "Cleanser"
  completed: boolean;
}

export type RoutineGroupId = "morning" | "foundation" | "evening";

export interface RoutineGroup {
  id: RoutineGroupId;
  label: string;               // "Morning Routine"
  sub: string;                 // "Skin basics"
  iconKey: string;             // "sun" | "activity" | "moon"
  bgAccentKey: string;         // palette key
  fillAccentKey: string;       // palette key for progress fill
  tasks: DailyTask[];
}

export interface ProtocolModule {
  id: string;
  title: string;               // "Skin Routine"
  iconKey: string;
  accentKey: string;
  totalItems: number;
  completedItems: number;
}

export interface Protocol {
  phases: ProtocolPhase[];
  currentPhaseId: string;
  currentDay: number;          // 12
  totalDays: number;           // 90
  percentComplete: number;     // 13
  routines: RoutineGroup[];
  modules: ProtocolModule[];
  ignoreForNow: string[];
}
