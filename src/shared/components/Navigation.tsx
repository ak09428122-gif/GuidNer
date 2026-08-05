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
} from 'lucide-react';
import { GuideNerLogo } from '../../core/theme/Logo';
import { ThemeMode, AIPersonaMode, AI_PERSONA_CONFIGS } from '../../core/theme/tokens';
import { useProfile, ProfileType } from '../../core/profile/ProfileContext';

export type ActiveTab =
  | 'home'
  | 'ai'
  | 'life_os'
  | 'study'
  | 'health_spiritual'
  | 'utilities'
  | 'downloader'
  | 'vault'
  | 'registration'
  | 'admin';

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
}) => {
  const { currentProfile, activeProfileId, switchProfile, allProfiles } = useProfile();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.FC<{ className?: string }>; badge?: string; category: string }[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home, category: 'Core' },
    { id: 'life_os', label: 'Life OS Routine', shortLabel: 'Routine', icon: CalendarCheck, category: 'Core' },
    { id: 'ai', label: 'AI Companion', shortLabel: 'AI Chat', icon: Bot, badge: 'Live', category: 'Core' },
    { id: 'study', label: 'Study Hub', shortLabel: 'Study', icon: GraduationCap, category: 'Core' },
    { id: 'health_spiritual', label: 'Health & Spiritual', shortLabel: 'Health', icon: HeartPulse, category: 'Wellness' },
    { id: 'vault', label: 'Secure Vault', shortLabel: 'Vault', icon: Lock, badge: 'AES', category: 'Security' },
    { id: 'downloader', label: 'Transfer & Downloads', shortLabel: 'Transfer', icon: Download, category: 'Utilities' },
    { id: 'utilities', label: 'Utilities & Notes', shortLabel: 'Utilities', icon: Wrench, category: 'Utilities' },
    { id: 'registration', label: 'Knowledge Library', shortLabel: 'Library', icon: BookOpen, badge: 'Hub', category: 'Learning' },
    { id: 'admin', label: 'Analytics & Admin', shortLabel: 'Analytics', icon: BarChart3, category: 'Tools' },
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between transition-colors shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <GuideNerLogo size="md" showTagline={true} />
        </div>

        {/* Center / Right Control Panel */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Universal Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-slate-700"
            title="Global Search across Life OS"
          >
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Search GuideNer...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-900 rounded-md">
              ⌘K
            </kbd>
          </button>

          {/* One-Tap Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsPersonaMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-extrabold rounded-2xl transition-all border ${currentProfile.badgeColor}`}
              title="One-Tap Multi-User Profile Switcher"
            >
              <span>{currentProfile.avatarIcon}</span>
              <span className="hidden sm:inline font-black">{currentProfile.name.split(' ')[0]}</span>
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

          {/* Life Score Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 text-xs font-bold text-blue-700 dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Score: {lifeScore}</span>
          </div>

          {/* AI Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPersonaMenuOpen(!isPersonaMenuOpen);
                setIsProfileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-2xl bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all border border-purple-500/20"
              title="Select AI Persona Mode"
            >
              <span>{AI_PERSONA_CONFIGS[persona].icon}</span>
              <span className="hidden md:inline">{AI_PERSONA_CONFIGS[persona].label}</span>
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

          {/* Theme Mode Toggle (Light / Dark / OLED) */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
            title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
            {theme === 'oled' && <Zap className="w-4 h-4 text-purple-400" />}
          </button>

          {/* AI Guided Mode Trigger */}
          {onOpenGuidedSettings && (
            <button
              onClick={onOpenGuidedSettings}
              className="p-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all border border-blue-500/20 flex items-center gap-1"
              title="AI Guided Mode Settings & Interactive Walkthrough"
            >
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span className="hidden xl:inline text-xs font-bold">Guided</span>
            </button>
          )}

          {/* Notification Center Trigger */}
          <button
            onClick={onOpenNotifs}
            className="relative p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all"
            title="Notifications & Smart Alarms"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>
      </header>

      {/* Desktop Navigation Dock / Sidebar Rail */}
      <aside className="hidden lg:flex fixed left-0 top-[57px] bottom-0 w-60 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col justify-between p-3 z-30">
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
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
