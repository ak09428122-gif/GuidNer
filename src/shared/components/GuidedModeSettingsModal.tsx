import React, { useState } from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { GuidanceLevel } from '../../core/guided/KnowledgeBase';

interface GuidedModeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedModeSettingsModal: React.FC<GuidedModeSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    isEnabled,
    mode,
    ttsEnabled,
    toggleGuidedMode,
    setMode,
    setTtsEnabled,
    resetSeenHistory,
    startWalkthrough,
    speakText,
    isSpeaking,
    stopSpeaking,
  } = useGuidedMode();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResetHistory = () => {
    resetSeenHistory();
    setToastMessage('Guided Mode history has been reset! Screen tips will display again.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText('Welcome to GuideNer AI Guided Mode! Voice narration is working perfectly.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-blue-500/30 shadow-2xl space-y-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Guided Mode Settings</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  Interactive AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure screen walkthroughs, detail levels, and TTS voice narration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="space-y-5">
          {/* Main Toggle Switch */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Enable AI Guided Mode</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically shows interactive walkthroughs and contextual feature guides
              </p>
            </div>

            <button
              onClick={() => toggleGuidedMode(!isEnabled)}
              id="guided_mode_toggle_switch"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Mode Selector (Beginner / Normal / Expert) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Guidance Detail Level</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5" id="guided_level_selector">
              {(
                [
                  { id: 'beginner', label: 'Beginner', desc: 'Detailed guidance & tips' },
                  { id: 'normal', label: 'Normal', desc: 'Short overview' },
                  { id: 'expert', label: 'Expert', desc: 'Minimal guidance' },
                ] as { id: GuidanceLevel; label: string; desc: string }[]
              ).map((lvl) => {
                const isSelected = mode === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setMode(lvl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{lvl.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                      {lvl.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Narration (TTS) Switch */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-500" />
                <span>Text-to-Speech Voice Narration</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audibly reads walkthroughs and screen guides out loud
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSpeech}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-all"
                title="Test Voice Output"
              >
                {isSpeaking ? 'Stop Test' : 'Test Speech'}
              </button>

              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                id="tts_setting_switch"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  ttsEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    ttsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset History & Test Tour */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleResetHistory}
              id="reset_guided_history_btn"
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Guided History</span>
            </button>

            <button
              onClick={() => {
                onClose();
                startWalkthrough('home');
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Start Home Tour</span>
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
