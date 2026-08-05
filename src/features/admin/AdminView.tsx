import React, { useEffect } from 'react';
import { BarChart3, Database, Shield, HardDrive, Download, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProfile } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

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

  useEffect(() => {
    checkAndTriggerScreenGuide('reports');
  }, [checkAndTriggerScreenGuide]);
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Analytics & System Health</h1>
            <HelpMeUseButton screenId="reports" label="Walkthrough" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Life Score Engine • Offline Database Telemetry • Backup Manager
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Life Score</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{user.life_score} / 1000</div>
          <div className="text-[11px] text-slate-500">Tier: Master Architect</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <Database className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Time Blocks</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{timeBlocksCount}</div>
          <div className="text-[11px] text-slate-500">IndexedDB Records</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <HardDrive className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">Habits Logged</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{habitsCount}</div>
          <div className="text-[11px] text-slate-500">Active Daily Routines</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase text-slate-400">AES Secrets</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{vaultItemsCount}</div>
          <div className="text-[11px] text-slate-500">Encrypted in Vault</div>
        </div>
      </div>

      {/* Backup and Offline Persistence Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Offline Data Backup & Synchronization</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          GuideNer runs entirely offline with local IndexedDB storage. You can export a encrypted JSON snapshot of your Life OS database at any time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExportBackup}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Encrypted Backup (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
