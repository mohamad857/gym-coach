import React, { useState } from 'react';
import { 
  Sparkles, 
  Dumbbell, 
  Calendar, 
  Target, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Scale, 
  Ruler, 
  Award,
  Zap
} from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel } from '../types';
import { EQUIPMENT_DEFINITIONS } from '../data/exercises';
import { db } from '../db';
import { generateSmartWorkoutPlan } from '../services/workoutEngine';
import { audioTimer } from '../services/audioTimer';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  // Form states
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('hypertrophy');
  const [preferredDays, setPreferredDays] = useState<number>(5);
  
  // Equipment checklist - prechecked with prompt's gym machines
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([
    'smith_machine',
    'cable_crossover',
    'seated_cable_row',
    'pec_deck',
    'leg_extension',
    'leg_press_45',
    'dumbbells_barbells',
    'bodyweight'
  ]);

  const toggleEquipment = (id: string) => {
    audioTimer.vibrate([15]);
    setSelectedEquipment(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    audioTimer.vibrate([50, 40, 80]);
    const profile: UserProfile = {
      id: 'default_user',
      weightKg,
      heightCm,
      experienceLevel,
      fitnessGoal,
      preferredDaysPerWeek: preferredDays,
      availableEquipment: selectedEquipment,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save profile to IndexedDB
    await db.user_profile.put(profile);

    // Generate optimal smart plan and save
    const plan = generateSmartWorkoutPlan(profile);
    await db.workout_plan.put(plan);

    onComplete(profile);
  };

  const nextStep = () => {
    audioTimer.vibrate([15]);
    setStep(s => Math.min(4, s + 1));
  };

  const prevStep = () => {
    audioTimer.vibrate([15]);
    setStep(s => Math.max(1, s - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gym-bg/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-gym-surface border border-gym-border rounded-3xl p-6 shadow-2xl relative my-auto">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-gym-muted font-bold block">مساعد الإعداد الذكي</span>
              <h2 className="text-sm font-extrabold text-white">الخطوة {step} من 4</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-emerald-400 glow-neon'
                    : i < step
                    ? 'w-2 bg-emerald-700'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Body Metrics & Experience */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white">البيانات البدنية ومستوى الخبرة</h3>
              <p className="text-xs text-gym-muted mt-1">تُستخدم لمعايرة الأحمال ومعدل الزيادة التدريجية في الأوزان</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
              <div className="p-3.5 bg-gym-card rounded-2xl border border-gym-border/70">
                <div className="flex items-center gap-1.5 text-xs text-gym-muted font-semibold mb-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>الوزن الحالي</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-20 text-center text-2xl font-black font-mono text-white bg-transparent focus:outline-none"
                  />
                  <span className="text-xs text-gym-muted font-bold">كجم</span>
                </div>
              </div>

              {/* Height */}
              <div className="p-3.5 bg-gym-card rounded-2xl border border-gym-border/70">
                <div className="flex items-center gap-1.5 text-xs text-gym-muted font-semibold mb-2">
                  <Ruler className="w-4 h-4 text-cyan-400" />
                  <span>الطول</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-20 text-center text-2xl font-black font-mono text-white bg-transparent focus:outline-none"
                  />
                  <span className="text-xs text-gym-muted font-bold">سم</span>
                </div>
              </div>
            </div>

            {/* Experience Level Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                مستواك التدريبي في الجيم:
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner' as ExperienceLevel, label: 'مبتدئ', desc: 'أقل من 6 شهور' },
                  { id: 'intermediate' as ExperienceLevel, label: 'متوسط', desc: '6 شهور - سنتين' },
                  { id: 'advanced' as ExperienceLevel, label: 'متقدم', desc: 'أكثر من سنتين' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      experienceLevel === lvl.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-glow-green font-bold'
                        : 'bg-gym-card border-gym-border text-gym-muted hover:text-white'
                    }`}
                  >
                    <span className="block text-sm font-bold">{lvl.label}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Fitness Goal */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white">ما هو هدفك الرياضي الرئيسي؟</h3>
              <p className="text-xs text-gym-muted mt-1">يحدد المحرك الذكي نطاق التكرارات وفترات الراحة بين المجموعات</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'hypertrophy' as FitnessGoal,
                  title: 'تضخيم عضلي (Hypertrophy)',
                  desc: 'بناء أقصى كتلة عضلية، 8-12 تكرار مع راحة 75-90 ثانية لزيادة التوتر العضلي الميكانيكي.',
                  badge: 'الأكثر شيوعاً'
                },
                {
                  id: 'fat_loss' as FitnessGoal,
                  title: 'تنشيف وحرق دهون (Fat Loss & Toning)',
                  desc: 'حرق دهون مشدد ونحت الألياف، 12-15 تكرار مع فترات راحة سريعة 60 ثانية لرفع الحرق الأيضي.',
                  badge: 'نحت وتعريف'
                },
                {
                  id: 'strength' as FitnessGoal,
                  title: 'زيادة القوة البدنية (Strength)',
                  desc: 'كسر أوزان ورفع القوة القصوى، 4-6 تكرارات ثقيلة للمركبات مع راحة كاملة 120-180 ثانية للجهاز العصبي.',
                  badge: 'أوزان ثقيلة'
                },
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setFitnessGoal(goal.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    fitnessGoal === goal.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-glow-green'
                      : 'bg-gym-card border-gym-border/80 text-gym-muted hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-white">{goal.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      fitnessGoal === goal.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {goal.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gym-muted leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Weekly Schedule */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white">جدول تدريبك الأسبوعي</h3>
              <p className="text-xs text-gym-muted mt-1">كم يوماً تفضل التمرين في الأسبوع؟</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { days: 3, label: '3 أيام تمرين', split: 'فول بودي (Full Body A/B/C)', rest: '4 أيام راحة' },
                { days: 4, label: '4 أيام تمرين', split: 'علوي / سفلي (Upper / Lower)', rest: '3 أيام راحة' },
                { days: 5, label: '5 أيام تمرين (موصى به)', split: 'Push / Pull / Legs / Upper / Lower', rest: 'يومان راحة' },
                { days: 6, label: '6 أيام تمرين', split: 'PPL مضاعف مرتين أسبوعياً', rest: 'يوم واحد راحة' },
              ].map((sch) => (
                <div
                  key={sch.days}
                  onClick={() => setPreferredDays(sch.days)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    preferredDays === sch.days
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-glow-green'
                      : 'bg-gym-card border-gym-border/70 text-gym-muted hover:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-white">{sch.label}</span>
                      {sch.days === 5 && (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                          الأمثل
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 block mt-1">{sch.split}</span>
                  </div>
                  <span className="text-[11px] text-gym-muted mt-3 block">{sch.rest}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Equipment Checklist */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white">الأجهزة المتاحة في جيمك</h3>
              <p className="text-xs text-gym-muted mt-1">
                سيقتصر المدرب الذكي في توليد التمارين والبدائل على هذه القائمة فقط:
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {EQUIPMENT_DEFINITIONS.map((eq) => {
                const isSelected = selectedEquipment.includes(eq.id);

                return (
                  <div
                    key={eq.id}
                    onClick={() => toggleEquipment(eq.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                        : 'bg-gym-card border-gym-border/60 text-gym-muted hover:text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">{eq.nameAr}</span>
                      <span className="text-[11px] text-gym-muted">{eq.nameEn}</span>
                    </div>

                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="mt-6 pt-4 border-t border-gym-border/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2.5 rounded-xl bg-gym-card border border-gym-border text-gym-muted hover:text-white font-bold text-xs flex items-center gap-1 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="gym-btn-primary px-5 py-2.5 text-xs font-black flex items-center gap-1.5"
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="gym-btn-primary px-6 py-2.5 text-xs font-black flex items-center gap-1.5 shadow-glow-green"
            >
              <Sparkles className="w-4 h-4" />
              توليد خطتي الذكية والبدء
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

