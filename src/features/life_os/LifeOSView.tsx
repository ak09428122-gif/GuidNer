import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Flame,
  Target,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Zap,
  Repeat,
  Layers,
} from 'lucide-react';
import { TimeBlock, Habit, Goal, PriorityLevel, TimeBlockCategory, EnergyLevel, GoalHorizon } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface LifeOSViewProps {
  timeBlocks: TimeBlock[];
  habits: Habit[];
  goals: Goal[];
  onSaveTimeBlock: (block: TimeBlock) => void;
  onDeleteTimeBlock: (id: string) => void;
  onToggleTimeBlock: (id: string) => void;
  onSaveHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onSaveGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export const LifeOSView: React.FC<LifeOSViewProps> = ({
  timeBlocks,
  habits,
  goals,
  onSaveTimeBlock,
  onDeleteTimeBlock,
  onToggleTimeBlock,
  onSaveHabit,
  onDeleteHabit,
  onToggleHabit,
  onSaveGoal,
  onDeleteGoal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'habits' | 'goals'>('timeline');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('life_os');
  }, [checkAndTriggerScreenGuide]);

  // Form states for creating items
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TimeBlockCategory>('study');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('high');
  const [newEnergy, setNewEnergy] = useState<EnergyLevel>('high');

  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Study');
  const [newHabitIcon, setNewHabitIcon] = useState('📖');

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalHorizon, setNewGoalHorizon] = useState<GoalHorizon>('monthly');

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const block: TimeBlock = {
      id: `tb-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      start_time: newStartTime,
      end_time: newEndTime,
      priority: newPriority,
      energy_level: newEnergy,
      is_completed: false,
      created_at: new Date().toISOString(),
    };
    onSaveTimeBlock(block);
    setNewTitle('');
    setIsAddBlockOpen(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle) return;
    const habit: Habit = {
      id: `h-${Date.now()}`,
      title: newHabitTitle,
      frequency: 'daily',
      target_count: 1,
      current_streak: 1,
      best_streak: 1,
      category: newHabitCategory,
      icon: newHabitIcon,
      logs: [],
      created_at: new Date().toISOString(),
    };
    onSaveHabit(habit);
    setNewHabitTitle('');
    setIsAddHabitOpen(false);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle) return;
    const goal: Goal = {
      id: `g-${Date.now()}`,
      title: newGoalTitle,
      description: newGoalDesc,
      horizon: newGoalHorizon,
      progress: 0.1,
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in_progress',
      created_at: new Date().toISOString(),
    };
    onSaveGoal(goal);
    setNewGoalTitle('');
    setNewGoalDesc('');
    setIsAddGoalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header & Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Life OS Workspace</h1>
              <HelpMeUseButton screenId="life_os" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              24-Hour Timeline • Habit Streaks • Goal Hierarchy
            </p>
          </div>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>24h Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('habits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'habits'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Habits ({habits.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('goals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'goals'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Goals ({goals.length})</span>
          </button>
        </div>
      </div>

      {/* 1. TIMELINE PLANNER TAB */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>24-Hour Schedule Stream</span>
            </h2>
            <button
              onClick={() => setIsAddBlockOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Time Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {timeBlocks.map((tb) => (
              <div
                key={tb.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                  tb.is_completed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => onToggleTimeBlock(tb.id)}
                    className="mt-0.5 sm:mt-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {tb.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{tb.title}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                        {tb.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tb.start_time} - {tb.end_time}
                      </span>
                      <span>•</span>
                      <span>Energy: {tb.energy_level.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/50 justify-between sm:justify-end">
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
                  <button
                    onClick={() => onDeleteTimeBlock(tb.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HABITS TAB */}
      {activeSubTab === 'habits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Habit Streaks & Matrix</span>
            </h2>
            <button
              onClick={() => setIsAddHabitOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Habit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-amber-500/10">{h.icon || '🎯'}</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{h.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{h.category} • Daily Goal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(h.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Streak: {h.current_streak} days (Best: {h.best_streak}d)
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleHabit(h.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Log Today
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GOALS TAB */}
      {activeSubTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Goal Hierarchy (Olympiad & Growth)</span>
            </h2>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{g.title}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 capitalize">
                        {g.horizon}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{g.description}</p>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Target Date: {g.target_date}</span>
                    <span>{Math.round(g.progress * 100)}% Complete</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${g.progress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Time Block Modal */}
      {isAddBlockOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBlock}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Time Block</h3>
              <button
                type="button"
                onClick={() => setIsAddBlockOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Block Title (e.g. Organic Chemistry Problems)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Start Time</label>
                <input
                  type="text"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">End Time</label>
                <input
                  type="text"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TimeBlockCategory)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="study">Study</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="leisure">Leisure</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Time Block
            </button>
          </form>
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddHabitOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHabit}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Create New Habit</h3>
              <button
                type="button"
                onClick={() => setIsAddHabitOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Habit Title (e.g. Read 30 mins)"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Category (e.g. Study)"
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Emoji Icon (e.g. 📖)"
                value={newHabitIcon}
                onChange={(e) => setNewHabitIcon(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Habit
            </button>
          </form>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGoal}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Goal</h3>
              <button
                type="button"
                onClick={() => setIsAddGoalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Goal Title"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <textarea
              placeholder="Goal Description"
              value={newGoalDesc}
              onChange={(e) => setNewGoalDesc(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <select
              value={newGoalHorizon}
              onChange={(e) => setNewGoalHorizon(e.target.value as GoalHorizon)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
