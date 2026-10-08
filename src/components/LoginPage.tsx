import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UtensilsCrossed, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  registeredUsers: UserProfile[];
  onRegisterUser: (user: UserProfile) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  registeredUsers,
  onRegisterUser,
  onLoginSuccess,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messName, setMessName] = useState('');
  const [messType, setMessType] = useState<
    'Hostel Mess' | 'College Canteen' | 'Restaurant Kitchen' | 'Corporate Mess'
  >('Hostel Mess');
  const [capacity, setCapacity] = useState<number>(300);
  const [location, setLocation] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Find account by email
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!existingUser) {
      setErrorMessage('Invalid Email Address. No mess account found with this email.');
      return;
    }

    if (existingUser.password !== cleanPassword) {
      setErrorMessage('Incorrect Password. Please check your password and try again.');
      return;
    }

    // Login Success
    onLoginSuccess(existingUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if email already exists
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      setErrorMessage('This email is already registered. Please sign in instead.');
      return;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Mess Manager',
      email: cleanEmail,
      password: cleanPassword,
      messName: messName.trim() || 'Hostel Mess',
      messType,
      capacity: Number(capacity) || 300,
      location: location.trim() || 'Campus Hub',
    };

    onRegisterUser(newUser);
    setSuccessMessage('Account registered successfully! Logging you in...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Logo Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            FoodSense Mess Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isRegisterMode
              ? 'Register a new hostel mess or canteen account'
              : 'Sign in to access your mess training model & prep recommendations'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rajesh@sunrisehostel.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mess / Kitchen Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise Hostel Mess"
                  value={messName}
                  onChange={(e) => setMessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Establishment Type
                  </label>
                  <select
                    value={messType}
                    onChange={(e) => setMessType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hostel Mess">Hostel Mess</option>
                    <option value="College Canteen">College Canteen</option>
                    <option value="Restaurant Kitchen">Restaurant Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block-B, Campus Tech Hub"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" /> Create Mess Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {isRegisterMode
              ? 'Already registered? Click here to Sign In'
              : 'New mess or canteen? Register a new account'}
          </button>
        </div>
      </div>
    </div>
  );
};
