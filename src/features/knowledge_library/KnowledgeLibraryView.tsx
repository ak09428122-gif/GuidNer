import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Plus,
  Tag,
  Clock,
  Download,
  Share2,
  Brain,
  Filter,
  Check,
  X,
  FileText,
  Code,
  GraduationCap,
  Lightbulb,
  Cpu,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

export interface ResourceItem {
  id: string;
  title: string;
  category: 'AI & Tech' | 'Science & Math' | 'Productivity & Life OS' | 'Health & Mindset' | 'Finance & Career';
  format: 'Interactive Guide' | 'PDF Cheat Sheet' | 'Research Summary' | 'Video Tutorial' | 'Code Reference';
  summary: string;
  keyTakeaways: string[];
  readTime: string;
  tags: string[];
  url?: string;
  isBookmarked: boolean;
  dateAdded: string;
  author?: string;
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Generative AI & Transformer Architectures Master Guide',
    category: 'AI & Tech',
    format: 'Interactive Guide',
    summary: 'Comprehensive breakdown of attention mechanisms, token embeddings, multi-head self-attention, and prompt engineering strategies for Gemini & LLMs.',
    keyTakeaways: [
      'Self-attention scales quadratically with sequence length; flash attention optimizes GPU memory access.',
      'System prompts set structural guardrails; few-shot examples anchor formatting expectations.',
      'RAG (Retrieval-Augmented Generation) combines dense vector search with non-parametric memory.',
    ],
    readTime: '8 min read',
    tags: ['AI', 'Transformers', 'Gemini', 'LLM', 'Machine Learning'],
    url: 'https://ai.google.dev/docs',
    isBookmarked: true,
    dateAdded: '2026-08-01',
    author: 'Google AI Studio Research',
  },
  {
    id: 'res-2',
    title: 'Spaced Repetition & Cognitive Memory Optimization',
    category: 'Productivity & Life OS',
    format: 'Research Summary',
    summary: 'Scientific analysis of the Ebbinghaus Forgetting Curve and SuperMemo SM-2 algorithm for long-term knowledge retention.',
    keyTakeaways: [
      'Reviewing material at increasing intervals (1d, 3d, 7d, 30d) flattens the decay rate.',
      'Active recall creates stronger synaptic pathways than passive re-reading.',
      'Interleaving distinct subjects prevents cognitive fatigue.',
    ],
    readTime: '6 min read',
    tags: ['Study', 'Cognition', 'Anki', 'Memory', 'Productivity'],
    isBookmarked: false,
    dateAdded: '2026-08-02',
    author: 'GuideNer Cognitive Team',
  },
  {
    id: 'res-3',
    title: 'Quantum Computing Fundamentals & Qubit Operations',
    category: 'Science & Math',
    format: 'PDF Cheat Sheet',
    summary: 'A visual formula sheet covering superposition, quantum entanglement, Bloch sphere representation, and Hadamard gates.',
    keyTakeaways: [
      'A qubit state is represented as |Ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.',
      'Quantum speedup stems from parallel state evaluation via wave function interference.',
    ],
    readTime: '10 min study',
    tags: ['Quantum', 'Physics', 'Mathematics', 'Qubits'],
    isBookmarked: true,
    dateAdded: '2026-08-03',
    author: 'MIT Open Learning',
  },
  {
    id: 'res-4',
    title: 'Circadian Biology, Huberman Protocols & Peak Focus',
    category: 'Health & Mindset',
    format: 'Interactive Guide',
    summary: 'Evidence-based protocols for morning sunlight exposure, adenosine clearance, NSDR (Non-Sleep Deep Rest), and deliberate cold exposure.',
    keyTakeaways: [
      '10-15 minutes of morning sunlight triggers cortisol peak and sets nighttime melatonin timer.',
      'Delaying caffeine by 90 minutes prevents afternoon energy slumps.',
      'NSDR sessions restore dopamine levels and reduce cognitive anxiety.',
    ],
    readTime: '5 min read',
    tags: ['Health', 'Circadian', 'Focus', 'Sleep', 'Biohacking'],
    isBookmarked: false,
    dateAdded: '2026-08-04',
    author: 'Stanford Neuroscience',
  },
  {
    id: 'res-5',
    title: 'Personal Financial Freedom & Index Fund Allocation',
    category: 'Finance & Career',
    format: 'Video Tutorial',
    summary: 'Step-by-step roadmap to building an emergency fund, low-cost index fund investing, tax-advantaged accounts, and compounding wealth.',
    keyTakeaways: [
      'The Rule of 72 estimates investment doubling time (72 / annual return rate).',
      'Dollar-cost averaging eliminates emotional market timing traps.',
      'Emergency reserves should cover 3-6 months of essential living expenses.',
    ],
    readTime: '12 min video',
    tags: ['Finance', 'Investing', 'Wealth', 'Index Funds'],
    isBookmarked: false,
    dateAdded: '2026-08-04',
    author: 'Vanguard Academy',
  },
];

