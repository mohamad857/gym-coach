import Dexie, { Table } from 'dexie';
import { UserProfile, WorkoutPlan, WorkoutSessionLog, PersonalRecord } from '../types';

export interface SyncQueueItem {
  id?: number;
  collection: 'user_profile' | 'workout_plan' | 'workout_logs';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export class GymCoachDB extends Dexie {
  user_profile!: Table<UserProfile, string>;
  workout_plan!: Table<WorkoutPlan, string>;
  workout_logs!: Table<WorkoutSessionLog, string>;
  personal_records!: Table<PersonalRecord, string>;
  sync_queue!: Table<SyncQueueItem, number>;

  constructor() {
    super('GymCoachProDB');
    this.version(1).stores({
      user_profile: 'id',
      workout_plan: 'id',
      workout_logs: 'id, date, dayNumber, isCompleted, planId',
      personal_records: 'exerciseId, maxWeightKg, estimated1RM',
      sync_queue: '++id, collection, timestamp'
    });
  }
}

export const db = new GymCoachDB();

// Helper functions for common offline queries
export async function getActiveUserProfile(): Promise<UserProfile | undefined> {
  const profiles = await db.user_profile.toArray();
  return profiles[0];
}

export async function getActiveWorkoutPlan(): Promise<WorkoutPlan | undefined> {
  const plans = await db.workout_plan.toArray();
  return plans[0];
}

export async function getWorkoutLogs(): Promise<WorkoutSessionLog[]> {
  return await db.workout_logs.orderBy('date').reverse().toArray();
}

export async function getExercisePreviousLog(exerciseId: string): Promise<{ weightKg: number; reps: number; date: string } | null> {
  const sessions = await db.workout_logs.where('isCompleted').equals(1).reverse().sortBy('date');
  for (const session of sessions) {
    const ex = session.exercises.find(e => e.exerciseId === exerciseId);
    if (ex && ex.sets.length > 0) {
      // Find the heaviest or best completed set
      const completedSets = ex.sets.filter(s => s.completed);
      if (completedSets.length > 0) {
        const bestSet = [...completedSets].sort((a, b) => b.weightKg - a.weightKg || b.reps - a.reps)[0];
        return {
          weightKg: bestSet.weightKg,
          reps: bestSet.reps,
          date: session.date
        };
      }
    }
  }
  return null;
}

export async function updatePersonalRecordsForSession(session: WorkoutSessionLog): Promise<void> {
  for (const ex of session.exercises) {
    for (const s of ex.sets) {
      if (s.completed && s.weightKg > 0 && s.reps > 0) {
        // Epley formula for 1RM: w * (1 + r/30)
        const estimated1RM = Math.round(s.weightKg * (1 + s.reps / 30) * 10) / 10;
        const currentPr = await db.personal_records.get(ex.exerciseId);

        if (!currentPr || s.weightKg > currentPr.maxWeightKg || estimated1RM > currentPr.estimated1RM) {
          await db.personal_records.put({
            exerciseId: ex.exerciseId,
            exerciseNameAr: ex.exerciseNameAr,
            maxWeightKg: Math.max(currentPr?.maxWeightKg || 0, s.weightKg),
            maxReps: s.reps,
            estimated1RM: Math.max(currentPr?.estimated1RM || 0, estimated1RM),
            achievedAt: session.date
          });
        }
      }
    }
  }
}

