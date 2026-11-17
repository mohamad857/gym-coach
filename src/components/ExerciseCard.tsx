import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Youtube, 
  HelpCircle, 
  Sparkles, 
  ArrowRightLeft, 
  Plus, 
  Minus, 
  Trash2, 
  History,
  ShieldAlert
} from 'lucide-react';
import { Exercise, WorkoutSetLog, WorkoutExerciseLog } from '../types';
import { getExerciseById, getYoutubeSearchUrl } from '../data/exercises';
import { getExercisePreviousLog } from '../db';
import { audioTimer } from '../services/audioTimer';

interface ExerciseCardProps {
  exerciseLog: WorkoutExerciseLog;
  targetSets: number;
  targetReps: string;
  defaultRestSec: number;
  userEquipment: string[];
  allActiveExerciseIds: string[];
  onUpdateSets: (sets: WorkoutSetLog[]) => void;
  onSwapExercise: (newExerciseId: string) => void;
  onTriggerRestTimer: (restSec: number, exerciseName: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseLog,
  targetSets,
  targetReps,
  defaultRestSec,
  userEquipment,
  allActiveExerciseIds,
  onUpdateSets,
  onSwapExercise,
  onTriggerRestTimer,
}) => {
  const [showCoach, setShowCoach] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [prevLog, setPrevLog] = useState<{ weightKg: number; reps: number; date: string } | null>(null);

  const exercise = getExerciseById(exerciseLog.exerciseId);

  // Fetch previous performance for progressive overload comparison
  useEffect(() => {
    let isMounted = true;
    getExercisePreviousLog(exerciseLog.exerciseId).then((data) => {
      if (isMounted) setPrevLog(data);
    });
    return () => {
      isMounted = false;
    };
  }, [exerciseLog.exerciseId]);

  if (!exercise) return null;

  // Progressive Overload recommendation engine
  const computeOverloadRecommendation = () => {
    if (!prevLog || prevLog.weightKg <= 0) return null;

    // Parse target reps range (e.g. "8-12" or "10-12" or "12-15")
    const repParts = targetReps.split('-').map(n => parseInt(n.trim(), 10));
    const maxTargetReps = repParts.length === 2 ? repParts[1] : parseInt(targetReps, 10) || 10;

    // If previous performance hit or exceeded the upper rep target
    if (prevLog.reps >= maxTargetReps) {
      const increment = exercise.isCompound ? (exercise.movementPattern === 'quad_dominant' ? 5 : 2.5) : 1.25;
      return {
        type: 'increase',
        suggestedWeight: prevLog.weightKg + increment,
        badgeText: `💡 مقترح اليوم: ارفع الوزن +${increment} كجم (حققّت التكرار المستهدف سابقاً)`,
      };
    } else {
      return {
        type: 'maintain',
        suggestedWeight: prevLog.weightKg,
        badgeText: `🎯 حافظ على ${prevLog.weightKg} كجم وحاول زيادة تكرار إضافي لتصل لـ ${maxTargetReps}`,
      };
    }
  };

  const overloadSuggestion = computeOverloadRecommendation();

  // Handle Set checkmark toggle
  const handleToggleSet = (index: number) => {
    const updated = exerciseLog.sets.map((s, idx) => {
      if (idx === index) {
        const nextCompleted = !s.completed;
        if (nextCompleted) {
          audioTimer.playSetCompleted();
          // Auto-trigger floating countdown rest timer
          onTriggerRestTimer(defaultRestSec, exercise.nameAr);
        } else {
          audioTimer.vibrate([20]);
        }
        return {
          ...s,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });
    onUpdateSets(updated);
  };

  const handleUpdateWeight = (index: number, newWeight: number) => {
    const safeWeight = Math.max(0, Math.round(newWeight * 10) / 10);
    const updated = exerciseLog.sets.map((s, idx) => {
      if (idx === index) return { ...s, weightKg: safeWeight };
      return s;
    });
    onUpdateSets(updated);
  };

  const handleUpdateReps = (index: number, newReps: number) => {
    const safeReps = Math.max(0, Math.round(newReps));
    const updated = exerciseLog.sets.map((s, idx) => {
      if (idx === index) return { ...s, reps: safeReps };
      return s;
    });
    onUpdateSets(updated);
  };

  const handleAddSet = () => {
    const lastSet = exerciseLog.sets[exerciseLog.sets.length - 1];
    const newSet: WorkoutSetLog = {
      setNumber: exerciseLog.sets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : (prevLog?.weightKg || 20),
      reps: lastSet ? lastSet.reps : 10,
      completed: false,
    };
    audioTimer.vibrate([15]);
    onUpdateSets([...exerciseLog.sets, newSet]);
  };

  const handleRemoveSet = (index: number) => {
    if (exerciseLog.sets.length <= 1) return;
    const updated = exerciseLog.sets
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    audioTimer.vibrate([20]);
    onUpdateSets(updated);
  };

  return (
    <div className="gym-card p-4 sm:p-5 relative overflow-hidden transition-all duration-200">
      
      {/* Exercise Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              {exercise.nameAr}
            </h3>
            {exerciseLog.swappedFromId && (
              <span className="text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-bold">
                بديل مُختار
              </span>
            )}
          </div>
          <p className="text-xs text-gym-muted mt-0.5">{exercise.nameEn}</p>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold border border-slate-700">
              {exercise.targetMuscle}
            </span>
            <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/20">
              الهدف: {targetSets} مجموعات × {targetReps} تكرار
            </span>
            <span className="text-[11px] text-gym-muted">
              راحة: {defaultRestSec} ثانية
            </span>
          </div>
        </div>

        {/* Quick Exercise Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Swap Exercise Button */}
          <button
            onClick={() => onSwapExercise(exercise.id)}
            className="p-2 rounded-xl bg-gym-surface hover:bg-slate-800 text-gym-muted hover:text-cyan-400 border border-gym-border active:scale-95 transition-all"
            title="تبديل التمرين (في حال كان الجهاز مشغولاً)"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          {/* Form Coach Toggle */}
          <button
            onClick={() => setShowCoach(!showCoach)}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              showCoach
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-gym-surface hover:bg-slate-800 border-gym-border text-gym-muted'
            }`}
            title="تعليمات الأداء الصحيح (أوفلاين)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Previous Performance Badge & Progressive Overload Suggestion */}
      <div className="space-y-1.5 mb-3">
        {prevLog ? (
          <div className="flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
            <History className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>آخر مرة: <strong className="text-white font-mono">{prevLog.weightKg} كجم</strong> × <strong className="text-white font-mono">{prevLog.reps} تكرارات</strong></span>
            <span className="text-[10px] text-gym-muted mr-auto font-mono">({prevLog.date})</span>
          </div>
        ) : (
          <div className="text-[11px] text-gym-muted bg-slate-900/50 px-2.5 py-1 rounded-lg">
            أول جلسة مسجلة لهذا التمرين. ابدأ بوزن إحمائي مناسب.
          </div>
        )}

        {/* Smart Overload Badge */}
        {overloadSuggestion && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-emerald-300 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{overloadSuggestion.badgeText}</span>
          </div>
        )}
      </div>

      {/* Offline Step-by-Step Form Coach (Collapsible) */}
      {showCoach && (
        <div className="mb-4 p-3.5 rounded-xl bg-gym-surface border border-emerald-500/30 space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gym-border/70 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
              <span>طريقة الأداء الصحيح (كوتش أوفلاين):</span>
            </div>
            
            {/* Online Video Link Button */}
            <a
              href={getYoutubeSearchUrl(exercise.nameEn)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg transition-all"
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              فيديو التمرين (يوتيوب)
            </a>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-white font-semibold">وضعية البداية: </strong>
                {exercise.formCues.setup}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-white font-semibold">مسار الحركة والإيقاع: </strong>
                {exercise.formCues.tempo}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-amber-400 font-semibold">احذر هذا الخطأ الشائع: </strong>
                {exercise.formCues.mistake}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set-by-Set Logging Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-gym-muted px-2">
          <div className="col-span-2 text-center">المجموعة</div>
          <div className="col-span-4 text-center">الوزن (كجم)</div>
          <div className="col-span-4 text-center">التكرارات</div>
          <div className="col-span-2 text-center">إتمام</div>
        </div>

        {exerciseLog.sets.map((set, idx) => {
          const isDone = set.completed;

          return (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-gym-surface/80 border-gym-border/70 hover:border-slate-600'
              }`}
            >
              {/* Set Number */}
              <div className="col-span-2 text-center font-bold text-xs">
                <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${
                  isDone ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                }`}>
                  {set.setNumber}
                </span>
              </div>

              {/* Weight Controls */}
              <div className="col-span-4 flex items-center justify-center gap-1 bg-gym-card rounded-lg p-1 border border-gym-border/50">
                <button
                  type="button"
                  onClick={() => handleUpdateWeight(idx, set.weightKg - 2.5)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs active:scale-95 shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.5"
                  value={set.weightKg === 0 ? '' : set.weightKg}
                  placeholder="0"
                  onChange={(e) => handleUpdateWeight(idx, parseFloat(e.target.value) || 0)}
                  className="w-12 text-center bg-transparent font-mono font-bold text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateWeight(idx, set.weightKg + 2.5)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center text-xs active:scale-95 shrink-0"
                >
                  +
                </button>
              </div>

              {/* Reps Controls */}
              <div className="col-span-4 flex items-center justify-center gap-1 bg-gym-card rounded-lg p-1 border border-gym-border/50">
                <button
                  type="button"
                  onClick={() => handleUpdateReps(idx, set.reps - 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs active:scale-95 shrink-0"
                >
                  -
                </button>
                <input
                  type="number"
                  value={set.reps === 0 ? '' : set.reps}
                  placeholder="0"
                  onChange={(e) => handleUpdateReps(idx, parseInt(e.target.value, 10) || 0)}
                  className="w-10 text-center bg-transparent font-mono font-bold text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateReps(idx, set.reps + 1)}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center text-xs active:scale-95 shrink-0"
                >
                  +
                </button>
              </div>

              {/* Completion Checkmark Button */}
              <div className="col-span-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleToggleSet(idx)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-green'
                      : 'bg-slate-800/90 text-slate-400 hover:text-white border border-slate-700 hover:border-emerald-500/50'
                  }`}
                  title={isDone ? 'تمت المجموعة (انقر للإلغاء)' : 'تسجيل إتمام المجموعة وبدء عداد الراحة'}
                >
                  <Check className={`w-5 h-5 ${isDone ? 'stroke-[3.5]' : 'stroke-2'}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Remove Set Row */}
      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gym-border/60">
        <button
          type="button"
          onClick={handleAddSet}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          إضافة مجموعة أخرى
        </button>

        {exerciseLog.sets.length > 1 && (
          <button
            type="button"
            onClick={() => handleRemoveSet(exerciseLog.sets.length - 1)}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-[11px] px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-3 h-3" />
            حذف الأخيرة
          </button>
        )}
      </div>

    </div>
  );
};

