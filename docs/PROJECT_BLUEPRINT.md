# GuideNer — Master Project Blueprint

## 1. Executive Architecture Overview

GuideNer is designed as a single, unified, AI-powered Life Operating System (Life OS). Rather than functioning as a collection of disconnected utility apps, GuideNer brings schedule management, habit tracking, goal execution, study tools, document management, health and spiritual tracking, encrypted file security, daily utilities, universal download management, and smart notifications under one cohesive architecture.

### Architectural Principles
* **Clean Modular Architecture**: Strict separation of Presentation, Domain, Data, Core AI/Security, and System Utility layers.
* **Offline-First Resilience**: All core data, local search, encrypted vaults, daily tracking, and utilities reside locally in persistent offline storage (IndexedDB / SQLite / Secure Enclave), seamlessly synchronizing with optional cloud and Gemini AI endpoints when online.
* **Unified Centralized AI Engine**: A single AI Engine abstraction layer (`AIEngineService`) manages context, prompt orchestration, memory extraction, and model routing (Offline Local Fallback + Gemini 2.5 Server-side API).
* **Cross-Platform & Desktop Design**: Shared business logic, database, and responsive presentation layer designed for seamless compilation across Android, Windows, Linux, and macOS.
* **2-Tap Navigation Golden Rule**: Maximum depth of 2-3 taps to perform any major action, utilizing workspace hubs instead of multi-tiered nested sub-pages.
* **Material Design 3 Design System**: Adaptive theme engine supporting Light, Dark, and OLED Dark modes with fluid responsive layouts for mobile, foldable, tablet, and desktop screens.

---

## 2. System Architecture & Layering

```
+-----------------------------------------------------------------------+
|                         PRESENTATION LAYER                            |
| Material 3 UI | Workspaces | Utilities | Downloader | Desktop Adaptor |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                    BUSINESS LOGIC / STATE LAYER                       |
| State Management | Event Handlers | Workspace ViewModels & Providers  |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                          DOMAIN LAYER                                 |
| Use Cases | Domain Entities | Life Score Engine | AI Context Aggregator |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                           DATA LAYER                                  |
| Repositories | Data Sources (Local/Remote) | Downloader | Cache Engine|
+-----------------------------------------------------------------------+
           |                        |                       |
           v                        v                       v
+-----------------------+  +---------------------+  +-------------------+
| LOCAL PERSISTENCE &   |  | CENTRAL AI ENGINE   |  | UNIFIED SMART     |
| ENCRYPTED VAULT       |  | Gemini 2.5 API &    |  | NOTIFICATION      |
| SQLite/IndexedDB/Vault|  | Offline Orchestrator|  | CENTER            |
+-----------------------+  +---------------------+  +-------------------+
```

---

## 3. Module Relationships & Communication

```
                            +--------------------------------+
                            |    Centralized AI Engine       |
                            |  (Context, Memory, Prompts)    |
                            +---------------+----------------+
                                            |
      +-------------------+-----------------+-------------------+-------------------+
      |                   |                 |                   |                   |
      v                   v                 v                   v                   v
+-----------+       +-----------+     +-----------+       +-----------+       +-----------+
|  Life OS  |       |   Study   |     | Health/   |       |  Daily    |       | Universal |
|  Module   |       |  Module   |     | Spiritual |       | Utilities |       | Download  |
+-----+-----+       +-----+-----+     +-----+-----+       +-----+-----+       +-----+-----+
      |                   |                 |                   |                   |
      +-------------------+-----------------+-------------------+-------------------+
                                            |
                                            v
                            +--------------------------------+
                            | Smart Notification Center      |
                            | & Life Score Analytics Engine  |
                            +---------------+----------------+
                                            |
                                            v
                            +--------------------------------+
                            |   Encrypted Security Vault     |
                            |   & Cross-Platform Storage     |
                            +--------------------------------+
```

---

## 4. Navigation System & Screen Hierarchy

### Primary Navigation (Bottom Navigation / Sidebar Hubs)
1. **Home Tab**
   - Daily Overview Header (Greeting, Weather/Date, Life Score Progress)
   - Interactive AI Companion Card & Daily Briefing
   - Active Time Block & Next Schedule Item
   - Quick Action Row (Add Task, Quick Note, Log Water, Start Study, Utilities)
   - Habits Streak Carousel
   - Health Vitals & Goal Progress Snapshots
2. **AI Tab (AI Life Companion)**
   - Unified Chat Interface with Voice Input & File Attachment
   - Persona Mode Selector (Friendly, Professional, Strict Coach, Minimal)
   - Memory Explorer & Insight Recommendations
   - AI Daily Review & Proactive Suggestions
