import React, { useState } from 'react';
import { Wifi, Laptop, Tv, HardDrive, UploadCloud, X, CheckCircle, RefreshCw, FileText, ArrowRight } from 'lucide-react';

interface OmniDirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendFile: (fileName: string, fileSize: string) => void;
}

export const OmniDirectModal: React.FC<OmniDirectModalProps> = ({
  isOpen,
  onClose,
  onSendFile,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [activeTab, setActiveTab] = useState<'p2p' | 'laptop'>('p2p');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (files: FileList) => {
    if (files && files[0]) {
      const f = files[0];
      const sz = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      setSelectedFile({ name: f.name, size: sz });
    }
  };

  const startTransfer = () => {
    if (!selectedFile) {
      setSelectedFile({ name: 'GuideNer_Full_Backup_2026.zip', size: '142.8 MB' });
    }
    setIsTransferring(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onSendFile(selectedFile?.name || 'Large_File_Transfer.zip', selectedFile?.size || '142.8 MB');
            setIsTransferring(false);
            setProgress(0);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>OmniDirect Transfer Engine</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold">
                  Wi-Fi P2P 120 MB/s
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Large files, Movies, ZIPs & Laptop sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-200/50 dark:bg-slate-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 p-1">
          <button
            onClick={() => setActiveTab('p2p')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'p2p'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Nearby Mobile P2P</span>
          </button>
          <button
            onClick={() => setActiveTab('laptop')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'laptop'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Laptop / TV Web Connect</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'p2p' ? (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFileDrop(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                <UploadCloud className="w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Drag & Drop files or click to choose
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Supports Movies, Videos, Large ZIP Archives, Datasets
                </p>
                <input
                  type="file"
                  id="omniDirectFileInput"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileDrop(e.target.files)}
                />
                <button
                  onClick={() => document.getElementById('omniDirectFileInput')?.click()}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Select File from Device
                </button>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold truncate">{selectedFile.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 font-bold shrink-0 ml-2">
                    {selectedFile.size}
                  </span>
                </div>
              )}

              {isTransferring ? (
                <div className="space-y-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Transferring via OmniDirect Wi-Fi...</span>
                    <span>{progress}% (94.2 MB/s)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={startTransfer}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Wifi className="w-4 h-4" />
                  <span>Start High-Speed Wi-Fi P2P Transfer</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <Laptop className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Transfer directly with PC / Laptop Browser
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Open your laptop browser on the same Wi-Fi network and navigate to:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold tracking-wider select-all">
                  http://192.168.1.42:3000/transfer
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero installation required on PC or Smart TV</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
