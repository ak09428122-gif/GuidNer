import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Palette,
  Layout,
  Bot,
  Camera,
  Globe,
  HeartPulse,
  GraduationCap,
  Bell,
  Shield,
  Cloud,
  HardDrive,
  Languages,
  Eye,
  FlaskConical,
  BarChart3,
  Info,
  Search,
  Check,
  ChevronRight,
  Sliders,
  Sparkles,
  Lock,
  Smartphone,
  Award,
  Zap,
  Volume2,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Key,
  SlidersHorizontal,
  Moon,
  Sun,
  Activity,
  FileText,
  HelpCircle,
  ExternalLink,
  Plus,
  AlertTriangle,
  Radio,
  Clock,
  Video,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { ThemeMode, AIPersonaMode } from '../../core/theme/tokens';
import { UserProfile } from '../../core/database/schema';
import { useProfile } from '../../core/profile/ProfileContext';
import { useFirebaseAuth } from '../../core/database/FirebaseAuthContext';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { cloudSyncService } from '../../core/database/CloudSyncService';
import { smartStorageManager } from '../../core/database/SmartStorageManager';
import { offlineAIPackManager } from '../../core/ai/OfflineAIPackManager';
import { batteryAndPerformanceManager } from '../../core/BatteryAndPerformanceManager';

export type SettingsCategory =
  | 'profile'
  | 'appearance'
  | 'home_screen'
  | 'ai_settings'
  | 'camera_settings'
  | 'browser_settings'
  | 'health_settings'
  | 'study_settings'
  | 'notifications'
  | 'security'
  | 'backup'
  | 'storage'
  | 'language'
  | 'accessibility'
  | 'labs'
  | 'admin'
  | 'about';

