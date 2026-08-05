import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Clock,
  Calculator,
  StickyNote,
  Clipboard,
  Plus,
  Play,
  Volume2,
  Trash2,
  Pin,
  Check,
} from 'lucide-react';
import { UtilityNote, ClipboardItem } from '../../core/database/schema';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface UtilitiesViewProps {
  utilityNotes: UtilityNote[];
  clipboardHistory: ClipboardItem[];
  onSaveNote: (note: UtilityNote) => void;
  onDeleteNote: (id: string) => void;
  onClearClipboard: () => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  utilityNotes,
  clipboardHistory,
  onSaveNote,
  onDeleteNote,
  onClearClipboard,
}) => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'notes' | 'clipboard' | 'alarms'>('calculator');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('utilities');
  }, [checkAndTriggerScreenGuide]);

  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');

  // New Note state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      return;
    }
    if (val === '=') {
      try {
        setCalcDisplay(eval(calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')).toString());
      } catch {
        setCalcDisplay('Error');
      }
      return;
    }
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(calcDisplay + val);
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle) return;
    const note: UtilityNote = {
      id: `un-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      pinned: false,
      updated_at: new Date().toISOString(),
    };
    onSaveNote(note);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Daily Utilities Hub</h1>
              <HelpMeUseButton screenId="utilities" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart Calculator • Scratchpad • Clipboard History • Alarms
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span>Notes ({utilityNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clipboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'clipboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>Clipboard</span>
          </button>
        </div>
      </div>

      {/* 1. CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="flex justify-center">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-right font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-wider overflow-x-auto min-h-[60px] flex items-center justify-end">
              {calcDisplay}
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcButton(btn)}
                    className={`py-3.5 rounded-2xl font-extrabold text-sm transition-all ${
                      btn === 'C'
                        ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                        : btn === '='
                        ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md'
                        : ['÷', '×', '-', '+', '%'].includes(btn)
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTES SCRATCHPAD TAB */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Note Form */}
          <form onSubmit={handleCreateNote} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-amber-600" />
              <span>Quick Utility Scratchpad</span>
            </h2>

            <input
              type="text"
              required
              placeholder="Note Title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <textarea
              required
              rows={4}
              placeholder="Write quick ideas, lists, or reminders..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Note</span>
            </button>
          </form>

          {/* Notes List */}
          <div className="space-y-3">
            {utilityNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{note.title}</h3>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CLIPBOARD HISTORY TAB */}
      {activeTab === 'clipboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-amber-600" />
              <span>Local Clipboard History</span>
            </h2>
            <button
              onClick={onClearClipboard}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 font-bold text-xs hover:bg-red-500/20 transition-all"
            >
              Wipe Clipboard
            </button>
          </div>

          <div className="space-y-2">
            {clipboardHistory.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">Clipboard history is clean.</div>
            ) : (
              clipboardHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span className="truncate max-w-xl">{item.content}</span>
                  <span className="text-[10px] text-slate-400">{item.copied_at}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
