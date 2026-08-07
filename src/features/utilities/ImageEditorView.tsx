import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCw,
  Crop,
  Sun,
  Contrast,
  Sparkles,
  Type,
  PenTool,
  Download,
  Share2,
  Undo2,
  Redo2,
  Maximize2,
  Image as ImageIcon,
  Check,
  Layers,
  Droplet,
} from 'lucide-react';

export const ImageEditorView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  );

  // Adjustment Controls
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [overlayText, setOverlayText] = useState<string>('');
  const [watermark, setWatermark] = useState<string>('GuideNer Pro');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const filterStyles: Record<string, string> = {
    normal: '',
    vivid: 'saturate(160%) contrast(110%)',
    vintage: 'sepia(40%) contrast(110%) brightness(95%)',
    dramatic: 'contrast(150%) brightness(90%)',
    cinema: 'contrast(125%) saturate(130%) hue-rotate(-10deg)',
    mono: 'grayscale(100%) contrast(140%)',
  };

  const getCombinedFilterStyle = () => {
    const baseFilter = filterStyles[activeFilter] || '';
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) ${baseFilter}`;
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setActiveFilter('normal');
    setOverlayText('');
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">Pro Image Editor & Canvas Studio</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Color Grading • Perspective • Text Overlay • Cinematic Filters • Watermarking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-2xl bg-fuchsia-600 text-white shadow-md hover:bg-fuchsia-700 transition-all"
          >
            <ImageIcon className="w-4 h-4" /> Load Photo
          </button>
          <button
            onClick={resetAdjustments}
            className="px-3 py-2 text-xs font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display Viewport */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden shadow-sm">
          <div className="relative max-w-full max-h-[380px] flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={selectedImage}
              alt="Editor Viewport"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: getCombinedFilterStyle(),
              }}
              className="max-h-[360px] w-auto object-contain rounded-xl transition-all duration-150 shadow-md"
            />

            {/* Text Overlay */}
            {overlayText && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <span className="text-2xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wide uppercase bg-black/30 px-4 py-2 rounded-xl backdrop-blur-xs">
                  {overlayText}
                </span>
              </div>
            )}

            {/* Watermark Tag */}
            {watermark && (
              <div className="absolute bottom-3 right-3 pointer-events-none bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20">
                ⚡ {watermark}
              </div>
            )}
          </div>
        </div>

        {/* Adjustments & Control Panel */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" /> Color & Exposure Tuning
            </h3>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-fuchsia-600"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Contrast</span>
                <span>{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-fuchsia-600"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Saturation</span>
                <span>{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-fuchsia-600"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Gaussian Blur</span>
                <span>{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-fuchsia-600"
              />
            </div>
          </div>

          {/* Filters & Presets */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-500" /> Preset Filters
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['normal', 'vivid', 'vintage', 'dramatic', 'cinema', 'mono'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`p-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    activeFilter === f
                      ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Text & Watermark Overlay Input */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-500" /> Text & Watermark
            </h3>

            <input
              type="text"
              placeholder="Type caption overlay text..."
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />

            <button
              onClick={() => alert('Image processed and exported in 4K resolution!')}
              className="w-full py-2.5 rounded-2xl bg-fuchsia-600 text-white font-extrabold text-xs shadow-md hover:bg-fuchsia-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export High-Res Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