3. **Life OS Tab (Workspace Hub)**
   - 24-Hour Interactive Timeline Planner & Time-Blocking Canvas
   - Habit Builder & Matrix (Streaks, Completion Rates, Heatmaps)
   - Goal Hierarchy Matrix (Daily -> Weekly -> Monthly -> Lifetime Goals)
   - Smart Routines Manager (Morning, Work, Night, Weekend)
4. **Study Tab (Knowledge & Document Workspace)**
   - AI Tutor Chat & Document Q&A Engine
   - Smart PDF Reader & Annotation Studio
   - OCR Camera Scanner & Text Extractor
   - Flashcards & Adaptive Quiz Deck
   - Spaced Repetition Revision Planner
5. **Health & Spiritual Tab (Wellness & Devotion Hub)**
   - Health Dashboard (Steps, Sleep, Water, Heart Rate, Meds)
   - Smartwatch Synchronization Interface
   - Spiritual Workspace (Puja Checklist, Mantras, Scriptures, Mala Counter)
   - Mental Wellness & Mood Journal
6. **Daily Utilities Workspace Hub (1-2 Taps Access)**
   - Alarm & Smart Alarm (Sleep cycle aligned)
   - Stopwatch & Multi-timer
   - Smart Calculator & Financial / Unit Converter
   - Currency Converter (Online rate sync)
   - QR Code & Barcode Scanner / Generator
   - Flashlight Shortcut & Voice Recorder
   - Quick Scratchpad Notes & Privacy-Controlled Clipboard History
7. **Universal Download Hub**
   - Download Manager & Link Paste Box
   - Active Downloads (Pause, Resume, Background Progress)
   - File Preview & Auto File Organization Categories (Docs, Audio, Video, Zip)
   - Download History & File Exporter
8. **Profile, Vault & System Drawer / Sub-Hub**
   - Encrypted Vault (Biometric Passwords, Secure Documents, Notes)
   - Universal File Transfer Hub (Local Peer-to-Peer & QR Pairing)
   - Smart Notification Center Settings (Alarm, Meds, Prayer, Tasks, AI)
   - Privacy Dashboard, AI Memory Manager & Cross-Platform Sync Backup

---

## 5. Unified Local Database Schema & Data Models

### Tables / Collections Specification

#### A. Users & Preferences (`users`)
* `id`: UUID (Primary Key)
* `name`: String
* `email`: String (Optional)
* `persona_mode`: Enum (`friendly`, `professional`, `strict`, `minimal`)
* `life_score`: Integer (0 - 1000)
* `desktop_layout_compact`: Boolean
* `created_at`: Timestamp
* `updated_at`: Timestamp

#### B. Schedules & Time Blocks (`time_blocks`)
* `id`: UUID (Primary Key)
* `title`: String
* `category`: Enum (`work`, `study`, `health`, `spiritual`, `leisure`, `routine`, `utility`)
* `start_time`: Timestamp
* `end_time`: Timestamp
* `priority`: Enum (`low`, `medium`, `high`, `critical`)
* `energy_level`: Enum (`low`, `medium`, `high`)
* `is_completed`: Boolean
* `repeat_rule`: String (RRULE format)
* `created_at`: Timestamp

#### C. Habits (`habits`)
* `id`: UUID (Primary Key)
* `title`: String
* `frequency`: Enum (`daily`, `weekly_days`, `interval`)
* `current_streak`: Integer
* `best_streak`: Integer
* `target_count`: Integer
* `category`: String
* `logs`: JSON Array of `{ date: String, completed: Boolean, count: Integer }`
* `created_at`: Timestamp

#### D. Goals (`goals`)
* `id`: UUID (Primary Key)
* `title`: String
* `description`: Text
* `horizon`: Enum (`daily`, `weekly`, `monthly`, `yearly`, `lifetime`)
* `progress`: Float (0.0 to 1.0)
* `parent_goal_id`: UUID (Nullable, self-referential)
* `target_date`: Date
* `status`: Enum (`in_progress`, `achieved`, `paused`)

#### E. Study Documents & Notes (`study_documents`)
* `id`: UUID (Primary Key)
* `title`: String
* `content`: Text (Rich Text / Markdown)
* `file_path`: String (Local Storage URI for PDFs / Images)
* `file_type`: Enum (`note`, `pdf`, `ocr_scan`, `web_clipping`, `quick_note`)
* `tags`: Array of Strings
* `summary`: Text
* `is_favorite`: Boolean
* `created_at`: Timestamp

#### F. Flashcards & Quizzes (`flashcard_decks`)
* `id`: UUID (Primary Key)
* `title`: String
* `document_id`: UUID (Nullable foreign key)
* `cards`: JSON Array of `{ id: UUID, front: Text, back: Text, last_reviewed: Timestamp, interval: Integer, ease_factor: Float }`
* `next_review_date`: Date

