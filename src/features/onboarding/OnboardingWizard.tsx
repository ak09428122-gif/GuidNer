import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  HeartPulse,
  Palette,
  Globe,
  CheckCircle2,
  ArrowRight,
  Shield,
  Bell,
  Camera,
  Mic,
  Folder,
  User,
  Flame,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { UserProfile } from '../../core/database/schema';
import { db } from '../../core/database/db';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (updatedProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  '⚡', '🚀', '🎯', '🧠', '🌟', '🛡️', '🎓', '🏆', '🔥', '🧘'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);

  // User Profile Fields
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('⚡');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Preferences
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState<'light' | 'dark' | 'oled'>('light');

  // Goals
  const [studyGoal, setStudyGoal] = useState('Pass competitive exam & master core concepts');
  const [healthGoal, setHealthGoal] = useState('10,000 steps & 3L daily hydration');
  const [spiritualGoal, setSpiritualGoal] = useState('Daily 108 Japa counts & mindfulness');

  // Permissions State
  const [permNotif, setPermNotif] = useState<boolean | null>(null);
  const [permStorage, setPermStorage] = useState<boolean | null>(null);
  const [permCamera, setPermCamera] = useState<boolean | null>(null);
  const [permMic, setPermMic] = useState<boolean | null>(null);

  if (!isOpen) return null;

  // Real Permission Handlers
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermNotif(res === 'granted');
      } catch {
        setPermNotif(true);
      }
    } else {
      setPermNotif(true);
    }
  };

  const requestStoragePermission = async () => {
    // Local storage / IndexedDB is available
    setPermStorage(true);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermCamera(true);
    } catch {
      setPermCamera(false);
    }
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermMic(true);
    } catch {
      setPermMic(false);
    }
  };

  const handleFinish = async () => {
    const finalName = name.trim() || 'GuideNer User';
    const existing = (await db.getUserProfile()) || {
      id: 'main_user',
      name: finalName,
      email: '',
      life_score: 850,
      persona_mode: 'friendly',
      desktop_layout_compact: false,
      biometric_enabled: false,
      dark_mode: theme,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedProfile: UserProfile = {
      ...existing,
      name: finalName,
      dark_mode: theme,
      updated_at: new Date().toISOString(),
    };

    await db.saveUserProfile(updatedProfile);

    // Save preferences locally
    localStorage.setItem('guidener_user_name', finalName);
    localStorage.setItem('guidener_nickname', nickname);
    localStorage.setItem('guidener_avatar', avatar);
    localStorage.setItem('guidener_custom_photo', customPhotoUrl);
    localStorage.setItem('guidener_language', language);
    localStorage.setItem('guidener_study_goal', studyGoal);
    localStorage.setItem('guidener_health_goal', healthGoal);
    localStorage.setItem('guidener_spiritual_goal', spiritualGoal);
    localStorage.setItem('guidener_onboarding_completed', 'true');

    onComplete(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-slate-900 dark:text-white">
        {/* Background Accent Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Welcome to GuideNer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup your personalized Life OS Engine
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
            Step {step} of 4
          </span>
        </div>

        {/* STEP 1: Profile & Identity */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nickname / Preferred Title (Optional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Champ, Alex, Commander"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Profile Avatar Symbol
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {AVATAR_PRESETS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setAvatar(icon)}
                    className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all ${
                      avatar === icon
                        ? 'bg-indigo-600 text-white scale-110 shadow-md ring-2 ring-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Continue to Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Language & Theme */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-500" /> Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="Nepali">नेपाली (Nepali)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="French">Français (French)</option>
                <option value="German">Deutsch (German)</option>
                <option value="Japanese">日本語 (Japanese)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-500" /> App Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-slate-800 text-indigo-600 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                  <span className="text-xs">Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-600 bg-slate-800 text-indigo-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                  <span className="text-xs">Dark Slate</span>
                </button>

                <button
                  onClick={() => setTheme('oled')}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    theme === 'oled'
                      ? 'border-indigo-600 bg-black text-amber-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Flame className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs">Pure OLED</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Set Life Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals Setup */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-500" /> Academic & Study Goal
              </label>
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" /> Health & Wellness Goal
              </label>
              <input
                type="text"
                value={healthGoal}
                onChange={(e) => setHealthGoal(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Spiritual / Mindful Goal
              </label>
              <input
                type="text"
                value={spiritualGoal}
                onChange={(e) => setSpiritualGoal(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Permissions & Finish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Permissions & Confirmation */}
        {step === 4 && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Grant permissions to enable offline Pro Camera, Voice AI, Smart Alarms, and Download Vault.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Notification Permission */}
              <button
                onClick={requestNotificationPermission}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  permNotif
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-xs font-bold">Notification</span>
                </div>
                {permNotif && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>

              {/* Storage Permission */}
              <button
                onClick={requestStoragePermission}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  permStorage
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span className="text-xs font-bold">Storage Vault</span>
                </div>
                {permStorage && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>

              {/* Camera Permission */}
              <button
                onClick={requestCameraPermission}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  permCamera
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span className="text-xs font-bold">Pro Camera</span>
                </div>
                {permCamera && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>

              {/* Microphone Permission */}
              <button
                onClick={requestMicPermission}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  permMic
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-xs font-bold">Voice Input</span>
                </div>
                {permMic && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </button>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Launch GuideNer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
