// ForgeTheme — no runtime imports, pure data

// ─────────────────────────────────────────────────────────────────────────────
// FORGE Design Tokens  v2.0
// Single source of truth for all styling decisions.
// 60% neutral foundation · 30% supporting tones · 10% forge accent
// ─────────────────────────────────────────────────────────────────────────────

export const ForgeTheme = {

  // ── Color Tokens ─────────────────────────────────────────────────────────

  colors: {
    // Background layers (elevation stack — darkest → lightest)
    bg0: '#0A0A0C',   // App base — deepest layer
    bg1: '#121215',   // Card surface — elevation 1
    bg2: '#1A1A1F',   // Elevated card — elevation 2
    bg3: '#222228',   // Input fields, chips — elevation 3
    bg4: '#2A2A32',   // Modals, tooltips — elevation 4

    // Border / Separator
    b0:  '#1F1F26',   // Hairline separator (0.5px)
    b1:  '#2C2C36',   // Default card border
    b2:  '#3A3A46',   // Focused / hover border

    // Text hierarchy (never use pure white)
    t1:  '#F2F2F5',   // Primary — headings, important content
    t2:  '#9A9AA8',   // Secondary — body text, subtitles
    t3:  '#52525E',   // Tertiary — labels, captions, empty states
    t4:  '#36363F',   // Quaternary — disabled / placeholder

    // Brand — Forge Orange
    forge:      '#FF5C2E',    // Primary CTA, active states
    forgeDim:   '#FF5C2E26', // 15% alpha — glow backgrounds
    forgeMid:   '#FF7A52',   // Hover / lighter variant
    forgeMuted: '#CC4A25',   // Pressed / darker variant

    // Semantic / Data colors
    green:   '#30D158',  // Success, completion, nutrition positive
    greenDim:'#30D15820',
    blue:    '#0A84FF',  // Info, water tracking
    blueDim: '#0A84FF20',
    gold:    '#FFD60A',  // Streak, achievement, XP
    goldDim: '#FFD60A20',
    red:     '#FF453A',  // Error, destructive, overload
    redDim:  '#FF453A20',
    purple:  '#BF5AF2',  // AI Coach indicator
    purpleDim:'#BF5AF220',

    // Overlay
    overlay: 'rgba(0,0,0,0.65)',
    overlayLight: 'rgba(0,0,0,0.35)',

    // Legacy aliases (keep for backward-compat while migrating)
    /** @deprecated use forge */       forgeHover: '#FF7A52',
  },

  // ── Typography ──────────────────────────────────────────────────────────

  typography: {
    // Families (ensure these are loaded in _layout.tsx via useFonts)
    families: {
      display: 'SpaceMono',   // Hero numbers, wordmark — swap for SpaceGrotesk when loaded
      heading: 'SpaceMono',   // Section headings
      body:    undefined,     // System default → SF Pro (iOS) / Roboto (Android)
      mono:    'SpaceMono',   // Timers, data, metrics
    },

    // Size scale — max 4 in use per screen
    sizes: {
      display: 32,  // Hero metrics, big numbers
      h1:      24,  // Screen titles
      h2:      20,  // Section headings
      h3:      17,  // Card titles, list headers
      body:    15,  // Main body content
      bodyS:   13,  // Supporting text, descriptions
      label:   11,  // Uppercase labels (use with letterSpacing)
      caption: 10,  // Metadata, timestamps
    },

    // Weight scale — max 2 per screen
    weights: {
      regular:  '400' as const,
      medium:   '500' as const,
      semibold: '600' as const,
      bold:     '700' as const,
      black:    '800' as const,
    },

    // Line height multipliers
    lineHeights: {
      tight:  1.2,  // Headings
      body:   1.5,  // Body text
      loose:  1.7,  // Readable long-form
    },
  },

  // ── Spacing (4pt / 8pt grid) ─────────────────────────────────────────────

  spacing: {
    // Named scale
    px1: 4,   // Micro — inline gap
    px2: 8,   // Tight — icon pad, small gap
    px3: 12,  // Compact — list item vertical
    px4: 16,  // Standard — card padding
    px5: 20,  // Page — screen horizontal margin
    px6: 24,  // Section — between content blocks
    px7: 32,  // Large — major section gap
    px8: 48,  // Hero — safe area padding
    px9: 64,  // Maximum — oversized safe zones

    // Semantic aliases
    xs:   4,
    sm:   8,
    md:   12,
    lg:   16,
    xl:   20,
    xxl:  24,
    page: 20,  // Standard screen paddingHorizontal
  },

  // ── Border Radius ────────────────────────────────────────────────────────

  radii: {
    xs:   4,    // Tags, tiny chips
    sm:   8,    // Small chips, badges
    md:   12,   // Buttons, segmented controls
    lg:   16,   // Standard cards
    xl:   20,   // Hero cards
    xxl:  28,   // Large modals, bottom sheets
    full: 9999, // Pills, avatars, circles
  },

  // ── Shadows / Elevation ──────────────────────────────────────────────────

  shadows: {
    // Neutral card shadow
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
    // Forge orange glow — use sparingly on active CTAs
    forge: {
      shadowColor: '#FF5C2E',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.30,
      shadowRadius: 12,
      elevation: 6,
    },
    // Floating elements — FABs, bottom sheets
    float: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.40,
      shadowRadius: 20,
      elevation: 12,
    },
    // Subtle lift — chips, inline badges
    lift: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
  },

  // ── Motion / Animation ───────────────────────────────────────────────────

  motion: {
    // Duration presets (ms)
    duration: {
      instant:  100,  // Tap feedback
      fast:     150,  // Press states
      standard: 250,  // Most UI transitions
      enter:    350,  // Screen entrances, modals
      slow:     500,  // Progress rings, elaborate transitions
      pulse:   1400,  // Breathing / ambient animations
    },
    // Easing descriptors — pass these to withSpring or compose in component
    spring: { damping: 14, stiffness: 120 } as const,
  },

  // ── Touch Targets ────────────────────────────────────────────────────────

  touch: {
    minSize: 44,      // iOS HIG minimum (pt)
    minSizeMd: 48,    // Material Design minimum (dp)
    minGap: 8,        // Minimum gap between targets
  },
} as const;

// ── Convenience re-export ─────────────────────────────────────────────────

/** Short alias: import { T } from '@/constants/ForgeTheme' */
export const T = ForgeTheme;

export type ForgeColors = typeof ForgeTheme.colors;
export type ForgeSpacing = typeof ForgeTheme.spacing;
