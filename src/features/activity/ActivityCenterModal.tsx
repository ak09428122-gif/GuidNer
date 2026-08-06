import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Radio,
  Brain,
  Globe,
  GraduationCap,
  HeartPulse,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Pin,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
} from 'lucide-react';
import { ActivityItem, ActivityCategory } from '../../core/database/schema';

interface ActivityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearItem: (id: string) => void;
  onClearAll: () => void;
  onTogglePin: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ActivityCenterModal: React.FC<ActivityCenterModalProps> = ({
  isOpen,
  onClose,
  activities,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearItem,
  onClearAll,
  onTogglePin,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<ActivityCategory | 'all'>('all');

  if (!isOpen) return null;

  const unreadCount = activities.filter((a) => !a.isRead).length;

  const filteredActivities = activities.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  // Sort: Pinned first, then by timestamp descending
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'new_feature':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'download':
        return <Download className="w-4 h-4 text-blue-500" />;
      case 'transfer':
        return <Radio className="w-4 h-4 text-emerald-500" />;
      case 'ai_action':
        return <Brain className="w-4 h-4 text-amber-500" />;
      case 'browser_download':
        return <Globe className="w-4 h-4 text-cyan-500" />;
      case 'study_update':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'health_update':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'system_message':
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryLabel = (category: ActivityCategory) => {
    switch (category) {
      case 'new_feature':
        return 'New Feature';
      case 'download':
        return 'Download';
      case 'transfer':
        return 'OmniAir Transfer';
      case 'ai_action':
        return 'AI Action';
      case 'browser_download':
        return 'Browser Download';
      case 'study_update':
        return 'Study Update';
      case 'health_update':
        return 'Health Vitals';
      case 'system_message':
      default:
        return 'System Message';
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">What's New & Activity Center</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live offline updates, transfers, AI updates, and system activity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'new_feature', label: 'New Features' },
              { id: 'transfer', label: 'Transfers' },
              { id: 'download', label: 'Downloads' },
              { id: 'ai_action', label: 'AI Actions' },
              { id: 'browser_download', label: 'Browser' },
              { id: 'study_update', label: 'Study' },
              { id: 'health_update', label: 'Health' },
              { id: 'system_message', label: 'System' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1 rounded-xl font-bold shrink-0 text-[11px] transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1"
              title="Mark All as Read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-[11px] flex items-center gap-1"
              title="Clear Non-Pinned Items"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Activity List Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {sortedActivities.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">No Activity Notifications</h4>
                <p className="text-xs text-slate-400 mt-1">You are all caught up on all system updates!</p>
              </div>
            </div>
          ) : (
            sortedActivities.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) onMarkAsRead(item.id);
                }}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 cursor-pointer relative ${
                  item.isPinned
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 shadow-xs'
                    : !item.isRead
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 font-medium'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 inline-block" title="Unread Update" />
                        )}
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {getCategoryLabel(item.category)}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                      item.status === 'completed' || item.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : item.status === 'new'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                    {item.description}
                  </p>
                )}

                {/* Action Toolbar */}
                <div className="flex items-center justify-between pt-1 pl-11 border-t border-slate-100 dark:border-slate-800/60">
                  {item.targetTab ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!item.isRead) onMarkAsRead(item.id);
                        onNavigateTab(item.targetTab!);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Open Workspace</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(item.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isPinned
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title={item.isPinned ? 'Unpin Update' : 'Pin to Top'}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors"
                      title={item.isRead ? 'Already Read' : 'Mark as Read'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      title="Clear Update"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