interface KnowledgeLibraryViewProps {
  onNavigateAI?: (initialPrompt?: string) => void;
}

export const KnowledgeLibraryView: React.FC<KnowledgeLibraryViewProps> = ({ onNavigateAI }) => {
  const { checkAndTriggerScreenGuide, explainFeature } = useGuidedMode();
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('gn_knowledge_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Resource Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceItem['category']>('AI & Tech');
  const [newFormat, setNewFormat] = useState<ResourceItem['format']>('Interactive Guide');
  const [newSummary, setNewSummary] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newReadTime, setNewReadTime] = useState('5 min read');
  const [newUrl, setNewUrl] = useState('');

  const saveToStorage = (updated: ResourceItem[]) => {
    setResources(updated);
    localStorage.setItem('gn_knowledge_resources', JSON.stringify(updated));
  };

  const toggleBookmark = (id: string) => {
    const updated = resources.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r));
    saveToStorage(updated);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newItem: ResourceItem = {
      id: `res-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      format: newFormat,
      summary: newSummary.trim(),
      keyTakeaways: newTakeaways
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean),
      readTime: newReadTime.trim() || '5 min read',
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      url: newUrl.trim() || undefined,
      isBookmarked: true,
      dateAdded: new Date().toISOString().split('T')[0],
      author: 'User Created',
    };

    saveToStorage([newItem, ...resources]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewTakeaways('');
    setNewTags('');
    setNewUrl('');
  };

  const handleAskAIAboutResource = (res: ResourceItem) => {
    const prompt = `Can you explain the following knowledge resource in detail and answer any questions I might have?\n\nTitle: ${res.title}\nCategory: ${res.category}\nSummary: ${res.summary}\nKey Points:\n${res.keyTakeaways.join('\n')}`;
    if (onNavigateAI) {
      onNavigateAI(prompt);
    }
  };

  const categories = ['All', 'AI & Tech', 'Science & Math', 'Productivity & Life OS', 'Health & Mindset', 'Finance & Career'];
  const formats = ['All', 'Interactive Guide', 'PDF Cheat Sheet', 'Research Summary', 'Video Tutorial', 'Code Reference'];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || res.format === selectedFormat;
    const matchesBookmark = !showOnlyBookmarks || res.isBookmarked;

    return matchesSearch && matchesCategory && matchesFormat && matchesBookmark;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl border border-indigo-500/20">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>KNOWLEDGE HUB & RESOURCE LIBRARY</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Curated Learning & Research Hub</h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed font-medium">
            Explore verified cheat sheets, scientific research summaries, AI protocols, and high-yield guides for continuous intellectual growth.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
          <HelpMeUseButton screenId="library" label="Guide" />
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, cheat sheets, tags, formulas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Bookmarks Filter Button */}
          <button
            onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              showOnlyBookmarks
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Bookmarked ({resources.filter((r) => r.isBookmarked).length})</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider pr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Format Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider pr-1">Format:</span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 border ${
                selectedFormat === fmt
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Badges & Bookmark */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {res.category}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                    {res.format}
                  </span>
                </div>

                <button
                  onClick={() => toggleBookmark(res.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 transition-colors"
                  title={res.isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}
                >
                  <Bookmark className={`w-4 h-4 ${res.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">{res.title}</h3>
                {res.author && (
                  <span className="text-[11px] text-slate-400 font-medium">By {res.author} • {res.readTime}</span>
                )}
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{res.summary}</p>

              {/* Key Takeaways */}
              {res.keyTakeaways.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Key Knowledge Points</span>
                  </div>
                  <ul className="space-y-1.5">
                    {res.keyTakeaways.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="text-indigo-500 font-bold shrink-0">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {res.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    <span>#{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => handleAskAIAboutResource(res)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xs transition-colors flex items-center gap-1.5 border border-purple-500/20"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Ask AI Guide</span>
              </button>

              {res.url && (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Open Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">No Knowledge Resources Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or adding a new resource card.
            </p>
          </div>
        )}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Knowledge Resource</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Advanced Calculus Cheat Sheet & Practice Problems"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="AI & Tech">AI & Tech</option>
                    <option value="Science & Math">Science & Math</option>
                    <option value="Productivity & Life OS">Productivity & Life OS</option>
                    <option value="Health & Mindset">Health & Mindset</option>
                    <option value="Finance & Career">Finance & Career</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="Interactive Guide">Interactive Guide</option>
                    <option value="PDF Cheat Sheet">PDF Cheat Sheet</option>
                    <option value="Research Summary">Research Summary</option>
                    <option value="Video Tutorial">Video Tutorial</option>
                    <option value="Code Reference">Code Reference</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Summary / Overview *</label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Key summary of what this guide or document teaches..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Point 1&#10;Point 2&#10;Point 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Math, Calculus, Formulas"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">URL (Optional)</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Save Knowledge Resource
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
