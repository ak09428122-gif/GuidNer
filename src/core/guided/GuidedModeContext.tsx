import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { KNOWLEDGE_BASE, GuidanceLevel, FeatureExplanation, ScreenGuidance } from './KnowledgeBase';

const SEEN_TIPS_KEY = 'gn_guided_seen_tips';
const GUIDED_SETTINGS_KEY = 'gn_guided_settings';

export interface GuidedSettings {
  isEnabled: boolean;
  mode: GuidanceLevel;
  ttsEnabled: boolean;
}

export interface GuidedModeContextType {
  isEnabled: boolean;
  mode: GuidanceLevel;
  ttsEnabled: boolean;
  seenTips: Set<string>;
  isSpeaking: boolean;
  
  // UI States
  activeScreenGuide: ScreenGuidance | null;
  activeWalkthrough: { screenId: string; stepIndex: number } | null;
  activeFeatureModal: FeatureExplanation | null;
  
  // Actions
  toggleGuidedMode: (enabled: boolean) => void;
  setMode: (mode: GuidanceLevel) => void;
  setTtsEnabled: (enabled: boolean) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  markTipSeen: (tipId: string) => void;
  resetSeenHistory: () => void;
  
  // Walkthrough & Explanation actions
  checkAndTriggerScreenGuide: (screenId: string) => void;
  dismissScreenGuide: () => void;
  startWalkthrough: (screenId: string) => void;
  nextWalkthroughStep: () => void;
  prevWalkthroughStep: () => void;
  endWalkthrough: () => void;
  explainFeature: (screenId: string, featureKey: string, customPrompt?: string) => Promise<void>;
  closeFeatureModal: () => void;
}

const GuidedModeContext = createContext<GuidedModeContextType | null>(null);

