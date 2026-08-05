/**
 * GuideNer Knowledge Base for AI Guided Mode
 * Built-in comprehensive explanations for every module, screen, feature, and setting.
 */

export type GuidanceLevel = 'beginner' | 'normal' | 'expert';

export interface FeatureExplanation {
  title: string;
  whatItDoes: string;
  whyUseful: string;
  whatHappensNext: string;
}

export interface WalkthroughStep {
  id: string;
  title: string;
  targetId?: string;
  explanation: FeatureExplanation;
}

export interface ScreenGuidance {
  id: string;
  title: string;
  overview: {
    beginner: string;
    normal: string;
    expert: string;
  };
  steps: WalkthroughStep[];
  features: Record<string, FeatureExplanation>;
}

export const KNOWLEDGE_BASE: Record<string, ScreenGuidance> = {
  home: {
    id: 'home',
    title: 'Home Dashboard',
    overview: {
      beginner:
        'Welcome to your GuideNer Home Dashboard! This is your central command center where you can see your daily AI briefing, your overall Life Score (0-1000), today’s scheduled time blocks, habit streaks, and quick study tools all in one glance.',
      normal:
        'The Home Dashboard brings together your AI Daily Briefing, Life Score progress, active time blocks, and habit streaks for seamless daily management.',
      expert:
        'Central command dashboard displaying AI briefing, Life Score metrics, active schedule, habits, and quick actions.',
    },
    steps: [
      {
        id: 'daily_briefing',
        title: 'AI Daily Briefing',
        targetId: 'daily_briefing_card',
        explanation: {
          title: 'AI Daily Briefing',
          whatItDoes: 'Provides an intelligent summary of your day personalized to your active AI persona (Friendly, Professional, Strict, or Minimal).',
          whyUseful: 'Gives you clear focus and motivation every morning aligned with your schedule.',
          whatHappensNext: 'Highlights your top priorities and guides your first task of the day.',
        },
      },
      {
        id: 'life_score',
        title: 'Life Score Meter',
        targetId: 'life_score_widget',
        explanation: {
          title: 'Life Score Meter',
          whatItDoes: 'Tracks your holistic productivity and balance on a scale from 0 to 1000.',
          whyUseful: 'Gamifies consistency across work, study, health, and habits.',
          whatHappensNext: 'Increases automatically as you check off tasks, habits, and study goals.',
        },
      },
      {
        id: 'time_blocks',
        title: 'Today’s Time Blocks',
        targetId: 'time_blocks_widget',
        explanation: {
          title: 'Today’s Time Blocks',
          whatItDoes: 'Displays your structured schedule for today sorted by time, energy level, and priority.',
          whyUseful: 'Prevents burnout by matching demanding tasks with high-energy hours.',
          whatHappensNext: 'Tapping the checkmark marks the block complete and boosts your score.',
        },
      },
      {
        id: 'habits_strip',
        title: 'Habit Streaks',
        targetId: 'habits_widget',
        explanation: {
          title: 'Habit Streaks',
          whatItDoes: 'Tracks daily routine execution and consecutive day streaks.',
          whyUseful: 'Builds long-term momentum and discipline through visual streak counters.',
          whatHappensNext: 'Clicking a habit logs your completion for today.',
        },
      },
      {
        id: 'guided_mode_trigger',
        title: 'AI Guided Mode Button',
        targetId: 'help_me_use_button',
        explanation: {
          title: 'Interactive Screen Tour',
          whatItDoes: 'Launches step-by-step interactive guidance for whichever screen you are on.',
          whyUseful: 'Helps you instantly master any section of GuideNer without confusion.',
          whatHappensNext: 'Starts an interactive walkthrough highlighting each component.',
        },
      },
    ],
    features: {
      daily_briefing: {
        title: 'AI Daily Briefing',
        whatItDoes: 'Summarizes your daily objectives using your chosen AI Persona.',
        whyUseful: 'Keeps you accountable and focused on what matters most today.',
        whatHappensNext: 'Updates dynamically as you finish scheduled tasks.',
      },
      life_score: {
        title: 'Life Score Metric',
        whatItDoes: 'Calculates overall balance between work, study, health, and spirit.',
        whyUseful: 'Gives immediate feedback on how consistently you execute your routines.',
        whatHappensNext: 'Ranks performance and offers target milestones.',
      },
    },
  },

  ai: {
    id: 'ai',
    title: 'AI Companion',
    overview: {
      beginner:
        'This is your AI Companion module. You can chat with GuideNer AI in real-time, ask complex study or life questions, switch persona voices (Friendly, Professional, Strict, Minimal), enable voice narration, and save memory points for long-term advice.',
      normal:
        'The AI Companion provides real-time intelligent dialogue, voice reading, concept tutoring, and personalized memory tracking.',
      expert:
        'Real-time Gemini AI assistant interface supporting personas, TTS, concept explanations, and long-term memory.',
    },
    steps: [
      {
        id: 'persona_selector',
        title: 'AI Persona Modes',
        targetId: 'ai_persona_bar',
        explanation: {
          title: 'AI Persona Modes',
          whatItDoes: 'Allows you to choose between Friendly, Professional, Strict, and Minimal AI coaching styles.',
          whyUseful: 'Adapts the AI tone to your current mood, discipline needs, or working style.',
          whatHappensNext: 'The AI immediately updates its tone and advice style for all responses.',
        },
      },
      {
        id: 'chat_box',
        title: 'Smart Query Box',
        targetId: 'ai_chat_input',
        explanation: {
          title: 'Smart Query Box',
          whatItDoes: 'Accepts questions about math, science, goals, planning, or general life advice.',
          whyUseful: 'Gives fast, structured, and contextual answers tailored to your profile.',
          whatHappensNext: 'Sends your prompt to the server AI engine for immediate response.',
        },
      },
      {
        id: 'speech_narration',
        title: 'Voice Narration (TTS)',
        targetId: 'ai_voice_button',
        explanation: {
          title: 'Voice Narration',
          whatItDoes: 'Reads AI responses aloud using browser Text-to-Speech.',
          whyUseful: 'Allows hands-free learning while multi-tasking or walking.',
          whatHappensNext: 'Plays audible speech narration for the AI reply.',
        },
      },
      {
        id: 'ai_memory',
        title: 'AI Memory Bank',
        targetId: 'ai_memory_card',
        explanation: {
          title: 'AI Memory Bank',
          whatItDoes: 'Stores key facts and preferences you share with the AI over time.',
          whyUseful: 'Ensures the AI gives personalized advice without you needing to repeat yourself.',
          whatHappensNext: 'Persists securely in your offline-first database.',
        },
      },
    ],
    features: {
      persona: {
        title: 'Persona Tone Engine',
        whatItDoes: 'Modifies AI system prompts to match selected personality.',
        whyUseful: 'Tailors motivation and coaching to your personal mindset.',
        whatHappensNext: 'Re-runs chat requests with new system instructions.',
      },
    },
  },

  life_os: {
    id: 'life_os',
    title: 'Life OS Planner',
    overview: {
      beginner:
        'Life OS is your personal operating system for productivity. Here you can schedule Time Blocks, build daily Habits with streak counters, and define Goal Horizons from daily tasks up to lifetime ambitions.',
      normal:
        'Life OS integrates Time Blocking, Habit tracking, and Goal Horizon planning for complete lifecycle management.',
      expert:
        'Integrated lifecycle management system covering time blocks, habit matrix, and multi-tier goal horizons.',
    },
    steps: [
      {
        id: 'time_block_creator',
        title: 'Time Block Scheduler',
        targetId: 'time_block_form',
        explanation: {
          title: 'Time Block Scheduler',
          whatItDoes: 'Schedules dedicated time blocks assigned to category, priority, and energy level.',
          whyUseful: 'Ensures high-energy hours are spent on high-impact work.',
          whatHappensNext: 'Adds a color-coded block to your daily timeline.',
        },
      },
      {
        id: 'habit_tracker',
        title: 'Habit Tracker Matrix',
        targetId: 'habit_section',
        explanation: {
          title: 'Habit Tracker Matrix',
          whatItDoes: 'Tracks daily and weekly recurring habits with streak counters and best records.',
          whyUseful: 'Reinforces positive behavioral routines through visible progress.',
          whatHappensNext: 'Increments your streak counter and updates your Life Score.',
        },
      },
      {
        id: 'goal_horizons',
        title: 'Goal Horizon Planner',
        targetId: 'goals_section',
        explanation: {
          title: 'Goal Horizon Planner',
          whatItDoes: 'Organizes objectives into Daily, Weekly, Monthly, Yearly, and Lifetime tiers.',
          whyUseful: 'Aligns small daily actions with long-term aspirations.',
          whatHappensNext: 'Progress bars update as sub-goals and tasks are completed.',
        },
      },
    ],
    features: {
      time_blocks: {
        title: 'Time Blocking',
        whatItDoes: 'Allocates specific hours for tasks.',
        whyUseful: 'Eliminates procrastination and multi-tasking.',
        whatHappensNext: 'Triggers smart notifications before blocks begin.',
      },
    },
  },

  study: {
    id: 'study',
    title: 'Study Hub & Flashcards',
    overview: {
      beginner:
        'Study Hub is your academic workspace. Write rich study notes, generate flashcard decks with Spaced Repetition, and use the AI Tutor to explain complex topics step by step.',
      normal:
        'Study Hub combines document editing, spaced-repetition flashcards, and an AI Concept Tutor for effective exam prep.',
      expert:
        'Academic management suite featuring markdown notes, spaced repetition flashcard engine, and AI tutoring.',
    },
    steps: [
      {
        id: 'doc_manager',
        title: 'Study Documents',
        targetId: 'study_docs_list',
        explanation: {
          title: 'Study Document Manager',
          whatItDoes: 'Stores structured markdown study notes, summaries, and revision guides.',
          whyUseful: 'Keeps all academic material organized and searchable in one place.',
          whatHappensNext: 'Opens the rich document reader/editor.',
        },
      },
      {
        id: 'flashcard_engine',
        title: 'Spaced Repetition Decks',
        targetId: 'flashcards_section',
        explanation: {
          title: 'Spaced Repetition Decks',
          whatItDoes: 'Tests your memory using interactive flashcard decks with adaptive review intervals.',
          whyUseful: 'Maximizes memory retention while minimizing review time.',
          whatHappensNext: 'Schedules hard cards for sooner review and easy cards for later.',
        },
      },
      {
        id: 'ai_tutor',
        title: 'AI Concept Tutor',
        targetId: 'ai_tutor_box',
        explanation: {
          title: 'AI Concept Tutor',
          whatItDoes: 'Explains complex formulas, theories, or exam concepts in simple terms.',
          whyUseful: 'Breaks down challenging subjects without needing external search engines.',
          whatHappensNext: 'Generates structured bullet points, formulas, and study tips.',
        },
      },
    ],
    features: {
      flashcards: {
        title: 'Flashcards',
        whatItDoes: 'Interactive front/back question cards.',
        whyUseful: 'Active recall for fast exam preparation.',
        whatHappensNext: 'Updates card mastery score.',
      },
    },
  },

  health_spiritual: {
    id: 'health_spiritual',
    title: 'Health & Spiritual Tracker',
    overview: {
      beginner:
        'This module supports your physical and spiritual wellness. Log steps, sleep, water intake, medication schedules, meditation minutes, and use the digital Mala counter for mantra japa.',
      normal:
        'Track physical health metrics (steps, sleep, water, meds) alongside spiritual practices (meditation, mala counter, gratitude).',
      expert:
        'Dual-domain wellness manager tracking biometric logs, medication alarms, meditation, and mala japa.',
    },
    steps: [
      {
        id: 'health_metrics',
        title: 'Daily Health Logs',
        targetId: 'health_metrics_card',
        explanation: {
          title: 'Daily Health Logs',
          whatItDoes: 'Records steps, sleep duration, hydration in ml, and average heart rate.',
          whyUseful: 'Helps maintain physical vitality and recovery for top mental output.',
          whatHappensNext: 'Updates your daily wellness score.',
        },
      },
      {
        id: 'meds_tracker',
        title: 'Medication Schedule',
        targetId: 'meds_card',
        explanation: {
          title: 'Medication Schedule',
          whatItDoes: 'Manages pill times, dosages, and daily compliance checkmarks.',
          whyUseful: 'Ensures medical instructions are followed on time every day.',
          whatHappensNext: 'Triggers smart alarm alerts when doses are due.',
        },
      },
      {
        id: 'mala_counter',
        title: 'Digital Mala Japa Counter',
        targetId: 'mala_card',
        explanation: {
          title: 'Digital Mala Japa Counter',
          whatItDoes: 'Interactive digital bead counter for mantra repetitions and meditation.',
          whyUseful: 'Tracks spiritual focus with haptic feedback and session records.',
          whatHappensNext: 'Increments count up to 108 beads per mala round.',
        },
      },
    ],
    features: {
      mala: {
        title: 'Mala Japa Counter',
        whatItDoes: 'Bead-by-bead mantra counter with round completion sounds.',
        whyUseful: 'Maintains mindful concentration.',
        whatHappensNext: 'Saves spiritual log to offline storage.',
      },
    },
  },

  utilities: {
    id: 'utilities',
    title: 'Daily Utilities Hub',
    overview: {
      beginner:
        'Utilities Hub provides quick daily tools: a Smart Calculator, Scratchpad Notes, Clipboard History, and Smart Alarms to help you manage fast tasks without leaving the app.',
      normal:
        'Access a Smart Calculator, Scratchpad, Clipboard History manager, and Smart Alarms in one convenient hub.',
      expert:
        'Productivity toolkit containing calculator, scratchpad, clipboard history, and alarm triggers.',
    },
    steps: [
      {
        id: 'calculator',
        title: 'Smart Calculator',
        targetId: 'calc_widget',
        explanation: {
          title: 'Smart Calculator',
          whatItDoes: 'Performs arithmetic and expressions directly inside GuideNer.',
          whyUseful: 'Saves time during study or budgeting sessions.',
          whatHappensNext: 'Evaluates expressions instantly.',
        },
      },
      {
        id: 'scratchpad',
        title: 'Scratchpad Notes',
        targetId: 'notes_widget',
        explanation: {
          title: 'Scratchpad Notes',
          whatItDoes: 'Allows rapid note-taking for temporary ideas, phone numbers, or formulas.',
          whyUseful: 'Captures fleeting ideas before they are forgotten.',
          whatHappensNext: 'Saves the note immediately to local storage.',
        },
      },
      {
        id: 'clipboard',
        title: 'Clipboard Manager',
        targetId: 'clipboard_widget',
        explanation: {
          title: 'Clipboard Manager',
          whatItDoes: 'Saves copied snippets so you can re-use text clips anytime.',
          whyUseful: 'Prevents losing important copied links or notes.',
          whatHappensNext: 'One-click copy back to clipboard.',
        },
      },
    ],
    features: {},
  },

  downloader: {
    id: 'downloader',
    title: 'Downloader & Transfer Hub',
    overview: {
      beginner:
        'Downloader Hub manages offline resource downloads and file transfers. Paste links to download educational materials, research papers, or media files for offline viewing.',
      normal:
        'Download and organize study media, research PDFs, and files for offline access.',
      expert:
        'Offline resource downloader and multi-threaded file queue management interface.',
    },
    steps: [
      {
        id: 'url_input',
        title: 'Resource Link Input',
        targetId: 'download_url_input',
        explanation: {
          title: 'Resource Link Input',
          whatItDoes: 'Accepts web download URLs for documents, video lessons, or code archives.',
          whyUseful: 'Pre-loads study materials so you can learn without an internet connection.',
          whatHappensNext: 'Adds the task to the download queue.',
        },
      },
      {
        id: 'download_queue',
        title: 'Download Task Queue',
        targetId: 'download_list',
        explanation: {
          title: 'Download Task Queue',
          whatItDoes: 'Displays progress, download speed, and completion status.',
          whyUseful: 'Allows pausing, resuming, and organizing downloaded files.',
          whatHappensNext: 'Saves completed files into your local GuideNer vault.',
        },
      },
    ],
    features: {},
  },

  vault: {
    id: 'vault',
    title: 'Secure Vault',
    overview: {
      beginner:
        'Secure Vault is your zero-knowledge encrypted locker. Store sensitive passwords, confidential identity notes, bank card credentials, or personal documents secured with master PIN and AES encryption.',
      normal:
        'Store passwords, documents, and private credentials using AES-256 local encryption.',
      expert:
        'Zero-knowledge AES-256 encrypted locker for credentials, private notes, and sensitive records.',
    },
    steps: [
      {
        id: 'pin_security',
        title: 'Master PIN & Biometrics',
        targetId: 'vault_pin_card',
        explanation: {
          title: 'Master PIN Security',
          whatItDoes: 'Locks your encrypted items behind a custom 4-digit PIN.',
          whyUseful: 'Ensures your passwords and credentials stay 100% private.',
          whatHappensNext: 'Unlocks vault contents only after correct PIN authentication.',
        },
      },
      {
        id: 'vault_items',
        title: 'Encrypted Items List',
        targetId: 'vault_items_list',
        explanation: {
          title: 'Encrypted Items List',
          whatItDoes: 'Displays categorized passwords, identity cards, and private notes.',
          whyUseful: 'Centralizes secure credential management offline.',
          whatHappensNext: 'Tap to decrypt and copy passwords or view secure payload.',
        },
      },
    ],
    features: {},
  },

  registration: {
    id: 'registration',
    title: 'Olympiad Registration Form',
    overview: {
      beginner:
        'This portal allows students to fill out and submit official registration forms for national and international academic Olympiads (Mathematics, Science, Cyber, English).',
      normal:
        'Complete, save drafts, and submit official student registrations for academic Olympiads.',
      expert:
        'Academic Olympiad registration submission portal with field validation and status tracking.',
    },
    steps: [
      {
        id: 'student_details',
        title: 'Student Information',
        targetId: 'registration_form_fields',
        explanation: {
          title: 'Student Information Fields',
          whatItDoes: 'Collects student name, grade, date of birth, contact email, and school name.',
          whyUseful: 'Ensures accurate details for exam hall tickets and certificates.',
          whatHappensNext: 'Validates input fields before saving draft or submitting.',
        },
      },
      {
        id: 'exam_selection',
        title: 'Olympiad Selection Grid',
        targetId: 'olympiad_select_grid',
        explanation: {
          title: 'Olympiad Subject Selection',
          whatItDoes: 'Allows choosing one or more Olympiad exams (Math, Science, Cyber, English).',
          whyUseful: 'Enables single-form registration across multiple subjects.',
          whatHappensNext: 'Highlights selected subjects and calculates registration summary.',
        },
      },
      {
        id: 'submission_action',
        title: 'Draft & Submit Action',
        targetId: 'registration_submit_btn',
        explanation: {
          title: 'Form Submission',
          whatItDoes: 'Generates a unique registration ID and submits your form.',
          whyUseful: 'Locks details and routes form to Admin panel for approval.',
          whatHappensNext: 'Issues official registration number and confirmation status.',
        },
      },
    ],
    features: {},
  },

  admin: {
    id: 'admin',
    title: 'Analytics & Admin Panel',
    overview: {
      beginner:
        'The Admin Panel gives high-level analytics on database health, offline storage quota, AI engine status, system audit logs, and student Olympiad form review.',
      normal:
        'Monitor database health, storage quota, AI metrics, audit logs, and registration form approvals.',
      expert:
        'System administration workspace monitoring database telemetry, storage quota, and registration workflows.',
    },
    steps: [
      {
        id: 'db_health',
        title: 'Database Telemetry',
        targetId: 'db_metrics_card',
        explanation: {
          title: 'Database & Storage Telemetry',
          whatItDoes: 'Monitors IndexedDB record counts, store sizes, and local storage fallback.',
          whyUseful: 'Ensures fast startup time and smooth offline performance.',
          whatHappensNext: 'Provides maintenance options like cache clearing.',
        },
      },
      {
        id: 'form_review',
        title: 'Form Approval Workflow',
        targetId: 'admin_forms_table',
        explanation: {
          title: 'Form Approval Workflow',
          whatItDoes: 'Lists submitted student Olympiad forms for review and approval.',
          whyUseful: 'Provides admin oversight for registrations.',
          whatHappensNext: 'Changes status from Pending to Approved or Rejected.',
        },
      },
    ],
    features: {},
  },

  settings: {
    id: 'settings',
    title: 'Settings & Preferences',
    overview: {
      beginner:
        'Customize GuideNer to your exact preferences. Enable or configure AI Guided Mode, switch theme modes (Light, Dark, OLED), adjust AI Persona defaults, manage PIN security, and test speech synthesis.',
      normal:
        'Configure AI Guided Mode, visual themes, AI Personas, vault security, and offline sync preferences.',
      expert:
        'System configuration panel for AI Guided Mode, theme tokens, security credentials, and storage sync.',
    },
    steps: [
      {
        id: 'guided_toggle',
        title: 'AI Guided Mode Toggle',
        targetId: 'guided_mode_toggle_switch',
        explanation: {
          title: 'AI Guided Mode Toggle',
          whatItDoes: 'Enables or disables interactive walkthroughs, screen introductions, and feature popups.',
          whyUseful: 'Helps users learn every feature with zero guesswork.',
          whatHappensNext: 'Turns guidance on or off across all screens.',
        },
      },
      {
        id: 'guided_level_select',
        title: 'Guidance Detail Level',
        targetId: 'guided_level_selector',
        explanation: {
          title: 'Guidance Detail Level',
          whatItDoes: 'Selects between Beginner (detailed), Normal (short), and Expert (minimal).',
          whyUseful: 'Matches explanation depth to your familiarity level.',
          whatHappensNext: 'Immediately shortens or expands all tip text.',
        },
      },
      {
        id: 'tts_narration_setting',
        title: 'Voice Narration (TTS)',
        targetId: 'tts_setting_switch',
        explanation: {
          title: 'Voice Narration (TTS)',
          whatItDoes: 'Toggles automatic or manual Text-to-Speech audio reading for guides.',
          whyUseful: 'Audible guidance makes learning effortless.',
          whatHappensNext: 'Reads explanations out loud when enabled.',
        },
      },
      {
        id: 'reset_history_setting',
        title: 'Reset Guided History',
        targetId: 'reset_guided_history_btn',
        explanation: {
          title: 'Reset Guided History',
          whatItDoes: 'Clears memory of which screen guides you have already seen.',
          whyUseful: 'Allows reviewing first-time screen walkthroughs again.',
          whatHappensNext: 'Re-enables initial screen introduction cards.',
        },
      },
    ],
    features: {},
  },
};
