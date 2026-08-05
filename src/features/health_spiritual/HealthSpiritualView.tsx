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
} from 'lucide-react';
import { HealthLog, SpiritualLog } from '../../core/database/schema';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { SmartwatchSyncCard } from './SmartwatchSyncCard';

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
  const [activeTab, setActiveTab] = useState<'health' | 'spiritual'>('health');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('health');
  }, [checkAndTriggerScreenGuide]);

  // Mala Counter state
  const [selectedMantra, setSelectedMantra] = useState('gayatri_mantra');
  const [currentMalaCount, setCurrentMalaCount] = useState<number>(
    spiritualLog.mala_counts[selectedMantra] || 0
  );

  // Meditation timer state
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);

  const handleMalaIncrement = () => {
    const nextCount = currentMalaCount + 1;
    setCurrentMalaCount(nextCount);

    // Play singing bowl audio every 108 counts
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
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Health & Spiritual Hub</h1>
              <HelpMeUseButton screenId="health" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vitals Tracker • Medication Logs • Digital Mala Counter • Meditation
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'health'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Health & Vitals</span>
          </button>

          <button
            onClick={() => setActiveTab('spiritual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'spiritual'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Spiritual Hub</span>
          </button>
        </div>
      </div>

      {/* 1. HEALTH & VITALS TAB */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Smartwatch Auto-Sync Hub */}
          <SmartwatchSyncCard
            healthLog={healthLog}
            onSyncData={(updated) => onSaveHealthLog({ ...healthLog, ...updated })}
          />

          {/* Vitals Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Steps */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                <Footprints className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Steps</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{healthLog.steps}</div>
              <div className="text-[11px] text-slate-500">Goal: 10,000 steps</div>
            </div>

            {/* Sleep */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                <Moon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Sleep</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {Math.floor(healthLog.sleep_minutes / 60)}h {healthLog.sleep_minutes % 60}m
              </div>
              <div className="text-[11px] text-slate-500">Quality Sleep Target</div>
            </div>

            {/* Water Tracker Card with (+) Add Water, (-) Remove Water & Manual Entry */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                <div className="flex items-center gap-1.5">
                  <Droplet className="w-5 h-5 text-teal-500" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hydration</span>
                </div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {Math.round((healthLog.water_ml / 2500) * 100)}%
                </span>
              </div>

              <div className="text-xl font-black text-slate-900 dark:text-white flex items-baseline justify-between">
                <span>{healthLog.water_ml} <span className="text-xs font-semibold text-slate-500">/ 2,500 ml</span></span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (healthLog.water_ml / 2500) * 100)}%` }}
                />
              </div>

              {/* Quick Actions & Manual Input */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  onClick={() => onSaveHealthLog({ ...healthLog, water_ml: Math.max(0, healthLog.water_ml + 250) })}
                  className="flex-1 py-1 px-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-500/20 transition-colors"
                  title="Add 250 ml water"
                >
                  +250ml
                </button>
                <button
                  onClick={() => onSaveHealthLog({ ...healthLog, water_ml: Math.max(0, healthLog.water_ml - 250) })}
                  className="py-1 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold border border-rose-500/20 transition-colors"
                  title="Remove 250 ml water"
                >
                  -250ml
                </button>
                <button
                  onClick={() => {
                    const custom = prompt('Enter water intake amount in ml:', String(healthLog.water_ml));
                    if (custom !== null && !isNaN(Number(custom))) {
                      onSaveHealthLog({ ...healthLog, water_ml: Math.max(0, Number(custom)) });
                    }
                  }}
                  className="py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-200 transition-colors"
                  title="Manual Amount Entry"
                >
                  Edit ✏️
                </button>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-red-500">
                <HeartPulse className="w-5 h-5 animate-pulse" />
                <span className="text-[10px] font-bold uppercase text-slate-400">Heart Rate</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{healthLog.heart_rate_avg} BPM</div>
              <div className="text-[11px] text-slate-500">Resting Average</div>
            </div>
          </div>

          {/* Medication Tracker */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>Medication & Vitamin Tracker</span>
            </h2>

            <div className="space-y-3">
              {healthLog.medications_taken.map((med) => (
                <div
                  key={med.med_id}
                  onClick={() => handleToggleMedication(med.med_id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    med.taken
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {med.taken ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-500/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <div className={`text-sm font-bold ${med.taken ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                        {med.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Time: {med.time} • Dosage: {med.dosage}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      med.taken ? 'bg-teal-500/10 text-teal-600' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {med.taken ? 'Taken' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. SPIRITUAL HUB TAB */}
      {activeTab === 'spiritual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Digital Mala Jaap Counter */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-base">
              <Sparkles className="w-5 h-5" />
              <span>Digital Mala Counter</span>
            </div>

            <select
              value={selectedMantra}
              onChange={(e) => {
                setSelectedMantra(e.target.value);
                setCurrentMalaCount(spiritualLog.mala_counts[e.target.value] || 0);
              }}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="gayatri_mantra">Gayatri Mantra (Om Bhur Bhuva Swaha)</option>
              <option value="om_namah_shivaya">Om Namah Shivaya</option>
              <option value="hare_krishna">Hare Krishna Mahamantra</option>
            </select>

            {/* Giant Interactive Beaded Counter Button */}
            <button
              onClick={handleMalaIncrement}
              className="w-44 h-44 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white font-black shadow-2xl shadow-purple-500/30 flex flex-col items-center justify-center border-4 border-white/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-4xl">{currentMalaCount}</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-purple-200 mt-1">
                {Math.floor(currentMalaCount / 108)} Malas Completed
              </span>
              <span className="text-[9px] text-white/80 mt-1">Tap to Count</span>
            </button>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Plays synthesized singing bowl chime at 108 completions.
            </div>
          </div>

          {/* Scripture & Puja Checklist */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/20 shadow-sm space-y-3">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Scripture Verse of the Day
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
                "{spiritualLog.scripture_read || 'Karmanye vadhikaraste ma phaleshu kadachana — Perform your duty without attachment to outcomes.'}"
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Daily Spiritual Routine</h3>
              <div
                onClick={() =>
                  onSaveSpiritualLog({ ...spiritualLog, puja_completed: !spiritualLog.puja_completed })
                }
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  spiritualLog.puja_completed
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/50'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {spiritualLog.puja_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 fill-purple-600/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Daily Morning Puja & Aarti</span>
                </div>
                <span className="text-xs font-bold text-purple-600">
                  {spiritualLog.puja_completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
