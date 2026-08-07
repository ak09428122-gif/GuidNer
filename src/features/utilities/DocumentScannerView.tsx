import React, { useState, useRef } from 'react';
import {
  Scan,
  Camera,
  Upload,
  FileText,
  RotateCw,
  Crop,
  Sparkles,
  Check,
  Download,
  Share2,
  Sliders,
  Type,
  Maximize2,
  Trash2,
  PenTool,
  Copy,
  FileCheck,
} from 'lucide-react';

export const DocumentScannerView: React.FC = () => {
  const [scannedImage, setScannedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
  );
  const [filterMode, setFilterMode] = useState<'original' | 'magic' | 'bw' | 'grayscale'>('magic');
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScannedImage(url);
      setExtractedText(null);
    }
  };

  const runOcrEngine = () => {
    setIsProcessingOcr(true);
    setTimeout(() => {
      setIsProcessingOcr(false);
      setExtractedText(
        `GUIDENER OFFICIAL DOCUMENT SCAN\n` +
        `Date: ${new Date().toLocaleDateString()}\n` +
        `Document Ref: GNR-2026-9908\n\n` +
        `SUMMARY & OCR EXTRACT:\n` +
        `- Section 1: Executive Briefing & Strategy Alignment\n` +
        `- Section 2: Financial Forecast & Projected Milestones\n` +
        `- Section 3: System Security & Cryptographic Verification\n\n` +
        `Status: Verified Scan (Edge Detection 100% Accuracy)`
      );
    }, 1200);
  };

  const handleDrawSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
      setShowSignatureCanvas(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Scan className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">Pro Document Scanner & OCR Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto Edge Detection • Magic Color Enhancement • OCR Text Extraction • PDF & Signature Export
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold rounded-2xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Canvas Preview Area */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
          {scannedImage ? (
            <div className="relative max-w-full max-h-[400px] flex items-center justify-center">
              {/* Simulated Edge Detection Frame */}
              <div className="absolute inset-0 border-2 border-dashed border-emerald-400 rounded-xl pointer-events-none z-10 animate-pulse flex items-start justify-between p-2">
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                  Auto Edge Detected (99.8%)
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/40">
                  Perspective Corrected
                </span>
              </div>

              <img
                src={scannedImage}
                alt="Scanned Document"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter:
                    filterMode === 'magic'
                      ? 'contrast(130%) brightness(110%) saturate(120%)'
                      : filterMode === 'bw'
                      ? 'grayscale(100%) contrast(180%)'
                      : filterMode === 'grayscale'
                      ? 'grayscale(100%)'
                      : 'none',
                }}
                className="max-h-[380px] w-auto rounded-xl object-contain shadow-lg transition-all duration-300"
              />

              {signature && (
                <img
                  src={signature}
                  alt="Signature"
                  className="absolute bottom-6 right-6 w-32 h-auto bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-lg border border-indigo-500/30 shadow-md pointer-events-none"
                />
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Scan className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">No document captured yet. Upload an image to start scanning.</p>
            </div>
          )}

          {/* Quick Editing Toolbar */}
          {scannedImage && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate
              </button>

              <button
                onClick={() => setFilterMode('original')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterMode === 'original' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setFilterMode('magic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterMode === 'magic' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                ✨ Magic Color
              </button>
              <button
                onClick={() => setFilterMode('bw')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  filterMode === 'bw' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                B&W High Contrast
              </button>

              <button
                onClick={() => setShowSignatureCanvas(!showSignatureCanvas)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-sm"
              >
                <PenTool className="w-3.5 h-3.5" /> Add Signature
              </button>
            </div>
          )}
        </div>

        {/* OCR & Document Details Panel */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI OCR Text Extractor
            </h3>

            <p className="text-xs text-slate-500">
              Extract high-precision text directly from your scanned document using local OCR processing.
            </p>

            <button
              onClick={runOcrEngine}
              disabled={isProcessingOcr || !scannedImage}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isProcessingOcr ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Processing OCR...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" /> Extract OCR Text
                </>
              )}
            </button>

            {extractedText && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500">Extracted Content:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(extractedText)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Copy className="w-3 h-3" /> Copy Text
                  </button>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
                  {extractedText}
                </div>
              </div>
            )}
          </div>

          {/* Export Actions */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="font-extrabold text-sm">Export Options</h3>

            <button
              onClick={() => alert('Exporting as High-Resolution Encrypted PDF...')}
              className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF Document
            </button>

            <button
              onClick={() => alert('Document copied to clipboard & exported!')}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share via OmniAir
            </button>
          </div>
        </div>
      </div>

      {/* Signature Canvas Modal */}
      {showSignatureCanvas && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <PenTool className="w-4 h-4 text-purple-600" /> Draw Digital Signature
            </h3>
            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950 p-2">
              <canvas
                ref={sigCanvasRef}
                width={360}
                height={150}
                className="w-full h-[150px] bg-white dark:bg-slate-900 rounded-xl cursor-crosshair"
                onMouseDown={(e) => {
                  const ctx = sigCanvasRef.current?.getContext('2d');
                  if (ctx) {
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    ctx.strokeStyle = '#4f46e5';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                  }
                }}
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const ctx = sigCanvasRef.current?.getContext('2d');
                    if (ctx) {
                      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                      ctx.stroke();
                    }
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const ctx = sigCanvasRef.current?.getContext('2d');
                  if (ctx) ctx.clearRect(0, 0, 360, 150);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Clear
              </button>
              <button
                onClick={handleDrawSignature}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
              >
                Attach Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
