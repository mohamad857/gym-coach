import React from 'react';
import { Dumbbell, CalendarRange, TrendingUp, UserCheck } from 'lucide-react';

export type NavigationTab = 'today' | 'plan' | 'progress' | 'profile';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'today' as NavigationTab,
      label: 'تمرين اليوم',
      icon: Dumbbell,
    },
    {
      id: 'plan' as NavigationTab,
      label: 'خطتي',
      icon: CalendarRange,
    },
    {
      id: 'progress' as NavigationTab,
      label: 'تقدمي',
      icon: TrendingUp,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'ملفي',
      icon: UserCheck,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gym-surface/95 backdrop-blur-lg border-t border-gym-border/80 px-2 py-1.5 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-gym-muted hover:text-slate-300 font-medium'
              }`}
            >
              <div className={`relative p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.6]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full glow-neon" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-emerald-400' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

