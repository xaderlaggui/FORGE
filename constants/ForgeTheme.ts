export const ForgeTheme = {
  colors: {
    bg0: '#0A0A0B',
    bg1: '#141416',
    bg2: '#1C1C20',
    bg3: '#242428',
    b1: '#2A2A2E',
    t1: '#F5F5F7',
    t2: '#8E8E99',
    t3: '#4E4E58',
    forge: '#FF5C2E',
    forgeHover: '#FF7A52',
    blue: '#0A84FF',
    green: '#34C759',
    gold: '#FFD700',
  },
  typography: {
    // Note: Assuming SpaceMono maps to Space Grotesk in the current codebase 
    // or you can add SpaceGrotesk to the useFonts hook in _layout.tsx
    heading: 'SpaceMono', 
    body: 'System', // React Native uses system font by default (San Francisco/Roboto, similar to Inter)
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    page: 20, // px class
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  }
};
