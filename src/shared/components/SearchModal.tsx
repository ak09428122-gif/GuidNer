import React, { useState } from 'react';
import { Search, Calendar, BookOpen, Lock, X, CheckSquare, Target, FileText, Download, FileCheck2 } from 'lucide-react';
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
  timeBlocks: TimeBlock[];
  habits?: Habit[];
  goals?: Goal[];
  documents: StudyDocument[];
  utilityNotes?: UtilityNote[];
  downloadTasks?: DownloadTask[];
  vaultItems: VaultItem[];
  registrationForms?: RegistrationForm[];
  onSelectTab: (tab: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  timeBlocks,
  habits = [],
  goals = [],
  documents,
  utilityNotes = [],
  downloadTasks = [],
  vaultItems,
  registrationForms = [],
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedBlocks = q ? timeBlocks.filter((tb) => tb.title.toLowerCase().includes(q)) : [];
  const matchedHabits = q ? habits.filter((h) => h.title.toLowerCase().includes(q)) : [];
  const matchedGoals = q ? goals.filter((g) => g.title.toLowerCase().includes(q)) : [];
  const matchedDocs = q ? documents.filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)) : [];
  const matchedNotes = q ? utilityNotes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) : [];
  const matchedDownloads = q ? downloadTasks.filter((d) => (d.file_name || d.source_url).toLowerCase().includes(q)) : [];
  const matchedVault = q ? vaultItems.filter((v) => v.title.toLowerCase().includes(q)) : [];
  const matchedReg = q ? registrationForms.filter((r) => r.student_name.toLowerCase().includes(q) || r.school_name.toLowerCase().includes(q)) : [];

  const totalResults =
    matchedBlocks.length +
    matchedHabits.length +
    matchedGoals.length +
    matchedDocs.length +
    matchedNotes.length +
    matchedDownloads.length +
    matchedVault.length +
    matchedReg.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, habits, goals, notes, vault, files..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 font-medium"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Stream */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {q === '' ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              Type to search across GuideNer Life OS...
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Time Blocks */}
              {matchedBlocks.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Time Blocks ({matchedBlocks.length})
                  </div>
                  {matchedBlocks.map((tb) => (
                    <div
                      key={tb.id}
                      onClick={() => {
                        onSelectTab('life_os');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{tb.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{tb.start_time}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Habits */}
              {matchedHabits.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Habits ({matchedHabits.length})
                  </div>
                  {matchedHabits.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => {
                        onSelectTab('life_os');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{h.title}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">Streak: {h.streak}d</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Goals */}
              {matchedGoals.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Goals ({matchedGoals.length})
                  </div>
                  {matchedGoals.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        onSelectTab('life_os');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{g.title}</span>
                      </div>
                      <span className="text-[10px] text-indigo-600 uppercase font-bold">{g.horizon}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Study Notes */}
              {matchedDocs.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Study Notes ({matchedDocs.length})
                  </div>
                  {matchedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onSelectTab('study');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{doc.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">#{doc.tags.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Utility Notes */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Scratchpad Notes ({matchedNotes.length})
                  </div>
                  {matchedNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onSelectTab('utilities');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{n.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Downloads */}
              {matchedDownloads.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Transfer Downloads ({matchedDownloads.length})
                  </div>
                  {matchedDownloads.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        onSelectTab('downloader');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-cyan-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{d.file_name || d.source_url}</span>
                      </div>
                      <span className="text-[10px] text-cyan-600 uppercase font-bold">{d.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Vault Items */}
              {matchedVault.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Encrypted Vault Secrets ({matchedVault.length})
                  </div>
                  {matchedVault.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        onSelectTab('vault');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{v.title}</span>
                      </div>
                      <span className="text-[10px] text-red-600 uppercase font-bold">{v.category}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Registration Forms */}
              {matchedReg.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Olympiad Forms ({matchedReg.length})
                  </div>
                  {matchedReg.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onSelectTab('registration');
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors border border-slate-200/50 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{r.student_name} ({r.school_name})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

