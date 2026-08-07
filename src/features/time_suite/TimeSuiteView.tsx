import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Award,
  Bell,
  Droplet,
  Pill,
  Dumbbell,
  BookOpen,
  HeartPulse,
  BarChart3,
  CheckCircle2,
  Trash2,
  Share2,
  Zap,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { M3Button, M3Card, M3CircularGauge } from '../../shared/components/ui/MaterialComponents';

export type TimeSuiteSubTab = 'stopwatch' | 'timer' | 'pomodoro' | 'alarms' | 'routine' | 'timeline';

export interface LapTime {
  lapNumber: number;
  timeMs: number;
  deltaMs: number;
}

export interface CountdownTimerItem {
  id: string;
  label: string;
  durationSec: number;
  remainingSec: number;
  isRunning: boolean;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  days: string[];
  category: 'study' | 'health' | 'meditation' | 'work';
  enabled: boolean;
}

export const TimeSuiteView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TimeSuiteSubTab>('stopwatch');

  // --- STOPWATCH STATE ---
  const [swTimeMs, setSwTimeMs] = useState(0);
  const [isSwRunning, setIsSwRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);

  useEffect(() => {
    let interval: any;
    if (isSwRunning) {
      interval = setInterval(() => setSwTimeMs((prev) => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isSwRunning]);

  const handleLap = () => {
    const prevTotalMs = laps.reduce((acc, l) => acc + l.deltaMs, 0);
    const deltaMs = swTimeMs - prevTotalMs;
    const newLap: LapTime = {
      lapNumber: laps.length + 1,
      timeMs: swTimeMs,
      deltaMs,
    };
    setLaps([newLap, ...laps]);
  };

  const resetSw = () => {
    setIsSwRunning(false);
    setSwTimeMs(0);
    setLaps([]);
  };

  const formatMs = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis
      .toString()
      .padStart(2, '0')}`;
  };

  // --- COUNTDOWN TIMERS STATE ---
  const [timers, setTimers] = useState<CountdownTimerItem[]>([
    { id: 't-1', label: '5m Quick Study Drill', durationSec: 300, remainingSec: 300, isRunning: false },
    { id: 't-2', label: '15m Mindful Breath Break', durationSec: 900, remainingSec: 900, isRunning: false },
    { id: 't-3', label: '25m Focus Session', durationSec: 1500, remainingSec: 1500, isRunning: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (t.isRunning && t.remainingSec > 0) {
            return { ...t, remainingSec: t.remainingSec - 1 };
          }
          if (t.isRunning && t.remainingSec === 0) {
            return { ...t, isRunning: false };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remainingSec: t.durationSec, isRunning: false } : t))
    );
  };

  // --- POMODORO STATE ---
  const [pomoSec, setPomoSec] = useState(1500); // 25 mins
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoCycle, setPomoCycle] = useState(1);
  const [completedPomos, setCompletedPomos] = useState(3);

  useEffect(() => {
    let interval: any;
    if (isPomoRunning && pomoSec > 0) {
      interval = setInterval(() => setPomoSec((prev) => prev - 1), 1000);
    } else if (isPomoRunning && pomoSec === 0) {
      setIsPomoRunning(false);
      setCompletedPomos((prev) => prev + 1);
      setPomoCycle((prev) => prev + 1);
      setPomoSec(1500);
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoSec]);

  // --- ROUTINE REMINDERS & HYDRATION TRACKER ---
  const [waterMl, setWaterMl] = useState(1750); // Goal: 2500ml
  const [routineTasks, setRoutineTasks] = useState([
    { id: 'r-1', title: 'Morning Omega-3 & Multivitamin', category: 'medicine', done: true, time: '08:00 AM' },
    { id: 'r-2', title: 'Physics Olympiad Practice Test 1', category: 'study', done: true, time: '10:30 AM' },
    { id: 'r-3', title: '15m Posture & Core Stretching', category: 'exercise', done: false, time: '04:00 PM' },
    { id: 'r-4', title: 'Guided Evening Breathwork', category: 'meditation', done: false, time: '09:00 PM' },
  ]);

  // --- SMART ALARMS ---
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: 'a-1', time: '06:00 AM', label: 'Early Study Routine', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], category: 'study', enabled: true },
    { id: 'a-2', time: '02:00 PM', label: 'Hydration & Posture Reset', days: ['Everyday'], category: 'health', enabled: true },
    { id: 'a-3', time: '10:30 PM', label: 'Screen Off & Sleep Prep', days: ['Everyday'], category: 'meditation', enabled: false },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight">Time & Productivity Suite</h1>
          </div>
          <p className="text-xs text-indigo-200">
            Precision Stopwatch, Multi-Timers, Pomodoro Engine & Smart Routine Alarms
          </p>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'stopwatch', label: 'Stopwatch' },
            { id: 'timer', label: 'Timers' },
            { id: 'pomodoro', label: 'Pomodoro' },
            { id: 'alarms', label: 'Alarms' },
            { id: 'routine', label: 'Routine' },
            { id: 'timeline', label: 'Timeline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-2xl font-extrabold text-xs transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: STOPWATCH */}
      {activeTab === 'stopwatch' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <M3Card variant="elevated" className="text-center p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Millisecond Precision</span>
              <div className="font-mono font-black text-5xl sm:text-6xl text-slate-900 dark:text-white tracking-tight">
                {formatMs(swTimeMs)}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <M3Button
                variant={isSwRunning ? 'danger' : 'primary'}
                size="lg"
                icon={isSwRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                onClick={() => setIsSwRunning(!isSwRunning)}
              >
                {isSwRunning ? 'Pause' : 'Start'}
              </M3Button>

              {isSwRunning && (
                <M3Button variant="tonal" size="lg" icon={<Plus className="w-5 h-5" />} onClick={handleLap}>
                  Record Lap
                </M3Button>
              )}

              <M3Button variant="ghost" size="lg" icon={<RotateCcw className="w-5 h-5" />} onClick={resetSw}>
                Reset
              </M3Button>
            </div>
          </M3Card>

          {/* Laps List */}
          {laps.length > 0 && (
            <M3Card variant="outlined" className="space-y-3">
              <div className="flex items-center justify-between font-extrabold text-xs text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Lap #</span>
                <span>Lap Delta</span>
                <span>Total Time</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {laps.map((l) => (
                  <div
                    key={l.lapNumber}
                    className="flex items-center justify-between font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60"
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Lap {l.lapNumber}</span>
                    <span className="text-slate-600 dark:text-slate-300">+{formatMs(l.deltaMs)}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatMs(l.timeMs)}</span>
                  </div>
                ))}
              </div>
            </M3Card>
          )}
        </div>
      )}

      {/* SUBTAB 2: COUNTDOWN TIMERS */}
      {activeTab === 'timer' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {timers.map((t) => (
            <M3Card key={t.id} variant="elevated" className="space-y-4 text-center">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">{t.label}</div>
              <div className="font-mono font-black text-3xl text-indigo-600 dark:text-indigo-400">
                {Math.floor(t.remainingSec / 60)}:{ (t.remainingSec % 60).toString().padStart(2, '0') }
              </div>
              <div className="flex items-center justify-center gap-2">
                <M3Button
                  variant={t.isRunning ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => toggleTimer(t.id)}
                >
                  {t.isRunning ? 'Pause' : 'Start'}
                </M3Button>
                <M3Button variant="ghost" size="sm" onClick={() => resetTimer(t.id)}>
                  Reset
                </M3Button>
              </div>
            </M3Card>
          ))}
        </div>
      )}

      {/* SUBTAB 3: POMODORO FOCUS */}
      {activeTab === 'pomodoro' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <M3Card variant="elevated" className="p-8 space-y-6">
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              <span>Pomodoro Cycle #{pomoCycle}</span>
            </div>

            <div className="mx-auto flex justify-center">
              <M3CircularGauge
                value={pomoSec}
                max={1500}
                size={160}
                strokeWidth={12}
                color="#6366F1"
                label={`${Math.floor(pomoSec / 60)}:${(pomoSec % 60).toString().padStart(2, '0')}`}
                sublabel="FOCUS TIME"
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <M3Button
                variant={isPomoRunning ? 'danger' : 'primary'}
                size="lg"
                icon={isPomoRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                onClick={() => setIsPomoRunning(!isPomoRunning)}
              >
                {isPomoRunning ? 'Pause Cycle' : 'Start Focus'}
              </M3Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="font-bold text-slate-400">Completed Sessions</div>
                <div className="font-black text-lg text-indigo-600 dark:text-indigo-400">{completedPomos}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="font-bold text-slate-400">Total Focus Score</div>
                <div className="font-black text-lg text-emerald-500">92 / 100</div>
              </div>
            </div>
          </M3Card>
        </div>
      )}

      {/* SUBTAB 4: SMART ALARMS */}
      {activeTab === 'alarms' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {alarms.map((a) => (
            <M3Card key={a.id} variant="outlined" className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <div className="font-mono font-black text-2xl text-slate-900 dark:text-white">{a.time}</div>
                <div className="font-bold text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span>{a.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                    {a.days.join(', ')}
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={a.enabled}
                onChange={() => toggleAlarm(a.id)}
                className="w-6 h-6 accent-indigo-600 rounded-lg cursor-pointer"
              />
            </M3Card>
          ))}
        </div>
      )}

      {/* SUBTAB 5: ROUTINE & HYDRATION */}
      {activeTab === 'routine' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Hydration Widget */}
          <M3Card variant="elevated" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-black text-sm">
                <Droplet className="w-5 h-5" />
                <span>Daily Water Hydration Tracker</span>
              </div>
              <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                {waterMl} / 2500 ml
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (waterMl / 2500) * 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              <M3Button variant="tonal" size="sm" onClick={() => setWaterMl((prev) => prev + 250)}>
                + 250 ml Glass
              </M3Button>
              <M3Button variant="tonal" size="sm" onClick={() => setWaterMl((prev) => prev + 500)}>
                + 500 ml Bottle
              </M3Button>
            </div>
          </M3Card>

          {/* Routine Reminders */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Today's Scheduled Routines</h3>
            {routineTasks.map((rt) => (
              <div
                key={rt.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rt.done}
                    onChange={() =>
                      setRoutineTasks((prev) =>
                        prev.map((item) => (item.id === rt.id ? { ...item, done: !item.done } : item))
                      )
                    }
                    className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer"
                  />
                  <div>
                    <div className={`font-bold text-xs ${rt.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {rt.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{rt.time} • {rt.category.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: TIMELINE VISUALIZER */}
      {activeTab === 'timeline' && (
        <M3Card variant="elevated" className="p-6 space-y-4 max-w-3xl mx-auto">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">24-Hour Activity Visualizer</h3>
          <div className="space-y-3">
            {[
              { time: '07:00 AM', label: 'Morning Meditation & Pranayama', tag: 'Health', color: 'bg-emerald-500' },
              { time: '09:00 AM', label: 'Physics Olympiad Mechanics Drill', tag: 'Study', color: 'bg-indigo-600' },
              { time: '01:00 PM', label: 'Hydration & Balanced Lunch Break', tag: 'Health', color: 'bg-cyan-500' },
              { time: '03:00 PM', label: 'Chemistry Olympiad Reaction Kinetics', tag: 'Study', color: 'bg-purple-600' },
              { time: '06:00 PM', label: 'Evening Workout & Cardio', tag: 'Fitness', color: 'bg-amber-500' },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-slate-400 w-16">{slot.time}</span>
                <div className={`w-3 h-3 rounded-full ${slot.color}`} />
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-1 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{slot.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-500">
                    {slot.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </M3Card>
      )}
    </div>
  );
};
