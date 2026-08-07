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
  Scan,
  SlidersHorizontal,
  FileText,
  Mic,
  QrCode,
} from 'lucide-react';
import { UtilityNote, ClipboardItem } from '../../core/database/schema';
import { notificationEngine } from '../../core/notifications/NotificationService';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { DocumentScannerView } from './DocumentScannerView';
import { ImageEditorView } from './ImageEditorView';
import { PdfSuiteView } from './PdfSuiteView';
import { VoiceRecorderView } from './VoiceRecorderView';
import { QrSystemView } from './QrSystemView';

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
  const [activeTab, setActiveTab] = useState<
    'calculator' | 'doc_scanner' | 'image_editor' | 'pdf_suite' | 'voice_recorder' | 'qr_system' | 'notes' | 'clipboard'
  >('calculator');
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
    <div className="space-y-6 pb-20 lg:pb-8 font-sans text-slate-900 dark:text-white">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Daily Utilities Suite Pro</h1>
              <HelpMeUseButton screenId="utilities" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculator • Document Scanner • Image Editor • PDF Suite • Voice Recorder • QR System
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'calculator' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Calc
          </button>
          <button
            onClick={() => setActiveTab('doc_scanner')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'doc_scanner' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Scan className="w-3.5 h-3.5" /> Scanner
          </button>
          <button
            onClick={() => setActiveTab('image_editor')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'image_editor' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Image Editor
          </button>
          <button
            onClick={() => setActiveTab('pdf_suite')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'pdf_suite' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> PDF Suite
          </button>
          <button
            onClick={() => setActiveTab('voice_recorder')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'voice_recorder' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Voice Recorder
          </button>
          <button
            onClick={() => setActiveTab('qr_system')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'qr_system' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> QR Hub
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'notes' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" /> Scratchpad
          </button>
          <button
            onClick={() => setActiveTab('clipboard')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'clipboard' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" /> Clipboard
          </button>
        </div>
      </div>

      {/* Sub-Views Content */}
      {activeTab === 'doc_scanner' && <DocumentScannerView />}
      {activeTab === 'image_editor' && <ImageEditorView />}
      {activeTab === 'pdf_suite' && <PdfSuiteView />}
      {activeTab === 'voice_recorder' && <VoiceRecorderView />}
      {activeTab === 'qr_system' && <QrSystemView />}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto shadow-sm space-y-4">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-right font-mono text-3xl font-black text-slate-900 dark:text-white min-h-[64px] flex items-center justify-end overflow-x-auto">
            {calcDisplay}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(
              (btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcButton(btn)}
                  className={`py-3.5 rounded-2xl font-black text-sm transition-all shadow-xs ${
                    btn === '='
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : ['÷', '×', '-', '+', '%', 'C'].includes(btn)
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {btn}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Scratchpad Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm">Add Quick Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <input
                type="text"
                placeholder="Note Title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
              <textarea
                placeholder="Write scratchpad details..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs h-32"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-amber-600 text-white font-extrabold text-xs shadow-md hover:bg-amber-700 transition-all"
              >
                Save Scratchpad Note
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-extrabold text-sm">Saved Scratchpad Notes ({utilityNotes.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {utilityNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 relative shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs">{note.title}</h4>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-rose-500 hover:text-rose-600 text-xs p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clipboard History */}
      {activeTab === 'clipboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm">Clipboard History Stream ({clipboardHistory.length})</h3>
            <button
              onClick={onClearClipboard}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-bold hover:bg-rose-500/20"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-2">
            {clipboardHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
              >
                <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate max-w-md">
                  {item.text}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.text);
                    alert('Copied to system clipboard!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[10px] font-bold"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