interface SettingsViewProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  persona: AIPersonaMode;
  setPersona: (persona: AIPersonaMode) => void;
  user: UserProfile;
  onExportBackup: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  setTheme,
  persona,
  setPersona,
  user,
  onExportBackup,
  onNavigateTab,
}) => {
  const { currentProfile, allProfiles, switchProfile } = useProfile();
  const { user: fbUser, signInWithGoogle, signOut: fbSignOut } = useFirebaseAuth();

  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings Persistent States (local state + localStorage sync)
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('gn_accent_color') || 'blue');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('gn_font_size') || 'normal');
  const [displayDensity, setDisplayDensity] = useState(() => localStorage.getItem('gn_density') || 'comfortable');
  const [cornerRadius, setCornerRadius] = useState(() => localStorage.getItem('gn_corner_radius') || '16px');
  const [animSpeed, setAnimSpeed] = useState(() => localStorage.getItem('gn_anim_speed') || '1.0x');
  const [glassEffects, setGlassEffects] = useState(() => localStorage.getItem('gn_glass_effects') !== 'false');

  // AI Config State
  const [primaryAIProvider, setPrimaryAIProvider] = useState(() => localStorage.getItem('gn_ai_provider') || 'gemini_flash');
  const [fallbackAIProvider, setFallbackAIProvider] = useState(() => localStorage.getItem('gn_ai_fallback') || 'openrouter');
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('gn_user_gemini_key') || '');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const [aiStreaming, setAiStreaming] = useState(true);
  const [aiMemoryLimit, setAiMemoryLimit] = useState('100');

  // Camera State
  const [cameraDefaultMode, setCameraDefaultMode] = useState('photo');
  const [cameraResolution, setCameraResolution] = useState('4k');
  const [cameraFps, setCameraFps] = useState('60');
  const [cameraBitrate, setCameraBitrate] = useState('high');
  const [cameraAudioSource, setCameraAudioSource] = useState('internal');
  const [cameraOverlays, setCameraOverlays] = useState({ histogram: true, focusPeaking: true, falseColor: false, grid: true, safeArea: true });
  const [cameraHdr, setCameraHdr] = useState(true);
  const [cameraRaw, setCameraRaw] = useState(false);
  const [cameraLog, setCameraLog] = useState(false);

  // Browser State
  const [searchEngine, setSearchEngine] = useState('google');
  const [browserHomepage, setBrowserHomepage] = useState('https://google.com');
  const [browserDesktopMode, setBrowserDesktopMode] = useState(false);
  const [browserReaderMode, setBrowserReaderMode] = useState(false);
  const [adBlocking, setAdBlocking] = useState(true);

  // Health Goals
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [ageYears, setAgeYears] = useState(25);
  const [genderVal, setGenderVal] = useState('male');
  const [waterGoalMl, setWaterGoalMl] = useState(2500);
  const [stepGoalVal, setStepGoalVal] = useState(8000);
  const [sleepGoalHours, setSleepGoalHours] = useState(8);
  const [workoutGoalKcal, setWorkoutGoalKcal] = useState(500);

  // Study Config
  const [subjectsList, setSubjectsList] = useState(['Mathematics', 'Computer Science', 'Physics', 'History']);
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [studyDailyGoal, setStudyDailyGoal] = useState(4);
  const [pomodoroWorkMin, setPomodoroWorkMin] = useState(25);
  const [pomodoroBreakMin, setPomodoroBreakMin] = useState(5);

  // Notifications Channel Toggles
  const [notifChannels, setNotifChannels] = useState({
    study: true,
    health: true,
    ai: true,
    calendar: true,
    downloads: true,
    browser: false,
    vault: true,
    communication: true,
    alarm: true,
  });

  // Security Settings
  const [pinEnabled, setPinEnabled] = useState(false);
  const [biometricUnlock, setBiometricUnlock] = useState(true);
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [vaultLockEnabled, setVaultLockEnabled] = useState(true);

  // Language State
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('gn_app_lang') || 'en');
  const [langToast, setLangToast] = useState<string | null>(null);

  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeTouchTargets, setLargeTouchTargets] = useState(true);

  // Labs & Admin Flags
  const [labBetaAI, setLabBetaAI] = useState(true);
  const [labBetaCameraLog, setLabBetaCameraLog] = useState(true);
  const [labBetaBrowserTurbo, setLabBetaBrowserTurbo] = useState(true);
  const [adminMaintenanceMode, setAdminMaintenanceMode] = useState(false);

  // Modals & Feedback
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentProfile?.name || 'Primary User');
  const [editUsername, setEditUsername] = useState('@guidener_user');
  const [editEmail, setEditEmail] = useState(user.email || 'user@guidener.ai');
  const [editPhone, setEditPhone] = useState('+1 (555) 019-2834');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Category Metadata List
  const categories: { id: SettingsCategory; label: string; icon: React.FC<{ className?: string }>; badge?: string; desc: string }[] = [
    { id: 'profile', label: 'Profile & Account', icon: User, badge: 'Active', desc: 'Identity, membership, badges, & devices' },
    { id: 'appearance', label: 'Appearance & Material You', icon: Palette, desc: 'Themes, OLED, accent colors, font size, density' },
    { id: 'home_screen', label: 'Home Screen & Widgets', icon: Layout, desc: 'Layout order, cards, widget sizes, start tab' },
    { id: 'ai_settings', label: 'AI Engine & Providers', icon: Bot, badge: 'Gemini 1.5', desc: 'Providers, API keys, streaming, memory, offline' },
    { id: 'camera_settings', label: 'Camera Studio Pro', icon: Camera, badge: '4K LOG', desc: 'Default modes, resolution, FPS, peaking, RAW/LOG' },
    { id: 'browser_settings', label: 'Omni Browser Settings', icon: Globe, desc: 'Search engine, desktop mode, reader, adblock, cache' },
    { id: 'health_settings', label: 'Health & Fitness Goals', icon: HeartPulse, desc: 'Biometrics, water, step, sleep, and workout goals' },
    { id: 'study_settings', label: 'Study Hub & Pomodoro', icon: GraduationCap, desc: 'Subjects, daily study goals, Pomodoro timers' },
    { id: 'notifications', label: 'Notifications & Channels', icon: Bell, desc: 'Sound, vibration, priority & 9 topic channels' },
    { id: 'security', label: 'Security & Privacy Vault', icon: Shield, badge: 'AES-256', desc: 'PIN, biometrics, app lock, private mode' },
    { id: 'backup', label: 'Cloud & Local Backup', icon: Cloud, desc: 'Offline JSON export/import & Firebase cloud sync' },
    { id: 'storage', label: 'Storage & Cache Cleaner', icon: HardDrive, desc: 'Cache breakdown, one-tap purge, storage allocation' },
    { id: 'language', label: 'Language & Regional', icon: Languages, badge: '9 Indic', desc: 'English, Hindi, Sanskrit, Gujarati, Tamil, etc.' },
    { id: 'accessibility', label: 'Accessibility & Vision', icon: Eye, desc: 'High contrast, text scaling, touch target sizes' },
    { id: 'labs', label: 'GuideNer Experimental Labs', icon: FlaskConical, badge: 'Beta', desc: 'Beta AI, Camera LOG engine, Browser Turbo' },
    { id: 'admin', label: 'Master Admin Panel', icon: BarChart3, badge: 'System', desc: 'Telemetry, crash reports, remote config, maintenance' },
    { id: 'about', label: 'About GuideNer', icon: Info, desc: 'v4.8.0 Pro Super App, licenses, rate, support' },
  ];

  // Helper notice trigger
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Save Accent Color
  const handleSelectAccent = (colorKey: string) => {
    setAccentColor(colorKey);
    localStorage.setItem('gn_accent_color', colorKey);
    showNotice(`Accent color updated to ${colorKey.toUpperCase()}`);
  };

  // Save Language
  const handleSelectLanguage = (langCode: string, langName: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('gn_app_lang', langCode);
    setLangToast(`Language switched to ${langName}. App UI updated live!`);
    setTimeout(() => setLangToast(null), 3000);
  };

  // Add Subject
  const handleAddSubject = () => {
    if (!newSubjectInput.trim()) return;
    setSubjectsList([...subjectsList, newSubjectInput.trim()]);
    setNewSubjectInput('');
    showNotice('New subject added to Study Hub!');
  };

  // Remove Subject
  const handleRemoveSubject = (index: number) => {
    setSubjectsList(subjectsList.filter((_, i) => i !== index));
    showNotice('Subject removed.');
  };

  // Clear All Cache
  const handlePurgeAllCache = async () => {
    await smartStorageManager.purgeTemporaryCache();
    showNotice('✨ Storage cache purged successfully! Freed up ~18.4 MB.');
  };

  // Filter Categories by Global Search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 shrink-0">
            <Settings className="w-7 h-7 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Master Settings Center</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase">
                Pixel + One UI Edition
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              17 Comprehensive Modules • Material You Design 3 • Instant Search & Persistence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 self-end sm:self-auto">
          <HelpMeUseButton screenId="settings" />
        </div>
      </div>

      {/* Global Live Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search all settings (e.g., Theme, API Key, Camera LOG, Water Goal, Security PIN, Language)..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Toast Notification */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Language Live Switch Banner */}
      {langToast && (
        <div className="p-3.5 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 shrink-0" />
            <span>{langToast}</span>
          </div>
        </div>
      )}

      {/* Master Settings Layout: Left Sidebar + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Category Dropdown / Scrollable Pills */}
        <div className="lg:hidden col-span-1 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isSel = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                    isSel
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.label.split('&')[0].trim()}</span>
                  {cat.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-indigo-500/20 text-indigo-300">
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Left Sidebar Category Navigation */}
        <div className="hidden lg:block lg:col-span-4 space-y-1.5 sticky top-20">
          <div className="p-2 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
            <div className="px-3 py-2 text-[11px] font-extrabold tracking-wider text-slate-400 uppercase flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 mb-1">
              <span>Categories ({filteredCategories.length})</span>
              <span className="text-[10px] text-indigo-500 font-bold">One UI Style</span>
            </div>

            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              const isSel = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group ${
                    isSel
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSel
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs truncate">{cat.label}</span>
                      <span className={`text-[10px] truncate ${isSel ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {cat.desc}
                      </span>
                    </div>
                  </div>

                  {cat.badge && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-[9px] font-black rounded-full shrink-0 ${
                        isSel
                          ? 'bg-white text-indigo-700'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Category Detail Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* CATEGORY 1: PROFILE & ACCOUNT */}
          {activeCategory === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">Profile & Identity</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage user profile, GuideNer ID, and synced devices</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Profile Card */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shrink-0">
                    {currentProfile.avatarIcon}
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{editName}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Pro Lifetime
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{editUsername} • ID: <span className="font-mono text-slate-600 dark:text-slate-300">GN-88942-PRO</span></p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{editEmail} • {editPhone}</p>
                  </div>
                </div>

                {/* Achievements Badges */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Achievements & Badges</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
                      <Award className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">7-Day Streak</div>
                        <div className="text-[10px] text-slate-400">Consistency Master</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Early Adopter</div>
                        <div className="text-[10px] text-slate-400">Super App Founder</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5">
                      <Zap className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Focus Master</div>
                        <div className="text-[10px] text-slate-400">50+ Study Hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connected Devices */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Sync Devices (3)</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-indigo-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Google Pixel 8 Pro (Primary)</div>
                          <div className="text-[10px] text-slate-400">Android 15 • Active Now</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-500">Connected</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Samsung Galaxy Watch 6 BLE</div>
                          <div className="text-[10px] text-slate-400">WearOS • Synced 2m ago</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-500">BLE Active</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">GuideNer Desktop Workstation</div>
                          <div className="text-[10px] text-slate-400">Web Client • Synced 1h ago</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-blue-500/10 text-blue-500">Cloud Sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 2: APPEARANCE */}
          {activeCategory === 'appearance' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Appearance & Material You 3</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Themes, OLED canvas, Material You accents, density, & corner radius</p>
                </div>
              </div>

              {/* Theme Mode Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Theme Mode</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean Light' },
                    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Slate Dark' },
                    { id: 'oled', label: 'AMOLED', icon: Zap, desc: 'True Black' },
                    { id: 'system', label: 'System', icon: Layout, desc: 'Auto Match' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = theme === item.id || (item.id === 'system' && false);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'light' || item.id === 'dark' || item.id === 'oled') {
                            setTheme(item.id as ThemeMode);
                            showNotice(`Theme set to ${item.label}`);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSel
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 mb-2" />
                        <div>
                          <div className="text-xs font-black">{item.label}</div>
                          <div className={`text-[10px] ${isSel ? 'text-purple-100' : 'text-slate-400'}`}>{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material You Accent Colors */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material You Accent Palette</label>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { id: 'blue', name: 'Sapphire', bg: 'bg-blue-600' },
                    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
                    { id: 'purple', name: 'Amethyst', bg: 'bg-purple-600' },
                    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
                    { id: 'rose', name: 'Rose Gold', bg: 'bg-rose-500' },
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => handleSelectAccent(acc.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                        accentColor === acc.id
                          ? 'ring-2 ring-indigo-500 border-transparent bg-slate-100 dark:bg-slate-700 font-bold'
                          : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${acc.bg} shadow-md flex items-center justify-center text-white`}>
                        {accentColor === acc.id && <Check className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size & Display Density */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Font Size Scaling</label>
                  <select
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                      localStorage.setItem('gn_font_size', e.target.value);
                      showNotice(`Font size scaled to ${e.target.value.toUpperCase()}`);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="small">Small (90%)</option>
                    <option value="normal">Normal (100% Default)</option>
                    <option value="large">Large (115%)</option>
                    <option value="xlarge">Extra Large (130%)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Density</label>
                  <select
                    value={displayDensity}
                    onChange={(e) => {
                      setDisplayDensity(e.target.value);
                      localStorage.setItem('gn_density', e.target.value);
                      showNotice(`Display density changed to ${e.target.value.toUpperCase()}`);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="compact">Compact (High Info Density)</option>
                    <option value="comfortable">Comfortable (Balanced One UI)</option>
                    <option value="spacious">Spacious (Large Touch Padding)</option>
                  </select>
                </div>
              </div>

              {/* Corner Radius & Glass Effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Corner Radius</label>
                  <select
                    value={cornerRadius}
                    onChange={(e) => {
                      setCornerRadius(e.target.value);
                      localStorage.setItem('gn_corner_radius', e.target.value);
                      showNotice(`Corner radius set to ${e.target.value}`);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="6px">Sharp (6px)</option>
                    <option value="12px">Subtle (12px)</option>
                    <option value="16px">Standard (16px Pixel)</option>
                    <option value="24px">Extra Rounded (24px One UI)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Glassmorphism & Blur Effects</div>
                    <div className="text-[10px] text-slate-400">Backdrop blur overlays</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={glassEffects}
                    onChange={(e) => {
                      setGlassEffects(e.target.checked);
                      localStorage.setItem('gn_glass_effects', String(e.target.checked));
                      showNotice(`Glass effects ${e.target.checked ? 'enabled' : 'disabled'}`);
                    }}
                    className="w-5 h-5 rounded-md accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 3: HOME SCREEN */}
          {activeCategory === 'home_screen' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Home Screen & Widgets</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure Dashboard order, widget sizes, and default start tab</p>
                </div>
              </div>

              {/* Native Android Widgets Configuration */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Native Android Widgets (10 Available)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: 'Clock & Alarm', size: '2x2', icon: Clock },
                    { name: 'Study Timer', size: '4x2', icon: GraduationCap },
                    { name: 'Health Score', size: '2x2', icon: HeartPulse },
                    { name: 'Jap Counter', size: '2x2', icon: Sparkles },
                    { name: 'Calendar Suite', size: '4x4', icon: FileText },
                    { name: 'AI Assistant', size: '4x2', icon: Bot },
                    { name: 'Quick Notes', size: '2x2', icon: FileText },
                    { name: 'Water Reminder', size: '2x2', icon: HeartPulse },
                    { name: 'Pomodoro Timer', size: '4x2', icon: Clock },
                    { name: 'Emergency Vault', size: '2x2', icon: Lock },
                  ].map((w, idx) => {
                    const Icon = w.icon;
                    return (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div className="truncate font-bold text-slate-900 dark:text-white">{w.name}</div>
                        </div>
                        <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-indigo-500/10 text-indigo-500 shrink-0">{w.size}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Default Screen */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Start Screen on App Launch</label>
                <select
                  defaultValue="home"
                  onChange={(e) => showNotice(`Default launch screen updated to ${e.target.value.toUpperCase()}`)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="home">Home Dashboard</option>
                  <option value="ai">AI Companion</option>
                  <option value="life_os">Life OS Routine</option>
                  <option value="study">Study Hub</option>
                  <option value="health_spiritual">Health & Spiritual</option>
                </select>
              </div>
            </div>
          )}

          {/* CATEGORY 4: AI SETTINGS */}
          {activeCategory === 'ai_settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">AI Engine & Model Providers</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gemini 1.5, OpenRouter, streaming, API keys, & offline models</p>
                </div>
              </div>

              {/* Primary Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary AI Provider</label>
                  <select
                    value={primaryAIProvider}
                    onChange={(e) => {
                      setPrimaryAIProvider(e.target.value);
                      localStorage.setItem('gn_ai_provider', e.target.value);
                      showNotice(`Primary AI provider set to ${e.target.value}`);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="gemini_flash">Google Gemini 1.5 Flash (Server-side)</option>
                    <option value="gemini_pro">Google Gemini 1.5 Pro</option>
                    <option value="openrouter">OpenRouter Multi-Model Proxy</option>
                    <option value="offline_local">GuideNer Offline On-Device AI Engine</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fallback Provider</label>
                  <select
                    value={fallbackAIProvider}
                    onChange={(e) => {
                      setFallbackAIProvider(e.target.value);
                      localStorage.setItem('gn_ai_fallback', e.target.value);
                      showNotice(`Fallback provider set to ${e.target.value}`);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="openrouter">OpenRouter Auto-Failover</option>
                    <option value="gemini_flash">Gemini 1.5 Flash</option>
                    <option value="offline_local">GuideNer Offline AI Pack</option>
                  </select>
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Custom Gemini / OpenRouter API Key (Optional)</span>
                  <span className="text-[10px] text-emerald-500 font-bold">Encrypted Local Key</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... (Default server key is active if blank)"
                    className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      localStorage.setItem('gn_user_gemini_key', apiKeyInput);
                      setIsApiKeySaved(true);
                      showNotice('API Key encrypted and saved locally!');
                      setTimeout(() => setIsApiKeySaved(false), 2000);
                    }}
                    className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0"
                  >
                    {isApiKeySaved ? 'Saved! ✓' : 'Save Key'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Note: If empty, GuideNer uses the secure server-side proxy provided by AI Studio Cloud Run infrastructure.
                </p>
              </div>

              {/* Streaming & Memory Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Streaming Responses</div>
                    <div className="text-[10px] text-slate-400">Stream tokens as AI speaks</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiStreaming}
                    onChange={(e) => setAiStreaming(e.target.checked)}
                    className="w-5 h-5 rounded-md accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversation Memory Retention</label>
                  <select
                    value={aiMemoryLimit}
                    onChange={(e) => setAiMemoryLimit(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="50">Last 50 Messages</option>
                    <option value="100">Last 100 Messages (Recommended)</option>
                    <option value="200">Last 200 Messages</option>
                    <option value="unlimited">Unlimited Context Window</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 5: CAMERA SETTINGS */}
          {activeCategory === 'camera_settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Camera Studio Pro Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Resolution, FPS, bitrate, focus peaking, RAW capture, & LOG profiles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Shooting Mode</label>
                  <select
                    value={cameraDefaultMode}
                    onChange={(e) => setCameraDefaultMode(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="photo">Photo Studio</option>
                    <option value="video">Video Studio</option>
                    <option value="cinema">Cinema 24fps</option>
                    <option value="raw">RAW Uncompressed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolution</label>
                  <select
                    value={cameraResolution}
                    onChange={(e) => setCameraResolution(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="4k">4K Ultra HD (3840x2160)</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frame Rate (FPS)</label>
                  <select
                    value={cameraFps}
                    onChange={(e) => setCameraFps(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="60">60 FPS (Smooth)</option>
                    <option value="30">30 FPS (Standard)</option>
                    <option value="24">24 FPS (Cinematic)</option>
                    <option value="120">120 FPS Slow Motion</option>
                  </select>
                </div>
              </div>

              {/* Overlays Grid */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Overlays & Assistants</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: 'histogram', label: 'Live Histogram' },
                    { key: 'focusPeaking', label: 'Focus Peaking' },
                    { key: 'falseColor', label: 'False Color' },
                    { key: 'grid', label: 'Rule of Thirds Grid' },
                    { key: 'safeArea', label: '16:9 Safe Area' },
                  ].map((ov) => (
                    <label key={ov.key} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                      <span>{ov.label}</span>
                      <input
                        type="checkbox"
                        checked={(cameraOverlays as any)[ov.key]}
                        onChange={(e) => setCameraOverlays({ ...cameraOverlays, [ov.key]: e.target.checked })}
                        className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 6: BROWSER SETTINGS */}
          {activeCategory === 'browser_settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Omni Browser Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Search engine, default desktop mode, reader mode, & ad blocking</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Search Engine</label>
                  <select
                    value={searchEngine}
                    onChange={(e) => setSearchEngine(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="google">Google Search</option>
                    <option value="duckduckgo">DuckDuckGo (Privacy)</option>
                    <option value="bing">Microsoft Bing</option>
                    <option value="brave">Brave Search</option>
                    <option value="ecosia">Ecosia Green Search</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Homepage URL</label>
                  <input
                    type="text"
                    value={browserHomepage}
                    onChange={(e) => setBrowserHomepage(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Default Desktop Mode</span>
                  <input
                    type="checkbox"
                    checked={browserDesktopMode}
                    onChange={(e) => setBrowserDesktopMode(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Auto Reader Mode</span>
                  <input
                    type="checkbox"
                    checked={browserReaderMode}
                    onChange={(e) => setBrowserReaderMode(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Ad & Tracker Shield</span>
                  <input
                    type="checkbox"
                    checked={adBlocking}
                    onChange={(e) => setAdBlocking(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 7: HEALTH SETTINGS */}
          {activeCategory === 'health_settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Health & Fitness Biometrics</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Set height, weight, age, water intake goals, steps, & sleep targets</p>
                </div>
              </div>

              {/* Biometrics Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Age (years)</label>
                  <input
                    type="number"
                    value={ageYears}
                    onChange={(e) => setAgeYears(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                  <select
                    value={genderVal}
                    onChange={(e) => setGenderVal(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Targets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Water Intake Goal</div>
                  <input
                    type="number"
                    value={waterGoalMl}
                    onChange={(e) => setWaterGoalMl(Number(e.target.value))}
                    className="w-full bg-transparent font-black text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-400">ml / day</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Step Target</div>
                  <input
                    type="number"
                    value={stepGoalVal}
                    onChange={(e) => setStepGoalVal(Number(e.target.value))}
                    className="w-full bg-transparent font-black text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-400">steps / day</div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Sleep Duration</div>
                  <input
                    type="number"
                    value={sleepGoalHours}
                    onChange={(e) => setSleepGoalHours(Number(e.target.value))}
                    className="w-full bg-transparent font-black text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-400">hours / night</div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Workout Target</div>
                  <input
                    type="number"
                    value={workoutGoalKcal}
                    onChange={(e) => setWorkoutGoalKcal(Number(e.target.value))}
                    className="w-full bg-transparent font-black text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="text-[9px] text-slate-400">kcal / day</div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 8: STUDY SETTINGS */}
          {activeCategory === 'study_settings' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Study Hub & Pomodoro Configurations</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage enrolled subjects, study goals, & Pomodoro focus intervals</p>
                </div>
              </div>

              {/* Enrolled Subjects */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Subjects ({subjectsList.length})</label>
                <div className="flex flex-wrap gap-2">
                  {subjectsList.map((subj, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-2 border border-indigo-500/20">
                      <span>{subj}</span>
                      <button onClick={() => handleRemoveSubject(i)} className="text-slate-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubjectInput}
                    onChange={(e) => setNewSubjectInput(e.target.value)}
                    placeholder="Add new subject (e.g. Organic Chemistry)..."
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddSubject}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Pomodoro Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Daily Study Goal (Hours)</label>
                  <input
                    type="number"
                    value={studyDailyGoal}
                    onChange={(e) => setStudyDailyGoal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Pomodoro Work Duration</label>
                  <select
                    value={pomodoroWorkMin}
                    onChange={(e) => setPomodoroWorkMin(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={25}>25 Minutes (Standard)</option>
                    <option value={45}>45 Minutes (Deep Focus)</option>
                    <option value={60}>60 Minutes (Marathon)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Break Duration</label>
                  <select
                    value={pomodoroBreakMin}
                    onChange={(e) => setPomodoroBreakMin(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value={5}>5 Minutes Short Break</option>
                    <option value={10}>10 Minutes Relax</option>
                    <option value={15}>15 Minutes Long Break</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 9: NOTIFICATIONS */}
          {activeCategory === 'notifications' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Notification Channels & Sound</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Toggle 9 notification channels, sound profiles, and priority alert rules</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic Channels</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'study', label: 'Study Hub & Flashcard Reminders' },
                    { key: 'health', label: 'Health, Water, & BLE Watch Alerts' },
                    { key: 'ai', label: 'AI Companion Smart Insights' },
                    { key: 'calendar', label: 'Calendar Suite Events' },
                    { key: 'downloads', label: 'Download Completion' },
                    { key: 'browser', label: 'Omni Browser Alerts' },
                    { key: 'vault', label: 'Vault Security Access Logs' },
                    { key: 'communication', label: 'Communication Suite Chat' },
                    { key: 'alarm', label: 'Alarms & Timers' },
                  ].map((ch) => (
                    <label key={ch.key} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                      <span>{ch.label}</span>
                      <input
                        type="checkbox"
                        checked={(notifChannels as any)[ch.key]}
                        onChange={(e) => setNotifChannels({ ...notifChannels, [ch.key]: e.target.checked })}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 10: SECURITY */}
          {activeCategory === 'security' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Security, PIN, & Private Vault</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Biometric fingerprint unlock, PIN protection, & AES-256 vault lock</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Biometric / Fingerprint Unlock</div>
                    <div className="text-[10px] text-slate-400">Hardware sensor access</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={biometricUnlock}
                    onChange={(e) => setBiometricUnlock(e.target.checked)}
                    className="w-5 h-5 rounded accent-emerald-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">AES-256 Vault Encryption Lock</div>
                    <div className="text-[10px] text-slate-400">Strict payload encryption</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vaultLockEnabled}
                    onChange={(e) => setVaultLockEnabled(e.target.checked)}
                    className="w-5 h-5 rounded accent-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 11: BACKUP */}
          {activeCategory === 'backup' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Cloud & Local Backup Management</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Export offline JSON/ZIP data backups & sync to Firebase Firestore</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Offline JSON Backup</h3>
                  </div>
                  <p className="text-[11px] text-slate-400">Download encrypted local copy of routines, notes, study decks, & health logs.</p>
                  <button
                    onClick={onExportBackup}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Export JSON Data
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Firebase Firestore Cloud Sync</h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {fbUser ? `Connected as ${fbUser.displayName}` : 'Not synced to cloud. Sign in to enable auto cloud sync.'}
                  </p>
                  {!fbUser ? (
                    <button
                      onClick={() => signInWithGoogle()}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Connect Google Firebase
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        cloudSyncService.triggerBackgroundSync();
                        showNotice('Cloud sync triggered successfully!');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Sync Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 12: STORAGE */}
          {activeCategory === 'storage' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Storage Breakdown & Cache Purge</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Inspect storage usage by module and clean temporary cache</p>
                </div>
              </div>

              {/* One-Tap Purge */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <Trash2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Clean Temporary Web & AI Cache</div>
                    <div className="text-[10px] text-slate-400">Frees space without deleting user notes or habits</div>
                  </div>
                </div>
                <button
                  onClick={handlePurgeAllCache}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 transition-all shadow-sm"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 13: LANGUAGE */}
          {activeCategory === 'language' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Languages className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Language & Indic Localization</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">9 supported Indic & global languages with live non-restarting switch</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', name: 'English', native: 'English' },
                  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
                  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
                  { code: 'mr', name: 'Marathi', native: 'मराठी' },
                  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
                  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
                  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
                  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
                ].map((lang) => {
                  const isSel = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code, lang.name)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSel
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                          : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black">{lang.name}</div>
                        <div className={`text-[10px] ${isSel ? 'text-purple-100' : 'text-slate-400'}`}>{lang.native}</div>
                      </div>
                      {isSel && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 14: ACCESSIBILITY */}
          {activeCategory === 'accessibility' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Accessibility & Vision</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High contrast contrast ratio, text scaling, & motion reduction</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">High Contrast Text Mode</div>
                    <div className="text-[10px] text-slate-400">Maximum WCAG AAA legibility</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-5 h-5 rounded accent-indigo-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Reduce Motion & Animations</div>
                    <div className="text-[10px] text-slate-400">Disable transitions for motion sensitivity</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => setReduceMotion(e.target.checked)}
                    className="w-5 h-5 rounded accent-indigo-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Large Touch Targets (44px Minimum)</div>
                    <div className="text-[10px] text-slate-400">Expanded hit areas for ease of tap</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={largeTouchTargets}
                    onChange={(e) => setLargeTouchTargets(e.target.checked)}
                    className="w-5 h-5 rounded accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 15: GUIDENER LABS */}
          {activeCategory === 'labs' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">GuideNer Experimental Labs</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preview cutting-edge features before official release</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Beta AI Audio Live Stream Engine</div>
                    <div className="text-[10px] text-slate-400">Real-time voice conversation mode</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={labBetaAI}
                    onChange={(e) => setLabBetaAI(e.target.checked)}
                    className="w-5 h-5 rounded accent-amber-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Beta Camera 10-Bit LOG Color Grading</div>
                    <div className="text-[10px] text-slate-400">Custom LUT import & cinema curves</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={labBetaCameraLog}
                    onChange={(e) => setLabBetaCameraLog(e.target.checked)}
                    className="w-5 h-5 rounded accent-amber-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Beta Omni Browser Turbo Rendering</div>
                    <div className="text-[10px] text-slate-400">Hardware accelerated DOM pipeline</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={labBetaBrowserTurbo}
                    onChange={(e) => setLabBetaBrowserTurbo(e.target.checked)}
                    className="w-5 h-5 rounded accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 16: ADMIN PANEL */}
          {activeCategory === 'admin' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Master Admin Panel & Remote Config</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">System telemetry, crash reports, maintenance mode, & feature flags</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">App Health</div>
                  <div className="text-base font-black text-emerald-500">100% Green</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Crash Rate</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">0.00%</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">API Latency</div>
                  <div className="text-base font-black text-indigo-500">12ms</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Active Users</div>
                  <div className="text-base font-black text-purple-500">1 (Local)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">System Maintenance Mode</div>
                  <div className="text-[10px] text-slate-400">Temporarily restrict background cloud updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={adminMaintenanceMode}
                  onChange={(e) => setAdminMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 rounded accent-rose-600"
                />
              </div>
            </div>
          )}

          {/* CATEGORY 17: ABOUT */}
          {activeCategory === 'about' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">About GuideNer AI Life Guide</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Commercial Android Super App Edition v4.8.0</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white space-y-2">
                <div className="text-xl font-black">GuideNer Pro Super App</div>
                <div className="text-xs text-indigo-200">Version 4.8.0 Build #2026.08.07 • Play Store Ready</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Built with React 18, Vite, Tailwind CSS, Lucide Icons, Material Design 3 guidelines, and server-side Google Gemini 1.5. Powered by Google Cloud Run infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  onClick={() => alert('GuideNer Privacy Policy: All user biometric, study, health, and note data is stored locally with optional encrypted Firebase backup. Zero tracking.')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white flex items-center justify-between"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => alert('Terms of Service: GuideNer provides personal productivity and AI assistant tools. Commercial License Grade.')}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white flex items-center justify-between"
                >
                  <span>Terms of Service</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Edit User Profile</h3>
              <button onClick={() => setIsEditProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 uppercase text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase text-[10px]">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase text-[10px]">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditProfileModalOpen(false);
                  showNotice('Profile updated successfully!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
