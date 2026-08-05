# GuideNer — Master Design System Specification

## 1. Brand Identity & Visual Language

### Brand Concept & Logo Mark
GuideNer's brand mark embodies **Guidance**, **Growth**, and **Genius**:
* **Letter G**: Represents Guide, Growth, Genius, and the unified Life OS foundation.
* **Forward Arrow**: Represents Progress, Forward Motion, Direction, and Momentum.
* **Genius Star**: Represents AI Intelligence, Precision, and Excellence.
* **Tagline**: `YOUR AI LIFE GUIDE`

### Brand Values
* **AI-Powered**: Proactive intelligence, natural conversation, context-aware suggestions.
* **100% Secure & Private**: AES-256 encrypted vault, biometric authentication, zero unauthorized tracking.
* **Offline-First**: Reliable performance regardless of connectivity.
* **Fast & Lightweight**: Zero clutter, instant response, battery optimized.
* **Premium & Minimal**: Material Design 3 elegance, generous negative space, refined typography.

---

## 2. Color System & Color Tokens

### Official Brand Color Palette

| Color Role | Token Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `--gn-primary` | `#2563EB` | Main CTAs, active tab highlights, primary brand mark |
| **Secondary Blue** | `--gn-blue-light` | `#3882F6` | Secondary buttons, gradient start, chart lines |
| **Soft Purple** | `--gn-purple` | `#7C3AED` | AI Companion accents, spiritual workspace highlights, gradient midpoint |
| **Vibrant Magenta** | `--gn-magenta` | `#D946EF` | AI sparkles, streak indicators, special highlights |
| **Teal Accent** | `--gn-teal` | `#14BBA6` | Health vitals, success states, water tracker |
| **Success** | `--gn-success` | `#10B981` | Completed tasks, positive goal progress |
| **Warning** | `--gn-warning` | `#F59E0B` | Pending items, alarms, streak reminders |
| **Error** | `--gn-error` | `#EF4444` | Security alerts, missed habits, critical priority |

### Theme Mode Variations

#### Light Mode Palette (Default)
* **Canvas Background**: `#FFFFFF` (Pure White)
* **Surface Background**: `#F8FAFC` (Soft Cool Slate White)
* **Card Container**: `#FFFFFF` with `#E2E8F0` border & soft 2px shadow
* **Text Primary**: `#0F172A` (Slate 900)
* **Text Secondary**: `#64748B` (Slate 500)
* **Text Muted**: `#94A3B8` (Slate 400)

#### Dark Mode Palette
* **Canvas Background**: `#0F172A` (Slate 900)
* **Surface Background**: `#1E293B` (Slate 800)
* **Card Container**: `#1E293B` with `#334155` border
* **Text Primary**: `#F8FAFC` (Slate 50)
* **Text Secondary**: `#94A3B8` (Slate 400)
* **Text Muted**: `#64748B` (Slate 500)

#### OLED Black Mode
* **Canvas Background**: `#000000` (Pure Black)
* **Surface Background**: `#121212` (OLED Dark Gray)
* **Card Container**: `#18181B` with `#27272A` border
* **Text Primary**: `#FFFFFF`
* **Text Secondary**: `#A1A1AA`

---

## 3. Typography Hierarchy & Rules

### Font Families
* **Primary Sans**: `Plus Jakarta Sans`, `Inter`, system-ui, sans-serif
* **Display Heading**: `Plus Jakarta Sans`, font-weight 700 / 800
* **Monospace (Code/Math)**: `JetBrains Mono`, `Fira Code`, monospace

### Scale & Hierarchy

