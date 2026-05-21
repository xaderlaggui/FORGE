const fs = require('fs');
const path = require('path');

const srcDirs = [
  'assets/images/mascot/sticker-1',
  'assets/images/mascot/sticker-2',
  'assets/images/mascot/sticker-3',
  'assets/images/mascot/sticker-4'
];

const targetDir = 'assets/sprites/forge-bear';
const spriteAssetsTsPath = 'features/sprites/sprite-assets.ts';
const spriteJsonPath = 'assets/sprites/forge-bear-sprites.json';

// Ensure target dir exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Delete all existing files in targetDir
const existingFiles = fs.readdirSync(targetDir);
for (const file of existingFiles) {
  fs.unlinkSync(path.join(targetDir, file));
}

// 2. Copy new files
const copiedFiles = [];
const baseNames = new Set();

for (const dir of srcDirs) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    
    let baseName = path.basename(file, '.png');
    let finalName = baseName;
    let finalFileName = finalName + '.png';
    
    // Handle duplicates
    let counter = 2;
    while (baseNames.has(finalName)) {
      finalName = `${baseName}-${counter}`;
      finalFileName = finalName + '.png';
      counter++;
    }
    
    baseNames.add(finalName);
    copiedFiles.push({ id: finalName, file: finalFileName });
    
    fs.copyFileSync(path.join(dir, file), path.join(targetDir, finalFileName));
  }
}

// 3. Generate sprite-assets.ts
let tsContent = 'export const spriteAssets: Record<string, any> = {\n';
copiedFiles.forEach(sprite => {
  // Use absolute path alias or relative to features/sprites
  tsContent += `  '${sprite.id}': require('../../assets/sprites/forge-bear/${sprite.file}'),\n`;
});
tsContent += '};\n';

fs.writeFileSync(spriteAssetsTsPath, tsContent);

// 4. Generate forge-bear-sprites.json
const jsonContent = copiedFiles.map(sprite => ({
  id: sprite.id,
  file: sprite.file,
  character_name: "FORGE",
  pose: sprite.id.replace(/-/g, ' '),
  personality: "Active and motivated",
  triggers: [],
  chatbot_tone: "energetic",
  chatbot_message_examples: [],
  ui_placement: []
}));

fs.writeFileSync(spriteJsonPath, JSON.stringify(jsonContent, null, 2));

console.log(`Successfully refactored ${copiedFiles.length} sprites.`);
