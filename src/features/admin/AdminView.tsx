import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Database,
  Shield,
  HardDrive,
  Download,
  Sparkles,
  Cloud,
  RefreshCw,
  Trash2,
  Bot,
  Zap,
  CheckCircle2,
  Pause,
  Play,
  Layers,
} from 'lucide-react';
import { UserProfile } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { cloudSyncService, SyncStatus } from '../../core/database/CloudSyncService';
import { smartStorageManager, StorageBreakdown } from '../../core/database/SmartStorageManager';
import { offlineAIPackManager, AIPackState } from '../../core/ai/OfflineAIPackManager';
import {
  batteryAndPerformanceManager,
  BatteryPerformanceState,
} from '../../core/BatteryAndPerformanceManager';

interface AdminViewProps {
  user: UserProfile;
  timeBlocksCount: number;
  habitsCount: number;
  goalsCount: number;
  vaultItemsCount: number;
  onExportBackup: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  timeBlocksCount,
  habitsCount,
  goalsCount,
  vaultItemsCount,
  onExportBackup,
}) => {
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Phase 5 States
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(cloudSyncService.getStatus());
  const [storage, setStorage] = useState<StorageBreakdown | null>(null);
  const [aiPack, setAiPack] = useState<AIPackState>(offlineAIPackManager.getState());
  const [perfState, setPerfState] = useState<BatteryPerformanceState>(
    batteryAndPerformanceManager.getState()
  );
  const [cleanMessage, setCleanMessage] = useState<string | null>(null);
  const [compactMessage, setCompactMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAndTriggerScreenGuide('reports');

    const unsubSync = cloudSyncService.subscribe(setSyncStatus);
    const unsubAi = offlineAIPackManager.subscribe(setAiPack);
    const unsubPerf = batteryAndPerformanceManager.subscribe(setPerfState);

    smartStorageManager.getStorageBreakdown().then(setStorage);

    return () => {
      unsubSync();
      unsubAi();
      unsubPerf();
    };
  }, [checkAndTriggerScreenGuide]);

  const handleManualSync = async () => {
    await cloudSyncService.triggerBackgroundSync();
  };

  const handlePurgeCache = async () => {
    const res = await smartStorageManager.purgeTemporaryCache();
    setCleanMessage(res.status);
    const updated = await smartStorageManager.getStorageBreakdown();
    setStorage(updated);
  };

  const handleCompactDB = async () => {
    const res = await smartStorageManager.compactDatabase();
    setCompactMessage(res.status);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">
              System Diagnostics & Cloud Engine
            </h1>
            <HelpMeUseButton screenId="reports" label="Walkthrough" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Life Score • Hybrid Supabase Backup • Storage Analyzer • Offline AI Pack
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Life Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.life_score} / 1000
          </div>
          <div className="text-[11px] text-slate-500">Tier: Master Architect</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <Database className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Time Blocks</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{timeBlocksCount}</div>
          <div className="text-[11px] text-slate-500">IndexedDB Records</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <HardDrive className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Habits Logged</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{habitsCount}</div>
          <div className="text-[11px] text-slate-500">Active Daily Routines</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">AES Secrets</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{vaultItemsCount}</div>
          <div className="text-[11px] text-slate-500">Encrypted in Vault</div>
        </div>
      </div>

      {/* 1. Hybrid Cloud Sync & Supabase Backup Engine */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Hybrid Cloud Sync & Supabase Backup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Local-first IndexedDB engine with non-blocking background delta synchronization.
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              syncStatus.isOnline
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {syncStatus.isOnline ? 'Cloud Adapter Online' : 'Airplane / Offline Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Pending Delta Queue:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {syncStatus.pendingChangesCount} items pending
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Last Sync Timestamp:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5 truncate">
              {syncStatus.lastSyncTime
                ? new Date(syncStatus.lastSyncTime).toLocaleTimeString()
                : 'Synced Just Now'}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Conflict Resolution Strategy:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              Last-Write-Wins (LWW)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleManualSync}
            disabled={syncStatus.isSyncing}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus.isSyncing ? 'Syncing Delta Queue...' : 'Force Sync Now'}</span>
          </button>

          <button
            onClick={onExportBackup}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Encrypted Backup JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Smart Storage Analyzer & Cache Cleaner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Smart Storage Manager & Cache Cleaner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Safe automatic cache cleanup. Personal notes and study files are strictly protected.
            </p>
          </div>
        </div>

        {storage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                Storage Allocation Breakdown (Free: {storage.freeSpaceGB} GB)
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                {(storage.totalUsageBytes / (1024 * 1024)).toFixed(1)} MB Used
              </span>
            </div>

            <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${Math.min(100, (storage.indexedDbBytes / storage.totalUsageBytes) * 100)}%`,
                }}
                className="bg-indigo-500 h-full"
                title="IndexedDB Data"
              />
              <div
                style={{
                  width: `${Math.min(100, (storage.cacheApiBytes / storage.totalUsageBytes) * 100)}%`,
                }}
                className="bg-amber-500 h-full"
                title="Temporary Fetch Caches"
              />
              <div
                style={{
                  width: `${Math.min(100, (storage.localStorageBytes / storage.totalUsageBytes) * 100)}%`,
                }}
                className="bg-emerald-500 h-full"
                title="LocalStorage"
              />
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>IndexedDB: {(storage.indexedDbBytes / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Caches & Temp: {(storage.cacheApiBytes / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  LocalStorage: {(storage.localStorageBytes / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>
        )}

        {cleanMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{cleanMessage}</span>
          </div>
        )}

        {compactMessage && (
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{compactMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handlePurgeCache}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Temporary Caches & Blobs</span>
          </button>

          <button
            onClick={handleCompactDB}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>Compact & Optimize IndexedDB</span>
          </button>
        </div>
      </div>

      {/* 3. Offline AI Pack Manager (700MB - 1GB Preparation) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Offline AI Pack Architecture (Gemini Nano Local Weights)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Optional ~890 MB local AI model weights for complete offline reasoning & study tutoring.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              aiPack.status === 'ready'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {aiPack.status === 'ready'
              ? 'Model Active & Verified'
              : aiPack.status === 'downloading'
              ? 'Downloading Weights...'
              : 'Pack Not Installed'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
          <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
            <span>Package Version: {aiPack.version} (Gemini Nano 1B • 4-bit Quantized)</span>
            <span>Requirement: 1.2 GB Free Storage (Available: {aiPack.freeStorageGB} GB)</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>
                Download Status: {aiPack.downloadProgressPercent}% (
                {(aiPack.downloadedBytes / (1024 * 1024)).toFixed(1)} MB / 890 MB)
              </span>
              <span>SHA-256 Checksum: {aiPack.checksumVerified ? 'VERIFIED' : 'PENDING'}</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                style={{ width: `${aiPack.downloadProgressPercent}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {aiPack.status === 'downloading' ? (
            <button
              onClick={() => offlineAIPackManager.pauseDownload()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Download</span>
            </button>
          ) : aiPack.status !== 'ready' ? (
            <button
              onClick={() => offlineAIPackManager.startDownload()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Download Offline AI Pack (890 MB)</span>
            </button>
          ) : (
            <button
              onClick={() => offlineAIPackManager.deletePack()}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Uninstall AI Pack (Reclaim 890 MB)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Battery & Performance Diagnostics */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              Battery Saver & Adaptive Performance Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Low power mode automatically throttles non-essential background tasks on low battery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Battery Level:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {perfState.batteryLevelPercent}% {perfState.isCharging ? '⚡ (Charging)' : ''}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Low Power Mode:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {perfState.isLowPowerMode ? 'ACTIVE' : 'STANDARD'}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">RAM Usage Estimate:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {perfState.ramUsageEstimateMB} MB
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Sync Interval:</span>
            <div className="font-black text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {perfState.backgroundSyncIntervalMs / 1000}s
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Smart Battery Saver Mode
          </span>
          <button
            onClick={() =>
              batteryAndPerformanceManager.setBatterySaver(!perfState.isBatterySaverEnabled)
            }
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              perfState.isBatterySaverEnabled
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{perfState.isBatterySaverEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
