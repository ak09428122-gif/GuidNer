import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  Smartphone,
  Lock,
  Search,
  Grid,
  List as ListIcon,
  Plus,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Edit2,
  Copy,
  Eye,
  ShieldAlert,
  ChevronRight,
  HardDrive,
  Tag,
  CheckCircle2,
  X,
  File,
} from 'lucide-react';
import { M3Card, M3Button } from '../../shared/components/ui/MaterialComponents';

export interface FileItem {
  id: string;
  name: string;
  category: 'images' | 'videos' | 'documents' | 'audio' | 'archives' | 'apks' | 'encrypted';
  size: string;
  sizeBytes: number;
  updatedAt: string;
  folder?: string;
  tags?: string[];
  isEncrypted?: boolean;
  isHidden?: boolean;
  previewUrl?: string;
}

export const FileManagerView: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showEncryptedVault, setShowEncryptedVault] = useState(false);
  const [vaultPin, setVaultPin] = useState('');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Sample File System State
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'f1',
      name: 'Olympiad_Physics_Notes_2026.pdf',
      category: 'documents',
      size: '4.8 MB',
      sizeBytes: 4800000,
      updatedAt: '2 hours ago',
      folder: 'Study Materials',
      tags: ['Physics', 'Exam'],
    },
    {
      id: 'f2',
      name: 'Lab_Experiment_Diagram.png',
      category: 'images',
      size: '2.1 MB',
      sizeBytes: 2100000,
      updatedAt: 'Yesterday',
      folder: 'Study Materials',
      previewUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      tags: ['Diagram', 'Biology'],
    },
    {
      id: 'f3',
      name: 'Quantum_Mechanics_Lecture.mp4',
      category: 'videos',
      size: '142.5 MB',
      sizeBytes: 142500000,
      updatedAt: '3 days ago',
      folder: 'Lectures',
      tags: ['Video', 'Lecture'],
    },
    {
      id: 'f4',
      name: 'Focus_Binaural_Beats_Alpha.mp3',
      category: 'audio',
      size: '12.4 MB',
      sizeBytes: 12400000,
      updatedAt: '1 week ago',
      folder: 'Audio',
      tags: ['Meditation', 'Focus'],
    },
    {
      id: 'f5',
      name: 'GuideNer_v2.5_Release_Package.apk',
      category: 'apks',
      size: '34.2 MB',
      sizeBytes: 34200000,
      updatedAt: 'Just now',
      folder: 'Downloads',
      tags: ['APK', 'App'],
    },
    {
      id: 'f6',
      name: 'Tax_Statement_Confidential_2026.zip',
      category: 'encrypted',
      size: '8.9 MB',
      sizeBytes: 8900000,
      updatedAt: '2 weeks ago',
      folder: 'Vault',
      isEncrypted: true,
      tags: ['Financial', 'Secret'],
    },
  ]);

  const categories = [
    { id: 'all', label: 'All Files', icon: Folder, count: files.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: files.filter((f) => f.category === 'documents').length },
    { id: 'images', label: 'Images', icon: ImageIcon, count: files.filter((f) => f.category === 'images').length },
    { id: 'videos', label: 'Videos', icon: Film, count: files.filter((f) => f.category === 'videos').length },
    { id: 'audio', label: 'Audio', icon: Music, count: files.filter((f) => f.category === 'audio').length },
    { id: 'apks', label: 'APKs & Apps', icon: Smartphone, count: files.filter((f) => f.category === 'apks').length },
    { id: 'encrypted', label: 'Encrypted Vault', icon: Lock, count: files.filter((f) => f.isEncrypted).length },
  ];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (currentCategory === 'encrypted') return f.isEncrypted && matchesSearch && isVaultUnlocked;
    if (currentCategory !== 'all') return f.category === currentCategory && !f.isEncrypted && matchesSearch;
    return !f.isEncrypted && matchesSearch;
  });

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFile(null);
  };

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (vaultPin === '1234' || vaultPin.length >= 4) {
      setIsVaultUnlocked(true);
      setShowEncryptedVault(false);
    } else {
      alert('Incorrect PIN. Enter 1234 for demo unlock.');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 font-sans text-slate-900 dark:text-white">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Advanced File Manager
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorized Storage • AES Encrypted Folder • Tags & Search
            </p>
          </div>
        </div>

        {/* View Toggle & Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files & tags..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Toggle View Mode"
          >
            {viewMode === 'grid' ? <ListIcon className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Storage Capacity Progress Card */}
      <M3Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
            68%
          </div>
          <div>
            <div className="font-extrabold text-sm">Internal Storage Usage</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              87.4 GB used of 128 GB (40.6 GB Available)
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-indigo-600 w-[40%]" title="Docs & Media" />
            <div className="h-full bg-purple-500 w-[15%]" title="Apps & APKs" />
            <div className="h-full bg-amber-500 w-[13%]" title="System & Encrypted" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Docs 40%</span>
            <span>APKs 15%</span>
            <span>Vault 13%</span>
          </div>
        </div>
      </M3Card>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'encrypted' && !isVaultUnlocked) {
                  setShowEncryptedVault(true);
                } else {
                  setCurrentCategory(cat.id);
                }
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px]">
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* File Grid / List Display */}
      <div className="space-y-4">
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Folder className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Files Found</h3>
            <p className="text-xs text-slate-400">
              {currentCategory === 'encrypted' && !isVaultUnlocked
                ? 'Unlock the Encrypted Vault using PIN 1234 to view secret files.'
                : 'No matching files in this category.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <M3Card
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="p-4 hover:border-indigo-500/50 transition-all cursor-pointer group space-y-3"
              >
                {/* File Thumbnail or Icon Header */}
                <div className="relative w-full h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex items-center justify-center">
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-10 h-10 text-indigo-500 group-hover:scale-110 transition-transform" />
                  )}

                  {file.isEncrypted && (
                    <span className="absolute top-2 right-2 p-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-md">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Info Details */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {file.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{file.size}</span>
                    <span>{file.updatedAt}</span>
                  </div>
                </div>

                {/* Tags */}
                {file.tags && file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </M3Card>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {file.size} • {file.updatedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlock Encrypted Vault Modal */}
      {showEncryptedVault && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleUnlockVault}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base">Encrypted Vault</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEncryptedVault(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your 4-digit Master Security PIN (Demo PIN: 1234)
            </p>

            <input
              type="password"
              maxLength={4}
              value={vaultPin}
              onChange={(e) => setVaultPin(e.target.value)}
              placeholder="• • • •"
              className="w-full p-3.5 text-center text-2xl tracking-widest font-mono rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs shadow-lg"
            >
              Unlock Encrypted Vault
            </button>
          </form>
        </div>
      )}

      {/* File Action Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm truncate pr-2">{selectedFile.name}</h3>
              <button onClick={() => setSelectedFile(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Size:</span>
                <span className="font-mono font-bold">{selectedFile.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="capitalize font-bold">{selectedFile.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Updated:</span>
                <span>{selectedFile.updatedAt}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Sharing ${selectedFile.name}...`);
                  setSelectedFile(null);
                }}
                className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-500/20"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => handleDeleteFile(selectedFile.id)}
                className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
