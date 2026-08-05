import React from 'react';
import { HelpCircle, Sparkles, ArrowRight, X, Volume2, VolumeX } from 'lucide-react';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

export const GuidedFeatureModal: React.FC = () => {
  const { activeFeatureModal, closeFeatureModal, speakText, stopSpeaking, isSpeaking, ttsEnabled } = useGuidedMode();

  if (!activeFeatureModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white max-w-md w-full p-6 rounded-3xl border border-blue-500/30 shadow-2xl space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{activeFeatureModal.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Guided Explanation</p>
            </div>
          </div>

          <button
            onClick={closeFeatureModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Structured Dimensions */}
        <div className="space-y-3 text-xs">
          {/* What it does */}
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1">
            <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <span>📌 What this feature does:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeFeatureModal.whatItDoes}
            </p>
          </div>

          {/* Why useful */}
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-1">
            <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>💡 Why it is useful:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeFeatureModal.whyUseful}
            </p>
          </div>

          {/* What happens next */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>⚡ What will happen after tapping it:</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeFeatureModal.whatHappensNext}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {ttsEnabled && (
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(
                    `${activeFeatureModal.title}. What it does: ${activeFeatureModal.whatItDoes}. Why useful: ${activeFeatureModal.whyUseful}. What happens next: ${activeFeatureModal.whatHappensNext}`
                  );
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isSpeaking
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? 'Stop Speech' : 'Listen Narration'}</span>
            </button>
          )}

          <button
            onClick={closeFeatureModal}
            className="ml-auto px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
