import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SmartPlanner } from './components/SmartPlanner';
import { TrainingLogger } from './components/TrainingLogger';
import { WeeklyAnalytics } from './components/WeeklyAnalytics';
import { NgoPortal } from './components/NgoPortal';
import { ImpactDashboard } from './components/ImpactDashboard';
import { LoginPage } from './components/LoginPage';

import {
  UserProfile,
  TrainingLog,
  SurplusItem,
  NgoPartner,
  SurplusStatus,
} from './types';
import {
  defaultUser,
  initialTrainingLogs,
  initialSurplusListings,
  initialNgos,
} from './data/mockTrainingData';

const DEFAULT_ACCOUNTS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Rajesh Kumar',
    email: 'rajesh@sunrisehostel.edu',
    password: 'password123',
    messName: 'Sunrise Hostel Mess',
    messType: 'Hostel Mess',
    capacity: 350,
    location: 'Block-B, Campus Tech Hub',
  },
  {
    id: 'user_2',
    name: 'Priya Sharma',
    email: 'priya@canteen.edu',
    password: 'password123',
    messName: 'Central College Canteen',
    messType: 'College Canteen',
    capacity: 500,
    location: 'Main Gate Campus, Sector 2',
  },
];

export function App() {
  // Load registered users from LocalStorage or use default
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('foodsense_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ACCOUNTS;
      }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('planner');

  // Logs Map per User ID: New accounts start empty []
  const [userLogsMap, setUserLogsMap] = useState<Record<string, TrainingLog[]>>({
    user_1: initialTrainingLogs,
  });

  // NGO & Surplus State
  const [surplusListings, setSurplusListings] = useState<SurplusItem[]>(initialSurplusListings);
  const [ngos] = useState<NgoPartner[]>(initialNgos);

  // Save registered users to LocalStorage
  useEffect(() => {
    localStorage.setItem('foodsense_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const handleRegisterUser = (newUser: UserProfile) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  // If user is not logged in, show real Login / Register page
  if (!currentUser) {
    return (
      <LoginPage
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          // Initialize empty logs for new accounts
          if (!userLogsMap[user.id]) {
            setUserLogsMap((prev) => ({
              ...prev,
              [user.id]: [],
            }));
          }
        }}
      />
    );
  }

  // Get current user's personal logs
  const currentLogs = userLogsMap[currentUser.id] || [];

  // Training Log Actions
  const handleAddLog = (newLog: TrainingLog) => {
    setUserLogsMap((prev) => ({
      ...prev,
      [currentUser.id]: [newLog, ...(prev[currentUser.id] || [])],
    }));
  };

  const handleDeleteLog = (id: string) => {
    setUserLogsMap((prev) => ({
      ...prev,
      [currentUser.id]: (prev[currentUser.id] || []).filter((l) => l.id !== id),
    }));
  };

  const handleResetLogs = () => {
    setUserLogsMap((prev) => ({
      ...prev,
      [currentUser.id]: [],
    }));
  };

  const handleLoadSampleLogs = () => {
    setUserLogsMap((prev) => ({
      ...prev,
      [currentUser.id]: initialTrainingLogs,
    }));
  };

  // Surplus Posting & NGO Claims
  const handlePostSurplus = (newItem: SurplusItem) => {
    setSurplusListings([newItem, ...surplusListings]);
  };

  const handleClaimItem = (id: string, ngoName: string) => {
    setSurplusListings(
      surplusListings.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'CLAIMED',
              claimedByNgo: ngoName,
              claimedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleUpdateSurplusStatus = (id: string, status: SurplusStatus) => {
    setSurplusListings(
      surplusListings.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const activeSurplusCount = surplusListings.filter(
    (s) => s.status === 'AVAILABLE'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        totalTrainingLogsCount={Math.ceil(currentLogs.length / 3)}
        availableSurplusCount={activeSurplusCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'planner' && (
          <SmartPlanner
            logs={currentLogs}
            currentUser={currentUser}
            onPostSurplus={handlePostSurplus}
          />
        )}

        {activeTab === 'logger' && (
          <TrainingLogger
            logs={currentLogs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onResetLogs={handleResetLogs}
            onLoadSampleLogs={handleLoadSampleLogs}
          />
        )}

        {activeTab === 'analytics' && <WeeklyAnalytics logs={currentLogs} />}

        {activeTab === 'ngo_portal' && (
          <NgoPortal
            surplusListings={surplusListings}
            ngos={ngos}
            onClaimItem={handleClaimItem}
            onUpdateStatus={handleUpdateSurplusStatus}
          />
        )}

        {activeTab === 'dashboard' && (
          <ImpactDashboard logs={currentLogs} surplusListings={surplusListings} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>FoodSense © 2026 • Smart Mess Planner & Surplus Recovery Platform</span>
          <span className="text-emerald-700 font-bold">
            All Rights Reserved
          </span>
        </div>
      </footer>
    </div>
  );
}
