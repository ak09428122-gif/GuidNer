/**
 * GuideNer Master Design System Tokens
 * Defines official brand colors, theme mode palettes, typography, spacing, and Material 3 design tokens.
 */

export const BRAND_COLORS = {
  primary: '#2563EB',     // Premium Blue Accent
  secondary: '#3882F6',   // Soft Gradient Blue
  purple: '#7C3AED',      // AI & Spiritual Purple Accent
  magenta: '#D946EF',     // Vibrant Highlight
  teal: '#14BBA6',        // Health Vitals & Success Teal
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Red
  info: '#06B6D4',        // Cyan
} as const;

export type ThemeMode = 'light' | 'dark' | 'oled';

export interface ColorPalette {
  canvas: string;
  surface: string;
  surfaceHover: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryContainer: string;
  accentPurple: string;
  accentTeal: string;
  inputBg: string;
  inputBorder: string;
  shadow: string;
}

export const THEMES: Record<ThemeMode, ColorPalette> = {
  light: {
    canvas: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceHover: '#F1F5F9',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryContainer: '#EFF6FF',
    accentPurple: '#7C3AED',
    accentTeal: '#14BBA6',
    inputBg: '#F8FAFC',
    inputBorder: '#CBD5E1',
    shadow: '0 4px 12px -2px rgba(15, 23, 42, 0.08)',
  },
  dark: {
    canvas: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    card: '#1E293B',
    cardBorder: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryContainer: '#1E3A8A',
    accentPurple: '#8B5CF6',
    accentTeal: '#2DD4BF',
    inputBg: '#0F172A',
    inputBorder: '#334155',
    shadow: '0 4px 16px -2px rgba(0, 0, 0, 0.4)',
  },
  oled: {
    canvas: '#000000',
    surface: '#121212',
    surfaceHover: '#1E1E1E',
    card: '#18181B',
    cardBorder: '#27272A',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryContainer: '#1E3A8A',
    accentPurple: '#8B5CF6',
    accentTeal: '#2DD4BF',
    inputBg: '#121212',
    inputBorder: '#27272A',
    shadow: '0 4px 16px -2px rgba(0, 0, 0, 0.8)',
  },
};

export const TYPOGRAPHY = {
  fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
  displayLarge: { fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 800 },
  displayMedium: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 700 },
  titleLarge: { fontSize: '1.125rem', lineHeight: '1.625rem', fontWeight: 600 },
  titleMedium: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 600 },
  bodyLarge: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400 },
  bodyMedium: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400 },
  labelSmall: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500 },
};

export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '0.75rem', // 12px
  lg: '1rem',    // 16px
  xl: '1.5rem',  // 24px
  '2xl': '2rem', // 32px
};

export const RADII = {
  sm: '0.375rem', // 6px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  full: '9999px',
};

export type AIPersonaMode = 'friendly' | 'professional' | 'strict' | 'minimal';

export const AI_PERSONA_CONFIGS: Record<AIPersonaMode, { label: string; icon: string; description: string; tagColor: string }> = {
  friendly: {
    label: 'Friendly',
    icon: '😊',
    description: 'Warm, encouraging, and empathetic life companion',
    tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  professional: {
    label: 'Professional',
    icon: '💼',
    description: 'Structured, direct, and efficient objective assistant',
    tagColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  strict: {
    label: 'Strict Coach',
    icon: '⚡',
    description: 'High accountability, zero excuses, goal-focused disciplinarian',
    tagColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  minimal: {
    label: 'Minimal',
    icon: '🎯',
    description: 'Concise, quiet, bulleted facts only when requested',
    tagColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
};
