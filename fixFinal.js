const fs = require('fs');

// 1. welcome.tsx - likely T is used in a nested component or missing
let welcome = fs.readFileSync('app/(auth)/welcome.tsx', 'utf8');
if (!welcome.includes('const { T } = useForgeTheme();', welcome.indexOf('function '))) {
    welcome = welcome.replace(/export default function [^{]*\{/, match => match + '\n  const { T } = useForgeTheme();');
}
// Fix any lingering T errors by just passing it or defining it
welcome = welcome.replace(/T\./g, 'ST.'); // fallback to static theme for anything outside
welcome = welcome.replace(/const \{ T \} = useForgeTheme\(\);\s*ST\./, 'const { T } = useForgeTheme();\n  T.');
fs.writeFileSync('app/(auth)/welcome.tsx', welcome);

// 2. ForgeButton.tsx
let fb = fs.readFileSync('components/forge/ForgeButton.tsx', 'utf8');
fb = fb.replace(/styles\[/g, '(styles as any)[');
fb = fb.replace(/ForgeTheme\./g, 'T.');
fs.writeFileSync('components/forge/ForgeButton.tsx', fb);

// 3. ForgeSegment.tsx
let fs_seg = fs.readFileSync('components/forge/ForgeSegment.tsx', 'utf8');
fs_seg = fs_seg.replace(/ForgeTheme\./g, 'T.');
fs.writeFileSync('components/forge/ForgeSegment.tsx', fs_seg);

// 4. ForgeSkeleton.tsx
let fs_skel = fs.readFileSync('components/forge/ForgeSkeleton.tsx', 'utf8');
fs_skel = fs_skel.replace(/ForgeTheme\./g, 'T.');
fs.writeFileSync('components/forge/ForgeSkeleton.tsx', fs_skel);

// 5. StreakWidget.tsx
let sw = fs.readFileSync('components/forge/StreakWidget.tsx', 'utf8');
sw = sw.replace(/ForgeTheme\./g, 'T.');
fs.writeFileSync('components/forge/StreakWidget.tsx', sw);

// 6. WorkoutWidgets.tsx
let ww = fs.readFileSync('components/forge/WorkoutWidgets.tsx', 'utf8');
ww = ww.replace(/export function LiveTimer\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();\n  const timerStyles = useTimerStyles(T);`);
ww = ww.replace(/export function NumpadModal\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
fs.writeFileSync('components/forge/WorkoutWidgets.tsx', ww);

console.log('Fixed files');
