import React, { useState, useEffect } from 'react';
import { db } from './core/database/db';
import {
  UserProfile,
  TimeBlock,
  Habit,
  Goal,
  HealthLog,
  SpiritualLog,
  StudyDocument,
  FlashcardDeck,
  UtilityNote,
  ClipboardItem,
  DownloadTask,
  VaultItem,
  RegistrationForm,
  SmartNotification,
  AIMemory,
} from './core/database/schema';
import { ThemeMode, AIPersonaMode } from './core/theme/tokens';
import { Navigation, ActiveTab } from './shared/components/Navigation';
import { HomeView } from './features/home/HomeView';
import { AIView } from './features/ai_companion/AIView';
import { LifeOSView } from './features/life_os/LifeOSView';
import { StudyView } from './features/study/StudyView';
import { HealthSpiritualView } from './features/health_spiritual/HealthSpiritualView';
import { UtilitiesView } from './features/utilities/UtilitiesView';
import { DownloaderView } from './features/downloader/DownloaderView';
import { VaultView } from './features/vault/VaultView';
import { KnowledgeLibraryView } from './features/knowledge_library/KnowledgeLibraryView';
import { AdminView } from './features/admin/AdminView';
import { SearchModal } from './shared/components/SearchModal';
import { NotificationModal } from './shared/components/NotificationModal';
import { GuidedModeProvider } from './core/guided/GuidedModeContext';
import { ProfileProvider } from './core/profile/ProfileContext';
import { GuidedScreenBanner } from './shared/components/GuidedScreenBanner';
import { GuidedTourOverlay } from './shared/components/GuidedTourOverlay';
import { GuidedFeatureModal } from './shared/components/GuidedFeatureModal';
import { GuidedModeSettingsModal } from './shared/components/GuidedModeSettingsModal';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [persona, setPersona] = useState<AIPersonaMode>('friendly');

  // Database Data States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [healthLog, setHealthLog] = useState<HealthLog | null>(null);
  const [spiritualLog, setSpiritualLog] = useState<SpiritualLog | null>(null);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [utilityNotes, setUtilityNotes] = useState<UtilityNote[]>([]);
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [registrationForms, setRegistrationForms] = useState<RegistrationForm[]>([]);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [aiMemories, setAiMemories] = useState<AIMemory[]>([]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isGuidedSettingsOpen, setIsGuidedSettingsOpen] = useState(false);

  // Load IndexedDB Data on Mount
  useEffect(() => {
    const loadAll = async () => {
      await db.init();
      const today = new Date().toISOString().split('T')[0];
      setUser(await db.getUserProfile());
      setTimeBlocks(await db.getTimeBlocks());
      setHabits(await db.getHabits());
      setGoals(await db.getGoals());
      setHealthLog(await db.getHealthLog(today));
      setSpiritualLog(await db.getSpiritualLog(today));
      setDocuments(await db.getStudyDocuments());
      setFlashcardDecks(await db.getFlashcardDecks());
      setUtilityNotes(await db.getUtilityNotes());
      setClipboardHistory(await db.getClipboardHistory());
      setDownloadTasks(await db.getDownloadTasks());
      setVaultItems(await db.getVaultItems());
      setRegistrationForms(await db.getRegistrationForms());
      setNotifications(await db.getNotifications());
      setAiMemories(await db.getAIMemories());
    };
    loadAll();
  }, []);

  // Update Theme DOM class & OLED background
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0F172A';
    } else if (theme === 'oled') {
      root.classList.add('dark');
      root.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F8FAFC';
    }
  }, [theme]);

  // Global Keyboard Shortcuts (e.g. Cmd+K / Ctrl+K for Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Data Mutators
  const handleToggleTimeBlock = (id: string) => {
    const updated = timeBlocks.map((tb) =>
      tb.id === id ? { ...tb, is_completed: !tb.is_completed } : tb
    );
    setTimeBlocks(updated);
    db.saveTimeBlocks(updated);

    // Increase life score on completion
    if (user) {
      const isCompleted = updated.find((tb) => tb.id === id)?.is_completed;
      const newScore = Math.min(1000, Math.max(0, user.life_score + (isCompleted ? 15 : -15)));
      const updatedUser = { ...user, life_score: newScore };
      setUser(updatedUser);
      db.saveUserProfile(updatedUser);
    }
  };

  const handleSaveTimeBlock = (block: TimeBlock) => {
    const updated = [block, ...timeBlocks];
    setTimeBlocks(updated);
    db.saveTimeBlocks(updated);
  };

  const handleDeleteTimeBlock = (id: string) => {
    const updated = timeBlocks.filter((tb) => tb.id !== id);
    setTimeBlocks(updated);
    db.saveTimeBlocks(updated);
  };

  const handleToggleHabit = (id: string) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, current_streak: h.current_streak + 1 } : h
    );
    setHabits(updated);
    db.saveHabits(updated);

    if (user) {
      const updatedUser = { ...user, life_score: Math.min(1000, user.life_score + 10) };
      setUser(updatedUser);
      db.saveUserProfile(updatedUser);
    }
  };

  const handleSaveHabit = (habit: Habit) => {
    const updated = [habit, ...habits];
    setHabits(updated);
    db.saveHabits(updated);
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    db.saveHabits(updated);
  };

  const handleSaveGoal = (goal: Goal) => {
    const updated = [goal, ...goals];
    setGoals(updated);
    db.saveGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    db.saveGoals(updated);
  };

  const handleAddWater = (amountMl: number) => {
    if (!healthLog) return;
    const updated = { ...healthLog, water_ml: healthLog.water_ml + amountMl };
    setHealthLog(updated);
    db.saveHealthLog(updated);
  };

  const handleSaveDocument = (doc: StudyDocument) => {
    const existing = documents.findIndex((d) => d.id === doc.id);
    let updated: StudyDocument[];
    if (existing >= 0) {
      updated = [...documents];
      updated[existing] = doc;
    } else {
      updated = [doc, ...documents];
    }
    setDocuments(updated);
    db.saveStudyDocuments(updated);
  };

  const handleSaveUtilityNote = (note: UtilityNote) => {
    const updated = [note, ...utilityNotes];
    setUtilityNotes(updated);
    db.saveUtilityNotes(updated);
  };

  const handleDeleteUtilityNote = (id: string) => {
    const updated = utilityNotes.filter((n) => n.id !== id);
    setUtilityNotes(updated);
    db.saveUtilityNotes(updated);
  };

  const handleClearClipboard = () => {
    setClipboardHistory([]);
    db.saveClipboardHistory([]);
  };

  const handleSaveDownloadTask = (task: DownloadTask) => {
    const updated = [task, ...downloadTasks];
    setDownloadTasks(updated);
    db.saveDownloadTasks(updated);
  };

  const handleDeleteDownloadTask = (id: string) => {
    const updated = downloadTasks.filter((t) => t.id !== id);
    setDownloadTasks(updated);
    db.saveDownloadTasks(updated);
  };

  const handleSaveVaultItem = (item: VaultItem) => {
    const updated = [item, ...vaultItems];
    setVaultItems(updated);
    db.saveVaultItems(updated);
  };

  const handleDeleteVaultItem = (id: string) => {
    const updated = vaultItems.filter((v) => v.id !== id);
    setVaultItems(updated);
    db.saveVaultItems(updated);
  };

  const handleSaveRegistration = (form: RegistrationForm) => {
    const updated = [form, ...registrationForms];
    setRegistrationForms(updated);
    db.saveRegistrationForms(updated);
  };

  const handleAddAIMemory = (key: string, value: string) => {
    const newMem: AIMemory = {
      id: `mem-${Date.now()}`,
      key,
      value,
      confidence: 1.0,
      created_at: new Date().toISOString(),
    };
    const updated = [newMem, ...aiMemories];
    setAiMemories(updated);
    db.saveAIMemories(updated);
  };

  const handleExportBackup = () => {
    const backupData = {
      user,
      timeBlocks,
      habits,
      goals,
      healthLog,
      spiritualLog,
      documents,
      flashcardDecks,
      utilityNotes,
      downloadTasks,
      vaultItems,
      registrationForms,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GuideNer_LifeOS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!user || !healthLog || !spiritualLog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold">Initializing GuideNer Life OS Engine...</p>
        </div>
      </div>
    );
  }

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors antialiased">
      {/* Top Header & Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        persona={persona}
        setPersona={setPersona}
        lifeScore={user.life_score}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadNotifsCount={unreadNotifs}
        onOpenNotifs={() => setIsNotifsOpen(true)}
        onOpenGuidedSettings={() => setIsGuidedSettingsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="lg:pl-64 p-4 sm:p-6 pb-20 lg:pb-6 max-w-7xl mx-auto min-h-[calc(100vh-60px)]">
        {activeTab === 'home' && (
          <HomeView
            user={{ ...user, persona_mode: persona }}
            timeBlocks={timeBlocks}
            habits={habits}
            goals={goals}
            healthLog={healthLog}
            onToggleTimeBlock={handleToggleTimeBlock}
            onToggleHabit={handleToggleHabit}
            onAddWater={handleAddWater}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'ai' && (
          <AIView
            persona={persona}
            setPersona={setPersona}
            aiMemories={aiMemories}
            onAddMemory={handleAddAIMemory}
          />
        )}

        {activeTab === 'life_os' && (
          <LifeOSView
            timeBlocks={timeBlocks}
            habits={habits}
            goals={goals}
            onSaveTimeBlock={handleSaveTimeBlock}
            onDeleteTimeBlock={handleDeleteTimeBlock}
            onToggleTimeBlock={handleToggleTimeBlock}
            onSaveHabit={handleSaveHabit}
            onDeleteHabit={handleDeleteHabit}
            onToggleHabit={handleToggleHabit}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'study' && (
          <StudyView
            documents={documents}
            flashcardDecks={flashcardDecks}
            onSaveDocument={handleSaveDocument}
            onSaveDeck={(deck) => {
              const updated = [deck, ...flashcardDecks];
              setFlashcardDecks(updated);
              db.saveFlashcardDecks(updated);
            }}
          />
        )}

        {activeTab === 'health_spiritual' && (
          <HealthSpiritualView
            healthLog={healthLog}
            spiritualLog={spiritualLog}
            onSaveHealthLog={(hl) => {
              setHealthLog(hl);
              db.saveHealthLog(hl);
            }}
            onSaveSpiritualLog={(sl) => {
              setSpiritualLog(sl);
              db.saveSpiritualLog(sl);
            }}
          />
        )}

        {activeTab === 'utilities' && (
          <UtilitiesView
            utilityNotes={utilityNotes}
            clipboardHistory={clipboardHistory}
            onSaveNote={handleSaveUtilityNote}
            onDeleteNote={handleDeleteUtilityNote}
            onClearClipboard={handleClearClipboard}
          />
        )}

        {activeTab === 'downloader' && (
          <DownloaderView
            downloadTasks={downloadTasks}
            onSaveTask={handleSaveDownloadTask}
            onDeleteTask={handleDeleteDownloadTask}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            vaultItems={vaultItems}
            onSaveVaultItem={handleSaveVaultItem}
            onDeleteVaultItem={handleDeleteVaultItem}
          />
        )}

        {activeTab === 'registration' && (
          <KnowledgeLibraryView
            onNavigateAI={(prompt) => {
              setActiveTab('ai');
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            user={user}
            timeBlocksCount={timeBlocks.length}
            habitsCount={habits.length}
            goalsCount={goals.length}
            vaultItemsCount={vaultItems.length}
            onExportBackup={handleExportBackup}
          />
        )}
      </main>

      {/* Global Command Palette Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        timeBlocks={timeBlocks}
        habits={habits}
        goals={goals}
        documents={documents}
        utilityNotes={utilityNotes}
        downloadTasks={downloadTasks}
        vaultItems={vaultItems}
        registrationForms={registrationForms}
        onSelectTab={setActiveTab}
      />

      {/* Global Notifications Modal */}
      <NotificationModal
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
          setNotifications(updated);
          db.saveNotifications(updated);
        }}
        onClearAll={() => {
          setNotifications([]);
          db.saveNotifications([]);
        }}
      />

      {/* AI Guided Mode Interactive Overlays */}
      <GuidedScreenBanner />
      <GuidedTourOverlay />
      <GuidedFeatureModal />
      <GuidedModeSettingsModal
        isOpen={isGuidedSettingsOpen}
        onClose={() => setIsGuidedSettingsOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <ProfileProvider>
      <GuidedModeProvider>
        <AppContent />
      </GuidedModeProvider>
    </ProfileProvider>
  );
}

export default App;
