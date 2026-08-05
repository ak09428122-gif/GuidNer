import React from 'react';
import { Compass, ArrowRight, ArrowLeft, X, Volume2, VolumeX, Check, Sparkles, HelpCircle } from 'lucide-react';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { KNOWLEDGE_BASE } from '../../core/guided/KnowledgeBase';

export const GuidedTourOverlay: React.FC = () => {
  const {
    activeWalkthrough,
    nextWalkthroughStep,
    prevWalkthroughStep,
    endWalkthrough,
    speakText,
    stopSpeaking,
    isSpeaking,
    ttsEnabled,
  } = useGuidedMode();

  if (!activeWalkthrough) return null;

  const guidance = KNOWLEDGE_BASE[activeWalkthrough.screenId];
  if (!guidance || !guidance.steps[activeWalkthrough.stepIndex]) return null;

  const currentStep = guidance.steps[activeWalkthrough.stepIndex];
  const totalSteps = guidance.steps.length;
  const stepNumber = activeWalkthrough.stepIndex + 1;
  const isLastStep = stepNumber === totalSteps;

  const exp = currentStep.explanation;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white max-w-lg w-full p-6 sm:p-7 rounded-3xl border border-blue-500/30 shadow-2xl space-y-5 relative">
        {/* Step Indicator & Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step {stepNumber} of {totalSteps}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {guidance.title}
                </span>
              </div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{currentStep.title}</h3>
            </div>
          </div>

          <button
            onClick={endWalkthrough}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit Walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>

        {/* Structured Explanation Cards */}
        <div className="space-y-3">
          {/* What it does */}
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>What this feature does</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {exp.whatItDoes}
            </p>
          </div>

          {/* Why it is useful */}
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Why it is useful</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {exp.whyUseful}
            </p>
          </div>

          {/* What happens next */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <ArrowRight className="w-4 h-4 text-amber-600" />
              <span>What will happen after tapping it</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {exp.whatHappensNext}
            </p>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* Audio TTS Button */}
          {ttsEnabled ? (
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText(
                    `${currentStep.title}. What it does: ${exp.whatItDoes}. Why useful: ${exp.whyUseful}. What happens next: ${exp.whatHappensNext}`
                  );
                }
              }}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSpeaking
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          ) : (
            <button
              onClick={endWalkthrough}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Skip Tour
            </button>
          )}

          {/* Step Back & Next Controls */}
          <div className="flex items-center gap-2">
            {activeWalkthrough.stepIndex > 0 && (
              <button
                onClick={prevWalkthroughStep}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={nextWalkthroughStep}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 active:scale-95"
            >
              <span>{isLastStep ? 'Complete Tour' : 'Next Step'}</span>
              {isLastStep ? <Check className="w-4 h-4 text-emerald-300" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
