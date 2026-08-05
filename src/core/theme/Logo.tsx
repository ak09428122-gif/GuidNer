import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'badge' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const GuideNerLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg', tagline: 'text-[8px]' },
    md: { icon: 34, text: 'text-xl', tagline: 'text-[9px]' },
    lg: { icon: 44, text: 'text-2xl', tagline: 'text-[11px]' },
    xl: { icon: 60, text: 'text-4xl', tagline: 'text-xs' },
  }[size];

  // SVG Logo Mark: Official Letter G + Upward Arrow + AI Star
  const LogoIcon = ({ iconSize }: { iconSize: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 filter drop-shadow-sm transition-transform hover:scale-105"
    >
      <defs>
        <linearGradient id="gnGradRing" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="35%" stopColor="#3882F6" />
          <stop offset="70%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="gnGradArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3882F6" />
        </linearGradient>
        <filter id="gnGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2563EB" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Letter G Outer Orbit Arc */}
      <path
        d="M 68 28 C 58 18, 38 18, 24 30 C 10 44, 10 68, 24 82 C 38 96, 64 96, 78 82 C 88 72, 92 58, 90 46 C 88 38, 78 32, 68 32 L 52 32"
        stroke="url(#gnGradRing)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#gnGlow)"
      />

      {/* Upward Forward Arrow (3D Polygon Style) */}
      <path
        d="M 28 72 L 66 34"
        stroke="url(#gnGradArrow)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <polygon
        points="68,26 48,34 58,44"
        fill="#3882F6"
      />
      <polygon
        points="68,26 58,44 66,54"
        fill="#2563EB"
      />

      {/* Genius AI 4-Point Star at Top Right */}
      <path
        d="M 82 14 Q 82 22, 90 22 Q 82 22, 82 30 Q 82 22, 74 22 Q 82 22, 82 14 Z"
        fill="#3882F6"
      />
      <path
        d="M 82 17 Q 82 22, 87 22 Q 82 22, 82 27 Q 82 22, 77 22 Q 82 22, 82 17 Z"
        fill="#7C3AED"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoIcon iconSize={dimensions.icon} />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 ${className}`}>
        <LogoIcon iconSize={24} />
        <span className="font-extrabold text-sm tracking-tight">
          Guide<span className="text-blue-400">Ner</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon iconSize={dimensions.icon} />
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight ${dimensions.text} flex items-center leading-none text-slate-900 dark:text-white`}>
          <span>Guide</span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Ner
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-[1px] bg-blue-500/40 hidden sm:inline-block" />
            <span className={`font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase ${dimensions.tagline}`}>
              Your AI Life Guide
            </span>
            <span className="w-2.5 h-[1px] bg-purple-500/40 hidden sm:inline-block" />
          </div>
        )}
      </div>
    </div>
  );
};

