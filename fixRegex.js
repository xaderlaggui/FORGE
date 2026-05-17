const fs = require('fs');

const filesToFix = [
  'app/(auth)/welcome.tsx',
  'app/(tabs)/index.tsx',
  'components/forge/AiCoachCard.tsx',
  'components/forge/ForgeButton.tsx',
  'components/forge/ForgeSegment.tsx',
  'components/forge/ForgeSkeleton.tsx',
  'components/forge/MacroDonutRing.tsx',
  'components/forge/StreakWidget.tsx',
  'components/forge/WorkoutWidgets.tsx'
];

for (const filePath of filesToFix) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Ensure useForgeTheme is imported
    if (!content.includes('useForgeTheme')) {
        content = `import { useForgeTheme } from '@/hooks/useForgeTheme';\n` + content;
    }

    // Replace ForgeTheme. with T.
    content = content.replace(/ForgeTheme\./g, 'T.');

    // Remove import of ForgeTheme
    content = content.replace(/import\s+\{\s*ForgeTheme\s*\}\s*from\s*['"][^'"]+['"];\s*/g, '');
    content = content.replace(/import\s+\{\s*ForgeTheme\s*as\s+T\s*\}\s*from\s*['"][^'"]+['"];\s*/g, '');

    // For each file, we need to inject `const { T } = useForgeTheme();` at the beginning of the component.
    // The easiest way to find the component body is to look for `return (` or `const s = useS(T);` or `const styles = useStyles(T);`
    
    // Welcome
    if (filePath.includes('welcome.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace('export default function WelcomeScreen() {', 'export default function WelcomeScreen() {\n  const { T } = useForgeTheme();');
    }
    
    // Index
    if (filePath.includes('index.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace('export default function HomeScreen() {', 'export default function HomeScreen() {\n  const { T } = useForgeTheme();');
    }
    
    // AiCoachCard
    if (filePath.includes('AiCoachCard.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace('export function AiCoachCard({ tip, isLoading, onChatPress }: AiCoachCardProps) {', 'export function AiCoachCard({ tip, isLoading, onChatPress }: AiCoachCardProps) {\n  const { T } = useForgeTheme();');
    }
    
    // ForgeButton
    if (filePath.includes('ForgeButton.tsx')) {
        if (!content.includes('const { T } = useForgeTheme();')) {
            content = content.replace('export function ForgeButton({', 'export function ForgeButton({\n  const { T } = useForgeTheme();'); // wait, props spread
            content = content.replace('export function ForgeButton(props: ForgeButtonProps) {', 'export function ForgeButton(props: ForgeButtonProps) {\n  const { T } = useForgeTheme();'); // usually props or spread
            // actually just inject after `) {` for the function ForgeButton
            content = content.replace(/export function ForgeButton\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
        }
        content = content.replace('const styles = useStyles(T);', 'const styles = useStyles(T) as any;');
    }
    
    // ForgeSegment
    if (filePath.includes('ForgeSegment.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace(/export function ForgeSegment\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
    }

    // ForgeSkeleton
    if (filePath.includes('ForgeSkeleton.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace(/export function ForgeSkeleton\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
    }

    // MacroDonutRing
    if (filePath.includes('MacroDonutRing.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace(/export function MacroDonutRing\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
    }

    // StreakWidget
    if (filePath.includes('StreakWidget.tsx') && !content.includes('const { T } = useForgeTheme();')) {
        content = content.replace(/export function StreakWidget\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
    }

    // WorkoutWidgets
    if (filePath.includes('WorkoutWidgets.tsx') && !content.includes('const timerStyles = useTimerStyles(T);')) {
        content = content.replace(/export function LiveTimer\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();\n  const timerStyles = useTimerStyles(T);`);
    }
    if (filePath.includes('WorkoutWidgets.tsx') && !content.includes('const { T } = useForgeTheme();', content.indexOf('export function NumpadModal'))) {
        content = content.replace(/export function NumpadModal\([^)]*\)\s*\{/, match => `${match}\n  const { T } = useForgeTheme();`);
    }

    fs.writeFileSync(filePath, content);
}
console.log('Fixed exactly the broken files!');
