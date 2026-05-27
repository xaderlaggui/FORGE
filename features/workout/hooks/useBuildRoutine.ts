import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoutines } from '../../../hooks/useRoutines';
import { useExercises } from './useExercises';
import { useAuthStore } from '../../../stores/authStore';
import { groqComplete } from '../../../services/groq';
import { buildRoutinePrompt } from '../../../constants/prompts';
import { SPLITS, PURPOSES, SplitType, PurposeType, ExData } from '../components/RoutineBuilder/constants';
import type { Exercise } from '../../../types';

export function useBuildRoutine() {
  const router = useRouter();
  const { saveRoutine }           = useRoutines();
  const { data: dbExercises }     = useExercises();
  const { user }                  = useAuthStore();

  const [step,    setStep]    = useState(1);
  const [name,    setName]    = useState('');
  const [split,   setSplit]   = useState<SplitType>('push');
  const [purpose, setPurpose] = useState<PurposeType>('hypertrophy');
  const [exercises, setExercises] = useState<ExData[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [previewEx,  setPreviewEx]  = useState<Exercise | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // ── Derive preset bank from current purpose ─────────────────
  const presets = PURPOSES[purpose].presets;

  // ── Exercises filtered to selected split (for picker + auto-populate) ────
  const splitExercises = useMemo(() => {
    if (!dbExercises) return [];
    if (split === 'full') return dbExercises;
    return dbExercises.filter(e => e.category === split);
  }, [dbExercises, split]);

  // ── Warning: purpose-aware ──────────────────────────────────
  const overlapWarning = useMemo(() => {
    if (purpose === 'strength') {
      return exercises.length > 4
        ? `Strength sessions work best with 4 or fewer exercises. Consider removing ${exercises.length - 4}.`
        : null;
    }
    const primary = exercises.map(e => e.category).filter(Boolean);
    const dups = primary.filter((v, i) => primary.indexOf(v) !== i);
    if (dups.length > 0) {
      const names = exercises.filter(e => e.category === dups[0]).map(e => e.name);
      if (names.length >= 2)
        return `"${names[0]}" and "${names[1]}" target the same muscle group (${dups[0]}). Consider removing one.`;
    }
    return null;
  }, [exercises, purpose]);

  // ── AI Exercise Generator ──────────────────────────────────
  const generateWithAI = async () => {
    setIsAiGenerating(true);
    try {
      const equipment = user?.equipmentAccess ?? 'full';
      const equipmentDesc = {
        full:       'full commercial gym (barbells, dumbbells, cables, machines)',
        dumbbells:  'dumbbells and a bench only',
        bodyweight: 'bodyweight only, no equipment',
      }[equipment] ?? 'full gym';

      const purposeDesc = PURPOSES[purpose].description;
      const splitLabel  = SPLITS[split].label;
      const cap = purpose === 'strength' ? 4 : 5;

      const prompt = buildRoutinePrompt(splitLabel, PURPOSES[purpose].label, purposeDesc, equipmentDesc, cap, purpose);

      const content = await groqComplete(
        [{ role: 'user', content: prompt }],
        { model: 'llama-3.1-8b-instant', max_tokens: 600, temperature: 0.5, response_format: { type: 'json_object' } }
      );

      const parsed = JSON.parse(content);
      const arr: { name: string; sets: number; reps: string }[] = Array.isArray(parsed)
        ? parsed
        : (parsed.exercises ?? parsed.workout ?? []);

      if (!arr.length) throw new Error('Empty response');

      const defaultPreset = PURPOSES[purpose].presets[0];
      const mapped: ExData[] = arr.slice(0, cap).map(e => {
        const known = splitExercises.find(
          db => db.name.toLowerCase() === e.name.toLowerCase()
        );
        return {
          name: e.name,
          preset: (`${e.sets}×${e.reps}`) || defaultPreset,
          category: known?.category ?? split,
          purpose: known?.purpose ?? purpose,
        };
      });
      setExercises(mapped);
    } catch (err) {
      console.error('AI generate error:', err);
      Alert.alert('AI Error', 'Could not generate exercises. Using smart suggestions instead.');
      autoPopulate();
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ── Auto-populate exercises on step 2→3 ────────────────────
  const autoPopulate = () => {
    if (!dbExercises || exercises.length > 0) return;

    let pool = [...splitExercises]; 

    if (purpose !== 'mixed') {
      const purposeFiltered = pool.filter(e => e.purpose === purpose);
      if (purposeFiltered.length >= 3) pool = purposeFiltered;
    }

    const grouped: Record<string, Exercise[]> = {};
    pool.forEach(ex => {
      const k = ex.muscleGroups[0] || 'other';
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(ex);
    });

    const selected: Exercise[] = [];
    Object.values(grouped).forEach(group => {
      const pick = group[Math.floor(Math.random() * group.length)];
      selected.push(pick);
    });

    const cap = purpose === 'strength' ? 4 : 5;
    const shuffled = selected.sort(() => 0.5 - Math.random()).slice(0, cap);
    const defaultPreset = presets[0];
    setExercises(shuffled.map(ex => ({ name: ex.name, preset: defaultPreset, category: ex.category, purpose: ex.purpose })));
  };

  // ── Step navigation ─────────────────────────────────────────
  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) return Alert.alert('Missing Name', 'Please name your routine.');
      setStep(2);
    } else if (step === 2) {
      setExercises([]);
      setStep(3);
    } else if (step === 3) {
      if (exercises.length === 0) return Alert.alert('No Exercises', 'Please add at least one exercise.');
      setStep(4);
    }
  };

  const goBack = () => setStep(s => Math.max(1, s - 1));

  // ── Save ────────────────────────────────────────────────────
  const handleSave = async () => {
    const formatted = exercises.map(ex => {
      const parts = ex.preset.split('×');
      return { name: ex.name, sets: Number(parts[0]) || 3, reps: Number(parts[1]) || 10, preset: ex.preset };
    });
    await saveRoutine({
      id: `routine_${Date.now()}`,
      name: name.trim() || 'My Routine',
      split,
      exercises: formatted,
    });
    router.back();
  };

  const setPreset      = (idx: number, p: string) => setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, preset: p } : ex));
  const removeEx       = (idx: number) => setExercises(prev => prev.filter((_, i) => i !== idx));
  const handleAddExercise = (ex: Exercise) => { setExercises(prev => [...prev, { name: ex.name, preset: presets[0], category: ex.category, purpose: ex.purpose }]); setShowPicker(false); };
  const handlePreview  = (exName: string) => { const full = dbExercises?.find(e => e.name === exName); if (full) setPreviewEx(full); };

  return {
    step, name, split, purpose, exercises, showPicker, previewEx, isAiGenerating,
    presets, splitExercises, overlapWarning, dbExercises,
    setName, setSplit, setPurpose, setShowPicker, setPreviewEx,
    generateWithAI, autoPopulate, handleNext, goBack, handleSave,
    setPreset, removeEx, handleAddExercise, handlePreview,
  };
}
