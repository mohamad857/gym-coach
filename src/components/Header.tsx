import React, { useEffect, useState } from 'react';
import { Dumbbell, Wifi, WifiOff, Cloud, Flame, RefreshCw } from 'lucide-react';
import { syncService, SyncStatus } from '../services/syncService';
import { db } from '../db';

interface HeaderProps {
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.getStatus());
  const [streakDays, setStreakDays] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = syncService.subscribe((status) => {
      setSyncStatus(status);
    });

    // Compute streak from workout logs
    const computeStreak = async () => {
      try {
        const logs = await db.workout_logs.where('isCompleted').equals(1).sortBy('date');
        if (!logs.length) {
          setStreakDays(0);
          return;
        }

        const uniqueDates = Array.from(new Set(logs.map(l => l.date))).sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().slice(0, 10);
        
        let checkDate = new Date();
        // Check if user worked out today or yesterday to maintain active streak
        const hasToday = uniqueDates.includes(today);
        let currentPointer = new Date();
        if (!hasToday) {
          currentPointer.setDate(currentPointer.getDate() - 1);
        }

        for (let i = 0; i < uniqueDates.length; i++) {
          const dateStr = currentPointer.toISOString().slice(0, 10);
          if (uniqueDates.includes(dateStr)) {
            streak++;
            currentPointer.setDate(currentPointer.getDate() - 1);
          } else {
            break;
          }
        }
        setStreakDays(Math.max(streak, hasToday ? 1 : 0));
      } catch (err) {
        console.warn('Streak calc error:', err);
      }
    };

    computeStreak();

    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    if (syncStatus.isOnline && syncStatus.isCloudConnected) {
      await syncService.pushToCloud();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-gym-bg/90 backdrop-blur-md border-b border-gym-border/70 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand & Coach Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-glow-green text-slate-950">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">كوتش الجيم</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">AI</span>
            </div>
            <p className="text-[11px] text-gym-muted leading-tight mt-0.5">مدربك الشخصي بدون نت</p>
          </div>
        </div>

        {/* Status Indicators & Streak */}
        <div className="flex items-center gap-2">
          
          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
            <span>{streakDays} {streakDays === 1 ? 'يوم' : 'أيام'}</span>
          </div>

          {/* Cloud / Offline Sync Status Badge */}
          <button 
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
              syncStatus.isCloudConnected
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : syncStatus.isOnline
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
            title={syncStatus.isCloudConnected ? 'متصل بالسحابة' : 'وضع أوفلاين محلي (آمن)'}
          >
            {syncStatus.isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : syncStatus.isCloudConnected ? (
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            ) : syncStatus.isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            )}
            
            <span className="text-[11px]">
              {syncStatus.isCloudConnected
                ? 'سحابي'
                : syncStatus.isOnline
                ? 'محلي'
                : 'أوفلاين'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
