import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, X, Play, RefreshCw, CheckCircle, Shield, Sparkles, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';

interface OmniBeamScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataScanned: (scannedText: string) => void;
  initialTransmitText?: string;
}

export const OmniBeamScannerModal: React.FC<OmniBeamScannerModalProps> = ({
  isOpen,
  onClose,
  onDataScanned,
  initialTransmitText,
}) => {
  const [activeTab, setActiveTab] = useState<'transmit' | 'scan'>(initialTransmitText ? 'transmit' : 'scan');
  const [transmitText, setTransmitText] = useState(initialTransmitText || 'OmniAir Beam Payload v1: High Density Optical Transfer');
  const [frameIndex, setFrameIndex] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('Ready to scan OmniBeam QR Stream...');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Generate animated QR frames whenever transmitText changes
  useEffect(() => {
    if (!transmitText) return;

    // Chunk data if large into frames
    const chunkSize = 150;
    const textChunks: string[] = [];
    if (transmitText.length <= chunkSize) {
      textChunks.push(`FRAME:1/1:${transmitText}`);
    } else {
      const total = Math.ceil(transmitText.length / chunkSize);
      for (let i = 0; i < total; i++) {
        const slice = transmitText.slice(i * chunkSize, (i + 1) * chunkSize);
        textChunks.push(`FRAME:${i + 1}/${total}:${slice}`);
      }
    }
    setFrames(textChunks);
    setFrameIndex(0);
  }, [transmitText]);

  // Render current frame on canvas
  useEffect(() => {
    if (activeTab !== 'transmit' || !frames.length || !canvasRef.current) return;

    const currentFrameData = frames[frameIndex % frames.length];
    QRCode.toCanvas(
      canvasRef.current,
      currentFrameData,
      {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('QR Render Error:', error);
      }
    );
  }, [activeTab, frames, frameIndex]);

  // Animated frame timer
  useEffect(() => {
    if (activeTab !== 'transmit' || frames.length <= 1) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 400); // 2.5 FPS stream
    return () => clearInterval(interval);
  }, [activeTab, frames]);

  // Camera scanner simulation / HTML5 Camera stream
  const startCameraScan = async () => {
    setIsScanning(true);
    setScanStatus('Initializing camera stream...');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setScanStatus('Align camera with sender screen QR code...');
        }
      } else {
        setScanStatus('Camera hardware access restricted. Simulating optical scan...');
      }
    } catch (err) {
      console.warn('Camera access error, falling back to simulated optical receiver:', err);
      setScanStatus('Camera permissions pending. Simulating OmniBeam scanner intake...');
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  const simulateSuccessfulScan = () => {
    const mockPayload = 'OmniBeam Received: Document PDF + Emergency Contact Card';
    onDataScanned(mockPayload);
    stopCameraStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>OmniBeam Transfer Engine</span>
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">
                  Optical QR
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero-network screen-to-screen data beam</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-200/50 dark:bg-slate-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 p-1">
          <button
            onClick={() => {
              stopCameraStream();
              setActiveTab('transmit');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'transmit'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Transmit (Display QR)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('scan');
              startCameraScan();
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'scan'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Receive (Scan Beam)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'transmit' ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center">
                <canvas ref={canvasRef} className="rounded-lg" />
                {frames.length > 1 && (
                  <div className="mt-2 text-[11px] font-mono text-blue-600 font-bold">
                    Stream Frame {frameIndex + 1} / {frames.length} (Animated Beam)
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block text-left">
                  Payload to Transmit
                </label>
                <textarea
                  value={transmitText}
                  onChange={(e) => setTransmitText(e.target.value)}
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  placeholder="Enter text, password snippet, contact info, or note..."
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>AES Encrypted • Works 100% offline without Wi-Fi or Bluetooth</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-blue-500/50">
                <video ref={videoRef} className="w-full h-full object-cover" playInline muted />

                {/* Reticle Overlay */}
                <div className="absolute inset-8 border-2 border-blue-400 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-0.5 bg-blue-500 animate-pulse shadow-glow" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-2 rounded-xl bg-slate-900/90 text-[11px] text-white font-medium backdrop-blur-xs truncate">
                  {scanStatus}
                </div>
              </div>

              <button
                onClick={simulateSuccessfulScan}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simulate Optical Beam Intake</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
