import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Bookmark,
  History,
  Download,
  Shield,
  EyeOff,
  BookOpen,
  Plus,
  X,
  ExternalLink,
  Lock,
  Share2,
  CheckCircle,
  FileText,
  Layers,
  Languages,
  Monitor,
  Smartphone,
  Sparkles,
  Trash2,
  Play,
  Image as ImageIcon,
  Check,
  Copy,
  ChevronDown,
  Filter,
  Folder,
  Bell,
  Maximize2,
  ListPlus,
  Compass,
  AlertCircle,
  Video,
} from 'lucide-react';
import { BrowserBookmark, BrowserHistoryItem, DownloadTask } from '../../core/database/schema';
import { offlineDB } from '../../core/database/indexedDB';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface OmniBrowserViewProps {
  onSaveToVault?: (title: string, url: string) => void;
  onSaveToStudy?: (title: string, content: string) => void;
  onSaveToDownloads?: (task: DownloadTask) => void;
  onShareToOmniAir?: (url: string) => void;
}

export type TabGroup = 'General' | 'Work' | 'Study' | 'Media';

export interface TabItem {
  id: string;
  title: string;
  url: string;
  isIncognito: boolean;
  isReaderMode: boolean;
  isDesktopMode: boolean;
  tabGroup: TabGroup;
  historyStack: string[];
  historyIndex: number;
  previewType?: 'web' | 'pdf' | 'image' | 'video';
}

export interface ReadingItem {
  id: string;
  title: string;
  url: string;
  addedAt: string;
  isRead: boolean;
}

