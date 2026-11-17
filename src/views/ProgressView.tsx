import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Trophy, 
  Flame, 
  Scale, 
  Calendar, 
  Dumbbell, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Activity
} from 'lucide-react';
import { WorkoutSessionLog, PersonalRecord } from '../types';
import { db } from '../db';
import { EXERCISES_DATABASE } from '../data/exercises';

export const ProgressView: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutSessionLog[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('smith_incline_press');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const allLogs = await db.workout_logs.where('isCompleted').equals(1).sortBy('date');
      const allPrs = await db.personal_records.toArray();
      if (isMounted) {
        setLogs(allLogs);
        setPrs(allPrs);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Overall KPI Stats
  let totalVolumeKg = 0;
  let totalRepsCompleted = 0;
  logs.forEach(l => {
    totalVolumeKg += l.totalVolumeKg || 0;
    totalRepsCompleted += l.totalReps || 0;
  });

  // Prepare Volume Over Time Chart Data (Last 10 sessions)
  const volumeChartData = logs.slice(-10).map((log, idx) => ({
    session: `جلسة ${idx + 1}`,
    date: log.date.slice(5),
    volume: Math.round(log.totalVolumeKg),
  }));

  // Prepare Estimated 1RM Progression for Selected Exercise
  const exerciseHistory = logs
    .filter(session => session.exercises.some(e => e.exerciseId === selectedExerciseId))
    .map(session => {
      const ex = session.exercises.find(e => e.exerciseId === selectedExerciseId);
      let best1RM = 0;
      let heaviestWeight = 0;

      if (ex) {
        ex.sets.forEach(s => {
          if (s.completed && s.weightKg > 0 && s.reps > 0) {
            const e1rm = s.weightKg * (1 + s.reps / 30);
            if (e1rm > best1RM) best1RM = e1rm;
            if (s.weightKg > heaviestWeight) heaviestWeight = s.weightKg;
          }
        });
      }

      return {
        date: session.date.slice(5),
        estimated1RM: Math.round(best1RM * 10) / 10,
        heaviestWeight,
      };
    })
    .filter(item => item.estimated1RM > 0);

  // Exercises that have been performed at least once
  const performedExerciseIds = Array.from(
    new Set(
      logs.flatMap(l => l.exercises.map(e => e.exerciseId))
    )
  );

  return (
    <div className="pb-28 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Total Volume */}
        <div className="gym-card p-4 border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gym-muted mb-2 font-semibold">
            <span>إجمالي الأوزان</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black font-mono text-white">
              {totalVolumeKg > 1000 ? `${(totalVolumeKg / 1000).toFixed(1)} طن` : `${Math.round(totalVolumeKg)} كجم`}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">حجم تمرين متراكم</span>
          </div>
        </div>

        {/* Sessions Count */}
        <div className="gym-card p-4 border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gym-muted mb-2 font-semibold">
            <span>الجلسات المكتملة</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black font-mono text-white">{logs.length}</span>
            <span className="text-[10px] text-cyan-400 font-bold block mt-0.5">جلسة تدريب ناجحة</span>
          </div>
        </div>

      </div>

      {/* CHART 1: Total Volume Progression (Local Recharts) */}
      <div className="gym-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 glow-neon" />
            <h3 className="text-sm font-extrabold text-white">تطور حجم التمرين (الحمل الكلي)</h3>
          </div>
          <span className="text-[11px] text-gym-muted font-mono">كجم</span>
        </div>

        {volumeChartData.length > 0 ? (
          <div className="h-48 w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#10B981" stop-opacity={0.4} />
                    <stop offset="95%" stop-color="#10B981" stop-opacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#273452" opacity={0.4} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131B2B',
                    borderColor: '#273452',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  formatter={(val: any) => [`${val} كجم`, 'إجمالي الوزن']}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#volGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gym-muted">
            سجل أول جلسة تمرين اليوم لتظهر لك رسوم بيانية تفاعلية لتطور أدائك.
          </div>
        )}
      </div>

      {/* CHART 2: Estimated 1RM Progression Curve per Exercise */}
      <div className="gym-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 glow-cyan" />
            <h3 className="text-sm font-extrabold text-white">منحنى القوة القصوى (1RM)</h3>
          </div>
        </div>

        {/* Exercise Dropdown Selector */}
        <div className="mb-3">
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full bg-gym-surface border border-gym-border text-white text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
          >
            {EXERCISES_DATABASE.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.nameAr} ({ex.targetMuscle})
              </option>
            ))}
          </select>
        </div>

        {exerciseHistory.length > 0 ? (
          <div className="h-44 w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273452" opacity={0.4} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131B2B',
                    borderColor: '#273452',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} كجم`, 'الوزن الأقصى التقديري (1RM)']}
                />
                <Line
                  type="monotone"
                  dataKey="estimated1RM"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  dot={{ fill: '#06B6D4', r: 4 }}
                  activeDot={{ r: 6, fill: '#FFFFFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-gym-muted bg-slate-900/40 rounded-xl">
            لا توجد جلسات مسجلة بعد لهذا التمرين المحدد. اختر تمريناً آخر أو سجل مجموعاتك اليوم.
          </div>
        )}
      </div>

      {/* Workout History Sessions Log */}
      <div className="space-y-2.5">
        <h3 className="font-extrabold text-white text-sm px-1">سجل التمارين السابقة:</h3>

        {logs.length === 0 ? (
          <div className="gym-card p-6 text-center text-xs text-gym-muted">
            لم تسجل أي جلسات بعد. أتمم تمرينك اليوم ليُحفظ في سجلك الدائم.
          </div>
        ) : (
          logs.slice().reverse().map((session) => {
            const isExpanded = expandedLogId === session.id;

            return (
              <div key={session.id} className="gym-card p-3.5 hover:border-slate-600 transition-all">
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : session.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{session.dayTitle}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-gym-muted mt-0.5">
                        <span className="font-mono">{session.date}</span>
                        <span>•</span>
                        <span>{session.exercises.length} تمارين</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {Math.round(session.totalVolumeKg)} كجم
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-gym-muted">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Session Sets Breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gym-border/70 space-y-2 animate-fade-in">
                    {session.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="bg-slate-900/60 p-2.5 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{ex.exerciseNameAr}</span>
                          <span className="text-[11px] text-cyan-400">{ex.targetMuscle}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {ex.sets.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                                s.completed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              م{s.setNumber}: {s.weightKg}ك × {s.reps}ت
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

