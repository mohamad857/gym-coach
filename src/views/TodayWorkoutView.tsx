import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  CheckCircle2, 
  Flame, 
  Clock, 
  RotateCcw, 
  Trophy, 
  Dumbbell, 
  Calendar,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { WorkoutPlan, WorkoutSessionLog, WorkoutExerciseLog, WorkoutSetLog, UserProfile } from '../types';
import { getExerciseById } from '../data/exercises';
import { ExerciseCard } from '../components/ExerciseCard';
import { FloatingRestTimer } from '../components/FloatingRestTimer';
import { SwapExerciseModal } from '../components/SwapExerciseModal';
import { db, updatePersonalRecordsForSession } from '../db';
import { syncService } from '../services/syncService';
import { audioTimer } from '../services/audioTimer';

interface TodayWorkoutViewProps {
  plan: WorkoutPlan;
  profile: UserProfile;
  onNavigateToProgress: () => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  plan,
  profile,
  onNavigateToProgress,
}) => {
  // Select active day (defaults to Day 1 or next unfinished)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeSession, setActiveSession] = useState<WorkoutSessionLog | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [swapTargetExerciseId, setSwapTargetExerciseId] = useState<string | null>(null);

  // Floating Rest Timer state
  const [restTimerConfig, setRestTimerConfig] = useState<{
    visible: boolean;
    seconds: number;
    exerciseName: string;
  }>({
    visible: false,
    seconds: 90,
    exerciseName: '',
  });

  const activeDay = plan.days.find(d => d.dayNumber === selectedDayNumber) || plan.days[0];

  // Initialize or load today's session draft
  useEffect(() => {
    if (!activeDay) return;

    const todayDate = new Date().toISOString().slice(0, 10);

    // Look for an existing unfinished session for today and this dayNumber
    db.workout_logs
      .where('date')
      .equals(todayDate)
      .and(log => log.dayNumber === activeDay.dayNumber && !log.isCompleted)
      .first()
      .then((existing) => {
        if (existing) {
          setActiveSession(existing);
          setIsSessionActive(true);
        } else {
          // Initialize fresh draft from plan
          const exercises: WorkoutExerciseLog[] = activeDay.exercises.map(pe => {
            const ex = getExerciseById(pe.exerciseId);
            const sets: WorkoutSetLog[] = Array.from({ length: pe.targetSets }, (_, i) => ({
              setNumber: i + 1,
              weightKg: 20,
              reps: 10,
              completed: false,
            }));

            return {
              exerciseId: pe.exerciseId,
              exerciseNameAr: ex?.nameAr || 'تمرين',
              exerciseNameEn: ex?.nameEn || 'Exercise',
              targetMuscle: ex?.targetMuscle || '',
              sets,
            };
          });

          const newSession: WorkoutSessionLog = {
            id: `session_${Date.now()}`,
            planId: plan.id,
            dayNumber: activeDay.dayNumber,
            dayTitle: activeDay.titleAr,
            date: todayDate,
            exercises,
            totalVolumeKg: 0,
            totalReps: 0,
            durationMinutes: 0,
            isCompleted: false,
            startedAt: new Date().toISOString(),
          };

          setActiveSession(newSession);
        }
      });
  }, [activeDay, plan.id]);

  // Session duration timer
  useEffect(() => {
    let timer: number;
    if (isSessionActive) {
      timer = window.setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  if (!activeDay || !activeSession) {
    return <div className="p-8 text-center text-gym-muted">جارِ تجهيز تمرين اليوم...</div>;
  }

  // Calculate progress stats
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  let currentVolume = 0;

  activeSession.exercises.forEach(e => {
    e.sets.forEach(s => {
      totalSetsCount++;
      if (s.completed) {
        completedSetsCount++;
        currentVolume += s.weightKg * s.reps;
      }
    });
  });

  const progressPct = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  // Handlers
  const handleUpdateSets = async (exerciseIdx: number, newSets: WorkoutSetLog[]) => {
    setIsSessionActive(true);
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exerciseIdx] = {
      ...updatedExercises[exerciseIdx],
      sets: newSets,
    };

    const updatedSession: WorkoutSessionLog = {
      ...activeSession,
      exercises: updatedExercises,
    };

    setActiveSession(updatedSession);
    await db.workout_logs.put(updatedSession);
  };

  const handleTriggerRestTimer = (restSec: number, exerciseName: string) => {
    setRestTimerConfig({
      visible: true,
      seconds: restSec,
      exerciseName,
    });
  };

  const handleSwapExercise = async (newExerciseId: string) => {
    if (!swapTargetExerciseId) return;

    const newEx = getExerciseById(newExerciseId);
    if (!newEx) return;

    const updatedExercises = activeSession.exercises.map(e => {
      if (e.exerciseId === swapTargetExerciseId) {
        return {
          ...e,
          exerciseId: newEx.id,
          exerciseNameAr: newEx.nameAr,
          exerciseNameEn: newEx.nameEn,
          targetMuscle: newEx.targetMuscle,
          swappedFromId: swapTargetExerciseId,
        };
      }
      return e;
    });

    const updatedSession = { ...activeSession, exercises: updatedExercises };
    setActiveSession(updatedSession);
    await db.workout_logs.put(updatedSession);
    setSwapTargetExerciseId(null);
  };

  const handleFinishWorkout = async () => {
    audioTimer.vibrate([100, 50, 100, 50, 300]);
    audioTimer.playRestCompleteChime();

    // Trigger celebration confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#06B6D4', '#F59E0B', '#3B82F6'],
    });

    let totalReps = 0;
    let totalVolume = 0;

    activeSession.exercises.forEach(e => {
      e.sets.forEach(s => {
        if (s.completed) {
          totalReps += s.reps;
          totalVolume += s.weightKg * s.reps;
        }
      });
    });

    const completedSession: WorkoutSessionLog = {
      ...activeSession,
      isCompleted: true,
      totalReps,
      totalVolumeKg: totalVolume,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      endedAt: new Date().toISOString(),
    };

    // Save to IndexedDB
    await db.workout_logs.put(completedSession);

    // Update Personal Records
    await updatePersonalRecordsForSession(completedSession);

    // Background sync to Cloud if online
    syncService.triggerAutoSync();

    setIsSessionActive(false);
    onNavigateToProgress();
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pb-28 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      
      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {plan.days.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setSelectedDayNumber(d.dayNumber)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
              selectedDayNumber === d.dayNumber
                ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-green'
                : 'bg-gym-card text-gym-muted hover:text-white border border-gym-border'
            }`}
          >
            اليوم {d.dayNumber}
          </button>
        ))}
      </div>

      {/* Today's Workout Hero Banner */}
      <div className="gym-card p-4 sm:p-5 relative overflow-hidden border-emerald-500/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{activeDay.subtitleAr}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{activeDay.titleAr}</h2>
            <p className="text-xs text-gym-muted mt-1">
              العضلات المستهدفة: {activeDay.focusMuscles.join(' • ')}
            </p>
          </div>

          {/* Live Workout Duration Counter */}
          <div className="text-left bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
            <div className="flex items-center gap-1 text-[10px] text-gym-muted font-semibold">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>المدة</span>
            </div>
            <span className="font-mono text-sm font-black text-white">
              {formatTimer(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Live Completion Progress Bar */}
        <div className="mt-4 pt-3 border-t border-gym-border/60">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">
              المجموعات المنجزة: <strong className="text-emerald-400 font-mono">{completedSetsCount}</strong> / {totalSetsCount}
            </span>
            <span className="text-emerald-400 font-mono">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 glow-neon"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {activeSession.exercises.map((exLog, idx) => {
          const planTarget = activeDay.exercises.find(e => e.exerciseId === exLog.exerciseId) || activeDay.exercises[idx];

          return (
            <ExerciseCard
              key={`${exLog.exerciseId}_${idx}`}
              exerciseLog={exLog}
              targetSets={planTarget?.targetSets || 3}
              targetReps={planTarget?.targetReps || '10-12'}
              defaultRestSec={planTarget?.restSec || 75}
              userEquipment={profile.availableEquipment}
              allActiveExerciseIds={activeSession.exercises.map(e => e.exerciseId)}
              onUpdateSets={(newSets) => handleUpdateSets(idx, newSets)}
              onSwapExercise={(exId) => setSwapTargetExerciseId(exId)}
              onTriggerRestTimer={handleTriggerRestTimer}
            />
          );
        })}
      </div>

      {/* Finish & Save Workout CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleFinishWorkout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-black text-base shadow-glow-green flex items-center justify-center gap-2 transition-all"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.8]" />
          إنهاء وحفظ جلسة تمرين اليوم ({Math.round(currentVolume)} كجم مرفوع)
        </button>
      </div>

      {/* Floating Rest Countdown Timer */}
      {restTimerConfig.visible && (
        <FloatingRestTimer
          initialSeconds={restTimerConfig.seconds}
          exerciseName={restTimerConfig.exerciseName}
          onClose={() => setRestTimerConfig(prev => ({ ...prev, visible: false }))}
        />
      )}

      {/* Exercise Swap Modal */}
      {swapTargetExerciseId && (
        <SwapExerciseModal
          currentExerciseId={swapTargetExerciseId}
          userEquipment={profile.availableEquipment}
          currentPlanExerciseIds={activeSession.exercises.map(e => e.exerciseId)}
          onSelectSwap={handleSwapExercise}
          onClose={() => setSwapTargetExerciseId(null)}
        />
      )}

    </div>
  );
};

