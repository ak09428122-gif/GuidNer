/**
 * GuideNer Central Offline-First Database Engine
 * Powered by IndexedDB with LocalStorage fallback & initial master seed state.
 */

import {
  UserProfile,
  TimeBlock,
  Habit,
  Goal,
  StudyDocument,
  FlashcardDeck,
  HealthLog,
  SpiritualLog,
  VaultItem,
  AIMemory,
  SmartNotification,
  DownloadTask,
  UtilityNote,
  ClipboardItem,
  RegistrationForm,
} from './schema';

const DB_NAME = 'GuideNerDB';
const DB_VERSION = 1;

class DatabaseEngine {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  public async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB unavailable. Using local state fallback.');
        resolve();
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create Object Stores if they don't exist
        if (!db.objectStoreNames.contains('user')) db.createObjectStore('user', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('time_blocks')) db.createObjectStore('time_blocks', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('habits')) db.createObjectStore('habits', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('goals')) db.createObjectStore('goals', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('study_documents')) db.createObjectStore('study_documents', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('flashcard_decks')) db.createObjectStore('flashcard_decks', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('health_logs')) db.createObjectStore('health_logs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('spiritual_logs')) db.createObjectStore('spiritual_logs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('vault_items')) db.createObjectStore('vault_items', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('ai_memories')) db.createObjectStore('ai_memories', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('smart_notifications')) db.createObjectStore('smart_notifications', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('download_tasks')) db.createObjectStore('download_tasks', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('utility_notes')) db.createObjectStore('utility_notes', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('clipboard_history')) db.createObjectStore('clipboard_history', { keyPath: 'id' });
      };

      request.onsuccess = async (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        await this.seedInitialDataIfNeeded();
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB failed to open:', (event.target as IDBOpenDBRequest).error);
        resolve(); // Continue with fallback
      };
    });
  }

  // --- Generic Helpers ---
  private async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) {
      const stored = localStorage.getItem(`gn_${storeName}`);
      return stored ? JSON.parse(stored) : [];
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  private async getOne<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) {
      const all = await this.getAll<T>(storeName);
      return (all as any[]).find((item) => item.id === id) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async putOne<T extends { id: string }>(storeName: string, data: T): Promise<void> {
    if (!this.db) {
      const all = await this.getAll<T>(storeName);
      const filtered = (all as any[]).filter((item) => item.id !== data.id);
      filtered.push(data);
      localStorage.setItem(`gn_${storeName}`, JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(data);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private async putMany<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    if (!items) return;
    if (!this.db) {
      localStorage.setItem(`gn_${storeName}`, JSON.stringify(items));
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const item of items) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private async deleteOne(storeName: string, id: string): Promise<void> {
    if (!this.db) {
      const all = await this.getAll<any>(storeName);
      const filtered = all.filter((item) => item.id !== id);
      localStorage.setItem(`gn_${storeName}`, JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- Seed Initial Master State ---
  private async seedInitialDataIfNeeded() {
    const user = await this.getOne<UserProfile>('user', 'main_user');
    if (user) return; // Already seeded

    const now = new Date().toISOString();
    const today = new Date().toISOString().split('T')[0];

    // Seed Profile
    const defaultUser: UserProfile = {
      id: 'main_user',
      name: 'Arun Gupta',
      email: 'arun@example.com',
      persona_mode: 'friendly',
      life_score: 850,
      desktop_layout_compact: false,
      biometric_enabled: false,
      dark_mode: 'light',
      created_at: now,
      updated_at: now,
    };
    await this.putOne('user', defaultUser);

    // Seed Time Blocks
    const seedTimeBlocks: TimeBlock[] = [
      {
        id: 'tb-1',
        title: 'Morning Yoga & Meditation',
        category: 'health',
        start_time: '06:30',
        end_time: '07:15',
        priority: 'high',
        energy_level: 'high',
        is_completed: true,
        created_at: now,
      },
      {
        id: 'tb-2',
        title: 'Mathematics Study & Calculus Problem Set',
        category: 'study',
        start_time: '09:00',
        end_time: '11:00',
        priority: 'critical',
        energy_level: 'high',
        is_completed: false,
        created_at: now,
      },
      {
        id: 'tb-3',
        title: 'Physics & Electrostatics Notes Review',
        category: 'study',
        start_time: '11:30',
        end_time: '13:00',
        priority: 'high',
        energy_level: 'medium',
        is_completed: false,
        created_at: now,
      },
      {
        id: 'tb-4',
        title: 'Evening Workout & Cardio Sprint',
        category: 'health',
        start_time: '18:30',
        end_time: '19:30',
        priority: 'medium',
        energy_level: 'medium',
        is_completed: false,
        created_at: now,
      },
      {
        id: 'tb-5',
        title: 'Daily Spiritual Mantra & Gayatri Jaap',
        category: 'spiritual',
        start_time: '20:00',
        end_time: '20:30',
        priority: 'high',
        energy_level: 'medium',
        is_completed: false,
        created_at: now,
      },
    ];
    for (const item of seedTimeBlocks) await this.putOne('time_blocks', item);

    // Seed Habits
    const seedHabits: Habit[] = [
      {
        id: 'h-1',
        title: 'Drink 2.5L Water Daily',
        frequency: 'daily',
        target_count: 2500,
        current_streak: 12,
        best_streak: 24,
        category: 'Health',
        icon: '💧',
        logs: [{ date: today, completed: true, count: 2000 }],
        created_at: now,
      },
      {
        id: 'h-2',
        title: 'Read 20 Pages of Book',
        frequency: 'daily',
        target_count: 20,
        current_streak: 8,
        best_streak: 15,
        category: 'Study',
        icon: '📖',
        logs: [{ date: today, completed: true, count: 20 }],
        created_at: now,
      },
      {
        id: 'h-3',
        title: 'Complete Morning Meditation',
        frequency: 'daily',
        target_count: 1,
        current_streak: 14,
        best_streak: 30,
        category: 'Spiritual',
        icon: '🧘',
        logs: [{ date: today, completed: true, count: 1 }],
        created_at: now,
      },
      {
        id: 'h-4',
        title: '10,000 Daily Steps Goal',
        frequency: 'daily',
        target_count: 10000,
        current_streak: 6,
        best_streak: 18,
        category: 'Health',
        icon: '👟',
        logs: [{ date: today, completed: false, count: 6842 }],
        created_at: now,
      },
    ];
    for (const habit of seedHabits) await this.putOne('habits', habit);

    // Seed Goals
    const seedGoals: Goal[] = [
      {
        id: 'g-1',
        title: 'Crack National Olympiad Exam 2027',
        description: 'Achieve Top 100 All India Rank in Physics & Mathematics',
        horizon: 'yearly',
        progress: 0.68,
        target_date: '2027-05-15',
        status: 'in_progress',
        created_at: now,
      },
      {
        id: 'g-2',
        title: 'Master Advanced Differential Calculus',
        description: 'Complete 15 chapters and 200 solved examples',
        horizon: 'monthly',
        progress: 0.85,
        target_date: '2026-08-31',
        status: 'in_progress',
        created_at: now,
      },
      {
        id: 'g-3',
        title: 'Maintain 100% Morning Discipline Streak',
        description: 'Wake up at 5:30 AM without snooze for 30 consecutive days',
        horizon: 'monthly',
        progress: 0.5,
        target_date: '2026-08-28',
        status: 'in_progress',
        created_at: now,
      },
    ];
    for (const goal of seedGoals) await this.putOne('goals', goal);

    // Seed Study Documents
    const seedDocs: StudyDocument[] = [
      {
        id: 'doc-1',
        title: 'Quadratic Equations & Complex Roots Notes',
        content: `# Quadratic Equations & Complex Numbers\n\n## Core Formula\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n### Key Concepts:\n- Discriminant $D = b^2 - 4ac$\n- If $D > 0$: Two distinct real roots.\n- If $D = 0$: Two equal real roots.\n- If $D < 0$: Conjugate complex roots.\n\n### Exam Shortcut Tips:\n1. Sum of roots $\\alpha + \\beta = -b/a$\n2. Product of roots $\\alpha \\cdot \\beta = c/a$`,
        file_type: 'note',
        tags: ['Math', 'Algebra', 'Formulas'],
        summary: 'Comprehensive formula summary and shortcut tricks for quadratic equations.',
        is_favorite: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'doc-2',
        title: 'Human Heart Anatomy & Blood Circulation',
        content: `# Human Heart Anatomy & Physiology\n\n## Four Chambers:\n1. Right Atrium\n2. Right Ventricle\n3. Left Atrium\n4. Left Ventricle\n\n### Pulmonary vs Systemic Circulation:\n- **Pulmonary**: Heart $\\rightarrow$ Lungs $\\rightarrow$ Heart\n- **Systemic**: Heart $\\rightarrow$ Body Organs $\\rightarrow$ Heart\n\n> Note: Deoxygenated blood enters the right atrium via the superior & inferior vena cava.`,
        file_type: 'pdf',
        tags: ['Biology', 'Anatomy', 'High School'],
        summary: 'Structural breakdown of heart chambers and double circulation mechanism.',
        is_favorite: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'doc-3',
        title: 'Electrostatics & Coulomb\'s Law Summary',
        content: `# Electrostatics Overview\n\n## Coulomb\'s Law\n$$F = \\frac{1}{4\\pi \\varepsilon_0} \\frac{q_1 q_2}{r^2}$$\n\nWhere $\\varepsilon_0 = 8.854 \\times 10^{-12} \\text{ F/m}$.`,
        file_type: 'ocr_scan',
        tags: ['Physics', 'Electrostatics'],
        summary: 'Scanned summary of Coulomb\'s law and electric field intensity.',
        is_favorite: false,
        created_at: now,
        updated_at: now,
      },
    ];
    for (const doc of seedDocs) await this.putOne('study_documents', doc);

    // Seed Flashcards
    const seedDeck: FlashcardDeck = {
      id: 'deck-1',
      title: 'High-Yield Physics Formulas',
      document_id: 'doc-3',
      cards: [
        {
          id: 'fc-1',
          front: 'What is Coulomb\'s Law equation?',
          back: 'F = (1 / 4πε₀) * (q₁q₂ / r²)',
          interval: 3,
          ease_factor: 2.5,
        },
        {
          id: 'fc-2',
          front: 'What is Electric Field Strength E at distance r from charge Q?',
          back: 'E = Q / (4πε₀ r²)',
          interval: 1,
          ease_factor: 2.3,
        },
        {
          id: 'fc-3',
          front: 'What is the capacitance of a parallel plate capacitor?',
          back: 'C = (ε₀ * A) / d',
          interval: 5,
          ease_factor: 2.6,
        },
      ],
      next_review_date: today,
      created_at: now,
    };
    await this.putOne('flashcard_decks', seedDeck);

    // Seed Health Log
    const seedHealth: HealthLog = {
      id: today,
      date: today,
      steps: 6842,
      sleep_minutes: 435, // 7h 15m
      water_ml: 2100,
      heart_rate_avg: 72,
      calories_burned: 420,
      weight_kg: 65.4,
      blood_pressure: '120/80',
      medications_taken: [
        { med_id: 'm-1', name: 'Vitamin D3 60K', time: '08:00', dosage: '1 Tablet', taken: true },
        { med_id: 'm-2', name: 'Multivitamin Gold', time: '21:00', dosage: '1 Capsule', taken: false },
      ],
    };
    await this.putOne('health_logs', seedHealth);

    // Seed Spiritual Log
    const seedSpiritual: SpiritualLog = {
      id: today,
      date: today,
      mala_counts: {
        'gayatri_mantra': 108,
        'om_namah_shivaya': 216,
      },
      puja_completed: true,
      meditation_minutes: 20,
      gratitude_note: 'Grateful for good health, focus, and clarity during morning studies.',
      scripture_read: 'Bhagavad Gita — Chapter 2, Verse 47',
    };
    await this.putOne('spiritual_logs', seedSpiritual);

    // Seed AI Memories
    const seedMemories: AIMemory[] = [
      {
        id: 'mem-1',
        key: 'Study Exam Target',
        value: 'Preparing for National Science & Math Olympiad 2027',
        category: 'goal_context',
        confidence_score: 0.98,
        created_at: now,
      },
      {
        id: 'mem-2',
        key: 'Morning Wakeup Preference',
        value: 'Prefers waking up at 5:30 AM with gentle smart alarms',
        category: 'routine_pattern',
        confidence_score: 0.95,
        created_at: now,
      },
      {
        id: 'mem-3',
        key: 'Water Intake Goal',
        value: 'Targeting 2,500ml water daily for optimal energy',
        category: 'health_fact',
        confidence_score: 0.9,
        created_at: now,
      },
    ];
    for (const mem of seedMemories) await this.putOne('ai_memories', mem);

    // Seed Notifications
    const seedNotifications: SmartNotification[] = [
      {
        id: 'notif-1',
        title: 'Morning Calculus Practice',
        body: 'Time for your 2-hour mathematics focus block!',
        trigger_time: `${today}T09:00:00`,
        category: 'study',
        is_active: true,
        sound_tone: 'Gentle Bell',
      },
      {
        id: 'notif-2',
        title: 'Hydration Check',
        body: 'Drink 300ml water to stay energized.',
        trigger_time: `${today}T14:30:00`,
        category: 'water',
        is_active: true,
        sound_tone: 'Drop Tone',
      },
      {
        id: 'notif-3',
        title: 'Night Multivitamin Reminder',
        body: 'Take 1 capsule of Multivitamin Gold after dinner.',
        trigger_time: `${today}T21:00:00`,
        category: 'medicine',
        is_active: true,
        sound_tone: 'Soft Chime',
      },
    ];
    for (const n of seedNotifications) await this.putOne('smart_notifications', n);

    // Seed Utility Note
    const seedUtilNote: UtilityNote = {
      id: 'un-1',
      title: 'Weekly Groceries & Study Station Supplies',
      content: '- 2 Highlighters (Yellow & Cyan)\n- Spiral A4 Notebook (200 pages)\n- Almonds & Walnuts\n- Herbal Tea Bags',
      pinned: true,
      updated_at: now,
    };
    await this.putOne('utility_notes', seedUtilNote);
  }

  // --- Public API Methods ---

  // User Profile
  public async getUserProfile(): Promise<UserProfile> {
    await this.init();
    const user = await this.getOne<UserProfile>('user', 'main_user');
    if (user) return user;
    return {
      id: 'main_user',
      name: 'User',
      persona_mode: 'friendly',
      life_score: 800,
      desktop_layout_compact: false,
      biometric_enabled: false,
      dark_mode: 'light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  public async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const next: UserProfile = { ...current, ...updated, updated_at: new Date().toISOString() };
    await this.putOne('user', next);
    return next;
  }

  // Time Blocks / Schedule
  public async getTimeBlocks(): Promise<TimeBlock[]> {
    await this.init();
    return this.getAll<TimeBlock>('time_blocks');
  }

  public async saveTimeBlock(block: TimeBlock): Promise<void> {
    await this.init();
    await this.putOne('time_blocks', block);
  }

  public async deleteTimeBlock(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('time_blocks', id);
  }

  // Habits
  public async getHabits(): Promise<Habit[]> {
    await this.init();
    return this.getAll<Habit>('habits');
  }

  public async saveHabit(habit: Habit): Promise<void> {
    await this.init();
    await this.putOne('habits', habit);
  }

  public async deleteHabit(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('habits', id);
  }

  // Goals
  public async getGoals(): Promise<Goal[]> {
    await this.init();
    return this.getAll<Goal>('goals');
  }

  public async saveGoal(goal: Goal): Promise<void> {
    await this.init();
    await this.putOne('goals', goal);
  }

  public async deleteGoal(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('goals', id);
  }

  // Study Documents
  public async getStudyDocuments(): Promise<StudyDocument[]> {
    await this.init();
    return this.getAll<StudyDocument>('study_documents');
  }

  public async saveStudyDocument(doc: StudyDocument): Promise<void> {
    await this.init();
    await this.putOne('study_documents', doc);
  }

  public async deleteStudyDocument(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('study_documents', id);
  }

  // Flashcards
  public async getFlashcardDecks(): Promise<FlashcardDeck[]> {
    await this.init();
    return this.getAll<FlashcardDeck>('flashcard_decks');
  }

  public async saveFlashcardDeck(deck: FlashcardDeck): Promise<void> {
    await this.init();
    await this.putOne('flashcard_decks', deck);
  }

  // Health Log
  public async getHealthLog(dateStr: string): Promise<HealthLog> {
    await this.init();
    const existing = await this.getOne<HealthLog>('health_logs', dateStr);
    if (existing) return existing;

    const newLog: HealthLog = {
      id: dateStr,
      date: dateStr,
      steps: 0,
      sleep_minutes: 0,
      water_ml: 0,
      heart_rate_avg: 70,
      calories_burned: 0,
      medications_taken: [],
    };
    await this.putOne('health_logs', newLog);
    return newLog;
  }

  public async saveHealthLog(log: HealthLog): Promise<void> {
    await this.init();
    await this.putOne('health_logs', log);
  }

  // Spiritual Log
  public async getSpiritualLog(dateStr: string): Promise<SpiritualLog> {
    await this.init();
    const existing = await this.getOne<SpiritualLog>('spiritual_logs', dateStr);
    if (existing) return existing;

    const newLog: SpiritualLog = {
      id: dateStr,
      date: dateStr,
      mala_counts: {},
      puja_completed: false,
      meditation_minutes: 0,
    };
    await this.putOne('spiritual_logs', newLog);
    return newLog;
  }

  public async saveSpiritualLog(log: SpiritualLog): Promise<void> {
    await this.init();
    await this.putOne('spiritual_logs', log);
  }

  // Encrypted Vault
  public async getVaultItems(): Promise<VaultItem[]> {
    await this.init();
    return this.getAll<VaultItem>('vault_items');
  }

  public async saveVaultItem(item: VaultItem): Promise<void> {
    await this.init();
    await this.putOne('vault_items', item);
  }

  public async deleteVaultItem(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('vault_items', id);
  }

  // AI Memories
  public async getAIMemories(): Promise<AIMemory[]> {
    await this.init();
    return this.getAll<AIMemory>('ai_memories');
  }

  public async saveAIMemory(memory: AIMemory): Promise<void> {
    await this.init();
    await this.putOne('ai_memories', memory);
  }

  public async deleteAIMemory(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('ai_memories', id);
  }

  // Notifications
  public async getSmartNotifications(): Promise<SmartNotification[]> {
    await this.init();
    return this.getAll<SmartNotification>('smart_notifications');
  }

  public async saveSmartNotification(n: SmartNotification): Promise<void> {
    await this.init();
    await this.putOne('smart_notifications', n);
  }

  public async deleteSmartNotification(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('smart_notifications', id);
  }

  // Download Tasks
  public async getDownloadTasks(): Promise<DownloadTask[]> {
    await this.init();
    return this.getAll<DownloadTask>('download_tasks');
  }

  public async saveDownloadTask(task: DownloadTask): Promise<void> {
    await this.init();
    await this.putOne('download_tasks', task);
  }

  public async deleteDownloadTask(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('download_tasks', id);
  }

  // Utility Notes
  public async getUtilityNotes(): Promise<UtilityNote[]> {
    await this.init();
    return this.getAll<UtilityNote>('utility_notes');
  }

  public async saveUtilityNote(note: UtilityNote): Promise<void> {
    await this.init();
    await this.putOne('utility_notes', note);
  }

  public async deleteUtilityNote(id: string): Promise<void> {
    await this.init();
    await this.deleteOne('utility_notes', id);
  }

  // Clipboard History
  public async getClipboardHistory(): Promise<ClipboardItem[]> {
    await this.init();
    return this.getAll<ClipboardItem>('clipboard_history');
  }

  public async addClipboardItem(item: ClipboardItem): Promise<void> {
    await this.init();
    await this.putOne('clipboard_history', item);
  }

  public async clearClipboardHistory(): Promise<void> {
    await this.init();
    if (!this.db) {
      localStorage.removeItem('gn_clipboard_history');
      return;
    }
    const tx = this.db.transaction('clipboard_history', 'readwrite');
    tx.objectStore('clipboard_history').clear();
  }

  // Universal Smart Search Across Database
  public async searchAll(query: string): Promise<{
    timeBlocks: TimeBlock[];
    habits: Habit[];
    documents: StudyDocument[];
    utilityNotes: UtilityNote[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return { timeBlocks: [], habits: [], documents: [], utilityNotes: [] };

    const timeBlocks = (await this.getTimeBlocks()).filter(
      (tb) => tb.title.toLowerCase().includes(q) || tb.category.toLowerCase().includes(q)
    );

    const habits = (await this.getHabits()).filter(
      (h) => h.title.toLowerCase().includes(q) || h.category.toLowerCase().includes(q)
    );

    const documents = (await this.getStudyDocuments()).filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );

    const utilityNotes = (await this.getUtilityNotes()).filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );

    return { timeBlocks, habits, documents, utilityNotes };
  }
  // Batch Array Helpers & Alias Methods
  public async saveTimeBlocks(blocks: TimeBlock[]): Promise<void> {
    await this.init();
    await this.putMany('time_blocks', blocks);
  }

  public async saveHabits(habits: Habit[]): Promise<void> {
    await this.init();
    await this.putMany('habits', habits);
  }

  public async saveGoals(goals: Goal[]): Promise<void> {
    await this.init();
    await this.putMany('goals', goals);
  }

  public async saveUserProfile(user: UserProfile): Promise<void> {
    await this.init();
    await this.putOne('user', user);
  }

  public async saveStudyDocuments(docs: StudyDocument[]): Promise<void> {
    await this.init();
    await this.putMany('study_documents', docs);
  }

  public async saveFlashcardDecks(decks: FlashcardDeck[]): Promise<void> {
    await this.init();
    await this.putMany('flashcard_decks', decks);
  }

  public async saveUtilityNotes(notes: UtilityNote[]): Promise<void> {
    await this.init();
    await this.putMany('utility_notes', notes);
  }

  public async saveClipboardHistory(items: ClipboardItem[]): Promise<void> {
    await this.init();
    await this.putMany('clipboard_history', items);
  }

  public async saveDownloadTasks(tasks: DownloadTask[]): Promise<void> {
    await this.init();
    await this.putMany('download_tasks', tasks);
  }

  public async saveVaultItems(items: VaultItem[]): Promise<void> {
    await this.init();
    await this.putMany('vault_items', items);
  }

  public async getRegistrationForms(): Promise<RegistrationForm[]> {
    await this.init();
    return this.getAll<RegistrationForm>('registration_forms');
  }

  public async saveRegistrationForms(forms: RegistrationForm[]): Promise<void> {
    await this.init();
    await this.putMany('registration_forms', forms);
  }

  public async getNotifications(): Promise<any[]> {
    await this.init();
    return this.getAll<any>('smart_notifications');
  }

  public async saveNotifications(notifs: any[]): Promise<void> {
    await this.init();
    await this.putMany('smart_notifications', notifs);
  }

  public async saveAIMemories(mems: AIMemory[]): Promise<void> {
    await this.init();
    await this.putMany('ai_memories', mems);
  }
}

export const dbEngine = new DatabaseEngine();
export const db = dbEngine;
