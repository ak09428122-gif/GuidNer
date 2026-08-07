import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Video,
  Zap,
  RefreshCw,
  Image as GalleryIcon,
  Settings,
  Clock,
  Sparkles,
  X,
  Sliders,
  Grid,
  Sun,
  Download,
  Info,
  ChevronDown,
  Moon,
  User,
  SlidersHorizontal,
  Circle,
  Focus,
  Maximize2,
  Volume2,
  Mic,
  Film,
  Aperture,
  Check,
} from 'lucide-react';
import { M3Button } from '../../shared/components/ui/MaterialComponents';

export type CameraMode = 'night' | 'portrait' | 'photo' | 'video' | 'pro' | 'slow_mo';

export interface ExifData {
  iso: number;
  shutter: string;
  aperture: string;
  focusDistance: string;
  whiteBalance: string;
  resolution: string;
  colorProfile: string;
  fps: number;
  ev: string;
}

export const ProCameraView: React.FC = () => {
  const [mode, setMode] = useState<CameraMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [flash, setFlash] = useState<'off' | 'auto' | 'on'>('off');
  const [timer, setTimer] = useState<0 | 3 | 10>(0);
  const [timerCountdown, setTimerCountdown] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '16:9' | '1:1' | 'FULL'>('4:3');
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState(true);

  // Focus point state
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [exposureVal, setExposureVal] = useState<number>(0);

  // Pro Monitoring Overlay States
  const [showHistogram, setShowHistogram] = useState(false);
  const [showZebra, setShowZebra] = useState(false);
  const [showPeaking, setShowPeaking] = useState(false);
  const [showFalseColor, setShowFalseColor] = useState(false);
  const [showAudioMeter, setShowAudioMeter] = useState(false);
  const [isRawMode, setIsRawMode] = useState(false);
  const [isLogMode, setIsLogMode] = useState(false);

  // Pro Controls (Hidden by default, expandable in Pro mode or via settings)
  const [showProDrawer, setShowProDrawer] = useState(false);
  const [iso, setIso] = useState<number>(100);
  const [shutterSpeed, setShutterSpeed] = useState<string>('1/250s');
  const [focusDistance, setFocusDistance] = useState<number>(0.8);
  const [wbKelvin, setWbKelvin] = useState<number>(5600);
  const [ev, setEv] = useState<number>(0);

  // Flash Effect on Capture
  const [shutterFlash, setShutterFlash] = useState(false);

  // Gallery State
  const [capturedMedia, setCapturedMedia] = useState<
    { id: string; url: string; type: 'image' | 'video'; timestamp: string; exif: ExifData }[]
  >([
    {
      id: 'cap-1',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      timestamp: 'Today 11:20 AM',
      exif: {
        iso: 100,
        shutter: '1/1000s',
        aperture: 'f/1.8',
        focusDistance: '1.2m',
        whiteBalance: '5500K Daylight',
        resolution: '4032 x 3024',
        colorProfile: 'DCI-P3',
        fps: 0,
        ev: '+0.0 EV',
      },
    },
    {
      id: 'cap-2',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      timestamp: 'Yesterday 06:45 PM',
      exif: {
        iso: 200,
        shutter: '1/4000s',
        aperture: 'f/2.2',
        focusDistance: 'Infinity',
        whiteBalance: '6000K Golden Hour',
        resolution: '4032 x 3024',
        colorProfile: 'sRGB',
        fps: 0,
        ev: '-0.3 EV',
      },
    },
  ]);
  const [selectedMedia, setSelectedMedia] = useState<(typeof capturedMedia)[0] | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Video Stream Canvas / Video Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stream Initialization
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: mode === 'video',
      })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        // Live camera unavailable/denied fallback
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facing, mode]);

  // Record timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordDuration((prev) => prev + 1), 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Viewfinder Tap for Focus & Metering
  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPoint({ x, y });

    // Auto dismiss focus box after 3.5s
    setTimeout(() => {
      setFocusPoint(null);
    }, 3500);
  };

  const handleCaptureTrigger = () => {
    if (timer > 0 && !isRecording) {
      setTimerCountdown(timer);
      const countdownInterval = setInterval(() => {
        setTimerCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            executeCapture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  const executeCapture = () => {
    if (mode === 'video' || mode === 'slow_mo') {
      setIsRecording(!isRecording);
      if (isRecording) {
        saveCapturedMedia('video');
      }
    } else {
      // Trigger shutter flash animation
      setShutterFlash(true);
      setTimeout(() => setShutterFlash(false), 150);
      saveCapturedMedia('image');
    }
  };

  const saveCapturedMedia = (type: 'image' | 'video') => {
    const newMedia = {
      id: `cap-${Date.now()}`,
      url:
        type === 'video'
          ? 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      type,
      timestamp: 'Just now',
      exif: {
        iso,
        shutter: shutterSpeed,
        aperture: 'f/1.8',
        focusDistance: `${(focusDistance * 3).toFixed(1)}m`,
        whiteBalance: `${wbKelvin}K`,
        resolution: type === 'video' ? '4K 60fps' : '12MP Ultra-HD',
        colorProfile: 'Standard HDR',
        fps: type === 'video' ? 60 : 0,
        ev: `${ev >= 0 ? '+' : ''}${ev.toFixed(1)} EV`,
      },
    };
    setCapturedMedia([newMedia, ...capturedMedia]);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const modesList: { id: CameraMode; label: string }[] = [
    { id: 'night', label: 'NIGHT' },
    { id: 'portrait', label: 'PORTRAIT' },
    { id: 'photo', label: 'PHOTO' },
    { id: 'video', label: 'VIDEO' },
    { id: 'pro', label: 'PRO' },
    { id: 'slow_mo', label: 'SLOW-MO' },
  ];

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Visual Shutter Flash Effect */}
      {shutterFlash && <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity" />}

      {/* Timer Countdown Big Display */}
      {timerCountdown !== null && (
        <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <span className="text-8xl font-black text-white animate-ping drop-shadow-2xl">{timerCountdown}</span>
        </div>
      )}

      {/* Top Floating Camera Controls (Minimalistic & Transparent) */}
      <div className="absolute top-0 inset-x-0 z-30 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Flash Toggle */}
        <button
          onClick={() => setFlash(flash === 'off' ? 'auto' : flash === 'auto' ? 'on' : 'off')}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
            flash !== 'off' ? 'bg-amber-400 text-black font-bold' : 'bg-black/40 text-white/90 hover:bg-black/60'
          }`}
          title="Flash Mode"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>

        {/* Timer Toggle */}
        <button
          onClick={() => setTimer(timer === 0 ? 3 : timer === 3 ? 10 : 0)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1 ${
            timer > 0 ? 'bg-amber-400 text-black font-bold' : 'bg-black/40 text-white/90 hover:bg-black/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{timer === 0 ? 'Off' : `${timer}s`}</span>
        </button>

        {/* Aspect Ratio Toggle */}
        <button
          onClick={() => setAspectRatio(aspectRatio === '4:3' ? '16:9' : aspectRatio === '16:9' ? '1:1' : '4:3')}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 text-white/90 hover:bg-black/60 backdrop-blur-md transition-all"
        >
          {aspectRatio}
        </button>

        {/* Grid Overlay Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
            showGrid ? 'bg-white/20 text-white' : 'bg-black/40 text-white/50 hover:bg-black/60'
          }`}
          title="Grid Lines"
        >
          <Grid className="w-5 h-5" />
        </button>

        {/* Pro Settings Drawer Toggle */}
        <button
          onClick={() => setShowProDrawer(!showProDrawer)}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
            showProDrawer || mode === 'pro'
              ? 'bg-indigo-600 text-white'
              : 'bg-black/40 text-white/90 hover:bg-black/60'
          }`}
          title="Manual Controls"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Pro Monitoring Quick Toolbar (Chips row for Histogram, Zebra, Peaking, False Color, Audio Meter, RAW, LOG) */}
      <div className="absolute top-16 inset-x-0 z-30 px-4 py-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto bg-black/20 backdrop-blur-xs">
        <button
          onClick={() => setShowHistogram(!showHistogram)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            showHistogram
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          HISTOGRAM
        </button>

        <button
          onClick={() => setShowZebra(!showZebra)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            showZebra
              ? 'bg-amber-500 border-amber-300 text-black shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          ZEBRA
        </button>

        <button
          onClick={() => setShowPeaking(!showPeaking)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            showPeaking
              ? 'bg-emerald-500 border-emerald-300 text-black shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          PEAKING
        </button>

        <button
          onClick={() => setShowFalseColor(!showFalseColor)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            showFalseColor
              ? 'bg-purple-600 border-purple-400 text-white shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          FALSE COLOR
        </button>

        <button
          onClick={() => setShowAudioMeter(!showAudioMeter)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            showAudioMeter || mode === 'video'
              ? 'bg-cyan-600 border-cyan-400 text-white shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          AUDIO dB
        </button>

        <button
          onClick={() => setIsRawMode(!isRawMode)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            isRawMode
              ? 'bg-rose-600 border-rose-400 text-white shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          RAW DNG
        </button>

        <button
          onClick={() => setIsLogMode(!isLogMode)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            isLogMode
              ? 'bg-amber-600 border-amber-400 text-white shadow-md'
              : 'bg-black/50 border-white/20 text-white/70 hover:bg-black/70'
          }`}
        >
          4K LOG
        </button>
      </div>

      {/* Main Full-Screen Viewfinder Canvas */}
      <div
        className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden cursor-crosshair"
        onClick={handleViewfinderClick}
      >
        {/* Video Camera Stream / Simulation */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-all duration-300 ${
            facing === 'user' ? 'scale-x-[-1]' : ''
          } ${showFalseColor ? 'hue-rotate-180 contrast-150 brightness-110' : ''}`}
        />

        {/* Focus Peaking Highlight Overlay */}
        {showPeaking && (
          <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/40 mix-blend-screen shadow-[inset_0_0_50px_rgba(52,211,153,0.3)] flex items-center justify-center">
            <div className="text-[10px] font-mono text-emerald-400 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md absolute top-28 left-4">
              FOCUS PEAKING HIGH (GREEN EDGE)
            </div>
          </div>
        )}

        {/* Zebra Overexposure Pattern Overlay */}
        {showZebra && (
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(251,191,36,0.25)_10px,rgba(251,191,36,0.25)_20px)]">
            <div className="text-[10px] font-mono text-amber-400 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md absolute top-28 right-4">
              ZEBRA 70% HIGHLIGHTS
            </div>
          </div>
        )}

        {/* RGB Luminance Histogram Mini Overlay */}
        {showHistogram && (
          <div className="absolute top-28 left-4 z-20 w-44 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-[10px] font-mono text-slate-300 space-y-1 shadow-xl pointer-events-none">
            <div className="flex justify-between items-center text-slate-400 font-bold">
              <span>RGB LUMINANCE</span>
              <span className="text-amber-400">EV 0</span>
            </div>
            <div className="h-12 w-full flex items-end gap-0.5 border-b border-slate-800 pb-0.5">
              {[15, 30, 45, 70, 95, 80, 60, 40, 25, 50, 85, 90, 65, 35, 20, 10].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-indigo-500 via-cyan-400 to-amber-300 rounded-xs"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Live Audio Level Meter Sidebar Overlay */}
        {(showAudioMeter || mode === 'video') && (
          <div className="absolute right-4 top-28 bottom-20 z-20 w-3 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex flex-col justify-end items-center gap-1 pointer-events-none">
            {[90, 80, 70, 60, 50, 40, 30, 20, 10].map((level, idx) => (
              <div
                key={idx}
                className={`w-full rounded-full transition-all ${
                  level > 80 ? 'bg-rose-500' : level > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ height: `${isRecording ? Math.random() * 100 : level}%` }}
              />
            ))}
          </div>
        )}

        {/* Fallback Ambient Visual if No Active Video Stream */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Composition Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10">
            <div className="border-r border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-b border-white/15" />
            <div className="border-r border-white/15" />
            <div className="border-r border-white/15" />
            <div className="border-transparent" />
          </div>
        )}

        {/* Tap-to-Focus Yellow Ring Ring Indicator */}
        {focusPoint && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{ left: focusPoint.x, top: focusPoint.y }}
          >
            <div className="w-16 h-16 rounded-full border-2 border-amber-400 border-dashed animate-spin flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="absolute top-0 right-[-32px] h-16 flex flex-col items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
          </div>
        )}

        {/* Live Recording Indicator Pill */}
        {isRecording && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full bg-rose-600 text-white font-mono font-bold text-xs shadow-xl flex items-center gap-2 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>REC {formatSeconds(recordDuration)}</span>
          </div>
        )}

        {/* Floating Zoom Switchers (.5x, 1x, 2x, 5x) */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-3 pointer-events-auto">
          {[0.5, 1, 2, 5].map((z) => (
            <button
              key={z}
              onClick={(e) => {
                e.stopPropagation();
                setZoom(z);
              }}
              className={`w-9 h-9 rounded-full text-xs font-bold transition-all backdrop-blur-md flex items-center justify-center ${
                zoom === z
                  ? 'bg-amber-400 text-black scale-110 shadow-lg'
                  : 'bg-black/50 text-white/90 hover:bg-black/70 border border-white/10'
              }`}
            >
              {z === 0.5 ? '.5' : z}x
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Pro Settings Drawer (Only opens when triggered) */}
      {(showProDrawer || mode === 'pro') && (
        <div className="z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800/80 pb-2">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Aperture className="w-4 h-4" /> Pro Camera Controls
            </span>
            <button
              onClick={() => setShowProDrawer(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* ISO */}
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>ISO</span>
                <span className="text-amber-400 font-mono">{iso}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3200"
                step="50"
                value={iso}
                onChange={(e) => setIso(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Focus */}
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Focus</span>
                <span className="text-emerald-400 font-mono">{(focusDistance * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={focusDistance}
                onChange={(e) => setFocusDistance(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* White Balance */}
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>WB (Kelvin)</span>
                <span className="text-cyan-400 font-mono">{wbKelvin}K</span>
              </div>
              <input
                type="range"
                min="2500"
                max="9000"
                step="100"
                value={wbKelvin}
                onChange={(e) => setWbKelvin(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* EV Exposure */}
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Exposure</span>
                <span className="text-purple-400 font-mono">{ev >= 0 ? `+${ev}` : ev} EV</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.2"
                value={ev}
                onChange={(e) => setEv(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Smartphone Camera Dock Controls */}
      <div className="z-30 bg-black/95 border-t border-white/10 pt-3 pb-6 px-6 flex flex-col items-center gap-4">
        {/* Horizontal Camera Modes Selector Carousel */}
        <div className="flex items-center gap-6 overflow-x-auto max-w-full no-scrollbar px-4 py-1 text-xs font-extrabold tracking-wider">
          {modesList.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                if (m.id === 'pro') setShowProDrawer(true);
              }}
              className={`whitespace-nowrap transition-all duration-200 ${
                mode === m.id
                  ? 'text-amber-400 font-black scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Primary Controls Row: Gallery - Shutter - Flip Camera */}
        <div className="w-full max-w-md flex items-center justify-between px-6">
          {/* Recent Gallery Media Thumbnail Preview */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-amber-400 transition-all group active:scale-95 bg-slate-900 shadow-lg"
          >
            {capturedMedia.length > 0 ? (
              <img
                src={capturedMedia[0].url}
                alt="Recent"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <GalleryIcon className="w-5 h-5" />
              </div>
            )}
          </button>

          {/* Central Authentic Smartphone Shutter Button */}
          <button
            onClick={handleCaptureTrigger}
            className={`relative w-20 h-20 rounded-full border-[5px] flex items-center justify-center transition-transform active:scale-90 ${
              isRecording
                ? 'border-rose-500'
                : 'border-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
            }`}
          >
            <div
              className={`transition-all duration-200 ${
                isRecording
                  ? 'w-8 h-8 rounded-lg bg-rose-600 animate-pulse'
                  : mode === 'video' || mode === 'slow_mo'
                  ? 'w-16 h-16 rounded-full bg-rose-600'
                  : 'w-16 h-16 rounded-full bg-white active:bg-slate-200'
              }`}
            />
          </button>

          {/* Flip Camera Facing Button */}
          <button
            onClick={() => setFacing(facing === 'environment' ? 'user' : 'environment')}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center border border-white/10 transition-all shadow-lg"
            title="Switch Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gallery & Vault Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 relative overflow-hidden text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <GalleryIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base">Camera Vault & Gallery</h3>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Media Preview */}
              <div className="space-y-3">
                {selectedMedia || capturedMedia[0] ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-4/3 flex items-center justify-center">
                    <img
                      src={(selectedMedia || capturedMedia[0]).url}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 text-[10px] font-mono text-amber-400 backdrop-blur-md">
                      {(selectedMedia || capturedMedia[0]).timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">No photos or videos captured yet.</div>
                )}

                {/* Thumbnails row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {capturedMedia.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMedia(m)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        (selectedMedia?.id || capturedMedia[0]?.id) === m.id
                          ? 'border-amber-400 scale-105'
                          : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={m.url} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Metadata Details */}
              {(selectedMedia || capturedMedia[0]) && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="font-sans font-extrabold text-amber-400 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Photo Information & EXIF</span>
                  </div>

                  <div className="space-y-2 pt-1 text-slate-300">
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">ISO:</span>
                      <span className="text-amber-400 font-bold">{(selectedMedia || capturedMedia[0]).exif.iso}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">Shutter Speed:</span>
                      <span className="text-slate-200">{(selectedMedia || capturedMedia[0]).exif.shutter}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">Aperture:</span>
                      <span className="text-slate-200">{(selectedMedia || capturedMedia[0]).exif.aperture}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">White Balance:</span>
                      <span className="text-cyan-400">{(selectedMedia || capturedMedia[0]).exif.whiteBalance}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">Resolution:</span>
                      <span className="text-indigo-300 font-bold">
                        {(selectedMedia || capturedMedia[0]).exif.resolution}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-500">Exposure Value:</span>
                      <span className="text-purple-400">{(selectedMedia || capturedMedia[0]).exif.ev}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <M3Button variant="primary" size="sm" className="w-full font-bold">
                      <Download className="w-4 h-4" /> Download Original
                    </M3Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
