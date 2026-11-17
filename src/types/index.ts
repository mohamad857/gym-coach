export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal = 'hypertrophy' | 'fat_loss' | 'strength';

export type SplitType = 'full_body' | 'upper_lower' | 'ppl_upper_lower' | 'ppl_x2';

export type MovementPattern =
  | 'chest_press'
  | 'chest_fly'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'shoulder_press'
  | 'lateral_raise'
  | 'quad_dominant'
  | 'hip_hinge'
  | 'hamstring_curl'
  | 'bicep_curl'
  | 'tricep_extension'
  | 'calves'
  | 'core';

export interface UserProfile {
  id: string;
  weightKg: number;
  heightCm: number;
  experienceLevel: ExperienceLevel;
  fitnessGoal: FitnessGoal;
  preferredDaysPerWeek: number; // 3, 4, 5, 6
  availableEquipment: string[];
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseFormCue {
  setup: string; // وضعية البداية
  tempo: string; // مسار الحركة والإيقاع
  mistake: string; // خطأ شائع احذره
}

export interface Exercise {
  id: string;
  nameAr: string;
  nameEn: string;
  targetMuscle: string;
  movementPattern: MovementPattern;
  equipmentRequired: string; // e.g., 'smith_machine', 'cable_crossover', etc.
  formCues: ExerciseFormCue;
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
  isCompound: boolean;
  alternateExerciseIds: string[];
}

export interface PlanExerciseTarget {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  restSec: number;
  notes?: string;
}

export interface WorkoutPlanDay {
  dayNumber: number;
  titleAr: string;
  subtitleAr: string;
  focusMuscles: string[];
  exercises: PlanExerciseTarget[];
}

export interface WorkoutPlan {
  id: string;
  nameAr: string;
  splitType: SplitType;
  goal: FitnessGoal;
  days: WorkoutPlanDay[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  completedAt?: string;
  isWarmup?: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseNameAr: string;
  exerciseNameEn: string;
  targetMuscle: string;
  sets: WorkoutSetLog[];
  swappedFromId?: string;
}

export interface WorkoutSessionLog {
  id: string;
  planId?: string;
  dayNumber: number;
  dayTitle: string;
  date: string; // YYYY-MM-DD
  exercises: WorkoutExerciseLog[];
  totalVolumeKg: number;
  totalReps: number;
  durationMinutes: number;
  isCompleted: boolean;
  startedAt: string;
  endedAt?: string;
  syncedToCloud?: boolean;
}

export interface ExerciseHistorySummary {
  exerciseId: string;
  exerciseNameAr: string;
  lastWeightKg: number;
  lastReps: number;
  lastSessionDate: string;
  maxWeightKg: number;
  estimated1RM: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseNameAr: string;
  maxWeightKg: number;
  maxReps: number;
  estimated1RM: number;
  achievedAt: string;
}
