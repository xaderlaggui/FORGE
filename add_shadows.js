
const fs = require('fs');
const path = require('path');

const targetFiles = [
  'features/progress/components/StatCard.tsx',
  'features/progress/components/MeasurementCard.tsx',
  'features/progress/components/ConsistencyHeatmap.tsx',
  'features/dashboard/components/QuickStatsRow.tsx',
  'features/dashboard/components/MetricRingsRow.tsx',
  'features/planner/components/WeeklyCalendar.tsx',
  'features/planner/components/RoutineList.tsx',
  'features/planner/components/ExerciseLibrary.tsx',
  'features/planner/components/DailyPlanCard.tsx',
  'app/workoutDetail.tsx',
  'app/aiPlan.tsx',
  'app/weeklyMealPlan.tsx',
  'features/nutrition/components/MealLogList.tsx',
  'features/nutrition/components/NutritionCoachBubble.tsx',
  'features/nutrition/components/MacroBreakdown.tsx',
  'features/nutrition/components/HydrationTracker.tsx'
];

targetFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace only if it doesn't already have ...T.shadows
  const newContent = content.split('\n').map(line => {
    if (line.includes('backgroundColor: T.colors.bg1') && !line.includes('...T.shadows') && !line.includes('backgroundColor: T.colors.bg1 +')) {
       return line.replace('backgroundColor: T.colors.bg1', 'backgroundColor: T.colors.bg1, ...T.shadows.lift');
    }
    return line;
  }).join('\n');
  
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent);
    console.log('Updated:', file);
  }
});

