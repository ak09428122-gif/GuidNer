import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Droplet,
  Brain,
  GraduationCap,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  X,
  Eye,
  EyeOff,
  LayoutGrid,
  Check,
  Watch,
  Award,
  TrendingUp,
  Camera,
  Clock,
} from 'lucide-react';
import { UserProfile, TimeBlock, Habit, Goal, HealthLog } from '../../core/database/schema';
import { aiEngine } from '../../core/ai/AIEngineService';
import { AI_PERSONA_CONFIGS } from '../../core/theme/tokens';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { useProfile } from '../../core/profile/ProfileContext';

interface HomeViewProps {
  user: UserProfile;
  timeBlocks: TimeBlock[];
  habits: Habit[];
  goals: Goal[];
  healthLog: HealthLog;
  onToggleTimeBlock: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onAddWater: (amountMl: number) => void;
  onNavigate: (tab: any) => void;
  unreadActivityCount?: number;
  onOpenActivityCenter?: () => void;
  latestActivityTitle?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  timeBlocks,
  habits,
  goals,
  healthLog,
  onToggleTimeBlock,
  onToggleHabit,
  onAddWater,
  onNavigate,
  unreadActivityCount = 0,
  onOpenActivityCenter,
  latestActivityTitle,
}) => {
  const { currentProfile } = useProfile();
  const { checkAndTriggerScreenGuide, explainFeature } = useGuidedMode();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'today_plan' | 'habits' | 'hydration' | 'smartwatch' | 'quick_tools'>('all');

  // Customizable Widgets & Density State
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('gn_home_widgets');
    return saved ? JSON.parse(saved) : ['today_plan', 'habits', 'hydration', 'smartwatch'];
  });

  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    return (localStorage.getItem('gn_home_density') as 'comfortable' | 'compact') || 'comfortable';
  });

  useEffect(() => {
    checkAndTriggerScreenGuide('home');
  }, [checkAndTriggerScreenGuide]);

  const toggleWidget = (widgetId: string) => {
    const updated = visibleWidgets.includes(widgetId)
      ? visibleWidgets.filter((w) => w !== widgetId)
      : [...visibleWidgets, widgetId];
    setVisibleWidgets(updated);
    localStorage.setItem('gn_home_widgets', JSON.stringify(updated));
  };

  const handleSetDensity = (d: 'comfortable' | 'compact') => {
    setDensity(d);
    localStorage.setItem('gn_home_density', d);
  };

  const completedTBCount = timeBlocks.filter((tb) => tb.is_completed).length;
  const todayDateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const briefingText = aiEngine.generateDailyBriefing(
    currentProfile.name || user.name,
    user.life_score,
    completedTBCount,
    timeBlocks.length,
    user.persona_mode
  );

  return (
    <div className={`w-full space-y-6 ${density === 'compact' ? 'text-sm' : ''}`}>
      {/* Top Hero Greeting Header Card (Inspired by uploaded Reference Image) */}
      <section
        id="daily_briefing_card"
        onContextMenu={(e) => {
          e.preventDefault();
          explainFeature('home', 'daily_briefing');
        }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-4 sm:p-6 lg:p-8 text-white shadow-xl shadow-blue-500/10 cursor-pointer"
        title="Right-click for AI Guided Explanation"
      >
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 relative z-10 pb-3 sm:pb-4 border-b border-white/15">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>Today {todayDateStr}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 backdrop-blur-md text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-emerald-400/30">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Goal {completedTBCount}/{timeBlocks.length || 8}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 backdrop-blur-md text-[11px] sm:text-xs font-bold flex items-center gap-1.5 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{AI_PERSONA_CONFIGS[user.persona_mode].label} AI</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-[11px] sm:text-xs transition-all flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize ⚙️</span>
            </button>
            <HelpMeUseButton screenId="home" label="Guide" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pt-4 sm:pt-5 relative z-10">
          <div className="space-y-2.5 max-w-2xl min-w-0 w-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight break-words">
              Good Morning, {currentProfile.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
              "{briefingText}"
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200/90 pt-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Stay Focused. Stay Consistent. Success follows.</span>
            </div>
          </div>

          {/* Life Score Ring Stat */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 w-full sm:w-auto">
            <div className="relative flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#3882F6"
                  strokeWidth="8"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * user.life_score) / 1000}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black">{Math.floor(user.life_score / 10)}</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Score</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ai')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Chat with AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* What's New & Activity Center Banner Card */}
      <button
        onClick={onOpenActivityCenter}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 hover:border-emerald-500 transition-all flex items-center justify-between gap-3 shadow-sm hover:shadow-md text-left group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative p-3 rounded-2xl bg-emerald-500 text-white font-bold shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
            {unreadActivityCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                What's New & Activity Center
              </span>
              {unreadActivityCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  🟢 {unreadActivityCount} NEW
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                  All Read
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              {latestActivityTitle || 'OmniAir P2P Transfer & OmniBrowser multi-tab engine active'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
          <span className="hidden sm:inline">Open Center</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Quick Access Dock (6 Primary Cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Action Workspaces
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">One Tap = Direct Access</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('ai')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">AI Assistant</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Smart Help</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('life_os')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Life Manager</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Plan & Routine</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('study')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Study Hub</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Learn & Practice</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('vault')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Secure Vault</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Passwords & Privacy</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('downloader')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-cyan-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Transfer Hub</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Share & Download</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Analytics</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Insights & System</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('camera')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Pro Camera</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Manual 4K LOG</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('time_suite')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Time Suite</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pomodoro & Alarms</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('calendar_suite')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Triple Calendar</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Gregorian / VS / BS</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('numerology')}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-500 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Numerology</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Offline Life Path</div>
            </div>
          </button>
        </div>
      </section>

      {/* Main Grid: Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline (2 Cols) */}
        {visibleWidgets.includes('today_plan') && (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Today's Priority Schedule
                </h2>
              </div>
              <button
                onClick={() => onNavigate('life_os')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View 24h OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {timeBlocks.map((tb) => (
                <div
                  key={tb.id}
                  onClick={() => onToggleTimeBlock(tb.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    tb.is_completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {tb.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div
                        className={`text-sm font-bold ${
                          tb.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {tb.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span>{tb.start_time} - {tb.end_time}</span>
                        <span>•</span>
                        <span className="capitalize">{tb.category}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      tb.priority === 'critical'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : tb.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tb.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Cards: Habits, Hydration & Watch */}
        <div className="space-y-6">
          {/* Active Habit Streaks */}
          {visibleWidgets.includes('habits') && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Habit Streaks</h3>
                </div>
              </div>

              <div className="space-y-3">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onToggleHabit(h.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{h.icon || '🎯'}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{h.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{h.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{h.current_streak}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hydration Tracker */}
          {visibleWidgets.includes('hydration') && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-extrabold text-sm">
                  <Droplet className="w-4 h-4 text-teal-500" />
                  <span>Hydration Tracker</span>
                </div>
                <span className="text-xs font-bold text-teal-800 dark:text-teal-200">
                  {healthLog.water_ml} / 2500 ml
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-teal-200/50 dark:bg-teal-950 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (healthLog.water_ml / 2500) * 100)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  onClick={() => onAddWater(250)}
                  className="flex-1 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-500/30 hover:bg-teal-50 transition-colors flex items-center justify-center gap-1"
                  title="Add 250 ml"
                >
                  <Plus className="w-3 h-3" />
                  <span>250 ml</span>
                </button>
                <button
                  onClick={() => onAddWater(-250)}
                  className="py-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors flex items-center justify-center"
                  title="Remove 250 ml"
                >
                  -250 ml
                </button>
                <button
                  onClick={() => {
                    const custom = prompt('Enter water intake in ml:', String(healthLog.water_ml));
                    if (custom !== null && !isNaN(Number(custom))) {
                      const diff = Number(custom) - healthLog.water_ml;
                      onAddWater(diff);
                    }
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 transition-colors"
                  title="Manual Amount Entry"
                >
                  Edit ✏️
                </button>
              </div>
            </div>
          )}

          {/* Smartwatch Snapshot Widget */}
          {visibleWidgets.includes('smartwatch') && (
            <div
              onClick={() => onNavigate('health_spiritual')}
              className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-md cursor-pointer space-y-2 hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-300">
                  <Watch className="w-4 h-4 text-indigo-400" />
                  <span>Apple Watch Ultra 2</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-lg font-black">{healthLog.steps || 6842} steps</div>
                  <div className="text-[11px] text-slate-300">72 BPM • SpO2 98%</div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customize Dashboard Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Customize Home Layout</h3>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Density Choice */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dashboard Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSetDensity('comfortable')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    density === 'comfortable'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Comfortable</span>
                </button>

                <button
                  onClick={() => handleSetDensity('compact')}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    density === 'compact'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Compact</span>
                </button>
              </div>
            </div>

            {/* Toggle Widgets */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Visible Dashboard Widgets
              </label>

              <div className="space-y-2">
                {[
                  { id: 'today_plan', label: "Today's Schedule Timeline" },
                  { id: 'habits', label: 'Active Habit Streaks' },
                  { id: 'hydration', label: 'Hydration Tracker' },
                  { id: 'smartwatch', label: 'Smartwatch Vitals Card' },
                ].map((w) => {
                  const isVis = visibleWidgets.includes(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => toggleWidget(w.id)}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{w.label}</span>
                      {isVis ? (
                        <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600">
                          <Eye className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-lg bg-slate-100 text-slate-400">
                          <EyeOff className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsCustomizeOpen(false)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all"
            >
              Done & Save Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
