import React, { useEffect, useState, useRef } from 'react';
import {
  Search,
  Maximize2,
  FilePlus,
  Cloud,
  Shield,
  Bot,
  Globe,
  Radio,
  BookOpen,
  Keyboard,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { desktopManager } from '../../core/DesktopManager';
import { cloudSyncService } from '../../core/database/CloudSyncService';
import { ActiveTab } from './Navigation';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface DesktopContextMenuProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenShortcutsModal: () => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenShortcutsModal,
}) => {
  const [position, setPosition] = useState<ContextMenuPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent default right-click menu on desktop screens
      if (window.innerWidth >= 1024) {
        e.preventDefault();
        const x = Math.min(e.clientX, window.innerWidth - 240);
        const y = Math.min(e.clientY, window.innerHeight - 340);
        setPosition({ x, y });
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPosition(null);
      } else {
        setPosition(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPosition(null);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!position) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setPosition(null);
  };

  const handleFullscreen = () => {
    desktopManager.toggleFullscreen();
    setPosition(null);
  };

  const handleSync = () => {
    cloudSyncService.triggerBackgroundSync();
    setPosition(null);
  };

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="fixed z-50 w-60 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 shadow-2xl p-1.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
        <span>GuideNer OS Actions</span>
        <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
          Desktop
        </span>
      </div>

      <button
        onClick={() => {
          onOpenSearch();
          setPosition(null);
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 font-semibold transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-blue-500 group-hover:text-white" />
          <span>Universal Search</span>
        </div>
        <kbd className="text-[10px] font-mono text-slate-400 group-hover:text-white/80">⌘K</kbd>
      </button>

      <button
        onClick={() => {
          onNavigate('ai');
          setPosition(null);
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 font-semibold transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <Bot className="w-4 h-4 text-emerald-500 group-hover:text-white" />
          <span>Ask AI Companion</span>
        </div>
        <kbd className="text-[10px] font-mono text-slate-400 group-hover:text-white/80">⌘2</kbd>
      </button>

      <button
        onClick={() => {
          onNavigate('utilities');
          setPosition(null);
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 font-semibold transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <FilePlus className="w-4 h-4 text-amber-500 group-hover:text-white" />
          <span>Quick Utility Note</span>
        </div>
        <kbd className="text-[10px] font-mono text-slate-400 group-hover:text-white/80">⌘N</kbd>
      </button>

      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

      <button
        onClick={() => {
          onNavigate('browser');
          setPosition(null);
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <Globe className="w-4 h-4 text-indigo-500" />
        <span>Open Omni Browser</span>
      </button>

      <button
        onClick={() => {
          onNavigate('omniair');
          setPosition(null);
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <Radio className="w-4 h-4 text-purple-500" />
        <span>OmniAir P2P Beam</span>
      </button>

      <button
        onClick={() => {
          onNavigate('vault');
          setPosition(null);
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <Shield className="w-4 h-4 text-emerald-500" />
        <span>Open Security Vault</span>
      </button>

      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

      <button
        onClick={handleSync}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <div className="flex items-center gap-2.5">
          <Cloud className="w-4 h-4 text-blue-500" />
          <span>Trigger Cloud Delta Sync</span>
        </div>
      </button>

      <button
        onClick={handleFullscreen}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <div className="flex items-center gap-2.5">
          <Maximize2 className="w-4 h-4 text-teal-500" />
          <span>Toggle Native Fullscreen</span>
        </div>
        <kbd className="text-[10px] font-mono text-slate-400">F11</kbd>
      </button>

      <button
        onClick={() => {
          onOpenShortcutsModal();
          setPosition(null);
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all"
      >
        <div className="flex items-center gap-2.5">
          <Keyboard className="w-4 h-4 text-amber-500" />
          <span>Keyboard Shortcuts</span>
        </div>
        <kbd className="text-[10px] font-mono text-slate-400">?</kbd>
      </button>
    </div>
  );
};
