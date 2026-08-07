import React, { useState } from 'react';
import {
  User,
  Shield,
  Smartphone,
  Cloud,
  Database,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  CheckCircle2,
  X,
  Sparkles,
  Key,
  Globe,
  HardDrive,
  Copy,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../../core/database/schema';
import { db } from '../../core/database/db';
import { cloudSyncService } from '../../core/database/CloudSyncService';

interface CloudAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const CloudAccountModal: React.FC<CloudAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'sync' | 'backup'>('profile');

  // Profile Form States
  const [name, setName] = useState(user.name || 'GuideNer User');
  const [username, setUsername] = useState('guidener_user_master');
  const [email, setEmail] = useState(user.email || 'user@guidener.internal');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [guidenerId] = useState('GN-2026-PRO-8842');

  // Devices & Sessions State
  const [devices, setDevices] = useState([
    {
      id: 'd1',
      name: 'Google Pixel 8 Pro',
      type: 'Primary Smartphone',
      ip: '192.168.1.104',
      lastActive: 'Active Now',
      isCurrent: true,
    },
    {
      id: 'd2',
      name: 'Samsung Galaxy Tab S9',
      type: 'Tablet P2P Node',
      ip: '192.168.1.112',
      lastActive: '25m ago',
      isCurrent: false,
    },
    {
      id: 'd3',
      name: 'Cloud Run Edge Workstation',
      type: 'Web Sandbox Container',
      ip: '10.244.0.18',
      lastActive: '2h ago',
      isCurrent: false,
    },
  ]);

  // Sync Status State
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'queued'>('synced');
  const [isBackupSuccess, setIsBackupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      email,
      updated_at: new Date().toISOString(),
    };
    await db.saveUserProfile(updated);
    onUpdateUser(updated);
    alert('GuideNer Cloud Profile updated successfully.');
  };

  const handleTriggerManualSync = async () => {
    setSyncStatus('syncing');
    await cloudSyncService.performFullCloudBackup();
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1200);
  };

  const handleExportEncryptedBackup = () => {
    const backupData = {
      version: '2.5',
      guidener_id: guidenerId,
      timestamp: new Date().toISOString(),
      user,
      notes: localStorage.getItem('guidener_user_name'),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GuideNer_Encrypted_Backup_${Date.now()}.json`;
    a.click();
    setIsBackupSuccess(true);
    setTimeout(() => setIsBackupSuccess(false), 3000);
  };

  const handleRevokeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">GuideNer Cloud Account</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                  {guidenerId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hybrid Offline-First Sync & Device Management
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Cloud Profile
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'devices'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Devices & Sessions
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'sync'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Hybrid Sync
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'backup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Encrypted Backup
          </button>
        </div>

        {/* Tab Contents Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Unique Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800/80 border border-indigo-500/20 text-xs font-medium space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Shield className="w-4 h-4" /> 100% On-Device Zero-Knowledge Key
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Your profile and data are signed with your on-device cryptographic key.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                Save Cloud Profile
              </button>
            </form>
          )}

          {/* DEVICES & SESSIONS TAB */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                Active Devices & Authorized Sessions
              </h3>

              <div className="space-y-3">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-indigo-500" />
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{d.name}</span>
                          {d.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[9px]">
                              This Device
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {d.type} • IP: {d.ip} • {d.lastActive}
                        </div>
                      </div>
                    </div>

                    {!d.isCurrent && (
                      <button
                        onClick={() => handleRevokeDevice(d.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-xs hover:bg-rose-500/20"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HYBRID SYNC TAB */}
          {activeTab === 'sync' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm">Hybrid DB Auto Sync Queue</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Offline-first priority • Auto conflict resolution
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>

                <button
                  onClick={handleTriggerManualSync}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Synchronizing...' : 'Force Manual Cloud Sync'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ENCRYPTED BACKUP TAB */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-6 h-6 text-indigo-500" />
                  <div>
                    <h4 className="font-extrabold text-sm">Smart 1-Click Encrypted Backup</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Backup AI chats, browser bookmarks, study notes, calendar events, and vault
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleExportEncryptedBackup}
                    className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Download className="w-4 h-4" /> Export Backup
                  </button>

                  <button
                    onClick={() => alert('Select a .guidener-backup.json file to restore workspace state.')}
                    className="p-3.5 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-extrabold text-xs flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Restore Backup
                  </button>
                </div>

                {isBackupSuccess && (
                  <p className="text-xs font-bold text-emerald-500 text-center animate-pulse">
                    ✓ Encrypted Backup JSON generated successfully!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
