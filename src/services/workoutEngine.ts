import { UserProfile, WorkoutPlan, WorkoutPlanDay, PlanExerciseTarget, FitnessGoal, MovementPattern } from '../types';
import { EXERCISES_DATABASE, getAvailableExercisesForEquipment, getExerciseById } from '../data/exercises';

export function generateSmartWorkoutPlan(profile: UserProfile): WorkoutPlan {
  const availableExercises = getAvailableExercisesForEquipment(profile.availableEquipment);
  const daysCount = Math.max(3, Math.min(6, profile.preferredDaysPerWeek || 5));
  const goal = profile.fitnessGoal;

  let splitType: WorkoutPlan['splitType'] = 'ppl_upper_lower';
  let days: WorkoutPlanDay[] = [];

  if (daysCount === 3) {
    splitType = 'full_body';
    days = [
      generateDayRoutine(1, 'اليوم 1: فول بودي (تركيز دفع وأفخاذ)', 'Full Body A', ['chest', 'quads', 'back', 'shoulders', 'arms'], availableExercises, goal),
      generateDayRoutine(2, 'اليوم 2: فول بودي (تركيز سحب وخلفيات)', 'Full Body B', ['back', 'hamstrings', 'chest', 'biceps', 'core'], availableExercises, goal),
      generateDayRoutine(3, 'اليوم 3: فول بودي (توازن وشمول)', 'Full Body C', ['legs', 'chest', 'back', 'shoulders', 'arms'], availableExercises, goal),
    ];
  } else if (daysCount === 4) {
    splitType = 'upper_lower';
    days = [
      generateDayRoutine(1, 'اليوم 1: الجزء العلوي A (قوة وبناء)', 'Upper Body A', ['chest_press', 'horizontal_pull', 'shoulder_press', 'arms'], availableExercises, goal),
      generateDayRoutine(2, 'اليوم 2: الجزء السفلي A (أفخاذ وسمانة)', 'Lower Body A', ['quad_dominant', 'hip_hinge', 'calves', 'core'], availableExercises, goal),
      generateDayRoutine(3, 'اليوم 3: الجزء العلوي B (حجم وكثافة)', 'Upper Body B', ['vertical_pull', 'chest_fly', 'lateral_raise', 'arms'], availableExercises, goal),
      generateDayRoutine(4, 'اليوم 4: الجزء السفلي B (خلفيات وعضلات عميقة)', 'Lower Body B', ['hip_hinge', 'quad_dominant', 'calves', 'core'], availableExercises, goal),
    ];
  } else if (daysCount === 5) {
    splitType = 'ppl_upper_lower';
    days = [
      generateDayRoutine(1, 'اليوم 1: بوش (دفع: صدر وأكتاف وتراي)', 'Push Day (Chest, Shoulders, Triceps)', ['chest_press', 'chest_fly', 'shoulder_press', 'lateral_raise', 'tricep_extension'], availableExercises, goal),
      generateDayRoutine(2, 'اليوم 2: بول (سحب: ظهر ومجنص وباي)', 'Pull Day (Back, Lats, Biceps)', ['horizontal_pull', 'vertical_pull', 'horizontal_pull', 'bicep_curl', 'bicep_curl'], availableExercises, goal),
      generateDayRoutine(3, 'اليوم 3: ليجز (أرجل وبطات كاملة)', 'Legs Day (Quads, Hamstrings, Calves)', ['quad_dominant', 'quad_dominant', 'hip_hinge', 'calves', 'core'], availableExercises, goal),
      generateDayRoutine(4, 'اليوم 4: الجزء العلوي (قوة وتناسق عالي)', 'Upper Power & Pump', ['chest_press', 'horizontal_pull', 'shoulder_press', 'tricep_extension', 'bicep_curl'], availableExercises, goal),
      generateDayRoutine(5, 'اليوم 5: الجزء السفلي والبطن (تثبيت ونحت)', 'Lower & Core Finish', ['quad_dominant', 'hip_hinge', 'calves', 'core'], availableExercises, goal),
    ];
  } else {
    // 6 Days: PPL x 2
    splitType = 'ppl_x2';
    days = [
      generateDayRoutine(1, 'اليوم 1: بوش A (تركيز أوزان ثقيلة)', 'Push A', ['chest_press', 'chest_fly', 'shoulder_press', 'tricep_extension'], availableExercises, goal),
      generateDayRoutine(2, 'اليوم 2: بول A (توسيع الظهر واللاتس)', 'Pull A', ['vertical_pull', 'horizontal_pull', 'bicep_curl', 'core'], availableExercises, goal),
      generateDayRoutine(3, 'اليوم 3: ليجز A (تركيز فخذ أمامي وسكوات)', 'Legs A', ['quad_dominant', 'quad_dominant', 'calves', 'core'], availableExercises, goal),
      generateDayRoutine(4, 'اليوم 4: بوش B (تركيز عزل وألياف عليا)', 'Push B', ['chest_press', 'lateral_raise', 'chest_fly', 'tricep_extension'], availableExercises, goal),
      generateDayRoutine(5, 'اليوم 5: بول B (كثافة ألياف وسحب أرضي)', 'Pull B', ['horizontal_pull', 'vertical_pull', 'bicep_curl', 'core'], availableExercises, goal),
      generateDayRoutine(6, 'اليوم 6: ليجز B (خلفيات وسمانة)', 'Legs B', ['hip_hinge', 'quad_dominant', 'calves', 'core'], availableExercises, goal),
    ];
  }

  const goalTitles: Record<FitnessGoal, string> = {
    hypertrophy: 'خطة التضخيم العضلي العلمي (Hypertrophy Split)',
    fat_loss: 'خطة التنشيف وحرق الدهون (Fat Loss & Toning)',
    strength: 'خطة زيادة القوة وكسر الأوزان (Strength Progression)'
  };

  return {
    id: `plan_${Date.now()}`,
    nameAr: goalTitles[goal],
    splitType,
    goal,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateDayRoutine(
  dayNumber: number,
  titleAr: string,
  subtitleAr: string,
  patterns: (MovementPattern | string)[],
  availablePool: typeof EXERCISES_DATABASE,
  goal: FitnessGoal
): WorkoutPlanDay {
  const chosenExercises: PlanExerciseTarget[] = [];
  const usedExerciseIds = new Set<string>();

  for (const pattern of patterns) {
    // Find candidate exercises matching this pattern or general muscle
    let candidates = availablePool.filter(e => {
      if (usedExerciseIds.has(e.id)) return false;
      return e.movementPattern === pattern || e.targetMuscle.includes(pattern);
    });

    // Fallback if no exact match: take any unused exercise from available pool
    if (candidates.length === 0) {
      candidates = availablePool.filter(e => !usedExerciseIds.has(e.id));
    }

    if (candidates.length > 0) {
      // Pick best compound first for earlier exercises, then isolation
      const isEarly = chosenExercises.length < 2;
      const sorted = [...candidates].sort((a, b) => {
        if (isEarly && a.isCompound !== b.isCompound) {
          return a.isCompound ? -1 : 1;
        }
        return 0;
      });

      const chosen = sorted[0];
      usedExerciseIds.add(chosen.id);

      // Tailor sets and reps based on goal and compound status
      const { sets, reps, rest } = getGoalParameters(goal, chosen.isCompound);

      chosenExercises.push({
        exerciseId: chosen.id,
        targetSets: sets,
        targetReps: reps,
        restSec: rest,
      });
    }
  }

  return {
    dayNumber,
    titleAr,
    subtitleAr,
    focusMuscles: Array.from(new Set(chosenExercises.map(e => getExerciseById(e.exerciseId)?.targetMuscle || ''))).filter(Boolean),
    exercises: chosenExercises,
  };
}

function getGoalParameters(goal: FitnessGoal, isCompound: boolean) {
  if (goal === 'strength') {
    return {
      sets: isCompound ? 4 : 3,
      reps: isCompound ? '4-6' : '6-8',
      rest: isCompound ? 150 : 90
    };
  } else if (goal === 'fat_loss') {
    return {
      sets: 3,
      reps: isCompound ? '10-12' : '12-15',
      rest: 60
    };
  } else {
    // Hypertrophy (Default)
    return {
      sets: isCompound ? 4 : 3,
      reps: isCompound ? '8-10' : '10-12',
      rest: isCompound ? 90 : 75
    };
  }
}

/**
 * Exercise Swap Helper:
 * Finds eligible alternatives strictly from the user's available equipment.
 */
export function getSwapCandidates(
  currentExerciseId: string,
  userEquipment: string[],
  currentPlanExerciseIds: string[]
) {
  const current = getExerciseById(currentExerciseId);
  if (!current) return [];

  const available = getAvailableExercisesForEquipment(userEquipment);

  return available.filter(candidate => {
    if (candidate.id === currentExerciseId) return false;
    if (currentPlanExerciseIds.includes(candidate.id)) return false;

    // Match movement pattern, or listed alternate, or target muscle
    const matchesPattern = candidate.movementPattern === current.movementPattern;
    const isExplicitAlternate = current.alternateExerciseIds.includes(candidate.id);
    const matchesMuscle = candidate.targetMuscle === current.targetMuscle;

    return matchesPattern || isExplicitAlternate || matchesMuscle;
  });
}

