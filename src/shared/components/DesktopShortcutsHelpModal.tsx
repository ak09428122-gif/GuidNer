import React from 'react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';
import { desktopManager } from '../../core/DesktopManager';

interface DesktopShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopShortcutsHelpModal: React.FC<DesktopShortcutsHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = desktopManager.getShortcutsList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Desktop Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                GuideNer OS hotkeys for Windows, macOS, & Linux Web
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((sc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {sc.description}
                </span>
              </div>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs">
                {sc.keyCombo}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">?</kbd> anytime on desktop</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
