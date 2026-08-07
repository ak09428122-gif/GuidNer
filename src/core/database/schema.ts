/**
 * GuideNer Master Database Schema Definitions
 * Defines types and interfaces for all 13 core tables/collections in the offline-first database.
 */

export type AIPersona = 'friendly' | 'professional' | 'strict' | 'minimal';
export type TimeBlockCategory = 'work' | 'study' | 'health' | 'spiritual' | 'leisure' | 'routine' | 'utility';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type GoalHorizon = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'lifetime';
export type GoalStatus = 'in_progress' | 'achieved' | 'paused';
export type DocumentFileType = 'note' | 'pdf' | 'ocr_scan' | 'web_clipping' | 'quick_note';
export type VaultCategory = 'password' | 'document' | 'private_note' | 'bank_card' | 'identity';
export type NotificationCategory = 'alarm' | 'smart_alarm' | 'study' | 'task' | 'medicine' | 'prayer' | 'water' | 'workout' | 'event' | 'birthday' | 'ai_suggestion';
export type DownloadCategory = 'document' | 'media' | 'archive' | 'code' | 'other';
export type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'failed';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  persona_mode: AIPersona;
  life_score: number; // 0 to 1000
  desktop_layout_compact: boolean;
  pin_hash?: string;
  biometric_enabled: boolean;
  dark_mode: 'light' | 'dark' | 'oled';
  created_at: string;
  updated_at: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  category: TimeBlockCategory;
  start_time: string; // ISO string or HH:MM
  end_time: string;   // ISO string or HH:MM
  priority: PriorityLevel;
  energy_level: EnergyLevel;
  is_completed: boolean;
  repeat_rule?: string; // RRULE format
  location?: string;
  notes?: string;
  created_at: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  completed: boolean;
  count: number;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly_days' | 'interval';
  target_count: number;
  current_streak: number;
  best_streak: number;
  category: string;
  icon?: string;
  logs: HabitLog[];
  created_at: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  horizon: GoalHorizon;
  progress: number; // 0.0 to 1.0
  parent_goal_id?: string;
  target_date: string;
  status: GoalStatus;
  created_at: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  content: string; // Rich Text / Markdown
  file_path?: string;
  file_type: DocumentFileType;
  tags: string[];
  summary?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  last_reviewed?: string;
  interval: number; // Spaced repetition interval in days
  ease_factor: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  document_id?: string;
  cards: Flashcard[];
  next_review_date: string;
  created_at: string;
}

export interface MedicationLog {
  med_id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
}

export interface HealthLog {
  id: string; // Format: YYYY-MM-DD
  date: string;
  steps: number;
  sleep_minutes: number;
  water_ml: number;
  heart_rate_avg: number;
  calories_burned: number;
  medications_taken: MedicationLog[];
  weight_kg?: number;
  blood_pressure?: string;
}

export interface SpiritualLog {
  id: string; // Format: YYYY-MM-DD
  date: string;
  mala_counts: Record<string, number>; // mantra_id -> count
  puja_completed: boolean;
  meditation_minutes: number;
  gratitude_note?: string;
  scripture_read?: string;
}

export interface VaultItem {
  id: string;
  title: string;
  category: VaultCategory;
  encrypted_payload: string; // Encrypted JSON payload string
  iv: string; // Initialization vector
  username_or_key?: string;
  updated_at: string;
}

export interface AIMemory {
  id: string;
  key: string;
  value: string;
  category?: 'preference' | 'goal_context' | 'routine_pattern' | 'health_fact';
  confidence_score?: number;
  confidence?: number;
  created_at: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  body?: string;
  message?: string;
  trigger_time?: string; // ISO string
  timestamp?: string;
  created_at?: string;
  category?: NotificationCategory;
  is_active?: boolean;
  read?: boolean;
  is_read?: boolean;
  sound_tone?: string;
  repeat_pattern?: string;
}

export interface RegistrationForm {
  id: string;
  student_name: string;
  grade: string;
  date_of_birth: string;
  email: string;
  phone: string;
  school_name: string;
  city: string;
  selected_olympiads: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  registration_number: string;
  submitted_at: string;
}

export interface DownloadTask {
  id: string;
  source_url: string;
  file_name: string;
  file_category: DownloadCategory;
  file_size: number;
  downloaded_size: number;
  status: DownloadStatus;
  local_path?: string;
  created_at: string;
}

export interface UtilityNote {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updated_at: string;
}

export interface ClipboardItem {
  id: string;
  content: string;
  copied_at: string;
  is_sensitive: boolean;
}

export type OmniAirEngine = 'omni_beam' | 'omni_direct' | 'omni_bluetooth';
export type AttachmentType =
  | 'document'
  | 'gallery'
  | 'camera'
  | 'audio'
  | 'contact'
  | 'password'
  | 'emergency_card'
  | 'timetable'
  | 'bill_split'
  | 'location';

export interface OmniAirMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  isMe: boolean;
  content: string;
  attachmentType?: AttachmentType;
  attachmentData?: any;
  engineUsed: OmniAirEngine;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
  autoDeleteSeconds?: number;
  encrypted?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  reactions?: string[];
}

export interface OmniAirChatSession {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  onlineStatus: 'online' | 'offline' | 'transferring';
  defaultEngine: OmniAirEngine;
  updatedAt: string;
  isBroadcast?: boolean;
  isGroup?: boolean;
}

export interface BrowserBookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  createdAt: string;
}

export interface BrowserHistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt: string;
}

export type ActivityCategory =
  | 'new_feature'
  | 'download'
  | 'transfer'
  | 'ai_action'
  | 'browser_download'
  | 'study_update'
  | 'health_update'
  | 'system_message';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  timestamp: string;
  status: 'completed' | 'new' | 'synced' | 'active' | 'delivered';
  targetTab?: string;
  isRead: boolean;
  isPinned: boolean;
}

