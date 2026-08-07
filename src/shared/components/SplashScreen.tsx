import React, { useEffect, useState } from 'react';
import { Sparkles, Shield, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing GuideNer Engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 20, t: 'Loading Encrypted Local Database...' },
      { p: 45, t: 'Verifying Security & Biometric Keys...' },
      { p: 70, t: 'Connecting AI Companion Engine...' },
      { p: 90, t: 'Preparing Personal Life OS Dashboard...' },
      { p: 100, t: 'System Ready' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].t);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onFinish();
          }, 400); // smooth fadeout duration
        }, 300);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-slate-950 text-white select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar Status Badges */}
      <div className="w-full max-w-md flex items-center justify-between text-[11px] font-mono text-slate-400 tracking-wider">
        <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
          <Shield className="w-3.5 h-3.5" /> ENCRYPTED OFFLINE OS
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          v2.5 PRO
        </span>
      </div>

      {/* Main Animated Branding & Logo Center */}
      <div className="flex flex-col items-center text-center space-y-6 my-auto">
        {/* Logo Container with Halo Glow Ring */}
        <div className="relative group">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-xl animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl bg-slate-900 border-2 border-slate-700/80 p-5 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-12 h-12 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Brand Title */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            GuideNer
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
            Intelligent Life OS & Companion
          </p>
        </div>

        {/* Monochromatic Adaptive App Icon Badge Preview */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Android 13 Edge-to-Edge Optimized</span>
        </div>
      </div>

      {/* Bottom Progress & Status Indicator */}
      <div className="w-full max-w-sm space-y-3 mb-4">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 font-semibold truncate pr-2">{statusText}</span>
          <span className="text-indigo-400 font-bold">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Security / Privacy Footnote */}
        <p className="text-[10px] text-center text-slate-500 font-sans">
          100% On-Device Privacy • No Cloud Tracking Required
        </p>
      </div>
    </div>
  );
};
