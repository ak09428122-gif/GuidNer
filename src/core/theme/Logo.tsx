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
    sm: { icon: 30, text: 'text-lg', tagline: 'text-[8px]', lineW: 'w-3' },
    md: { icon: 38, text: 'text-xl', tagline: 'text-[9px]', lineW: 'w-5' },
    lg: { icon: 48, text: 'text-2xl', tagline: 'text-[11px]', lineW: 'w-7' },
    xl: { icon: 64, text: 'text-4xl', tagline: 'text-xs', lineW: 'w-10' },
  }[size];

  // SVG Logo Mark: Official 3D Stylized Letter G + Forward Arrow + AI Genius Star
  const LogoIcon = ({ iconSize }: { iconSize: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 filter drop-shadow-md transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="gnGradRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="30%" stopColor="#3882F6" />
          <stop offset="65%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="gnGradArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3882F6" />
        </linearGradient>
        <linearGradient id="gnArrowFacet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="gnGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Main Stylized Letter G Outer Orbit Arc */}
      <path
        d="M 68 26 C 58 14, 34 14, 20 28 C 6 42, 6 68, 20 82 C 34 96, 64 96, 78 82 C 88 72, 92 56, 88 42 C 84 32, 72 28, 60 28 C 50 28, 44 30, 44 30"
        stroke="url(#gnGradRing)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#gnGlow)"
      />

      {/* Upward Forward Arrow Shaft */}
      <path
        d="M 28 72 L 62 38"
        stroke="url(#gnGradArrow)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Arrow Head 3D Facets */}
      <polygon points="68,26 44,36 56,48" fill="url(#gnGradArrow)" />
      <polygon points="68,26 56,48 66,56" fill="url(#gnArrowFacet)" />

      {/* 4-Point AI Genius Star */}
      <path
        d="M 82 8 Q 82 18, 92 18 Q 82 18, 82 28 Q 82 18, 72 18 Q 82 18, 82 8 Z"
        fill="#2563EB"
      />
      <path
        d="M 82 11 Q 82 18, 88 18 Q 82 18, 82 25 Q 82 18, 76 18 Q 82 18, 82 11 Z"
        fill="#60A5FA"
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
        <LogoIcon iconSize={26} />
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
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 ml-[1px]">
            Ner
          </span>
        </div>
        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 mt-1">
            <span className={`h-[1.5px] ${dimensions.lineW} bg-blue-500/60 hidden sm:inline-block rounded-full`} />
            <span className={`font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase ${dimensions.tagline}`}>
              YOUR AI LIFE GUIDE
            </span>
            <span className={`h-[1.5px] ${dimensions.lineW} bg-purple-500/60 hidden sm:inline-block rounded-full`} />
          </div>
        )}
      </div>
    </div>
  );
};

