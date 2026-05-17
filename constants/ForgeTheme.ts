// ForgeTheme — Apple Fitness Edition
// Pure OLED blacks, bright neon activity rings, and highly rounded shapes.

export const ForgeTheme = {

  // ── Color Tokens ─────────────────────────────────────────────────────────

  colors: {
    // Background layers (Apple system grays)
    bg0: '#000000',   // Pure OLED Black
    bg1: '#1C1C1E',   // Secondary system background
    bg2: '#2C2C2E',   // Tertiary system background
    bg3: '#3A3A3C',   // Quaternary system background
    bg4: '#48484A',   // Prominent floating layer

    // Border / Separator
    b0:  '#38383A',   // Hairline separator
    b1:  '#2C2C2E',   // Default card border
    b2:  '#3A3A3C',   // Focused / hover border

    // Text hierarchy
    t1:  '#FFFFFF',   // Primary text
    t2:  '#8E8E93',   // Apple System Gray
    t3:  '#636366',   // Apple System Gray 2
    t4:  '#48484A',   // Disabled

    // Brand — Apple Fitness "Exercise" Neon Green
    forge:      '#B2FF24',    
    forgeDim:   '#B2FF2426', 
    forgeMid:   '#D4FF70',   
    forgeMuted: '#8FCC1D',   

    // Semantic / Data colors (Apple Activity Ring palette)
    green:   '#B2FF24',  // Exercise Green
    greenDim:'#B2FF2420',
    blue:    '#00E5FF',  // Stand Blue
    blueDim: '#00E5FF20',
    gold:    '#FA114F',  // Move Pink/Red (Replaced gold with Pink)
    goldDim: '#FA114F20',
    red:     '#FF3B30',  // System Destructive Red
    redDim:  '#FF3B3020',
    purple:  '#BF5AF2',  // System Purple
    purpleDim:'#BF5AF220',

    // Overlay
    overlay: 'rgba(0,0,0,0.75)',
    overlayLight: 'rgba(0,0,0,0.45)',

    // Legacy aliases
    /** @deprecated use forge */ forgeHover: '#D4FF70',
  },

  // ── Typography ──────────────────────────────────────────────────────────

  typography: {
    // Stripping out custom fonts to force iOS/Android default System font (San Francisco / Roboto)
    families: {
      display: undefined,
      heading: undefined,
      body:    undefined,
      mono:    undefined, // Fallback to system monospaced for timers
    },

    // Size scale
    sizes: {
      display: 34,  // iOS Large Title
      h1:      28,  // Title 1
      h2:      22,  // Title 2
      h3:      20,  // Title 3
      body:    17,  // Body
      bodyS:   15,  // Subheadline
      label:   13,  // Footnote
      caption: 11,  // Caption
    },

    // Weight scale (Apple uses heavily weighted headings)
    weights: {
      regular:  '400' as const,
      medium:   '500' as const,
      semibold: '600' as const,
      bold:     '700' as const,
      black:    '800' as const,
    },

    lineHeights: {
      tight:  1.1,
      body:   1.3,
      loose:  1.5,
    },
  },

  // ── Spacing ─────────────────────────────────────────────────────────────

  spacing: {
    px1: 4,
    px2: 8,
    px3: 12,
    px4: 16,
    px5: 20,
    px6: 24,
    px7: 32,
    px8: 48,
    px9: 64,

    xs:   4,
    sm:   8,
    md:   12,
    lg:   16,
    xl:   20,
    xxl:  24,
    page: 20,
  },

  // ── Border Radius (Apple's signature squircles) ────────────────────────

  radii: {
    xs:   8,    // Tighter pills
    sm:   12,   // Small inputs
    md:   16,   // Apple style buttons
    lg:   20,   // Standard cards
    xl:   24,   // Hero cards
    xxl:  32,   // Bottom sheets
    full: 9999, // Perfect circles/pills
  },

  // ── Shadows / Elevation ──────────────────────────────────────────────────

  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    forge: {
      shadowColor: '#B2FF24', // Green glow
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.40,
      shadowRadius: 16,
      elevation: 8,
    },
    float: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.50,
      shadowRadius: 24,
      elevation: 14,
    },
    lift: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
  },

  // ── Motion / Animation ───────────────────────────────────────────────────

  motion: {
    duration: {
      instant:  100,
      fast:     150,
      standard: 250,
      enter:    350,
      slow:     500,
      pulse:   1400,
    },
    spring: { damping: 14, stiffness: 120 } as const,
  },

  touch: {
    minSize: 44,
    minSizeMd: 48,
    minGap: 8,
  },
} as const;

export const T = ForgeTheme;
export type ForgeColors = typeof ForgeTheme.colors;
export type ForgeSpacing = typeof ForgeTheme.spacing;
