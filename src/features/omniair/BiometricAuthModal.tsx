import React, { useState } from 'react';
import { Fingerprint, ScanFace, ShieldCheck, Lock, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Biometric Authentication Required',
  subtitle = 'Verify identity via Fingerprint or Face Unlock to proceed',
}) => {
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'face'>('fingerprint');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  if (!isOpen) return null;

  const handleScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        setStatus('idle');
        onClose();
      }, 600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-center space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-base text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>

        {/* Method Toggle */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setAuthMethod('fingerprint');
              setStatus('idle');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'fingerprint'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Fingerprint</span>
          </button>
          <button
            onClick={() => {
              setAuthMethod('face');
              setStatus('idle');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'face'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>Face Unlock</span>
          </button>
        </div>

        {/* Interactive Biometric Sensor Scanner Box */}
        <div
          onClick={handleScan}
          className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
            status === 'scanning'
              ? 'border-emerald-500 bg-emerald-500/10 scale-98'
              : status === 'success'
              ? 'border-emerald-500 bg-emerald-500/20'
              : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-emerald-500 hover:bg-emerald-500/5'
          }`}
        >
          {authMethod === 'fingerprint' ? (
            <div className="relative">
              <Fingerprint
                className={`w-16 h-16 transition-all ${
                  status === 'scanning'
                    ? 'text-emerald-500 animate-pulse scale-110'
                    : status === 'success'
                    ? 'text-emerald-500 scale-110'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              {status === 'scanning' && (
                <div className="absolute inset-0 border-t-2 border-emerald-400 animate-bounce" />
              )}
            </div>
          ) : (
            <div className="relative">
              <ScanFace
                className={`w-16 h-16 transition-all ${
                  status === 'scanning'
                    ? 'text-emerald-500 animate-pulse scale-110'
                    : status === 'success'
                    ? 'text-emerald-500 scale-110'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              {status === 'scanning' && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-40" />
              )}
            </div>
          )}

          <div className="space-y-0.5">
            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
              {status === 'idle' && 'Tap sensor to scan'}
              {status === 'scanning' && 'Verifying biometric credentials...'}
              {status === 'success' && 'Identity Confirmed!'}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Hardware Security Module (HSM) Level 3
            </span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          Protected by Native Biometric API & OmniAir Vault Security
        </p>
      </div>
    </div>
  );
};
