import React, { useState, useEffect } from 'react';
import {
  Download,
  Link,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Trash2,
  FileText,
  Film,
  Archive,
  Code,
  Zap,
  Globe,
  ArrowUpRight,
  Clock,
  HardDrive,
  Sliders,
  XCircle,
} from 'lucide-react';
import { DownloadTask, DownloadCategory } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';
import { M3Card, M3Button } from '../../shared/components/ui/MaterialComponents';

interface DownloaderViewProps {
  downloadTasks: DownloadTask[];
  onSaveTask: (task: DownloadTask) => void;
  onDeleteTask: (id: string) => void;
}

export const DownloaderView: React.FC<DownloaderViewProps> = ({
  downloadTasks,
  onSaveTask,
  onDeleteTask,
}) => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState<DownloadCategory>('document');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [speedLimit, setSpeedLimit] = useState<string>('unlimited');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Active Downloading Simulator State
  const [activeQueue, setActiveQueue] = useState<{
    id: string;
    fileName: string;
    category: DownloadCategory;
    sizeBytes: number;
    downloadedBytes: number;
    speedMBs: number;
    status: 'downloading' | 'paused' | 'failed' | 'completed';
    etaSeconds: number;
  }[]>([
    {
      id: 'active-1',
      fileName: 'NCERT_Class12_Physics_Full_Vol1.pdf',
      category: 'document',
      sizeBytes: 42.5 * 1024 * 1024,
      downloadedBytes: 24.1 * 1024 * 1024,
      speedMBs: 4.8,
      status: 'downloading',
      etaSeconds: 4,
    },
  ]);

  useEffect(() => {
    checkAndTriggerScreenGuide('transfer');
  }, [checkAndTriggerScreenGuide]);

  // Simulate active download progress increment
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQueue((prev) =>
        prev.map((item) => {
          if (item.status !== 'downloading') return item;
          const added = item.speedMBs * 1024 * 1024 * 0.5;
          const nextDownloaded = Math.min(item.sizeBytes, item.downloadedBytes + added);
          const remaining = item.sizeBytes - nextDownloaded;
          const nextEta = Math.ceil(remaining / (item.speedMBs * 1024 * 1024));

          if (nextDownloaded >= item.sizeBytes) {
            // Save as completed task in DB
            const completedTask: DownloadTask = {
              id: item.id,
              source_url: 'https://example.com/' + item.fileName,
              file_name: item.fileName,
              file_category: item.category,
              file_size: item.sizeBytes,
              downloaded_size: item.sizeBytes,
              status: 'completed',
              created_at: new Date().toISOString(),
            };
            onSaveTask(completedTask);
            return { ...item, downloadedBytes: item.sizeBytes, status: 'completed', etaSeconds: 0 };
          }
          return { ...item, downloadedBytes: nextDownloaded, etaSeconds: nextEta };
        })
      );
    }, 500);

    return () => clearInterval(timer);
  }, [onSaveTask]);

  const handleStartDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl) return;

    const fileName = sourceUrl.split('/').pop() || 'Study_Resource_Material.pdf';
    const newActive = {
      id: `dl-${Date.now()}`,
      fileName,
      category,
      sizeBytes: 28.5 * 1024 * 1024,
      downloadedBytes: 0,
      speedMBs: 5.2,
      status: 'downloading' as const,
      etaSeconds: 6,
    };

    setActiveQueue((prev) => [newActive, ...prev]);
    setSourceUrl('');
  };

  const togglePause = (id: string) => {
    setActiveQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'downloading' ? 'paused' : 'downloading' }
          : item
      )
    );
  };

  const cancelActive = (id: string) => {
    setActiveQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 font-sans text-slate-900 dark:text-white">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pro Download Manager
              </h1>
              <HelpMeUseButton screenId="transfer" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-Threaded Queue • Background Acceleration • Auto Categorization
            </p>
          </div>
        </div>

        {/* Speed Limit Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Sliders className="w-4 h-4 text-slate-400" />
          <select
            value={speedLimit}
            onChange={(e) => setSpeedLimit(e.target.value)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="unlimited">Max Bandwidth (Unlimited)</option>
            <option value="10mb">10 MB/s Limit</option>
            <option value="2mb">2 MB/s Limit (Background)</option>
          </select>
        </div>
      </div>

      {/* Download Input Box Form */}
      <form
        onSubmit={handleStartDownload}
        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="url"
              required
              placeholder="Paste file URL, YouTube video link, or PDF resource..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DownloadCategory)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="document">📄 Document (PDF)</option>
            <option value="media">🎬 Media / Video</option>
            <option value="archive">📦 Archive (ZIP)</option>
            <option value="code">💻 Code / App</option>
          </select>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Accelerate</span>
          </button>
        </div>
      </form>

      {/* Active Downloading Tasks Queue */}
      {activeQueue.filter((a) => a.status !== 'completed').length > 0 && (
        <div className="space-y-3">
          <h2 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider px-1">
            Active Download Queue
          </h2>

          <div className="space-y-3">
            {activeQueue
              .filter((a) => a.status !== 'completed')
              .map((item) => {
                const percent = Math.min(100, Math.round((item.downloadedBytes / item.sizeBytes) * 100));
                return (
                  <M3Card key={item.id} className="p-4 space-y-3 border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Download className="w-5 h-5 animate-bounce" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                            {item.fileName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {(item.downloadedBytes / (1024 * 1024)).toFixed(1)} MB /{' '}
                            {(item.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {item.speedMBs} MB/s
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePause(item.id)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        >
                          {item.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => cancelActive(item.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & ETA */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-indigo-500 font-bold">{percent}%</span>
                        <span className="text-slate-400">
                          {item.status === 'paused' ? 'Paused' : `ETA: ${item.etaSeconds}s`}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </M3Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Downloaded History Tasks */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
            Completed Library ({downloadTasks.length})
          </h2>
        </div>

        <div className="space-y-3">
          {downloadTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                    {t.file_name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Category: {t.file_category} • Size: {(t.file_size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </span>
                <button
                  onClick={() => onDeleteTask(t.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