#### G. Health Vitals (`health_logs`)
* `id`: UUID (Primary Key)
* `date`: Date (Indexed)
* `steps`: Integer
* `sleep_minutes`: Integer
* `water_ml`: Integer
* `heart_rate_avg`: Integer
* `calories_burned`: Integer
* `medications_taken`: JSON Array of `{ med_id: UUID, time: String, taken: Boolean }`

#### H. Spiritual & Vrat Logs (`spiritual_logs`)
* `id`: UUID (Primary Key)
* `date`: Date
* `mala_counts`: JSON Map of `{ mantra_id: String, count: Integer }`
* `puja_completed`: Boolean
* `meditation_minutes`: Integer
* `gratitude_note`: Text

#### I. Encrypted Vault Storage (`vault_items`)
* `id`: UUID (Primary Key)
* `title`: String
* `category`: Enum (`password`, `document`, `private_note`, `bank_card`, `identity`)
* `encrypted_payload`: Text (AES-256 Encrypted)
* `iv`: String
* `updated_at`: Timestamp

#### J. AI Memory & Context Store (`ai_memories`)
* `id`: UUID (Primary Key)
* `key`: String
* `value`: Text
* `category`: Enum (`preference`, `goal_context`, `routine_pattern`, `health_fact`)
* `confidence_score`: Float
* `created_at`: Timestamp

#### K. Smart Notifications Schedule (`smart_notifications`)
* `id`: UUID (Primary Key)
* `title`: String
* `body`: Text
* `trigger_time`: Timestamp
* `category`: Enum (`alarm`, `smart_alarm`, `study`, `task`, `medicine`, `prayer`, `water`, `workout`, `event`, `birthday`, `ai_suggestion`)
* `is_active`: Boolean
* `sound_tone`: String
* `repeat_pattern`: String

#### L. Universal Downloads (`download_tasks`)
* `id`: UUID (Primary Key)
* `source_url`: String
* `file_name`: String
* `file_category`: Enum (`document`, `media`, `archive`, `code`, `other`)
* `file_size`: Integer (Bytes)
* `downloaded_size`: Integer (Bytes)
* `status`: Enum (`pending`, `downloading`, `paused`, `completed`, `failed`)
* `local_path`: String
* `created_at`: Timestamp

---

## 6. Project Directory & File Layout

```
/src
  /assets                  # Fonts, SVG Icons, Audio files, Standard Illustrations
  /core
    /ai                    # Central AI Engine Service, Gemini API Proxy, Prompt Templates
    /config                # App Config, Environment Constants, Feature Flags
    /database              # DB Client, Migrations, Indexing, Encrypted Storage Adapters
    /notifications         # Unified Smart Notification Engine & Alert Dispatcher
    /security              # AES-256 Encryption, Biometric Auth, Token Manager
    /theme                 # Material 3 Color Schemes, Typography, Elevation, Spacing
    /utils                 # Formatting, Date Helpers, Math/Life Score Calculations
  /features
    /home                  # Home Dashboard, Widgets, Daily Briefing
    /ai_companion          # AI Chat, Memory Explorer, Voice & Persona Controls
    /life_os               # Timeline Planner, Time Blocking, Habit Engine, Goal Hierarchy
    /study                 # AI Tutor, PDF Reader, Flashcards, Quiz Generator, OCR Scanner
    /health_spiritual      # Vitals Tracker, Smartwatch Sync, Meds, Puja/Mantra, Spiritual Library
    /utilities             # Daily Utility Hub (Alarm, Calc, Stopwatch, Unit/Currency, Voice)
    /downloader            # Universal Download Manager, Link Paster, File Organizer
    /vault                 # Encrypted Vault, Password Manager, Biometrics
    /transfer              # Peer-to-Peer File Transfer & QR Pairing
    /reports               # Analytics Generator, Life Score Engine, PDF/CSV Exporter
  /shared
    /components            # Custom M3 Buttons, Cards, Inputs, Dialogs, Charts, Desktop Frame
    /models                # Core Shared Interfaces and Types
    /services              # System-level Notification Service, Audio Synth, Cross-Platform Adaptors
  /App.tsx                 # Main Root Component with Navigation Routing & Responsive Desktop Frame
  /main.tsx                # Entry point
```

---

## 7. Implementation Roadmap

### Phase 1: Core Foundation & Infrastructure
1. Initialize clean architecture file structure and state management backbone.
2. Build centralized Material 3 theme provider (Light, Dark, High-Contrast) and layout system with desktop responsiveness.
3. Establish local database persistence engine, encrypted vault module, and Smart Notification Center.
4. Implement Central AI Engine service proxying Gemini API with lazy initialization and offline fallback structure.

