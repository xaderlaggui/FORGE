const fs = require('fs');
const path = require('path');

function fixFiles() {
    // 1. ForgeButton
    const btnPath = 'components/forge/ForgeButton.tsx';
    if (fs.existsSync(btnPath)) {
        let content = fs.readFileSync(btnPath, 'utf8');
        content = content.replace('const styles = useStyles(T);', 'const styles = useStyles(T) as any;');
        content = content.replace(/ForgeTheme\./g, 'T.');
        fs.writeFileSync(btnPath, content);
    }

    // 2. MacroBreakdown
    const mbPath = 'features/nutrition/components/MacroBreakdown.tsx';
    if (fs.existsSync(mbPath)) {
        let content = fs.readFileSync(mbPath, 'utf8');
        if (!content.includes('const mb =')) {
            content = content.replace('const { T } = useForgeTheme();', 'const { T } = useForgeTheme();\n  const mb = useMb(T);');
        }
        content = content.replace(/ForgeTheme\./g, 'T.');
        fs.writeFileSync(mbPath, content);
    }

    // 3. WorkoutWidgets
    const wwPath = 'components/forge/WorkoutWidgets.tsx';
    if (fs.existsSync(wwPath)) {
        let content = fs.readFileSync(wwPath, 'utf8');
        if (!content.includes('const timerStyles =')) {
            content = content.replace('const { T } = useForgeTheme();', 'const { T } = useForgeTheme();\n  const timerStyles = useTimerStyles(T);');
        }
        content = content.replace(/ForgeTheme\./g, 'T.');
        fs.writeFileSync(wwPath, content);
    }

    // Fix ForgeTheme. everywhere else
    const filesToFix = [
        'components/forge/ForgeSegment.tsx',
        'components/forge/ForgeSkeleton.tsx',
        'components/forge/MacroDonutRing.tsx',
        'components/forge/StreakWidget.tsx',
        'components/forge/WorkoutAtoms.tsx'
    ];

    for (const f of filesToFix) {
        if (fs.existsSync(f)) {
            let content = fs.readFileSync(f, 'utf8');
            content = content.replace(/ForgeTheme\./g, 'T.');
            fs.writeFileSync(f, content);
        }
    }
}
fixFiles();
console.log('Fixed remaining files!');
