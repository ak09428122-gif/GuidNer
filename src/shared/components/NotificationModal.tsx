import React from 'react';
import { Bell, Volume2, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import { SmartNotification } from '../../core/database/schema';
import { notificationEngine } from '../../core/notifications/NotificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-4 pt-16">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Smart Notification Hub</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-red-500 font-semibold"
            >
              Clear All
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Test Row */}
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>Test Web Audio Synthesizer</span>
          </div>
          <button
            onClick={() => notificationEngine.playTone('gentle_chime')}
            className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-[11px] shadow-sm"
          >
            Play Chime
          </button>
        </div>

        {/* Notifications Stream */}
        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No active notifications.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800 border-blue-500/30 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{n.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{n.message}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
