const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

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
    const sourceFile = project.addSourceFileAtPath(filePath);
    
    // 1. Ensure useForgeTheme is imported
    let useForgeImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue().includes('useForgeTheme'));
    if (!useForgeImport) {
        sourceFile.addImportDeclaration({
            namedImports: ['useForgeTheme'],
            moduleSpecifier: '@/hooks/useForgeTheme'
        });
    }

    // 2. Replace all ForgeTheme. with T.
    let text = sourceFile.getFullText();
    if (text.includes('ForgeTheme.')) {
        text = text.replace(/ForgeTheme\./g, 'T.');
        sourceFile.replaceWithText(text);
    }

    // 3. Find any exported function or component and inject const { T }
    const functions = [
        ...sourceFile.getFunctions(),
        ...sourceFile.getVariableDeclarations().map(vd => {
            const init = vd.getInitializer();
            if (init && (init.getKind() === SyntaxKind.ArrowFunction || init.getKind() === SyntaxKind.FunctionExpression)) {
                return { node: init, isArrow: true };
            }
            return null;
        }).filter(Boolean)
    ];

    for (const fnObj of functions) {
        const fn = fnObj.node || fnObj;
        let body = fn.getBody();

        // Convert implicit return arrow function to block body
        if (body && body.getKind() !== SyntaxKind.Block && fn.getKind() === SyntaxKind.ArrowFunction) {
            const oldText = body.getText();
            fn.setBodyText(`return ${oldText};`);
            body = fn.getBody(); // Re-fetch the new block body
        }

        if (body && body.getKind() === SyntaxKind.Block) {
            const bodyText = body.getText();
            if (bodyText.includes('T.') || bodyText.includes('styles')) {
                if (!bodyText.includes('useForgeTheme()')) {
                    body.insertStatements(0, `const { T } = useForgeTheme();`);
                }
            }
        }
    }

    // specific fix for WorkoutWidgets timerStyles
    if (filePath.includes('WorkoutWidgets.tsx')) {
        let t = sourceFile.getFullText();
        if (!t.includes('const timerStyles = useTimerStyles(T);')) {
            t = t.replace('const { T } = useForgeTheme();', 'const { T } = useForgeTheme();\n    const timerStyles = useTimerStyles(T);');
            sourceFile.replaceWithText(t);
        }
    }

    // specific fix for ForgeButton styles index
    if (filePath.includes('ForgeButton.tsx')) {
        let t = sourceFile.getFullText();
        t = t.replace('const styles = useStyles(T);', 'const styles = useStyles(T) as any;');
        sourceFile.replaceWithText(t);
    }

    // Remove old ForgeTheme import
    const imports = sourceFile.getImportDeclarations();
    for (const imp of imports) {
        if (imp.getModuleSpecifierValue().includes('ForgeTheme')) {
            const namedImports = imp.getNamedImports();
            let keep = false;
            for (const named of namedImports) {
                if (named.getName() === 'ForgeTheme') {
                    named.remove();
                } else {
                    keep = true;
                }
            }
            if (!keep) {
                imp.remove();
            }
        }
    }
}
project.saveSync();
console.log('Fixed exactly the broken files!');
