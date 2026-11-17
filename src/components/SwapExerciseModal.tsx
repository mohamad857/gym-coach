import React from 'react';
import { X, ArrowRightLeft, Dumbbell, Check, Youtube } from 'lucide-react';
import { Exercise } from '../types';
import { getExerciseById, getYoutubeSearchUrl } from '../data/exercises';
import { getSwapCandidates } from '../services/workoutEngine';

interface SwapExerciseModalProps {
  currentExerciseId: string;
  userEquipment: string[];
  currentPlanExerciseIds: string[];
  onSelectSwap: (newExerciseId: string) => void;
  onClose: () => void;
}

export const SwapExerciseModal: React.FC<SwapExerciseModalProps> = ({
  currentExerciseId,
  userEquipment,
  currentPlanExerciseIds,
  onSelectSwap,
  onClose,
}) => {
  const current = getExerciseById(currentExerciseId);
  const candidates = getSwapCandidates(currentExerciseId, userEquipment, currentPlanExerciseIds);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gym-surface border border-gym-border w-full max-w-md rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gym-border/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">تبديل التمرين الحالي</h3>
              <p className="text-xs text-gym-muted">الجهاز مشغول؟ اختر بديلاً بنفس الكفاءة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gym-card text-gym-muted hover:text-white border border-gym-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Exercise Banner */}
        <div className="my-3 p-3 rounded-xl bg-gym-card border border-gym-border/60">
          <span className="text-[11px] text-gym-muted font-semibold block mb-0.5">التمرين الحالي:</span>
          <h4 className="font-bold text-sm text-white">{current.nameAr}</h4>
          <span className="text-[11px] text-cyan-400 font-semibold">{current.targetMuscle} • {current.defaultSets} مجموعات</span>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-0.5">
          <span className="text-xs font-bold text-slate-300 block mb-1">
            البدائل المتاحة وفق أجهزتك ({candidates.length}):
          </span>

          {candidates.length === 0 ? (
            <div className="p-6 text-center text-gym-muted text-sm bg-gym-card/50 rounded-xl border border-dashed border-gym-border">
              لا توجد بدائل إضافية بنفس الجهاز في قائمتك. يمكنك تجربة أداء التمرين بأوزان حرة أو دامبلز.
            </div>
          ) : (
            candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-3.5 rounded-xl bg-gym-card hover:bg-slate-800/90 border border-gym-border/70 hover:border-emerald-500/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {candidate.nameAr}
                    </h5>
                  </div>
                  <p className="text-[11px] text-gym-muted mt-0.5">{candidate.nameEn}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {candidate.targetMuscle}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {candidate.isCompound ? 'تمرين مركب' : 'تمرين عزل'}
                    </span>
                    <a
                      href={getYoutubeSearchUrl(candidate.nameEn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 underline mr-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Youtube className="w-3 h-3" />
                      فيديو
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSwap(candidate.id)}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs border border-emerald-500/40 transition-all flex items-center gap-1 shrink-0 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  اختيار
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-gym-border/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gym-card text-gym-muted hover:text-white text-xs font-semibold border border-gym-border"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
};

