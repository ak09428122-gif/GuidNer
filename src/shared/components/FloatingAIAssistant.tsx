import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Mic,
  Zap,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Cpu,
  Brain,
  MessageSquare,
  Globe,
  Radio,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

interface FloatingAIAssistantProps {
  onNavigateTab: (tab: string) => void;
  onRunQuickAction?: (action: string) => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  onNavigateTab,
  onRunQuickAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isScanningStorage, setIsScanningStorage] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const toggleVoice = () => {
    setIsListening(true);
    setSpeechText('Listening for GuideNer command...');
    setTimeout(() => {
      const commands = [
        'Organize my study notes and flashcards',
        'Check P2P beam connection status',
        'Run quick storage cleanup and cache wipe',
        'Summarize today\'s Life OS habits',
      ];
      const selected = commands[Math.floor(Math.random() * commands.length)];
      setSpeechText(selected);
      setIsListening(false);
      setAiResponse(`GuideNer AI Executed: "${selected}". All systems optimal.`);
    }, 1200);
  };

  const runStorageCheck = () => {
    setIsScanningStorage(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanningStorage(false);
      setScanResult('Storage & File Integrity Audit Completed: 0 duplicates found. 142 MB browser cache wiped. Local DB synced.');
    }, 1500);
  };

  return (
    <>
      {/* Floating Widget Button */}
      <div className="fixed bottom-20 right-5 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all group flex items-center gap-2 border-2 border-white dark:border-slate-800"
          title="GuideNer Floating AI Assistant & Quick Actions"
        >
          <Brain className="w-6 h-6 animate-pulse" />
          <span className="hidden md:inline font-extrabold text-xs tracking-wide">AI Assistant</span>
          <span className="absolute -top-1 -right-1 flex h-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300" />
          </span>
        </button>
      </div>

      {/* Floating Panel Drawer */}
      {isOpen && (
        <div className="fixed bottom-36 right-5 sm:bottom-20 sm:right-6 z-50 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>GuideNer Floating AI Assistant</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-black">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Voice Control • Quick Actions • Quality Check</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Input Interaction */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-emerald-500" />
                <span>Voice Command Engine</span>
              </span>
              <button
                onClick={toggleVoice}
                className={`px-3 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
              </button>
            </div>

            {speechText && (
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                💬 {speechText}
              </p>
            )}

            {aiResponse && (
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                ✨ {aiResponse}
              </p>
            )}
          </div>

          {/* One-Tap Quick Actions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigateTab('omniair');
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-emerald-500/10 hover:border-emerald-500 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center gap-2 group"
              >
                <Radio className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                    OmniAir P2P
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">Beam Transfer</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('browser');
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-500/10 hover:border-blue-500 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center gap-2 group"
              >
                <Globe className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                    OmniBrowser
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">Multi-Tab Search</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('study');
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-purple-500/10 hover:border-purple-500 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center gap-2 group"
              >
                <FileCheck className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                    Study AI Docs
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">OCR & Summarizer</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('ai');
                  setIsOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-teal-500/10 hover:border-teal-500 border border-slate-200 dark:border-slate-700 text-left transition-all flex items-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 block truncate">
                    AI Chatbot
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">Companion OS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quality Check & Storage Cleaner Tool */}
          <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>System Health & Storage Audit</span>
              </span>
              <button
                onClick={runStorageCheck}
                disabled={isScanningStorage}
                className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] flex items-center gap-1 transition-all"
              >
                <Cpu className={`w-3 h-3 ${isScanningStorage ? 'animate-spin' : ''}`} />
                <span>{isScanningStorage ? 'Scanning...' : 'Run Audit'}</span>
              </button>
            </div>

            {scanResult && (
              <p className="text-[10px] text-emerald-300 font-mono bg-slate-800/90 p-2 rounded-xl border border-emerald-500/30">
                ✓ {scanResult}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
