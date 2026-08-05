import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface HelpMeUseButtonProps {
  screenId: string;
  className?: string;
  label?: string;
}

export const HelpMeUseButton: React.FC<HelpMeUseButtonProps> = ({
  screenId,
  className = '',
  label = 'Help me use this screen',
}) => {
  const { isEnabled, startWalkthrough } = useGuidedMode();

  if (!isEnabled) return null;

  return (
    <button
      onClick={() => startWalkthrough(screenId)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 ${className}`}
      title="Start Interactive Guided Walkthrough"
    >
      <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
      <span>{label}</span>
      <Sparkles className="w-3 h-3 text-blue-200" />
    </button>
  );
};
