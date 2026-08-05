import React, { useState, useEffect } from 'react';
import { Download, Link, Play, Pause, CheckCircle, Trash2, FileText, Film, Archive, Code } from 'lucide-react';
import { DownloadTask, DownloadCategory } from '../../core/database/schema';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

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
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('transfer');
  }, [checkAndTriggerScreenGuide]);

  const handleStartDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl) return;

    const fileName = sourceUrl.split('/').pop() || 'Olympiad_Study_Material.pdf';
    const newTask: DownloadTask = {
      id: `dl-${Date.now()}`,
      source_url: sourceUrl,
      file_name: fileName,
      file_category: category,
      file_size: 15.4 * 1024 * 1024, // 15.4 MB
      downloaded_size: 15.4 * 1024 * 1024,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    onSaveTask(newTask);
    setSourceUrl('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Universal Download Manager</h1>
            <HelpMeUseButton screenId="transfer" label="Walkthrough" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Offline File Vault • PDF & Study Material Grabber
          </p>
        </div>
      </div>

      {/* Download Input Box */}
      <form onSubmit={handleStartDownload} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="url"
              required
              placeholder="Paste file URL or study resource link..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DownloadCategory)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none font-bold"
          >
            <option value="document">Document (PDF)</option>
            <option value="media">Media / Video</option>
            <option value="archive">Archive (ZIP)</option>
            <option value="code">Code / Data</option>
          </select>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Downloaded Files ({downloadTasks.length})</h2>

        <div className="space-y-3">
          {downloadTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">{t.file_name}</div>
                  <div className="text-[10px] text-slate-500">
                    Category: {t.file_category} • Size: {(t.file_size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ready</span>
                </span>
                <button onClick={() => onDeleteTask(t.id)} className="p-1.5 text-slate-400 hover:text-red-600">
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
