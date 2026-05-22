
const fs = require('fs');
const path = require('path');

const targetFiles = [
  'features/dashboard/components/RecentWorkoutsList.tsx',
  'features/nutrition/components/DailyCalorieSummary.tsx',
  'features/progress/components/VolumeChart.tsx',
  'features/progress/components/WeightChart.tsx',
  'features/workout/components/WorkoutSetsTable.tsx',
  'app/workoutHistory.tsx'
];

targetFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // For these files, replace borderRadius: T.radii.xl with ...T.shadows.lift, borderRadius: T.radii.xl
  // but only if it doesn't already have ...T.shadows
  const newContent = content.split('\n').map(line => {
    if (line.includes('borderRadius: T.radii.xl') && !line.includes('...T.shadows')) {
       return line.replace('borderRadius: T.radii.xl', '...T.shadows.lift, borderRadius: T.radii.xl');
    }
    return line;
  }).join('\n');
  
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent);
    console.log('Updated:', file);
  }
});

