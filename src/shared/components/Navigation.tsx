import React, { useState } from 'react';
import {
  Home,
  Bot,
  CalendarCheck,
  GraduationCap,
  HeartPulse,
  Wrench,
  Download,
  Lock,
  BookOpen,
  BarChart3,
  Sun,
  Moon,
  Zap,
  Search,
  Bell,
  Sparkles,
  Compass,
  Grid,
  X,
  ChevronRight,
  Shield,
  UserCheck,
  Check,
  Radio,
  Globe,
  Maximize2,
  Camera,
  Clock,
  Calendar,
  MessageSquare,
  Folder,
  Cloud,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import { GuideNerLogo } from '../../core/theme/Logo';
import { ThemeMode, AIPersonaMode, AI_PERSONA_CONFIGS } from '../../core/theme/tokens';
import { useProfile, ProfileType } from '../../core/profile/ProfileContext';
import { useFirebaseAuth } from '../../core/database/FirebaseAuthContext';
import { desktopManager } from '../../core/DesktopManager';

export type ActiveTab =
  | 'home'
  | 'ai'
  | 'communication'
  | 'life_os'
  | 'study'
  | 'health_spiritual'
  | 'vault'
  | 'omniair'
  | 'browser'
  | 'downloader'
  | 'utilities'
  | 'registration'
  | 'admin'
  | 'camera'
  | 'time_suite'
  | 'calendar_suite'
  | 'numerology'
  | 'file_manager'
  | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  persona: AIPersonaMode;
  setPersona: (persona: AIPersonaMode) => void;
  lifeScore: number;
  onOpenSearch: () => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  onOpenGuidedSettings?: () => void;
  onOpenCloudAccount?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  persona,
  setPersona,
  lifeScore,
  onOpenSearch,
  unreadNotifsCount,
  onOpenNotifs,
  onOpenGuidedSettings,
  onOpenCloudAccount,
}) => {
  const { currentProfile, activeProfileId, switchProfile, allProfiles } = useProfile();
  const { user: fbUser, signInWithGoogle, signOut: fbSignOut, firestoreStatus } = useFirebaseAuth();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.FC<{ className?: string }>; badge?: string; category: string; shortcut?: string }[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home, category: 'Core', shortcut: '⌘1' },
    { id: 'ai', label: 'AI Companion', shortLabel: 'AI Chat', icon: Bot, badge: 'Live', category: 'Core', shortcut: '⌘2' },
    { id: 'communication', label: 'Communication Suite', shortLabel: 'Chat', icon: MessageSquare, badge: 'Online/P2P', category: 'Social' },
    { id: 'file_manager', label: 'File Manager', shortLabel: 'Files', icon: Folder, badge: 'AES', category: 'Storage' },
    { id: 'study', label: 'Study Hub', shortLabel: 'Study', icon: GraduationCap, category: 'Core', shortcut: '⌘3' },
    { id: 'camera', label: 'Pro Camera Engine', shortLabel: 'Camera', icon: Camera, badge: '4K LOG', category: 'Media' },
    { id: 'time_suite', label: 'Time & Pomodoro Suite', shortLabel: 'Time', icon: Clock, category: 'Productivity' },
    { id: 'calendar_suite', label: 'Triple Calendar Suite', shortLabel: 'Calendars', icon: Calendar, badge: 'VS/BS', category: 'Productivity' },
    { id: 'numerology', label: 'Offline Numerology', shortLabel: 'Numerology', icon: Sparkles, category: 'Utilities' },
    { id: 'health_spiritual', label: 'Health & Spiritual', shortLabel: 'Health', icon: HeartPulse, category: 'Wellness', shortcut: '⌘4' },
    { id: 'vault', label: 'Secure Vault', shortLabel: 'Vault', icon: Lock, badge: 'AES', category: 'Security', shortcut: '⌘5' },
    { id: 'omniair', label: 'OmniAir Transfer', shortLabel: 'OmniAir', icon: Radio, badge: 'P2P', category: 'Transfer', shortcut: '⌘6' },
    { id: 'browser', label: 'Omni Browser', shortLabel: 'Browser', icon: Globe, badge: 'Web', category: 'Browser', shortcut: '⌘7' },
    { id: 'life_os', label: 'Life OS Routine', shortLabel: 'Routine', icon: CalendarCheck, category: 'Core', shortcut: '⌘8' },
    { id: 'downloader', label: 'Download Manager', shortLabel: 'Downloads', icon: Download, category: 'Utilities', shortcut: '⌘9' },
    { id: 'utilities', label: 'Utilities & Notes', shortLabel: 'Utilities', icon: Wrench, category: 'Utilities' },
    { id: 'registration', label: 'Knowledge Library', shortLabel: 'Library', icon: BookOpen, badge: 'Hub', category: 'Learning' },
    { id: 'admin', label: 'Analytics & Admin', shortLabel: 'Analytics', icon: BarChart3, category: 'Tools' },
    { id: 'settings', label: 'Master Settings Hub', shortLabel: 'Settings', icon: Settings, badge: 'Hub', category: 'Tools' },
  ];

  const primaryTabs: ActiveTab[] = ['home', 'life_os', 'ai', 'study'];
  const isSecondaryActive = !primaryTabs.includes(activeTab);
  const activeSecondaryItem = navItems.find((n) => n.id === activeTab);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('oled');
    else setTheme('light');
  };

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full max-w-full h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between transition-colors shadow-xs overflow-x-hidden">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <GuideNerLogo size="md" showTagline={true} />
        </div>

        {/* Right Header Action Panel */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Universal Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shrink-0"
            title="Global Search across Life OS (⌘K)"
          >
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="hidden sm:inline text-xs font-semibold">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-900 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Profile Switcher Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsPersonaMenuOpen(false);
                setIsQuickToolsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-extrabold rounded-xl transition-all border ${currentProfile.badgeColor}`}
              title="One-Tap Multi-User Profile Switcher"
            >
              <span>{currentProfile.avatarIcon}</span>
              <span className="hidden md:inline font-black">{currentProfile.name.split(' ')[0]}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>Switch Profile</span>
                  <span className="text-[10px] font-normal text-blue-600 dark:text-blue-400">One Tap</span>
                </div>

                <div className="space-y-1 px-1">
                  {allProfiles.map((p) => {
                    const isSelected = p.id === activeProfileId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchProfile(p.id);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{p.avatarIcon}</span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{p.name}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {p.roleLabel}
                            </span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Activity Center Notifications Bell */}
          <button
            onClick={onOpenNotifs}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center shrink-0"
            title="Activity Center & Smart Updates"
          >
            <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-black text-white bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
            title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500 shrink-0" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400 shrink-0" />}
            {theme === 'oled' && <Zap className="w-4 h-4 text-purple-400 shrink-0" />}
          </button>

          {/* Desktop-Only Power Control Tools (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-2">
            {onOpenCloudAccount && (
              <button
                onClick={onOpenCloudAccount}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all"
                title="GuideNer Cloud Account & Backup"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Account</span>
              </button>
            )}

            {fbUser ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate max-w-[90px]">{fbUser.displayName || 'Synced'}</span>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
                title="Sync profile and Life OS to Firebase Firestore"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>
            )}

            {/* Life Score Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>Score: {lifeScore}</span>
            </div>

            {/* AI Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPersonaMenuOpen(!isPersonaMenuOpen);
                  setIsProfileMenuOpen(false);
                  setIsQuickToolsOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all"
                title="Select AI Persona Mode"
              >
                <span>{AI_PERSONA_CONFIGS[persona].icon}</span>
                <span className="font-bold">{AI_PERSONA_CONFIGS[persona].label}</span>
              </button>

              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    AI Persona Mode
                  </div>
                  {(['friendly', 'professional', 'strict', 'minimal'] as AIPersonaMode[]).map((pKey) => {
                    const cfg = AI_PERSONA_CONFIGS[pKey];
                    return (
                      <button
                        key={pKey}
                        onClick={() => {
                          setPersona(pKey);
                          setIsPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                          persona === pKey ? 'font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{cfg.icon}</span>
                        <div className="flex flex-col">
                          <span>{cfg.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{cfg.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Guided Mode Trigger */}
            {onOpenGuidedSettings && (
              <button
                onClick={onOpenGuidedSettings}
                className="p-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all flex items-center gap-1"
                title="AI Guided Mode Settings"
              >
                <Compass className="w-4 h-4 animate-spin-slow shrink-0" />
                <span className="text-xs font-bold">Guided</span>
              </button>
            )}

            {/* Desktop Fullscreen Button */}
            <button
              onClick={() => desktopManager.toggleFullscreen()}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Toggle Fullscreen (F11)"
            >
              <Maximize2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Mobile Quick Tools Button (< lg screens) */}
          <div className="lg:hidden relative shrink-0">
            <button
              onClick={() => {
                setIsQuickToolsOpen(!isQuickToolsOpen);
                setIsProfileMenuOpen(false);
                setIsPersonaMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center transition-all"
              title="More Tools & Settings"
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
            </button>

            {/* Mobile Quick Tools Dropdown */}
            {isQuickToolsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase pb-1 border-b border-slate-100 dark:border-slate-700">
                  Quick Tools & Cloud
                </div>

                <div className="space-y-1.5">
                  {onOpenCloudAccount && (
                    <button
                      onClick={() => {
                        onOpenCloudAccount();
                        setIsQuickToolsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4" />
                        <span>Cloud Account</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {!fbUser ? (
                    <button
                      onClick={() => {
                        signInWithGoogle().catch(() => {});
                        setIsQuickToolsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Firebase Sync</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <div className="flex items-center gap-2 min-w-0">
                        <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{fbUser.displayName || 'Synced'}</span>
                      </div>
                      <button
                        onClick={() => fbSignOut()}
                        className="text-[10px] text-red-500 hover:underline shrink-0"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}

                  {onOpenGuidedSettings && (
                    <button
                      onClick={() => {
                        onOpenGuidedSettings();
                        setIsQuickToolsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-blue-500" />
                        <span>AI Guided Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* AI Persona Quick Selector inside Mobile Quick Tools */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">AI Persona Mode</div>
                    <div className="grid grid-cols-2 gap-1">
                      {(['friendly', 'professional', 'strict', 'minimal'] as AIPersonaMode[]).map((pKey) => {
                        const cfg = AI_PERSONA_CONFIGS[pKey];
                        const isSel = persona === pKey;
                        return (
                          <button
                            key={pKey}
                            onClick={() => {
                              setPersona(pKey);
                              setIsQuickToolsOpen(false);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                              isSel
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            <span>{cfg.icon}</span>
                            <span className="truncate">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Instagram / WhatsApp / Twitter Style Story & Quick Tab Strip */}
      <div className="w-full max-w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-2 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-3 lg:pl-68 shrink-0 z-20">
        {[
          { id: 'home', label: 'Feed', icon: Home, ring: 'from-blue-500 via-indigo-500 to-purple-500', isLive: true },
          { id: 'life_os', label: 'Routine', icon: CalendarCheck, ring: 'from-emerald-400 to-teal-600' },
          { id: 'ai', label: 'AI Voice', icon: Bot, ring: 'from-fuchsia-500 via-pink-500 to-rose-500', isLive: true },
          { id: 'communication', label: 'Messages', icon: MessageSquare, ring: 'from-rose-500 to-orange-500' },
          { id: 'study', label: 'Study Hub', icon: GraduationCap, ring: 'from-indigo-500 to-blue-600' },
          { id: 'file_manager', label: 'Files', icon: Folder, ring: 'from-amber-400 to-yellow-600' },
          { id: 'camera', label: '4K Camera', icon: Camera, ring: 'from-red-500 to-pink-600' },
          { id: 'omniair', label: 'OmniAir', icon: Radio, ring: 'from-cyan-400 to-blue-500' },
          { id: 'vault', label: 'Vault', icon: Lock, ring: 'from-violet-500 to-purple-700' },
          { id: 'browser', label: 'Browser', icon: Globe, ring: 'from-sky-400 to-cyan-600' },
          { id: 'health_spiritual', label: 'Wellness', icon: HeartPulse, ring: 'from-emerald-500 to-green-600' },
          { id: 'time_suite', label: 'Pomodoro', icon: Clock, ring: 'from-orange-400 to-amber-600' },
          { id: 'calendar_suite', label: 'Calendar', icon: Calendar, ring: 'from-blue-600 to-indigo-700' },
          { id: 'numerology', label: 'Numerology', icon: Sparkles, ring: 'from-purple-500 to-pink-500' },
          { id: 'downloader', label: 'Downloads', icon: Download, ring: 'from-teal-500 to-emerald-600' },
          { id: 'settings', label: 'Settings', icon: Settings, ring: 'from-slate-500 to-zinc-700' },
        ].map((story) => {
          const Icon = story.icon;
          const isActive = activeTab === story.id;
          return (
            <button
              key={story.id}
              onClick={() => setActiveTab(story.id as ActiveTab)}
              className="flex flex-col items-center gap-1 group shrink-0 transition-transform active:scale-95"
              title={`Switch to ${story.label}`}
            >
              <div
                className={`relative p-0.5 rounded-full bg-gradient-to-tr ${story.ring} transition-all ${
                  isActive ? 'scale-105 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md' : 'opacity-85 hover:opacity-100 hover:scale-105'
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  />
                </div>
                {story.isLive && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight truncate max-w-[64px] font-semibold ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {story.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Navigation Dock / Sidebar Rail */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col justify-between p-3.5 z-30 shadow-xs">
        <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
          <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workspaces
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMoreSheetOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.shortcut && !item.badge && (
                    <span
                      className={`hidden group-hover:inline-block text-[10px] font-mono opacity-60 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Security Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Secure & Private</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
            Profile: {currentProfile.name} • AES-256 Vault
          </p>
        </div>
      </aside>

      {/* Fixed Material Design 3 Mobile Bottom Navigation Bar (5 slots, NO horizontal scrolling) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 grid grid-cols-5 items-center gap-1 shadow-lg">
        {/* Slot 1: Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            setIsMoreSheetOpen(false);
          }}
          className="flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'home'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              activeTab === 'home' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Home
          </span>
        </button>

        {/* Slot 2: Routine (Life OS) */}
        <button
          onClick={() => {
            setActiveTab('life_os');
            setIsMoreSheetOpen(false);
          }}
          className="flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'life_os'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              activeTab === 'life_os' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Routine
          </span>
        </button>

        {/* Slot 3: AI Assistant */}
        <button
          onClick={() => {
            setActiveTab('ai');
            setIsMoreSheetOpen(false);
          }}
          className="flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              activeTab === 'ai' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            AI Chat
          </span>
        </button>

        {/* Slot 4: Study Hub */}
        <button
          onClick={() => {
            setActiveTab('study');
            setIsMoreSheetOpen(false);
          }}
          className="flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === 'study'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              activeTab === 'study' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Study
          </span>
        </button>

        {/* Slot 5: More Workspaces */}
        <button
          onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
          className="flex flex-col items-center justify-center py-1 transition-all group"
        >
          <div
            className={`px-4 py-1 rounded-full transition-all flex items-center justify-center relative ${
              isSecondaryActive || isMoreSheetOpen
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
            }`}
          >
            {isSecondaryActive && activeSecondaryItem ? (
              <activeSecondaryItem.icon className="w-5 h-5" />
            ) : (
              <Grid className="w-5 h-5" />
            )}
            {isSecondaryActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
            )}
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[60px] ${
              isSecondaryActive || isMoreSheetOpen ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.shortLabel : 'More'}
          </span>
        </button>
      </nav>

      {/* Material Design 3 Bottom Sheet / Drawer for All Workspaces */}
      {isMoreSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsMoreSheetOpen(false)}
          />

          <div className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
            {/* Sheet Drag Pill & Header */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">All GuideNer Workspaces</h2>
                </div>
                <button
                  onClick={() => setIsMoreSheetOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid of Workspaces */}
            <div className="grid grid-cols-2 gap-2.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreSheetOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 text-[9px] rounded-full font-extrabold shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* M3 Bottom Sheet Footer Info */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold text-[11px]">Offline Local Storage Enabled</span>
              </div>
              <button
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  if (onOpenGuidedSettings) onOpenGuidedSettings();
                }}
                className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <span>Walkthrough</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