### Phase 2: Home Dashboard & Life OS Core
1. Develop Bottom Navigation and Adaptive Desktop Sidebar adhering to the 2-Tap Golden Rule.
2. Build Home Dashboard with interactive AI Companion card, Life Score counter, and daily summary widgets.
3. Build 24-Hour Timeline Planner with drag-and-drop time-blocking.
4. Implement Habit Tracker with streak calculation algorithms and completion heatmaps.
5. Implement Goal Hierarchy system (Daily -> Weekly -> Monthly -> Lifetime).

### Phase 3: Daily Utilities Hub & Universal Download Hub
1. Build Daily Utility Workspace with Alarms, Smart Alarms, Stopwatch, Timer, Smart Calculator, Unit/Currency Converter, Quick Notes, Voice Recorder, and Clipboard History.
2. Integrate QR Code & Barcode Scanner/Generator components.
3. Build Universal Download Hub with link paste, download task state machine (Pause/Resume/Progress), and auto-file categorization.

### Phase 4: Smart Study & Document Ecosystem
1. Build AI Tutor interactive conversational assistant for explanation and doubt resolution.
2. Build PDF Document Studio with view rendering, AI summarization, and key concept extraction.
3. Integrate OCR Camera/Image Scanner with text extraction and copy/note export capabilities.
4. Build Flashcard Deck and Adaptive Quiz Generator using spaced repetition logic.

### Phase 5: Health, Wellness & Spiritual Workspace
1. Develop Health Dashboard tracking Steps, Water, Sleep, Heart Rate, and Medication Reminders.
2. Implement Smartwatch API mock & sync state adapters.
3. Build Spiritual Workspace with Puja checklist, Mala tap counter, Mantra audio reader, and scripture viewer.
4. Build Life Score calculation engine aggregating productivity, habits, health, utilities, and routine compliance.

### Phase 6: Security Vault, Universal Transfer & AI Memory
1. Implement Encrypted Vault with Biometric PIN/Password gating and encrypted payload storage.
2. Implement Universal File Transfer UI supporting peer device simulation and QR code pairing.
3. Implement AI Memory Manager enabling users to view, edit, or wipe stored personal context.
4. Build Universal Smart Search scanning across tasks, notes, PDFs, health logs, downloaded files, and vaults.

### Phase 7: Final Verification & Performance Polish
1. Perform comprehensive compilation and linting checks (`compile_applet`).
2. Verify touch targets (44px+), fluid responsive layout across desktop, mobile, and tablet views, and accessibility contrast.
3. Final review against all Master Specifications and Final Feature Enhancements.

---

## 8. Brand Identity & Official Design Guidelines

### Visual Identity Specifications
* **Logo Concept**: "Letter G" (Guide, Growth, Genius) + "Forward Arrow" (Progress, Direction) + "Genius Star" (AI, Intelligence, Excellence).
* **Tagline**: `YOUR AI LIFE GUIDE`
* **Color Palette**:
  - Primary Accent Blue: `#2563EB`
  - Secondary Blue: `#3882F6`
  - Soft Purple: `#7C3AED`
  - Vibrant Magenta: `#D946EF`
  - Teal Highlight: `#14BBA6`
* **UI Themes**:
  - Light Canvas (Pure White `#FFFFFF`, Soft Gray Cards `#F8FAFC`, Subtitle `#64748B`)
  - Dark Mode Canvas (`#0F172A` / `#1E293B` Slate)
  - High Contrast / OLED Black Mode (`#000000` / `#121212`)
* **Core Screens & Layouts**:
  1. Dashboard (Home with Greeting, AI Companion Card, Quick Actions, Tasks, Habits, Vitals)
  2. AI Assistant (Multi-Persona Chat with Offline/Online indicator, Voice, Attachment)
  3. Life Manager (Timeline 24h block, Habits streak, Goals hierarchy, Routine builder)
  4. Study Hub (Notes, Books, Papers, AI Tutor, Flashcards, OCR)
  5. Secure Vault (Passwords, Bank Cards, Documents, Private Notes, Biometric gate)
  6. Transfer Hub (PC Connect, QR Pair, Recent Transfers, File Progress)
  7. Analytics & Reports (Daily/Weekly/Monthly charts for Study Time, Tasks, Focus Score)
  8. Student Registration & Olympiad Portal (5-Step Form Wizard & Printable Summary)
  9. Admin / Backend Dashboard (KPI Cards, Growth Charts, Activity Feed)
  10. Health & Finance Tracker (Steps, Calories, Sleep, Heart Rate, Expense/Income Ring)
  11. Settings & Privacy Dashboard (App Theme, AI Memory Manager, Offline Mode toggle)

