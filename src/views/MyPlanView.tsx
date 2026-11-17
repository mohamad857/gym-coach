import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  RotateCcw, 
  Dumbbell, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Youtube
} from 'lucide-react';
import { WorkoutPlan, UserProfile } from '../types';
import { getExerciseById, EQUIPMENT_DEFINITIONS, getYoutubeSearchUrl } from '../data/exercises';
import { generateSmartWorkoutPlan } from '../services/workoutEngine';
import { db } from '../db';
import { audioTimer } from '../services/audioTimer';

interface MyPlanViewProps {
  plan: WorkoutPlan;
  profile: UserProfile;
  onPlanUpdated: (newPlan: WorkoutPlan) => void;
}

export const MyPlanView: React.FC<MyPlanViewProps> = ({ plan, profile, onPlanUpdated }) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const activeDay = plan.days.find(d => d.dayNumber === selectedDayNumber) || plan.days[0];

  const handleRegeneratePlan = async () => {
    if (!window.confirm('هل ترغب في إعادة توليد جدول التدريب بالذكاء الاصطناعي بناءً على إعداداتك وأجهزتك الحالية؟')) {
      return;
    }

    setIsRegenerating(true);
    audioTimer.vibrate([30, 20, 50]);

    setTimeout(async () => {
      const newPlan = generateSmartWorkoutPlan(profile);
      await db.workout_plan.put(newPlan);
      onPlanUpdated(newPlan);
      setIsRegenerating(false);
    }, 400);
  };

  const goalName = {
    hypertrophy: 'تضخيم عضلي مبرمج (Hypertrophy)',
    fat_loss: 'تنشيف وحرق دهون (Fat Loss)',
    strength: 'زيادة القوة القصوى (Strength)',
  }[profile.fitnessGoal];

  return (
    <div className="pb-28 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      
      {/* Plan Header Card */}
      <div className="gym-card p-4 sm:p-5 border-emerald-500/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>نظام التمرين العلمي الذكي</span>
            </div>
            <h2 className="text-lg font-black text-white">{plan.nameAr}</h2>
            <p className="text-xs text-gym-muted mt-1">
              {profile.preferredDaysPerWeek} أيام تمرين أسبوعياً • الهدف: {goalName}
            </p>
          </div>

          <button
            onClick={handleRegeneratePlan}
            disabled={isRegenerating}
            className="p-2.5 rounded-xl bg-gym-surface hover:bg-slate-800 text-gym-muted hover:text-emerald-400 border border-gym-border active:scale-95 transition-all flex items-center gap-1 shrink-0"
            title="إعادة توليد الخطة"
          >
            <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Available Equipment Badges */}
        <div className="mt-4 pt-3 border-t border-gym-border/60">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">الأجهزة المعتمدة في خطتك:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {profile.availableEquipment.map(eqId => {
              const def = EQUIPMENT_DEFINITIONS.find(d => d.id === eqId);
              if (!def) return null;
              return (
                <span
                  key={eqId}
                  className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/80 font-medium"
                >
                  {def.nameAr}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Days Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {plan.days.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setSelectedDayNumber(d.dayNumber)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
              selectedDayNumber === d.dayNumber
                ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-green'
                : 'bg-gym-card text-gym-muted hover:text-white border border-gym-border'
            }`}
          >
            اليوم {d.dayNumber}: {d.subtitleAr.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Selected Day Routine Overview */}
      {activeDay && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-extrabold text-white text-base">{activeDay.titleAr}</h3>
              <p className="text-xs text-emerald-400">{activeDay.exercises.length} تمارين مخصصة</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {activeDay.exercises.map((target, idx) => {
              const ex = getExerciseById(target.exerciseId);
              if (!ex) return null;
              const isExpanded = expandedExerciseId === ex.id;

              return (
                <div
                  key={ex.id}
                  className="gym-card p-3.5 transition-all hover:border-slate-600"
                >
                  <div 
                    onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                    className="flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{ex.nameAr}</h4>
                        <span className="text-[11px] text-gym-muted">
                          {ex.targetMuscle} • {target.targetSets} مجموعات × {target.targetReps} تكرار
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gym-muted">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Form Cues */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gym-border/60 text-xs space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400">تعليمات التدريب:</span>
                        <a
                          href={getYoutubeSearchUrl(ex.nameEn)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                        >
                          <Youtube className="w-3 h-3 text-red-500" />
                          فيديو التمرين
                        </a>
                      </div>

                      <div className="space-y-1.5 text-slate-300 text-[11px]">
                        <div><strong className="text-white">وضعية البداية: </strong>{ex.formCues.setup}</div>
                        <div><strong className="text-white">المسار: </strong>{ex.formCues.tempo}</div>
                        <div className="text-amber-400"><strong className="text-amber-300">احذر: </strong>{ex.formCues.mistake}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

