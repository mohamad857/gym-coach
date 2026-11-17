import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan } from './types';
import { db, getActiveUserProfile, getActiveWorkoutPlan } from './db';
import { Header } from './components/Header';
import { Navbar, NavigationTab } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { TodayWorkoutView } from './views/TodayWorkoutView';
import { MyPlanView } from './views/MyPlanView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('today');

  // Load profile and plan from IndexedDB
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const existingProfile = await getActiveUserProfile();
        const existingPlan = await getActiveWorkoutPlan();

        if (existingProfile && existingProfile.onboardingCompleted) {
          setProfile(existingProfile);
          setPlan(existingPlan || null);
        }
      } catch (err) {
        console.error('Failed to load local DB:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAppData();
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    const activePlan = await getActiveWorkoutPlan();
    setPlan(activePlan || null);
    setActiveTab('today');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-bg flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-pulse">
            <span className="text-emerald-400 font-black text-xl">GC</span>
          </div>
          <span className="text-xs font-bold text-gym-muted">جارِ تحميل كوتش الجيم أوفلاين...</span>
        </div>
      </div>
    );
  }

  // If user hasn't completed assessment wizard yet
  if (!profile || !profile.onboardingCompleted || !plan) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gym-bg text-gym-text flex flex-col font-cairo">
      {/* Top Header */}
      <Header onOpenProfile={() => setActiveTab('profile')} />

      {/* Main Content View Container */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === 'today' && (
          <TodayWorkoutView
            plan={plan}
            profile={profile}
            onNavigateToProgress={() => setActiveTab('progress')}
          />
        )}

        {activeTab === 'plan' && (
          <MyPlanView
            plan={plan}
            profile={profile}
            onPlanUpdated={(newPlan) => setPlan(newPlan)}
          />
        )}

        {activeTab === 'progress' && <ProgressView />}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        )}
      </main>

      {/* Bottom Sticky Mobile Gym Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};

export default App;

