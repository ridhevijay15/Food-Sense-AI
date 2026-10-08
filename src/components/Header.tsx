import React from 'react';
import { UserProfile } from '../types';
import {
  UtensilsCrossed,
  BrainCircuit,
  History,
  TrendingDown,
  HeartHandshake,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  totalTrainingLogsCount: number;
  availableSurplusCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  totalTrainingLogsCount,
  availableSurplusCount,
}) => {
  const tabs = [
    { id: 'planner', label: 'Smart Planner', icon: BrainCircuit, badge: null },
    {
      id: 'logger',
      label: '1-Month Training Logger',
      icon: History,
      badge: `${totalTrainingLogsCount} Days`,
    },
    { id: 'analytics', label: 'Week-Wise Graphs', icon: TrendingDown, badge: null },
    {
      id: 'ngo_portal',
      label: 'NGO Partner Portal',
      icon: HeartHandshake,
      badge: availableSurplusCount > 0 ? `${availableSurplusCount} Available` : '2 NGOs',
    },
    { id: 'dashboard', label: 'Impact Dashboard', icon: LayoutDashboard, badge: null },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Emerald Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  FoodSense
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                  v2.4 Production
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Smart Mess Planner & Hyper-Local Surplus Donation Platform
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {currentUser.messName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {currentUser.messName}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {currentUser.name} • {currentUser.capacity} Students
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
