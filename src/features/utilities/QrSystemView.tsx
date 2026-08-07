import React, { useState } from 'react';
import {
  QrCode,
  Scan,
  Wifi,
  Contact,
  Link,
  Type,
  Download,
  Share2,
  Copy,
  Check,
  Camera,
} from 'lucide-react';

export const QrSystemView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'generate'>('scan');
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'contact' | 'text'>('url');

  // QR Form State
  const [urlInput, setUrlInput] = useState('https://guidener.ai');
  const [wifiSsid, setWifiSsid] = useState('GuideNer_5G');
  const [wifiPass, setWifiPass] = useState('SecretWifiPass2026');
  const [contactName, setContactName] = useState('Alex River');
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-2831');
  const [textInput, setTextInput] = useState('GuideNer Ultra Security Encryption Key');

  // Scanner Result State
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setScanResult('https://guidener.ai/verify?token=GNR-88102-SECURE');
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/30">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">QR & Barcode Pro Hub</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Camera Scanner • WiFi Network QR • vCard Contact QR • Barcode Reader
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('scan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'scan' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => setActiveSubTab('generate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'generate' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Generator
          </button>
        </div>
      </div>

      {activeSubTab === 'scan' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="relative w-64 h-64 mx-auto rounded-3xl border-2 border-dashed border-teal-500/50 bg-slate-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
            <Scan className="w-16 h-16 text-teal-400 animate-bounce" />
            <div className="absolute top-4 left-4 right-4 text-center">
              <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/40">
                ALIGN QR / BARCODE IN FRAME
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulateScan}
            className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-extrabold text-xs shadow-md hover:bg-teal-700 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Camera className="w-4 h-4" /> Scan Code Now
          </button>

          {scanResult && (
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 text-left space-y-2">
              <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase">
                Scan Result Detected:
              </span>
              <p className="font-mono text-xs text-slate-900 dark:text-white break-all">{scanResult}</p>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Generator Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm">Select QR Content Type</h3>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'url', label: 'URL', icon: Link },
                { id: 'wifi', label: 'WiFi', icon: Wifi },
                { id: 'contact', label: 'vCard', icon: Contact },
                { id: 'text', label: 'Text', icon: Type },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setQrType(t.id as any)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold transition-all ${
                      qrType === t.id
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {qrType === 'url' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Website URL</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">WiFi SSID Network Name</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">WiFi Password</label>
                  <input
                    type="password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            )}

            {qrType === 'contact' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Raw Text Message</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs h-24"
                />
              </div>
            )}
          </div>

          {/* Generated QR Preview */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 flex flex-col items-center justify-center shadow-sm">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrType === 'url'
                    ? urlInput
                    : qrType === 'wifi'
                    ? `WIFI:S:${wifiSsid};T:WPA;P:${wifiPass};;`
                    : qrType === 'contact'
                    ? `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nTEL:${contactPhone}\nEND:VCARD`
                    : textInput
                )}`}
                alt="Generated QR Code"
                className="w-48 h-48 rounded-xl"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert('QR Code downloaded as high-res PNG!')}
                className="px-6 py-2.5 rounded-2xl bg-teal-600 text-white font-extrabold text-xs shadow-md hover:bg-teal-700 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
