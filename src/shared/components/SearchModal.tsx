import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Shield, Globe, Bot, FileText, X, ArrowRight, Settings, Sparkles, Download, CheckSquare } from 'lucide-react';
import {
  TimeBlock,
  Habit,
  Goal,
  StudyDocument,
  UtilityNote,
  DownloadTask,
  VaultItem,
  RegistrationForm,
} from '../../core/database/schema';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tabId: string) => void;
  onSelectTab?: (tabId: any) => void;
  timeBlocks?: TimeBlock[];
  habits?: Habit[];
  goals?: Goal[];
  documents?: StudyDocument[];
  utilityNotes?: UtilityNote[];
  downloadTasks?: DownloadTask[];
  vaultItems?: VaultItem[];
  registrationForms?: RegistrationForm[];
}

export interface SearchResultItem {
  id: string;
  type: 'note' | 'vault' | 'bookmark' | 'history' | 'ai' | 'setting' | 'task' | 'download';
  title: string;
  subtitle: string;
  targetTab: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onSelectTab,
  timeBlocks = [],
  habits = [],
  goals = [],
  documents = [],
  utilityNotes = [],
  downloadTasks = [],
  vaultItems = [],
  registrationForms = [],
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'notes' | 'browser' | 'vault' | 'settings'>('all');

  const navigate = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigateToTab) onNavigateToTab(tabId);
    onClose();
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const items: SearchResultItem[] = [];

    // Search Study Documents & Notes
    documents.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)) {
        items.push({
          id: d.id,
          type: 'note',
          title: d.title,
          subtitle: `Study Hub • #${d.tags.join(', ')}`,
          targetTab: 'study',
        });
      }
    });

    // Search Utility Notes
    utilityNotes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        items.push({
          id: n.id,
          type: 'note',
          title: n.title,
          subtitle: `Notes & Utilities`,
          targetTab: 'utilities',
        });
      }
    });

    // Search TimeBlocks & Routine Tasks
    timeBlocks.forEach((tb) => {
      if (tb.title.toLowerCase().includes(q)) {
        items.push({
          id: tb.id,
          type: 'task',
          title: tb.title,
          subtitle: `Life OS Routine (${tb.start_time} - ${tb.end_time})`,
          targetTab: 'life_os',
        });
      }
    });

    // Search Vault Items
    vaultItems.forEach((v) => {
      if (v.title.toLowerCase().includes(q)) {
        items.push({
          id: v.id,
          type: 'vault',
          title: v.title,
          subtitle: `Secure Vault • ${v.category}`,
          targetTab: 'vault',
        });
      }
    });

    // Search Downloads
    downloadTasks.forEach((dl) => {
      if (dl.file_name.toLowerCase().includes(q)) {
        items.push({
          id: dl.id,
          type: 'download',
          title: dl.file_name,
          subtitle: `Download Manager (${dl.status})`,
          targetTab: 'downloader',
        });
      }
    });

    // Default system matches if search is broad
    if ('settings analytics admin options'.includes(q)) {
      items.push({
        id: 'sys-admin',
        type: 'setting',
        title: 'System Preferences & Settings',
        subtitle: 'Security, Themes, Performance, Backup',
        targetTab: 'admin',
      });
    }

    if ('ai gemini assistant chat'.includes(q)) {
      items.push({
        id: 'sys-ai',
        type: 'ai',
        title: 'Gemini AI Assistant',
        subtitle: 'Proactive Intelligence & Context Memory',
        targetTab: 'ai',
      });
    }

    if ('browser wikipedia google web internet'.includes(q)) {
      items.push({
        id: 'sys-browser',
        type: 'bookmark',
        title: 'OmniBrowser Multi-Tab Engine',
        subtitle: 'Private Browsing, Reader Mode, PDF Viewer',
        targetTab: 'browser',
      });
    }

    setResults(items);
  }, [query, documents, utilityNotes, timeBlocks, vaultItems, downloadTasks]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'note':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'vault':
        return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'bookmark':
      case 'history':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-indigo-500" />;
      case 'setting':
        return <Settings className="w-4 h-4 text-amber-500" />;
      case 'download':
        return <Download className="w-4 h-4 text-cyan-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-teal-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredResults = results.filter((res) => {
    if (filter === 'all') return true;
    if (filter === 'notes') return res.type === 'note' || res.type === 'task';
    if (filter === 'browser') return res.type === 'bookmark' || res.type === 'history';
    if (filter === 'vault') return res.type === 'vault';
    if (filter === 'settings') return res.type === 'setting';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 space-y-4">
        {/* Search input field */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, vault items, bookmarks, settings, AI memories..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'notes', label: 'Study Notes & Tasks' },
            { id: 'browser', label: 'Bookmarks & Web' },
            { id: 'vault', label: 'Vault Items' },
            { id: 'settings', label: 'System Settings' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {query && filteredResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1">
              <p>No matching items found for "{query}".</p>
              <p className="text-[10px] text-slate-500">Try searching for "Physics", "Vault", or "Settings".</p>
            </div>
          ) : !query ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400 block">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('browser')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500"
                >
                  🌐 Launch OmniBrowser
                </button>
                <button
                  onClick={() => navigate('ai')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500"
                >
                  🤖 Ask Gemini AI
                </button>
                <button
                  onClick={() => navigate('vault')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500"
                >
                  🔒 Open Secure Vault
                </button>
                <button
                  onClick={() => navigate('admin')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500"
                >
                  ⚙️ System Preferences
                </button>
              </div>
            </div>
          ) : (
            filteredResults.map((res) => (
              <button
                key={res.id}
                onClick={() => navigate(res.targetTab)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs shrink-0">
                    {getIcon(res.type)}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{res.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{res.subtitle}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
