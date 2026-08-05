import React from 'react';
import { Compass, Volume2, VolumeX, X, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

export const GuidedScreenBanner: React.FC = () => {
  const {
    activeScreenGuide,
    mode,
    dismissScreenGuide,
    startWalkthrough,
    speakText,
    stopSpeaking,
    isSpeaking,
    ttsEnabled,
  } = useGuidedMode();

  if (!activeScreenGuide) return null;

  const overviewText = activeScreenGuide.overview[mode] || activeScreenGuide.overview.beginner;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-4 sm:p-5 rounded-3xl border border-blue-500/30 shadow-2xl backdrop-blur-xl relative space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-600/30 text-blue-400 ring-1 ring-blue-500/40">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-white">{activeScreenGuide.title}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {mode} Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-400">AI Guided Mode Overview</p>
            </div>
          </div>

          <button
            onClick={dismissScreenGuide}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss Overview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overview Message */}
        <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
          {overviewText}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const screenId = activeScreenGuide.id;
                dismissScreenGuide();
                startWalkthrough(screenId);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Start Walkthrough</span>
            </button>

            {ttsEnabled && (
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(`${activeScreenGuide.title}. ${overviewText}`);
                  }
                }}
                className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={isSpeaking ? 'Stop Narration' : 'Read Aloud (TTS)'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button
            onClick={dismissScreenGuide}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
