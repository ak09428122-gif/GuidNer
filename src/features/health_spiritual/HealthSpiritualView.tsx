import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Flame,
  Droplet,
  Footprints,
  Moon,
  Pill,
  Sparkles,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Volume2,
  Activity,
  BarChart3,
  Scale,
  Zap,
} from 'lucide-react';
import { HealthLog, SpiritualLog } from '../../core/database/schema';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { SmartwatchSyncCard } from './SmartwatchSyncCard';
import { M3Card } from '../../shared/components/ui/MaterialComponents';

interface HealthSpiritualViewProps {
  healthLog: HealthLog;
  spiritualLog: SpiritualLog;
  onSaveHealthLog: (log: HealthLog) => void;
  onSaveSpiritualLog: (log: SpiritualLog) => void;
}

export const HealthSpiritualView: React.FC<HealthSpiritualViewProps> = ({
  healthLog,
  spiritualLog,
  onSaveHealthLog,
  onSaveSpiritualLog,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'analytics' | 'spiritual'>('health');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Additional Vitals state for Module 7
  const [caloriesBurned, setCaloriesBurned] = useState<number>(480);
  const [weightKg, setWeightKg] = useState<number>(68.5);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [spO2Percent, setSpO2Percent] = useState<number>(98);
  const [exerciseMode, setExerciseMode] = useState<'walking' | 'running' | 'yoga' | 'meditation'>('walking');
  const [exerciseTimer, setExerciseTimer] = useState<number>(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);

  useEffect(() => {
    checkAndTriggerScreenGuide('health');
  }, [checkAndTriggerScreenGuide]);

  // Exercise Timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExerciseActive) {
      interval = setInterval(() => setExerciseTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isExerciseActive]);

  // Calculate BMI
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  // Mala Counter state
  const [selectedMantra, setSelectedMantra] = useState('gayatri_mantra');
  const [currentMalaCount, setCurrentMalaCount] = useState<number>(
    spiritualLog.mala_counts[selectedMantra] || 0
  );

  const handleMalaIncrement = () => {
    const nextCount = currentMalaCount + 1;
    setCurrentMalaCount(nextCount);

    if (nextCount % 108 === 0) {
      notificationEngine.playTone('meditation_singing_bowl');
    } else {
      notificationEngine.playTone('water_drop');
    }

    const updatedCounts = { ...spiritualLog.mala_counts, [selectedMantra]: nextCount };
    onSaveSpiritualLog({ ...spiritualLog, mala_counts: updatedCounts });
  };

  const handleToggleMedication = (medId: string) => {
    const updatedMeds = healthLog.medications_taken.map((m) =>
      m.med_id === medId ? { ...m, taken: !m.taken } : m
    );
    onSaveHealthLog({ ...healthLog, medications_taken: updatedMeds });
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 font-sans text-slate-900 dark:text-white">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/30">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pro Health Engine & Spiritual Hub
              </h1>
              <HelpMeUseButton screenId="health" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SpO2 • Heart Rate • BMI • Exercise Tracker • Mala Counter • Reports
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Vitals</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('spiritual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'spiritual'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Spiritual</span>
          </button>
        </div>
      </div>

      {/* 1. HEALTH & VITALS TAB */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <SmartwatchSyncCard
            healthLog={healthLog}
            onSyncData={(updated) => onSaveHealthLog({ ...healthLog, ...updated })}
          />

          {/* Expanded Grid for Vitals & Measurements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Steps */}
            <M3Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-blue-500">
                <Footprints className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Steps</span>
              </div>
              <div className="text-xl font-black">{healthLog.steps}</div>
              <div className="text-[11px] text-slate-500">Goal: 10,000 steps</div>
            </M3Card>

            {/* Calories Burned */}
            <M3Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-amber-500">
                <Flame className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Calories</span>
              </div>
              <div className="text-xl font-black">{caloriesBurned} kcal</div>
              <div className="text-[11px] text-slate-500">Active Burn</div>
            </M3Card>

            {/* Weight & BMI */}
            <M3Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-purple-500">
                <Scale className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">BMI Index</span>
              </div>
              <div className="text-xl font-black">{bmi}</div>
              <div className="text-[11px] text-slate-500">{weightKg} kg (Normal)</div>
            </M3Card>

            {/* SpO2 Blood Oxygen */}
            <M3Card className="p-4 space-y-2">
              <div className="flex items-center justify-between text-rose-500">
                <Activity className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">SpO2 Oxygen</span>
              </div>
              <div className="text-xl font-black">{spO2Percent}%</div>
              <div className="text-[11px] text-slate-500">Optimal Range</div>
            </M3Card>
          </div>

          {/* Exercise Activity Tracker */}
          <M3Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base">Live Exercise Tracker</h3>
              </div>
              <span className="font-mono font-bold text-sm text-indigo-500">
                {Math.floor(exerciseTimer / 60)}m {exerciseTimer % 60}s
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['walking', 'running', 'yoga', 'meditation'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setExerciseMode(mode)}
                  className={`p-3 rounded-2xl font-bold text-xs capitalize transition-all ${
                    exerciseMode === mode
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsExerciseActive(!isExerciseActive)}
              className={`w-full py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isExerciseActive
                  ? 'bg-rose-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isExerciseActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isExerciseActive ? 'Pause Exercise Session' : 'Start ' + exerciseMode + ' Workout'}</span>
            </button>
          </M3Card>

          {/* Water Hydration */}
          <M3Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-teal-500" />
                <h3 className="font-extrabold text-base">Hydration Log</h3>
              </div>
              <span className="font-bold text-teal-500 text-sm">
                {healthLog.water_ml} / 2,500 ml
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSaveHealthLog({ ...healthLog, water_ml: healthLog.water_ml + 250 })}
                className="flex-1 py-2.5 rounded-2xl bg-teal-500/10 text-teal-600 font-bold text-xs"
              >
                +250ml Glass
              </button>
              <button
                onClick={() => onSaveHealthLog({ ...healthLog, water_ml: healthLog.water_ml + 500 })}
                className="flex-1 py-2.5 rounded-2xl bg-teal-600 text-white font-bold text-xs"
              >
                +500ml Bottle
              </button>
            </div>
          </M3Card>
        </div>
      )}

      {/* 2. REPORTS TAB */}
      {activeTab === 'analytics' && (
        <M3Card className="p-6 space-y-4">
          <h3 className="font-extrabold text-base">Weekly Vitals Analytics</h3>
          <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-end justify-between p-4 gap-2">
            {[65, 80, 95, 70, 88, 100, 85].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-indigo-600 rounded-t-xl transition-all duration-500"
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                </span>
              </div>
            ))}
          </div>
        </M3Card>
      )}

      {/* 3. SPIRITUAL TAB */}
      {activeTab === 'spiritual' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center">
          <h3 className="font-extrabold text-base">Digital Mala Counter</h3>
          <button
            onClick={handleMalaIncrement}
            className="w-44 h-44 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white font-black shadow-2xl mx-auto flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-4xl">{currentMalaCount}</span>
            <span className="text-[10px] text-purple-200 mt-1 uppercase tracking-widest">
              {Math.floor(currentMalaCount / 108)} Malas Done
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
