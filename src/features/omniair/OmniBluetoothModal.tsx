import React, { useState } from 'react';
import { Bluetooth, Radio, X, CheckCircle, RefreshCw, Users, ShieldAlert, Send } from 'lucide-react';

interface OmniBluetoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendNearbyPing: (msgText: string) => void;
}

export const OmniBluetoothModal: React.FC<OmniBluetoothModalProps> = ({
  isOpen,
  onClose,
  onSendNearbyPing,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [pingText, setPingText] = useState('');
  const [discoveredPeers, setDiscoveredPeers] = useState<
    { id: string; name: string; deviceType: string; signal: string }[]
  >([
    { id: 'ble-1', name: 'Galaxy Tab (Library Group)', deviceType: 'Tablet', signal: '-42 dBm' },
    { id: 'ble-2', name: 'MacBook Air (Study Room 3)', deviceType: 'Laptop', signal: '-58 dBm' },
    { id: 'ble-3', name: 'Pixel 8 (Prof. Davis)', deviceType: 'Phone', signal: '-65 dBm' },
  ]);

  if (!isOpen) return null;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDiscoveredPeers((prev) => [
        ...prev,
        {
          id: `ble-${Date.now()}`,
          name: 'GuideNer Peer #' + Math.floor(Math.random() * 900 + 100),
          deviceType: 'Android BLE',
          signal: '-38 dBm',
        },
      ]);
      setIsScanning(false);
    }, 1500);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pingText) return;
    onSendNearbyPing(pingText);
    setPingText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>OmniBluetooth Engine</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold">
                  BLE Mesh
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Nearby silent chat & emergency broadcast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-200/50 dark:bg-slate-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Scanning Status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{discoveredPeers.length} Discovered Bluetooth Peers</span>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Scan Nearby'}</span>
            </button>
          </div>

          {/* Peer list */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Discovered BLE Devices
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {discoveredPeers.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">{peer.name}</span>
                      <span className="text-[10px] text-slate-400">{peer.deviceType}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{peer.signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Form */}
          <form onSubmit={handleBroadcast} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Broadcast Nearby Message / Silent Ping
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Type message to broadcast to nearby peers..."
                value={pingText}
                onChange={(e) => setPingText(e.target.value)}
                className="flex-1 p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ping</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