export const GuidedModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings State
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [mode, setModeState] = useState<GuidanceLevel>('beginner');
  const [ttsEnabled, setTtsEnabledState] = useState<boolean>(false);
  const [seenTips, setSeenTips] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Active Overlay States
  const [activeScreenGuide, setActiveScreenGuide] = useState<ScreenGuidance | null>(null);
  const [activeWalkthrough, setActiveWalkthrough] = useState<{ screenId: string; stepIndex: number } | null>(null);
  const [activeFeatureModal, setActiveFeatureModal] = useState<FeatureExplanation | null>(null);

  // Load Settings and Seen Tips on Mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(GUIDED_SETTINGS_KEY);
      if (savedSettings) {
        const parsed: GuidedSettings = JSON.parse(savedSettings);
        setIsEnabled(parsed.isEnabled ?? true);
        setModeState(parsed.mode ?? 'beginner');
        setTtsEnabledState(parsed.ttsEnabled ?? false);
      }

      const savedSeen = localStorage.getItem(SEEN_TIPS_KEY);
      if (savedSeen) {
        setSeenTips(new Set(JSON.parse(savedSeen)));
      }
    } catch (e) {
      console.warn('Could not read guided mode settings from localStorage', e);
    }
  }, []);

  // Save Settings Helper
  const saveSettings = (newEnabled: boolean, newMode: GuidanceLevel, newTts: boolean) => {
    try {
      localStorage.setItem(
        GUIDED_SETTINGS_KEY,
        JSON.stringify({ isEnabled: newEnabled, mode: newMode, ttsEnabled: newTts })
      );
    } catch (e) {
      console.warn('Failed to save guided settings', e);
    }
  };

  const toggleGuidedMode = (enabled: boolean) => {
    setIsEnabled(enabled);
    saveSettings(enabled, mode, ttsEnabled);
    if (!enabled) {
      setActiveScreenGuide(null);
      setActiveWalkthrough(null);
      stopSpeaking();
    }
  };

  const setMode = (newMode: GuidanceLevel) => {
    setModeState(newMode);
    saveSettings(isEnabled, newMode, ttsEnabled);
  };

  const setTtsEnabled = (enabled: boolean) => {
    setTtsEnabledState(enabled);
    saveSettings(isEnabled, mode, enabled);
    if (!enabled) {
      stopSpeaking();
    }
  };

  // Text-to-Speech Engine
  const speakText = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel(); // Stop current speech
      const cleanedText = text.replace(/[*#_`>]/g, ' ').trim();
      if (!cleanedText) return;

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [ttsEnabled]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Seen Tips Helper
  const markTipSeen = (tipId: string) => {
    setSeenTips((prev) => {
      const next = new Set(prev);
      next.add(tipId);
      try {
        localStorage.setItem(SEEN_TIPS_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Could not save seen tip to localStorage', e);
      }
      return next;
    });
  };

  const resetSeenHistory = () => {
    setSeenTips(new Set());
    try {
      localStorage.removeItem(SEEN_TIPS_KEY);
    } catch (e) {
      console.warn('Could not reset seen tips', e);
    }
  };

  // Trigger Screen Guide when opening a screen for the first time
  const checkAndTriggerScreenGuide = useCallback(
    (screenId: string) => {
      if (!isEnabled) return;
      const screenKey = `screen_${screenId}`;
      if (seenTips.has(screenKey)) return;

      const guidance = KNOWLEDGE_BASE[screenId];
      if (guidance) {
        setActiveScreenGuide(guidance);
        markTipSeen(screenKey);
        
        // Auto-speak overview if TTS is enabled
        const overviewText = guidance.overview[mode] || guidance.overview.beginner;
        speakText(`${guidance.title}. ${overviewText}`);
      }
    },
    [isEnabled, seenTips, mode, speakText]
  );

  const dismissScreenGuide = () => {
    setActiveScreenGuide(null);
    stopSpeaking();
  };

  // Walkthrough Actions
  const startWalkthrough = (screenId: string) => {
    const guidance = KNOWLEDGE_BASE[screenId];
    if (!guidance || guidance.steps.length === 0) return;

    setActiveWalkthrough({ screenId, stepIndex: 0 });
    const firstStep = guidance.steps[0];
    speakText(`${firstStep.title}. ${firstStep.explanation.whatItDoes}`);
  };

  const nextWalkthroughStep = () => {
    if (!activeWalkthrough) return;
    const guidance = KNOWLEDGE_BASE[activeWalkthrough.screenId];
    if (!guidance) return;

    if (activeWalkthrough.stepIndex < guidance.steps.length - 1) {
      const nextIdx = activeWalkthrough.stepIndex + 1;
      setActiveWalkthrough({ screenId: activeWalkthrough.screenId, stepIndex: nextIdx });
      const step = guidance.steps[nextIdx];
      speakText(`${step.title}. ${step.explanation.whatItDoes}`);
    } else {
      endWalkthrough();
    }
  };

  const prevWalkthroughStep = () => {
    if (!activeWalkthrough || activeWalkthrough.stepIndex <= 0) return;
    const guidance = KNOWLEDGE_BASE[activeWalkthrough.screenId];
    if (!guidance) return;

    const prevIdx = activeWalkthrough.stepIndex - 1;
    setActiveWalkthrough({ screenId: activeWalkthrough.screenId, stepIndex: prevIdx });
    const step = guidance.steps[prevIdx];
    speakText(`${step.title}. ${step.explanation.whatItDoes}`);
  };

  const endWalkthrough = () => {
    setActiveWalkthrough(null);
    stopSpeaking();
  };

  // Explain individual feature (Online AI or Offline KB)
  const explainFeature = async (screenId: string, featureKey: string, customPrompt?: string) => {
    if (!isEnabled) return;

    const screenData = KNOWLEDGE_BASE[screenId];
    let explanation: FeatureExplanation | null = null;

    if (screenData) {
      // Check step explanations or feature map
      const step = screenData.steps.find((s) => s.id === featureKey);
      if (step) {
        explanation = step.explanation;
      } else if (screenData.features[featureKey]) {
        explanation = screenData.features[featureKey];
      }
    }

    // Fallback default structure
    if (!explanation) {
      explanation = {
        title: featureKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        whatItDoes: customPrompt || `This feature lets you manage and interact with ${featureKey}.`,
        whyUseful: 'Improves organization, workflow efficiency, and daily productivity.',
        whatHappensNext: 'Tapping this executes the action and updates your Life OS state.',
      };
    }

    // Online AI Enrichment Attempt
    try {
      const response = await fetch('/api/ai/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screenId,
          featureKey,
          mode,
          baseExplanation: explanation,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.explanation) {
          explanation = data.explanation;
        }
      }
    } catch {
      // Use offline explanation
    }

    setActiveFeatureModal(explanation);
    speakText(`${explanation.title}. What it does: ${explanation.whatItDoes}. Why it is useful: ${explanation.whyUseful}. What happens next: ${explanation.whatHappensNext}`);
  };

  const closeFeatureModal = () => {
    setActiveFeatureModal(null);
    stopSpeaking();
  };

  return (
    <GuidedModeContext.Provider
      value={{
        isEnabled,
        mode,
        ttsEnabled,
        seenTips,
        isSpeaking,
        activeScreenGuide,
        activeWalkthrough,
        activeFeatureModal,
        toggleGuidedMode,
        setMode,
        setTtsEnabled,
        speakText,
        stopSpeaking,
        markTipSeen,
        resetSeenHistory,
        checkAndTriggerScreenGuide,
        dismissScreenGuide,
        startWalkthrough,
        nextWalkthroughStep,
        prevWalkthroughStep,
        endWalkthrough,
        explainFeature,
        closeFeatureModal,
      }}
    >
      {children}
    </GuidedModeContext.Provider>
  );
};

export const useGuidedMode = () => {
  const context = useContext(GuidedModeContext);
  if (!context) {
    throw new Error('useGuidedMode must be used within a GuidedModeProvider');
  }
  return context;
};
