import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Pin,
  Trash2,
  X,
  BookOpen,
  HeartPulse,
  Calendar,
  Download,
  Bot,
  MessageSquare,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { SmartNotification } from '../../core/database/schema';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SmartNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'study', label: 'Study Hub', icon: BookOpen },
    { id: 'health', label: 'Health', icon: HeartPulse },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'ai', label: 'AI Companion', icon: Bot },
    { id: 'communication', label: 'Messages', icon: MessageSquare },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'study':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'health':
      case 'spiritual':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'downloads':
        return <Download className="w-4 h-4 text-indigo-500" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-amber-500" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const pinnedList = filteredNotifs.filter((n) => pinnedIds.includes(n.id));
  const regularList = filteredNotifs.filter((n) => !pinnedIds.includes(n.id));

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">Notification Center</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                System Alerts, Study Reminders & AI Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Header Action Bar & Category Filters */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold px-1">
            <button
              onClick={onMarkAllAsRead}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <Bell className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-bold">No notifications in this category</p>
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-amber-500" /> Pinned Alerts
                  </span>
                  {pinnedList.map((n) => renderNotifCard(n))}
                </div>
              )}

              {/* Regular List */}
              <div className="space-y-2.5">
                {pinnedList.length > 0 && (
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Recent Alerts
                  </span>
                )}
                {regularList.map((n) => renderNotifCard(n))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  function renderNotifCard(n: SmartNotification) {
    const isPinned = pinnedIds.includes(n.id);
    const isRead = n.is_read || n.read;
    const timeVal = n.created_at || n.timestamp || n.trigger_time || new Date().toISOString();

    return (
      <div
        key={n.id}
        onClick={() => onMarkAsRead(n.id)}
        className={`p-3.5 rounded-2xl border transition-all space-y-2 cursor-pointer ${
          !isRead
            ? 'bg-indigo-50/50 dark:bg-slate-800/90 border-indigo-500/40 shadow-xs'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 opacity-80 hover:opacity-100'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {getCategoryIcon(n.category || 'all')}
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
              {n.title}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date(timeVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(n.id);
              }}
              className={`p-1 rounded-lg ${
                isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pin Notification"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {n.message}
        </p>

        {/* Quick Action Navigation Link */}
        {onNavigateTab && (
          <div className="pt-1 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(n.id);
                onClose();
                onNavigateTab(n.category || 'home');
              }}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <span>Open {n.category || 'View'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }
};
