import React, { useEffect, useState, useRef } from 'react';
import { Timer, X, Plus, Minus, Play, Pause, Bell } from 'lucide-react';
import { audioTimer } from '../services/audioTimer';

interface FloatingRestTimerProps {
  initialSeconds: number;
  exerciseName?: string;
  onClose: () => void;
  onFinish?: () => void;
}

export const FloatingRestTimer: React.FC<FloatingRestTimerProps> = ({
  initialSeconds,
  exerciseName,
  onClose,
  onFinish,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Restart timer when initialSeconds changes
  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setRemaining(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            audioTimer.playRestCompleteChime();
            if (onFinish) onFinish();
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            audioTimer.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining, onFinish]);

  const addTime = (secs: number) => {
    setRemaining((prev) => Math.max(0, prev + secs));
    setTotalSeconds((prev) => Math.max(prev, remaining + secs));
    audioTimer.vibrate([15]);
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
    audioTimer.vibrate([20]);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 100;
  const strokeDashoffset = 100 - progressPct;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-bounce-in">
      <div className={`p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all ${
        isFinished 
          ? 'bg-emerald-950/95 border-emerald-500 text-white shadow-glow-green animate-pulse' 
          : 'bg-gym-card/95 border-emerald-500/40 text-gym-text shadow-black/60'
      }`}>
        <div className="flex items-center justify-between gap-3">
          
          {/* Circular SVG Ring & Time Display */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${isFinished ? 'text-emerald-400' : 'text-emerald-500'} transition-all duration-500`}
                  strokeDasharray="100, 100"
                  strokeDashoffset={strokeDashoffset}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                {isFinished ? (
                  <Bell className="w-5 h-5 text-emerald-300 animate-bounce" />
                ) : (
                  <Timer className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono tracking-tight text-white">
                  {formatTime(remaining)}
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isFinished ? 'انتهت الراحة! ابدأ مجموعتك' : 'فترة الراحة'}
                </span>
              </div>
              <p className="text-xs text-gym-muted truncate max-w-[160px]">
                {exerciseName ? exerciseName : 'استعد للمجموعة القادمة'}
              </p>
            </div>
          </div>

          {/* Quick Adjust & Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!isFinished && (
              <>
                <button
                  onClick={() => addTime(-15)}
                  className="w-8 h-8 rounded-lg bg-gym-surface hover:bg-slate-800 text-gym-muted hover:text-white flex items-center justify-center border border-gym-border active:scale-95 text-xs font-bold"
                  title="-15 ثانية"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => addTime(15)}
                  className="w-8 h-8 rounded-lg bg-gym-surface hover:bg-slate-800 text-emerald-400 flex items-center justify-center border border-gym-border active:scale-95 text-xs font-bold"
                  title="+15 ثانية"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={togglePause}
                  className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center justify-center border border-emerald-500/40 active:scale-95"
                  title={isRunning ? 'إيقاف مؤقت' : 'استئناف'}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </>
            )}

            {/* Close / Skip button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 active:scale-95 ml-1"
              title="تخطي الراحة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

