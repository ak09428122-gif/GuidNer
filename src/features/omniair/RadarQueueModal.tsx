import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wifi,
  Bluetooth,
  QrCode,
  Zap,
  BatteryCharging,
  Star,
  RefreshCw,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  HardDrive,
  Cpu,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

export interface PeerDevice {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet' | 'tv';
  distanceMeters: number;
  isFavorite: boolean;
  status: 'available' | 'transferring' | 'offline';
  ipAddress: string;
  protocol: string;
}

export interface QueueTransferItem {
  id: string;
  fileName: string;
  fileSize: string;
  progress: number;
  speedMbPerSec: number;
  status: 'queued' | 'active' | 'paused' | 'completed' | 'interrupted';
  peerName: string;
  protocolUsed: string;
  autoResume: boolean;
}

interface RadarQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBatterySaver: boolean;
  onToggleBatterySaver: () => void;
}

export const RadarQueueModal: React.FC<RadarQueueModalProps> = ({
  isOpen,
  onClose,
  isBatterySaver,
  onToggleBatterySaver,
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'queue' | 'history'>('radar');
  const [isScanning, setIsScanning] = useState(true);

  // Demo Peers
  const [peers, setPeers] = useState<PeerDevice[]>([
    {
      id: 'p-1',
      name: 'Pixel 8 Pro (Nearby)',
      type: 'phone',
      distanceMeters: 1.2,
      isFavorite: true,
      status: 'available',
      ipAddress: '192.168.1.105',
      protocol: 'Wi-Fi Direct P2P',
    },
    {
      id: 'p-2',
      name: 'MacBook Pro M3 (Lab)',
      type: 'laptop',
      distanceMeters: 2.8,
      isFavorite: true,
      status: 'transferring',
      ipAddress: '192.168.1.42',
      protocol: 'WebRTC Mesh',
    },
    {
      id: 'p-3',
      name: 'Galaxy Tab S9 (Library)',
      type: 'tablet',
      distanceMeters: 4.5,
      isFavorite: false,
      status: 'available',
      ipAddress: '192.168.1.189',
      protocol: 'BLE 5.3',
    },
  ]);

  // Demo Transfer Queue
  const [queue, setQueue] = useState<QueueTransferItem[]>([
    {
      id: 'q-1',
      fileName: 'Quantum_Lecture_3D_Sim.mp4',
      fileSize: '482.4 MB',
      progress: 68,
      speedMbPerSec: 114.5,
      status: 'active',
      peerName: 'MacBook Pro M3 (Lab)',
      protocolUsed: 'Wi-Fi Direct P2P (120 MB/s)',
      autoResume: true,
    },
    {
      id: 'q-2',
      fileName: 'GuideNer_Syllabus_2026.pdf',
      fileSize: '14.2 MB',
      progress: 100,
      speedMbPerSec: 0,
      status: 'completed',
      peerName: 'Pixel 8 Pro (Nearby)',
      protocolUsed: 'OmniBeam Optical QR',
      autoResume: true,
    },
    {
      id: 'q-3',
      fileName: 'Physics_Lab_Dataset_Raw.zip',
      fileSize: '1.2 GB',
      progress: 32,
      speedMbPerSec: 0,
      status: 'interrupted',
      peerName: 'Galaxy Tab S9 (Library)',
      protocolUsed: 'WebRTC Channel',
      autoResume: true,
    },
  ]);

  // Simulate active transfer progress
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setQueue((prev) =>
        prev.map((item) => {
          if (item.status === 'active') {
            const nextProgress = item.progress + 4;
            if (nextProgress >= 100) {
              return { ...item, progress: 100, status: 'completed', speedMbPerSec: 0 };
            }
            return {
              ...item,
              progress: nextProgress,
              speedMbPerSec: +(105 + Math.random() * 20).toFixed(1),
            };
          }
          return item;
        })
      );
    }, 400);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleFavoritePeer = (id: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const handleResumeTransfer = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'active', speedMbPerSec: 98.4 } : item))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="relative p-2 rounded-xl bg-emerald-500 text-white font-bold shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <span>Nearby Device Radar & Queue</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Live Scanner
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">P2P Peer Discovery • Transfer Speed Gauge • Auto Resume</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBatterySaver}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                isBatterySaver
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Conserve Wi-Fi radio energy"
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{isBatterySaver ? 'Eco Mode On' : 'Eco Mode Off'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Nearby Radar ({peers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Transfer Queue ({queue.filter((q) => q.status === 'active' || q.status === 'interrupted').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History ({queue.filter((q) => q.status === 'completed').length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'radar' && (
            <div className="space-y-4">
              {/* Radar Animation Stage */}
              <div className="relative w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Concentric Circles */}
                <div className="absolute w-36 h-36 rounded-full border border-emerald-500/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30" />
                <div className="absolute w-12 h-12 rounded-full border border-emerald-500/40" />
                <div className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-glow" />

                {/* Sweeping Line */}
                <div
                  className={`absolute w-full h-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(16,185,129,0.3)_360deg)] ${
                    isBatterySaver ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_2s_linear_infinite]'
                  }`}
                />

                {/* Blips for devices */}
                <div className="absolute top-8 left-16 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px] text-emerald-300 font-extrabold animate-pulse">
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  <span>Pixel 8</span>
                </div>
                <div className="absolute bottom-10 right-20 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 text-[10px] text-emerald-300 font-extrabold animate-pulse">
                  <Laptop className="w-3 h-3 text-emerald-400" />
                  <span>MacBook</span>
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-400/80">
                  Radar Range: 15 meters • Protocol: Wi-Fi Direct / WebRTC / BLE
                </div>
              </div>

              {/* Peer Devices List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">Discovered Peer Nodes</span>
                  <button
                    onClick={() => {
                      setIsScanning(true);
                      setTimeout(() => setIsScanning(false), 1200);
                    }}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>Rescan</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {peers.map((peer) => (
                    <div
                      key={peer.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          {peer.type === 'phone' && <Smartphone className="w-5 h-5" />}
                          {peer.type === 'laptop' && <Laptop className="w-5 h-5" />}
                          {peer.type === 'tablet' && <Tablet className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{peer.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({peer.distanceMeters}m away)</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                            <span>{peer.ipAddress}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{peer.protocol}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleFavoritePeer(peer.id)}
                          className={`p-2 rounded-xl transition-all ${
                            peer.isFavorite
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          }`}
                          title="Bookmark Favorite Peer"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="space-y-4">
              {/* AI Smart Transfer Recommendation */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-extrabold text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>AI Smart Transfer Recommendation Engine</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Auto-routing large files via Wi-Fi Direct P2P (120 MB/s) and small secret tokens via OmniBeam QR to maximize speed and battery efficiency.
                </p>
              </div>

              {/* Queue Items */}
              <div className="space-y-2.5">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[200px]">
                            {item.fileName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {item.fileSize} • Target: {item.peerName}
                          </span>
                        </div>
                      </div>

                      {item.status === 'active' && (
                        <div className="text-right">
                          <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400 block">
                            ⚡ {item.speedMbPerSec} MB/s
                          </span>
                          <span className="text-[9px] text-slate-400">WebRTC P2P</span>
                        </div>
                      )}

                      {item.status === 'interrupted' && (
                        <button
                          onClick={() => handleResumeTransfer(item.id)}
                          className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Auto Resume</span>
                        </button>
                      )}

                      {item.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {item.status !== 'completed' && (
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 rounded-full ${
                              item.status === 'interrupted' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>{item.progress}% Transferred</span>
                          <span>{item.protocolUsed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">Transfer History Logs</span>
              <div className="space-y-2">
                {queue
                  .filter((q) => q.status === 'completed')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block">{item.fileName}</span>
                          <span className="text-[10px] text-slate-400">
                            {item.fileSize} • Transferred via {item.protocolUsed}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">100% Verified</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
