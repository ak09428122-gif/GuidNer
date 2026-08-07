import React, { useState } from 'react';
import {
  FileText,
  Bookmark,
  Highlighter,
  Search,
  Merge,
  Scissors,
  Archive,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ZoomIn,
  ZoomOut,
  PenTool,
  Check,
} from 'lucide-react';

export const PdfSuiteView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 12;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([1, 4, 8]);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [activeTab, setActiveTab] = useState<'reader' | 'merge_split' | 'compress'>('reader');

  const toggleBookmark = (page: number) => {
    if (bookmarks.includes(page)) {
      setBookmarks(bookmarks.filter((b) => b !== page));
    } else {
      setBookmarks([...bookmarks, page]);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">PDF Pro Reader & Master Suite</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Annotate • Highlight • Bookmarks • Merge & Split • High-Ratio Compression
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reader' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            PDF Reader
          </button>
          <button
            onClick={() => setActiveTab('merge_split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'merge_split' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Merge & Split
          </button>
          <button
            onClick={() => setActiveTab('compress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'compress' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Compress
          </button>
        </div>
      </div>

      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main PDF Viewport */}
          <div className="lg:col-span-3 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHighlighting(!isHighlighting)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    isHighlighting ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <Highlighter className="w-3.5 h-3.5" /> Highlight Mode
                </button>

                <button
                  onClick={() => toggleBookmark(currentPage)}
                  className={`p-1.5 rounded-xl ${
                    bookmarks.includes(currentPage) ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl text-xs font-bold">
                  <button onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}>
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono">{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}>
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Render Canvas Simulated Page */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[500px] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4 max-w-2xl mx-auto" style={{ zoom: `${zoomLevel}%` }}>
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-center">
                  <span className="text-xs font-bold font-mono text-rose-600">CHAPTER {currentPage}: ADVANCED SYSTEM ARCHITECTURE</span>
                  <span className="text-[10px] text-slate-400">GUIDENER OFFICIAL SPECIFICATION</span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  High-Performance Cryptographic Storage & Real-Time Sync
                </h1>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  This document details the core runtime architecture powering the GuideNer Super App engine.
                  Using client-side WebAssembly primitives alongside IndexedDB storage, all user notes, calendar events,
                  and biometric vault credentials are secured with AES-256 GCM encryption.
                </p>

                <div
                  className={`p-4 rounded-2xl border ${
                    isHighlighting
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-serif italic text-slate-800 dark:text-slate-200">
                    "Key Takeaway: The GuideNer offline-first engine guarantees zero data loss even during complete network severance."
                  </p>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-4">
                Page {currentPage} of {totalPages} • Confidential GuideNer Internal Document
              </div>
            </div>
          </div>

          {/* Bookmarks & Search Sidebar */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" /> Search PDF Text
              </h3>
              <input
                type="text"
                placeholder="Find in PDF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-rose-500" /> Bookmarked Pages ({bookmarks.length})
              </h3>
              <div className="space-y-1.5">
                {bookmarks.map((bm) => (
                  <button
                    key={bm}
                    onClick={() => setCurrentPage(bm)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex justify-between items-center transition-all"
                  >
                    <span>Page {bm}</span>
                    <span className="text-[10px] text-rose-600 font-mono">Jump →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'merge_split' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-xl mx-auto shadow-sm">
          <Merge className="w-12 h-12 text-rose-600 mx-auto" />
          <h3 className="font-extrabold text-lg">Merge & Split PDF Files</h3>
          <p className="text-xs text-slate-500">
            Combine multiple PDF files into a single unified document, or extract specific page ranges with one click.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => alert('Select 2 or more PDF files to merge...')}
              className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-md hover:bg-rose-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Select PDFs to Merge
            </button>
            <button
              onClick={() => alert('Select a PDF to split into pages...')}
              className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" /> Split Pages
            </button>
          </div>
        </div>
      )}

      {activeTab === 'compress' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 max-w-xl mx-auto shadow-sm">
          <Archive className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-extrabold text-lg">PDF Compression Engine</h3>
          <p className="text-xs text-slate-500">
            Compress large PDFs down by up to 75% without compromising text clarity or vector typography.
          </p>

          <button
            onClick={() => alert('PDF Compressed! Saved 68% file size.')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-all"
          >
            Compress Active Document
          </button>
        </div>
      )}
    </div>
  );
};