| Level | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Large** | 32px | 1.25 (40px) | 800 (Bold) | Dashboard main greeting, Life Score numbers |
| **Display Medium**| 24px | 1.3 (31.2px)| 700 (Bold) | Section headers, workspace titles |
| **Title Large**   | 18px | 1.4 (25.2px)| 600 (Semi) | Card titles, modal titles, task names |
| **Title Medium**  | 16px | 1.5 (24px)  | 600 (Semi) | Subheaders, list item titles |
| **Body Large**    | 16px | 1.5 (24px)  | 400 (Regular)| Primary content, notes, chat messages |
| **Body Medium**   | 14px | 1.5 (21px)  | 400 (Regular)| Secondary content, descriptions |
| **Label Small**   | 12px | 1.4 (16.8px)| 500 (Medium) | Tags, metadata, tab labels, pill captions |

### Readability Golden Rules
* Minimum body text size: **16px**.
* Line height ratio: **1.5 – 1.7** for body paragraphs.
* Maximum line width: **65–75 characters** (`ch`).
* Controls & Badges: Single-line `white-space: nowrap` labels only.

---

## 4. Spatial Matrix, Grid & Radii

### Spacing Grid (8px Base System)
* `xs`: 4px
* `sm`: 8px
* `md`: 12px
* `lg`: 16px (Standard Container Padding)
* `xl`: 24px (Section Gap)
* `2xl`: 32px (Workspace Separation)
* `3xl`: 48px

### Nested Border Radius Formula
`Inner Corner Radius = Outer Corner Radius - Padding`

* **Card Corner Radius**: `16px` (`rounded-2xl`)
* **Inner Container Radius**: `12px` (`rounded-xl` when padding is 4px)
* **Button Radius**: `12px` (`rounded-xl`) or Pill `9999px` (`rounded-full`)
* **Badge / Pill Radius**: `9999px` (`rounded-full`)

---

## 5. Core Component Design Specifications

### A. App Header & Brand Mark
* Horizontal brand logo with G-Arrow mark + GuideNer text + `YOUR AI LIFE GUIDE` subtitle.
* Quick action icons on top-right: Notification Bell, Search Bar, Settings.

### B. AI Companion Card
* **Gradient Frame**: Subtle border with `#2563EB` to `#7C3AED` gradient glow.
* **Avatar**: Interactive G-Star animated icon with mood indicator (Friendly, Professional, Strict Coach, Minimal).
* **AI Message Bubble**: Soft tinted background with high legibility.

### C. Workspace Cards
* **Elevation**: 0px border + soft 2px shadow in Light Mode; 1px subtle border (`#334155`) in Dark Mode.
* **Padding**: 16px (`p-4`).
* **Header**: Icon in soft tinted circle + Title + Trailing Action (chevron/menu).

### D. Primary Action Buttons
* **Gradient Button**: Background `linear-gradient(135deg, #2563EB, #7C3AED)`, white bold text, shadow `0 4px 14px rgba(37,99,235,0.3)`.
* **Standard Button**: Solid `#2563EB`, hover brightness drop, 44px+ touch height.
* **Touch Target**: Minimum 44px height x 44px width.

### E. Navigation Bars
* **Bottom Nav (Mobile)**: 5-tab bar with active pill indicator (`#2563EB` tint), smooth sliding transition.
* **Sidebar Rail (Desktop)**: Vertical navigation dock with collapsible workspace shortcuts.

---

## 6. Motion & Interactive Feedback

* **Standard Transition**: `cubic-bezier(0.4, 0.0, 0.2, 1)`, 200ms duration.
* **Scale Click Feedback**: Button compress to `0.97` on press (`active:scale-97`).
* **Hover State**: Subtle brightness increase / 2px vertical lift on desktop (`hover:-translate-y-0.5`).
* **Entry Animation**: Fade & slight slide up (`fade-in`, `slide-in-from-bottom-2`).

---

## 7. Accessibility Standards (WCAG 2.1 AA)

* **Contrast Ratios**: Minimum 4.5:1 for body text against dark or light background; minimum 3:1 for large display titles.
* **Touch Target Size**: Minimum 44x44px for all mobile interactive elements.
* **Focus States**: Visible 2px focus ring (`ring-2 ring-blue-500 ring-offset-2`) for keyboard and screen reader accessibility.
