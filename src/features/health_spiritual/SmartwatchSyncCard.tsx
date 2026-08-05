import React, { useState, useEffect } from 'react';
import {
  Watch,
  Activity,
  Heart,
  Moon,
  Zap,
  Droplet,
  Gauge,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { HealthLog } from '../../core/database/schema';

interface SmartwatchSyncCardProps {
  healthLog: HealthLog;
  onSyncData: (updatedLog: Partial<HealthLog>) => void;
}

export const SmartwatchSyncCard: React.FC<SmartwatchSyncCardProps> = ({ healthLog, onSyncData }) => {
  const [selectedDevice, setSelectedDevice] = useState<'apple' | 'galaxy' | 'fitbit' | 'garmin'>('apple');
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [liveBpm, setLiveBpm] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [stress, setStress] = useState(24);

  // Simulate real-time smartwatch sensor fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBpm(68 + Math.floor(Math.random() * 8));
      setStress(20 + Math.floor(Math.random() * 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const addedSteps = Math.floor(Math.random() * 350) + 150;
      const newSteps = (healthLog.steps || 6842) + addedSteps;
      const newCal = (healthLog.calories_burned || 420) + Math.floor(addedSteps * 0.04);
      
      onSyncData({
        steps: newSteps,
        calories_burned: newCal,
        heart_rate_avg: liveBpm,
      });

      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsSyncing(false);
    }, 800);
  };

  const devices = {
    apple: { name: 'Apple Watch Ultra 2', battery: '88%', status: 'BLE Connected' },
    galaxy: { name: 'Galaxy Watch 6 Pro', battery: '92%', status: 'Connected' },
    fitbit: { name: 'Fitbit Sense 2', battery: '76%', status: 'Connected' },
    garmin: { name: 'Garmin Epix Pro', battery: '95%', status: 'Connected' },
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 space-y-5">
      {/* Header & Watch Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
            <Watch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">Smartwatch Auto-Sync Hub</h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              {devices[selectedDevice].name} • Battery: {devices[selectedDevice].battery}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoSync(!isAutoSync)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isAutoSync
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Auto-Sync: {isAutoSync ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Device Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(Object.keys(devices) as Array<keyof typeof devices>).map((dev) => (
          <button
            key={dev}
            onClick={() => setSelectedDevice(dev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedDevice === dev
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <span>{dev === 'apple' ? '🍎' : dev === 'galaxy' ? '🌌' : dev === 'fitbit' ? '👟' : '⌚'}</span>
            <span>{devices[dev].name}</span>
          </button>
        ))}
      </div>

      {/* Live Telemetry Sensor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Steps */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold text-indigo-300">STEPS</span>
          </div>
          <div className="text-lg font-black text-white">{healthLog.steps || 6842}</div>
          <div className="text-[10px] text-slate-400">Goal: 10,000</div>
        </div>

        {/* Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <Heart className="w-4 h-4 animate-bounce" />
            <span className="text-[10px] font-bold text-rose-300">HEART RATE</span>
          </div>
          <div className="text-lg font-black text-white">{liveBpm} BPM</div>
          <div className="text-[10px] text-rose-400/90 font-medium">Resting Normal</div>
        </div>

        {/* Blood Oxygen SpO2 */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-sky-400">
            <Gauge className="w-4 h-4" />
            <span className="text-[10px] font-bold text-sky-300">SpO2</span>
          </div>
          <div className="text-lg font-black text-white">{spo2}%</div>
          <div className="text-[10px] text-sky-400/90 font-medium">Optimal Range</div>
        </div>

        {/* Sleep */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <Moon className="w-4 h-4" />
            <span className="text-[10px] font-bold text-purple-300">SLEEP</span>
          </div>
          <div className="text-lg font-black text-white">7h 15m</div>
          <div className="text-[10px] text-purple-300">Score 88 / 100</div>
        </div>

        {/* Active Calories */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold text-amber-300">CALORIES</span>
          </div>
          <div className="text-lg font-black text-white">{healthLog.calories_burned || 420} kcal</div>
          <div className="text-[10px] text-amber-300/90 font-medium">Burn Target 500</div>
        </div>

        {/* Stress */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between text-teal-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold text-teal-300">STRESS</span>
          </div>
          <div className="text-lg font-black text-white">{stress} / 100</div>
          <div className="text-[10px] text-teal-400 font-medium">Relaxed State</div>
        </div>
      </div>

      {/* Sync Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-indigo-200/70 pt-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Automatic background sync active • Last synced: {lastSyncedTime}</span>
        </div>
      </div>
    </div>
  );
};
