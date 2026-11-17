import React, { useState, useEffect } from 'react';
import { 
  User, 
  Cloud, 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  Save, 
  LogOut, 
  LogIn, 
  Dumbbell, 
  Scale, 
  Ruler, 
  Award, 
  Target, 
  Calendar, 
  Check, 
  Sparkles,
  RefreshCw,
  ShieldCheck,
  FileJson
} from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel } from '../types';
import { EQUIPMENT_DEFINITIONS } from '../data/exercises';
import { db } from '../db';
import { syncService, SyncStatus } from '../services/syncService';
import { 
  auth, 
  isFirebaseConfigured, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut 
} from '../services/firebase';
import { generateSmartWorkoutPlan } from '../services/workoutEngine';
import { audioTimer } from '../services/audioTimer';

interface ProfileViewProps {
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onProfileUpdated }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.getStatus());
  
  // Local editable states
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile.fitnessGoal);
  const [preferredDays, setPreferredDays] = useState<number>(profile.preferredDaysPerWeek);
  const [equipment, setEquipment] = useState<string[]>(profile.availableEquipment);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    return syncService.subscribe((s) => setSyncStatus(s));
  }, []);

  const toggleEquipment = (id: string) => {
    audioTimer.vibrate([15]);
    setEquipment(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async () => {
    audioTimer.vibrate([30, 20, 50]);
    const updated: UserProfile = {
      ...profile,
      weightKg,
      heightCm,
      experienceLevel,
      fitnessGoal,
      preferredDaysPerWeek: preferredDays,
      availableEquipment: equipment,
      updatedAt: new Date().toISOString(),
    };

    await db.user_profile.put(updated);
    
    // Regenerate plan if goal or days changed
    if (updated.fitnessGoal !== profile.fitnessGoal || updated.preferredDaysPerWeek !== profile.preferredDaysPerWeek) {
      const newPlan = generateSmartWorkoutPlan(updated);
      await db.workout_plan.put(newPlan);
    }

    onProfileUpdated(updated);
    syncService.triggerAutoSync();

    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      alert('Firebase غير مهيأ حالياً. التطبيق يعمل في الوضع المحلي الأوفلاين 100% بكفاءة كاملة. يمكنك إضافة مفاتيحك في ملف .env للحفظ السحابي.');
      return;
    }
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message || 'فشل تسجيل الدخول بجوجل');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      alert('Firebase غير مهيأ حالياً. التطبيق يعمل في الوضع المحلي الأوفلاين 100%.');
      return;
    }
    try {
      setAuthError(null);
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message || 'حدث خطأ أثناء المصادقة');
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await fbSignOut(auth);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await syncService.importBackupJSON(file);
      if (success) {
        alert('تمت استعادة النسخة الاحتياطية بنجاح! سيتم تحديث الصفحة.');
        window.location.reload();
      } else {
        alert('فشل قراءة ملف النسخة الاحتياطية.');
      }
    }
  };

  return (
    <div className="pb-28 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      
      {/* Cloud & Local Mode Status Card */}
      <div className={`p-4 rounded-2xl border transition-all ${
        syncStatus.isCloudConnected
          ? 'bg-cyan-950/40 border-cyan-500/40'
          : 'bg-gym-card border-gym-border'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
              syncStatus.isCloudConnected
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {syncStatus.isCloudConnected ? <Cloud className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">
                  {syncStatus.isCloudConnected ? 'متصل بالسحابة (Firebase)' : 'الوضع المحلي أوفلاين (آمن)'}
                </h3>
              </div>
              <p className="text-xs text-gym-muted mt-0.5">
                {syncStatus.isCloudConnected
                  ? `الحساب: ${syncStatus.userEmail || 'مجهول'}`
                  : 'بياناتك محفوظة بأمان على هاتفك بدون إنترنت'}
              </p>
            </div>
          </div>

          <div>
            {syncStatus.isCloudConnected ? (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-slate-800 text-red-400 hover:text-red-300 border border-slate-700 text-xs font-bold"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                ربط حساب
              </button>
            )}
          </div>
        </div>

        {/* Sync Action Trigger */}
        {syncStatus.isCloudConnected && (
          <div className="mt-3 pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs">
            <span className="text-gym-muted text-[11px]">
              آخر مزامنة: {syncStatus.lastSyncedAt || 'الآن'}
            </span>
            <button
              onClick={() => syncService.pushToCloud()}
              disabled={syncStatus.isSyncing}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              مزامنة فورية
            </button>
          </div>
        )}
      </div>

      {/* Body Metrics Editor */}
      <div className="gym-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-white">القياسات البدنية الحالية</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gym-surface rounded-xl border border-gym-border">
            <label className="text-[11px] text-gym-muted font-bold block mb-1">الوزن الحالي (كجم)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent font-mono font-black text-xl text-white focus:outline-none"
            />
          </div>

          <div className="p-3 bg-gym-surface rounded-xl border border-gym-border">
            <label className="text-[11px] text-gym-muted font-bold block mb-1">الطول (سم)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent font-mono font-black text-xl text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Fitness Goal */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">الهدف التدريبي:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hypertrophy' as FitnessGoal, label: 'تضخيم' },
              { id: 'fat_loss' as FitnessGoal, label: 'تنشيف' },
              { id: 'strength' as FitnessGoal, label: 'قوة' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFitnessGoal(g.id)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  fitnessGoal === g.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-green border-emerald-400'
                    : 'bg-gym-surface border-gym-border text-gym-muted'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Days Per Week */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">أيام التمرين في الأسبوع:</label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setPreferredDays(days)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  preferredDays === days
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-glow-cyan border-cyan-400'
                    : 'bg-gym-surface border-gym-border text-gym-muted'
                }`}
              >
                {days} أيام
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gym Equipment Checklist */}
      <div className="gym-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <h3 className="font-extrabold text-sm text-white">أجهزة الجيم المتاحة لديك</h3>
        </div>

        <div className="space-y-2">
          {EQUIPMENT_DEFINITIONS.map((eq) => {
            const isSelected = equipment.includes(eq.id);

            return (
              <div
                key={eq.id}
                onClick={() => toggleEquipment(eq.id)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-gym-surface border-gym-border text-gym-muted'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{eq.nameAr}</span>
                  <span className="text-[10px] text-gym-muted">{eq.nameEn}</span>
                </div>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-800'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSaveProfile}
          className="w-full py-3.5 rounded-2xl gym-btn-primary flex items-center justify-center gap-2 text-sm font-black shadow-glow-green"
        >
          <Save className="w-4 h-4" />
          حفظ التعديلات وتحديث الخطة
        </button>
        {isSavedAlert && (
          <p className="text-center text-xs text-emerald-400 font-bold mt-2 animate-bounce">
            ✓ تم حفظ التعديلات بنجاح!
          </p>
        )}
      </div>

      {/* Offline JSON Backup / Restore Section */}
      <div className="gym-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-amber-400" />
          <h3 className="font-extrabold text-sm text-white">النسخ الاحتياطي اليدوي أوفلاين</h3>
        </div>
        <p className="text-xs text-gym-muted">
          يمكنك تصدير واسترجاع بياناتك بالكامل في ملف JSON بدون الحاجة لأي حساب أو اتصال بالإنترنت.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => syncService.exportBackupJSON()}
            className="p-2.5 rounded-xl bg-gym-surface hover:bg-slate-800 text-white font-bold text-xs border border-gym-border flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            تصدير ملف أوفلاين
          </button>

          <label className="p-2.5 rounded-xl bg-gym-surface hover:bg-slate-800 text-white font-bold text-xs border border-gym-border flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            استرجاع من ملف
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Auth Modal Dialog */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gym-surface border border-gym-border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2 border border-cyan-500/30">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">الحفظ السحابي التلقائي</h3>
              <p className="text-xs text-gym-muted mt-1">
                سجل دخولك لحفظ تمارينك وخطتك واستعادتها على أي هاتف جديد
              </p>
            </div>

            {authError && (
              <div className="p-2.5 mb-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center font-bold">
                {authError}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 mb-3 shadow transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              متابعة عبر حساب Google
            </button>

            <div className="relative my-3 text-center">
              <span className="bg-gym-surface px-2 text-[10px] text-gym-muted relative z-10">أو بالبريد الإلكتروني</span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gym-border"></div></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder="البريد الإلكتروني"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <input
                type="password"
                required
                placeholder="كلمة المرور"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-cyan-500"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
              >
                {authMode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                {authMode === 'signin' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل الدخول'}
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gym-muted hover:text-white text-[11px]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