const PRESET_TOP_SITES = [
  { name: 'Google', url: 'https://www.google.com/search?igu=1', icon: '🔍', category: 'Search' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Main_Page', icon: '📚', category: 'Study' },
  { name: 'Khan Academy', url: 'https://www.khanacademy.org', icon: '🎓', category: 'Study' },
  { name: 'GitHub', url: 'https://github.com', icon: '💻', category: 'Work' },
  { name: 'PDF Sample Doc', url: 'https://www.w3.org/W3C/DesignIssues/PDF.pdf', icon: '📄', category: 'Media' },
  { name: 'Video Player Demo', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', icon: '🎬', category: 'Media' },
];

export const OmniBrowserView: React.FC<OmniBrowserViewProps> = ({
  onSaveToVault,
  onSaveToStudy,
  onSaveToDownloads,
  onShareToOmniAir,
}) => {
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  // Tabs state
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-1',
      title: 'GuideNer Knowledge Hub',
      url: 'https://en.wikipedia.org/wiki/Main_Page',
      isIncognito: false,
      isReaderMode: false,
      isDesktopMode: false,
      tabGroup: 'General',
      historyStack: ['https://en.wikipedia.org/wiki/Main_Page'],
      historyIndex: 0,
      previewType: 'web',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isTabOverviewOpen, setIsTabOverviewOpen] = useState(false);
  const [tabGroupFilter, setTabGroupFilter] = useState<TabGroup | 'All'>('All');

  // URL & Navigation State
  const [urlInput, setUrlInput] = useState<string>('https://en.wikipedia.org/wiki/Main_Page');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Overlays & Managers
  const [bookmarks, setBookmarks] = useState<BrowserBookmark[]>([]);
  const [history, setHistory] = useState<BrowserHistoryItem[]>([]);
  const [readingList, setReadingList] = useState<ReadingItem[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<DownloadTask[]>([]);
  
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReadingListOpen, setIsReadingListOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [downloadPromptUrl, setDownloadPromptUrl] = useState<string | null>(null);

  // In-Page Tools
  const [isFindInPageOpen, setIsFindInPageOpen] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [findMatchCount, setFindMatchCount] = useState(0);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedNotice, setTranslatedNotice] = useState<string | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAndTriggerScreenGuide('utilities');
  }, [checkAndTriggerScreenGuide]);

  // Load IndexedDB browser data
  useEffect(() => {
    const loadData = async () => {
      const storedBm = await offlineDB.getAll<BrowserBookmark>('browser_bookmarks');
      if (storedBm) setBookmarks(storedBm);

      const storedHist = await offlineDB.getAll<BrowserHistoryItem>('browser_history');
      if (storedHist) setHistory(storedHist);

      const storedRl = localStorage.getItem('guidener_reading_list');
      if (storedRl) {
        try { setReadingList(JSON.parse(storedRl)); } catch { setReadingList([]); }
      }
    };
    loadData();
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Autocomplete / Search Suggestions
  const handleInputChange = (val: string) => {
    setUrlInput(val);
    if (!val.trim()) {
      setShowSuggestions(false);
      setSuggestions([]);
      return;
    }
    const query = val.toLowerCase();
    const matches: string[] = [];

    // Match top sites
    PRESET_TOP_SITES.forEach((site) => {
      if (site.name.toLowerCase().includes(query) || site.url.toLowerCase().includes(query)) {
        matches.push(site.url);
      }
    });

    // Match bookmarks & history
    bookmarks.forEach((bm) => {
      if (bm.title.toLowerCase().includes(query) || bm.url.toLowerCase().includes(query)) {
        if (!matches.includes(bm.url)) matches.push(bm.url);
      }
    });

    // Common search suggestions
    matches.push(`https://www.google.com/search?q=${encodeURIComponent(val)}&igu=1`);
    matches.push(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(val)}`);

    setSuggestions(matches.slice(0, 5));
    setShowSuggestions(true);
  };

  // Determine file preview type
  const detectPreviewType = (url: string): 'web' | 'pdf' | 'image' | 'video' => {
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return 'pdf';
    if (lower.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (lower.match(/\.(mp4|webm|ogg)$/)) return 'video';
    return 'web';
  };

  // Primary Navigation Handler
  const handleNavigate = async (targetUrl: string, addToHistoryStack = true) => {
    let finalUrl = targetUrl.trim();
    if (!finalUrl) return;

    setShowSuggestions(false);

    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`;
      }
    }

    // Trigger fake loading progress
    setIsLoading(true);
    setLoadingProgress(20);
    const progressTimer1 = setTimeout(() => setLoadingProgress(65), 150);
    const progressTimer2 = setTimeout(() => setLoadingProgress(90), 300);

    const title = extractTitle(finalUrl);
    const pType = detectPreviewType(finalUrl);

    // Update Tab
    setTabs((prevTabs) =>
      prevTabs.map((t) => {
        if (t.id === activeTabId) {
          const newStack = addToHistoryStack
            ? [...t.historyStack.slice(0, t.historyIndex + 1), finalUrl]
            : t.historyStack;
          const newIndex = addToHistoryStack ? newStack.length - 1 : t.historyIndex;

          return {
            ...t,
            url: finalUrl,
            title,
            previewType: pType,
            historyStack: newStack,
            historyIndex: newIndex,
          };
        }
        return t;
      })
    );
    setUrlInput(finalUrl);

    // Save History if not incognito
    if (activeTab && !activeTab.isIncognito) {
      const histItem: BrowserHistoryItem = {
        id: `hist-${Date.now()}`,
        title,
        url: finalUrl,
        visitedAt: new Date().toISOString(),
      };
      await offlineDB.put('browser_history', histItem);
      setHistory((prev) => [histItem, ...prev.filter((h) => h.url !== finalUrl)]);
    }

    setTimeout(() => {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 450);
  };

  // Back and Forward Navigation
  const handleBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const prevIndex = activeTab.historyIndex - 1;
    const prevUrl = activeTab.historyStack[prevIndex];
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: prevIndex, url: prevUrl } : t))
    );
    handleNavigate(prevUrl, false);
  };

  const handleForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.historyStack.length - 1) return;
    const nextIndex = activeTab.historyIndex + 1;
    const nextUrl = activeTab.historyStack[nextIndex];
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: nextIndex, url: nextUrl } : t))
    );
    handleNavigate(nextUrl, false);
  };

  const extractTitle = (url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('google')) return 'Google Search';
      if (parsed.hostname.includes('wikipedia')) return 'Wikipedia';
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'Web Page';
    }
  };

  // Tab Management
  const createTab = (isIncognito = false, group: TabGroup = 'General') => {
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      title: isIncognito ? 'Private Tab' : 'New Tab',
      url: 'https://www.google.com/search?igu=1',
      isIncognito,
      isReaderMode: false,
      isDesktopMode: false,
      tabGroup: group,
      historyStack: ['https://www.google.com/search?igu=1'],
      historyIndex: 0,
      previewType: 'web',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setIsTabOverviewOpen(false);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      showToast('Cannot close the only open tab');
      return;
    }
    const nextTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(nextTabs);
    if (activeTabId === tabId) {
      setActiveTabId(nextTabs[0].id);
    }
  };

  // Bookmarks
  const toggleBookmark = async () => {
    if (!activeTab) return;
    const existing = bookmarks.find((b) => b.url === activeTab.url);
    if (existing) {
      await offlineDB.delete('browser_bookmarks', existing.id);
      setBookmarks(bookmarks.filter((b) => b.id !== existing.id));
      showToast('Removed from Bookmarks');
    } else {
      const bm: BrowserBookmark = {
        id: `bm-${Date.now()}`,
        title: activeTab.title,
        url: activeTab.url,
        createdAt: new Date().toISOString(),
      };
      await offlineDB.put('browser_bookmarks', bm);
      setBookmarks([...bookmarks, bm]);
      showToast('Saved to Bookmarks');
    }
  };

  const isCurrentBookmarked = activeTab && bookmarks.some((b) => b.url === activeTab.url);

  // Reading List
  const toggleReadingList = () => {
    if (!activeTab) return;
    const existing = readingList.find((r) => r.url === activeTab.url);
    if (existing) {
      const updated = readingList.filter((r) => r.id !== existing.id);
      setReadingList(updated);
      localStorage.setItem('guidener_reading_list', JSON.stringify(updated));
      showToast('Removed from Reading List');
    } else {
      const newItem: ReadingItem = {
        id: `rl-${Date.now()}`,
        title: activeTab.title,
        url: activeTab.url,
        addedAt: new Date().toISOString(),
        isRead: false,
      };
      const updated = [...readingList, newItem];
      setReadingList(updated);
      localStorage.setItem('guidener_reading_list', JSON.stringify(updated));
      showToast('Added to Reading List');
    }
  };

  // Clear History
  const clearAllHistory = async () => {
    await offlineDB.clear('browser_history');
    setHistory([]);
    showToast('Browsing History Cleared!');
  };

  // Translation Simulation
  const handleTranslatePage = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      setTranslatedNotice(`Page translated to ${targetLang}`);
      setIsTranslateOpen(false);
      showToast(`Translated page content into ${targetLang}!`);
    }, 1200);
  };

  // Download Task Simulator
  const startDownload = (url: string) => {
    const fileName = extractTitle(url) + (detectPreviewType(url) === 'pdf' ? '.pdf' : '.html');
    const task: DownloadTask = {
      id: `dl-${Date.now()}`,
      source_url: url,
      file_name: fileName,
      file_category: detectPreviewType(url) === 'pdf' ? 'document' : 'media',
      file_size: 2.8 * 1024 * 1024,
      downloaded_size: 2.8 * 1024 * 1024,
      status: 'completed',
      created_at: new Date().toISOString(),
    };

    setActiveDownloads((prev) => [task, ...prev]);
    if (onSaveToDownloads) onSaveToDownloads(task);
    setDownloadPromptUrl(null);
    showToast(`Downloaded: ${fileName}`);
  };

  const filteredTabs = tabGroupFilter === 'All' ? tabs : tabs.filter((t) => t.tabGroup === tabGroupFilter);

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/90 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border border-slate-700 animate-in fade-in zoom-in-95">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Browser Header & Tab Bar */}
      <div className={`flex items-center justify-between px-3 py-2 shrink-0 border-b ${
        activeTab?.isIncognito
          ? 'bg-purple-950 text-purple-100 border-purple-800'
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80 shrink-0">
            <Globe className={`w-4 h-4 ${activeTab?.isIncognito ? 'text-purple-400' : 'text-emerald-400'}`} />
            <span className="font-extrabold text-xs tracking-wide">OmniBrowser</span>
            {activeTab?.isIncognito && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-800 text-purple-200 text-[9px] font-mono font-bold flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> Incognito
              </span>
            )}
            <HelpMeUseButton screenId="utilities" label="Guide" />
          </div>

          {/* Tab Strip */}
          {!isTabOverviewOpen && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer max-w-[150px] shrink-0 transition-all ${
                      isActive
                        ? tab.isIncognito
                          ? 'bg-purple-900 text-purple-100 shadow-md border border-purple-700'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {tab.isIncognito ? (
                      <EyeOff className="w-3 h-3 text-purple-300 shrink-0" />
                    ) : (
                      <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                    <span className="truncate">{tab.title}</span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="p-0.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab Controls Right */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={() => createTab(false)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white"
            title="New Normal Tab"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => createTab(true)}
            className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 flex items-center gap-1 text-[11px] font-extrabold"
            title="New Private Incognito Tab"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsTabOverviewOpen(!isTabOverviewOpen)}
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border transition-all ${
              isTabOverviewOpen
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Tab Grid Overview"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{tabs.length}</span>
          </button>
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-200"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* Primary Address & Toolbar */}
      <div className="p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-xs shrink-0 z-30">
        {/* Navigation Buttons */}
        <button
          onClick={handleBack}
          disabled={!activeTab || activeTab.historyIndex <= 0}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleForward}
          disabled={!activeTab || activeTab.historyIndex >= activeTab.historyStack.length - 1}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleNavigate('https://en.wikipedia.org/wiki/Main_Page')}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="Home Page"
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleNavigate(activeTab.url, false)}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          title="Reload Page"
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
        </button>

        {/* Address Bar Input Form */}
        <div className="flex-1 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNavigate(urlInput);
            }}
            className="flex items-center"
          >
            <div className="absolute left-3 flex items-center gap-1 text-slate-400 pointer-events-none">
              {activeTab?.url.startsWith('https://') ? (
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (urlInput) setShowSuggestions(true);
              }}
              className={`w-full pl-8 pr-20 py-2 text-xs rounded-2xl border font-medium focus:outline-none transition-all ${
                activeTab?.isIncognito
                  ? 'bg-purple-900/20 border-purple-800/80 text-purple-100 focus:border-purple-500'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500'
              }`}
              placeholder="Search Google or type web address..."
            />

            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleBookmark}
                className={`p-1 rounded-lg text-xs transition-transform active:scale-90 ${
                  isCurrentBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Bookmark Page"
              >
                <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
            </div>
          </form>

          {/* Autocomplete Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1 block">
                Search Suggestions
              </span>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(s)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 flex items-center justify-between transition-all"
                >
                  <span className="truncate">{s}</span>
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feature Tools Strip */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Reader Mode Toggle */}
          <button
            onClick={() => {
              const updated = tabs.map((t) =>
                t.id === activeTabId ? { ...t, isReaderMode: !t.isReaderMode } : t
              );
              setTabs(updated);
              showToast(activeTab?.isReaderMode ? 'Exited Reader Mode' : 'Entered Reader Mode');
            }}
            className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
              activeTab?.isReaderMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Reader Mode"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Desktop Mode Toggle */}
          <button
            onClick={() => {
              const updated = tabs.map((t) =>
                t.id === activeTabId ? { ...t, isDesktopMode: !t.isDesktopMode } : t
              );
              setTabs(updated);
              showToast(activeTab?.isDesktopMode ? 'Mobile View' : 'Desktop Mode');
            }}
            className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
              activeTab?.isDesktopMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title="Desktop Mode Toggle"
          >
            {activeTab?.isDesktopMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Find In Page Button */}
          <button
            onClick={() => setIsFindInPageOpen(!isFindInPageOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Find in Page"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Translate Button */}
          <button
            onClick={() => setIsTranslateOpen(!isTranslateOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Translate Page"
          >
            <Languages className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Save / Download Resource */}
          <button
            onClick={() => setDownloadPromptUrl(activeTab.url)}
            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1"
            title="Download / Save Resource"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Bookmarks Overlay Button */}
          <button
            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="View Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* History Overlay Button */}
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Browsing History"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Reading List Overlay Button */}
          <button
            onClick={() => setIsReadingListOpen(!isReadingListOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Reading List"
          >
            <ListPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Find in Page Floating Bar */}
      {isFindInPageOpen && (
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-b border-amber-200 dark:border-slate-700 flex items-center gap-2 animate-in slide-in-from-top-2">
          <Search className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={findQuery}
            onChange={(e) => {
              setFindQuery(e.target.value);
              setFindMatchCount(e.target.value ? Math.floor(Math.random() * 8) + 1 : 0);
            }}
            placeholder="Find text in page..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
          {findQuery && (
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {findMatchCount} matches
            </span>
          )}
          <button onClick={() => setIsFindInPageOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Translate Page Banner Bar */}
      {isTranslateOpen && (
        <div className="p-3 bg-emerald-50 dark:bg-slate-800 border-b border-emerald-200 dark:border-slate-700 flex items-center justify-between gap-2 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Translate Page into:
            </span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl text-xs font-bold"
            >
              <option value="Spanish">Spanish</option>
              <option value="Hindi">Hindi</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTranslatePage}
              disabled={isTranslating}
              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1"
            >
              {isTranslating ? <RotateCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>{isTranslating ? 'Translating...' : 'Translate Now'}</span>
            </button>
            <button onClick={() => setIsTranslateOpen(false)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Grid Overview Modal */}
      {isTabOverviewOpen ? (
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span>Tab Manager ({tabs.length} Open Tabs)</span>
              </h2>
              <p className="text-xs text-slate-500">Group, organize, and switch tabs effortlessly</p>
            </div>

            {/* Filter by Group */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Group:</span>
              {(['All', 'General', 'Work', 'Study', 'Media'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setTabGroupFilter(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                    tabGroupFilter === g
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTabs.map((t) => {
              const isActive = t.id === activeTabId;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTabId(t.id);
                    setIsTabOverviewOpen(false);
                  }}
                  className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border transition-all cursor-pointer hover:scale-102 shadow-lg space-y-3 relative group ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-[180px] flex items-center gap-1.5">
                      {t.isIncognito ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{t.title}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(t.id);
                      }}
                      className="p-1 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 truncate bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                    {t.url}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-bold">
                      Group: {t.tabGroup}
                    </span>
                    {t.isIncognito && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main View Container */
        <div className="flex-1 relative bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
          {/* Preset Top Sites Quick Bar for blank search or Wikipedia home */}
          {activeTab?.url === 'https://www.google.com/search?igu=1' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Speed Dial & Top Sites
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {PRESET_TOP_SITES.map((site) => (
                  <button
                    key={site.name}
                    onClick={() => handleNavigate(site.url)}
                    className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-102 transition-all flex items-center gap-2 shadow-xs"
                  >
                    <span className="text-lg">{site.icon}</span>
                    <div className="min-w-0 text-left">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block truncate">
                        {site.name}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">{site.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reader Mode Text View */}
          {activeTab?.isReaderMode ? (
            <div className="p-8 max-w-3xl mx-auto space-y-4 overflow-y-auto h-full text-slate-800 dark:text-slate-200">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Distraction-Free Reader Mode Active</span>
              </div>
              <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white">
                {activeTab.title}
              </h1>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                High-contrast, clean-typography mode optimized for reading study articles, notes, and research papers inside GuideNer OmniBrowser.
              </p>
            </div>
          ) : activeTab?.previewType === 'pdf' ? (
            /* Custom PDF Previewer */
            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-800 text-white space-y-4">
              <FileText className="w-16 h-16 text-blue-400 animate-bounce" />
              <h3 className="font-extrabold text-lg">{activeTab.title}</h3>
              <p className="text-xs text-slate-400 font-mono">{activeTab.url}</p>
              <button
                onClick={() => startDownload(activeTab.url)}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Document</span>
              </button>
            </div>
          ) : activeTab?.previewType === 'video' ? (
            /* Video Player Previewer */
            <div className="flex-1 p-4 bg-black flex items-center justify-center">
              <video controls src={activeTab.url} className="max-w-full max-h-full rounded-2xl shadow-2xl" />
            </div>
          ) : (
            /* Standard Web View Frame with Desktop mode simulation */
            <div className={`w-full h-full flex justify-center bg-slate-200 dark:bg-slate-950 overflow-hidden ${
              activeTab?.isDesktopMode ? 'p-4' : ''
            }`}>
              <iframe
                src={activeTab.url}
                title={activeTab.title}
                className={`h-full border-none transition-all shadow-xl bg-white ${
                  activeTab?.isDesktopMode ? 'w-[1280px] rounded-2xl border border-slate-300 dark:border-slate-700' : 'w-full'
                }`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          )}
        </div>
      )}

      {/* Bookmarks Modal Overlay */}
      {isBookmarksOpen && (
        <div className="absolute right-4 top-20 z-50 w-80 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </h4>
            <button onClick={() => setIsBookmarksOpen(false)} className="text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No bookmarks saved yet.</p>
            ) : (
              bookmarks.map((bm) => (
                <button
                  key={bm.id}
                  onClick={() => {
                    handleNavigate(bm.url);
                    setIsBookmarksOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-between group transition-all"
                >
                  <span className="font-bold truncate text-slate-800 dark:text-slate-200">{bm.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0 ml-1" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Browsing History Modal Overlay */}
      {isHistoryOpen && (
        <div className="absolute right-4 top-20 z-50 w-88 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-500" />
              <span>Browsing History ({history.length})</span>
            </h4>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="text-[10px] font-extrabold text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">History is empty.</p>
            ) : (
              history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    handleNavigate(h.url);
                    setIsHistoryOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-between transition-all"
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="font-bold truncate text-slate-800 dark:text-slate-200">{h.title}</span>
                    <span className="text-[10px] text-slate-400 truncate">{h.url}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reading List Modal Overlay */}
      {isReadingListOpen && (
        <div className="absolute right-4 top-20 z-50 w-80 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <ListPlus className="w-4 h-4 text-purple-500" />
              <span>Reading List ({readingList.length})</span>
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleReadingList}
                className="text-[10px] font-extrabold text-emerald-500 hover:underline"
              >
                + Add Current Page
              </button>
              <button onClick={() => setIsReadingListOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {readingList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Reading list is empty.</p>
            ) : (
              readingList.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    handleNavigate(r.url);
                    setIsReadingListOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-between transition-all"
                >
                  <span className="font-bold truncate text-slate-800 dark:text-slate-200">{r.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Save Resource Modal */}
      {downloadPromptUrl && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Save & Export Web Resource</span>
              </h3>
              <button onClick={() => setDownloadPromptUrl(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl">
              {downloadPromptUrl}
            </p>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={() => startDownload(downloadPromptUrl)}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download File / Page</span>
              </button>

              <button
                onClick={() => {
                  if (onSaveToVault) onSaveToVault(extractTitle(downloadPromptUrl), downloadPromptUrl);
                  setDownloadPromptUrl(null);
                  showToast('Saved to Encrypted Vault!');
                }}
                className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Save to Encrypted Vault</span>
              </button>

              <button
                onClick={() => {
                  if (onShareToOmniAir) onShareToOmniAir(downloadPromptUrl);
                  setDownloadPromptUrl(null);
                  showToast('Shared via OmniAir Beam!');
                }}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Beam via OmniAir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
