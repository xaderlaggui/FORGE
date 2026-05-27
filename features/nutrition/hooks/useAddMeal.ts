import { useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MEAL_ANALYSIS_SYSTEM_PROMPT } from '../../../constants/prompts';
import { useNutrition } from './useNutrition';
import { groqComplete } from '../../../services/groq';
import type { Meal } from '../../../types';

export interface MealFormState {
  foodName: string;
  portion: string;
  cals: string;
  pro: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
  waterMl: string;
}

export function useAddMeal() {
  const router = useRouter();
  const { mealName: mealNameParam } = useLocalSearchParams();
  const { data: nutrition, updateNutrition } = useNutrition();

  const getDefaultMealSlot = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return 'Breakfast';
    if (h >= 11 && h < 16) return 'Lunch';
    if (h >= 16 && h < 21) return 'Dinner';
    return 'Snacks';
  };
  const mealName = (mealNameParam as string) || getDefaultMealSlot();

  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [wasAiAnalyzed, setWasAiAnalyzed] = useState(false);
  const [resolvedMealName, setResolvedMealName] = useState(mealName);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low' | null>(null);
  const [analysisNotes, setAnalysisNotes] = useState('');

  // Form state
  const [foodName, setFoodName] = useState('');
  const [portion, setPortion] = useState('');
  const [cals, setCals] = useState('');
  const [pro, setPro] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [sugar, setSugar] = useState('');
  const [waterMl, setWaterMl] = useState('');

  const detectMealSlotFromText = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (/\bbreakfast\b/.test(lower)) return 'Breakfast';
    if (/\blunch\b/.test(lower)) return 'Lunch';
    if (/\bdinner\b/.test(lower)) return 'Dinner';
    if (/\bsnack(s)?\b/.test(lower)) return 'Snacks';
    return null;
  };

  const validateAndCorrectCalories = (
    calories: number,
    protein: number,
    carbsG: number,
    fatG: number
  ): { corrected: number; wasOff: boolean } => {
    const computed = protein * 4 + carbsG * 4 + fatG * 9;
    const diff = Math.abs(calories - computed);
    const threshold = calories * 0.12;
    if (diff > threshold && computed > 0) {
      return { corrected: Math.round(computed), wasOff: true };
    }
    return { corrected: calories, wasOff: false };
  };

  const analyzeMeal = async () => {
    if (!description.trim()) {
      Alert.alert('Empty', 'Please describe what you ate first.');
      return;
    }

    const detectedSlot = detectMealSlotFromText(description);
    if (detectedSlot) setResolvedMealName(detectedSlot);

    setIsAnalyzing(true);
    try {
      const content = await groqComplete(
        [
          { role: 'system', content: MEAL_ANALYSIS_SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        {
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          max_tokens: 300,
          response_format: { type: 'json_object' },
        }
      );

      const parsed = JSON.parse(content);
      const protein = Number(parsed.protein || 0);
      const carbsVal = Number(parsed.carbs || 0);
      const fatVal = Number(parsed.fat || 0);
      const rawCals = Number(parsed.calories || 0);

      const { corrected: finalCals, wasOff } = validateAndCorrectCalories(rawCals, protein, carbsVal, fatVal);

      setFoodName(parsed.foodName || description);
      setPortion(parsed.portion || '1 serving');
      setCals(String(finalCals));
      setPro(String(protein));
      setCarbs(String(carbsVal));
      setFat(String(fatVal));
      setFiber(String(Number(parsed.fiber || 0)));
      setSugar(String(Number(parsed.sugar || 0)));
      setWaterMl(String(Number(parsed.waterMl || 0)));
      setConfidence(parsed.confidence || 'medium');
      setAnalysisNotes(
        wasOff
          ? `Calories adjusted from ${rawCals} to ${finalCals} to match macros.${parsed.notes ? ' ' + parsed.notes : ''}`
          : parsed.notes || ''
      );

      setAnalyzed(true);
      setWasAiAnalyzed(true);
    } catch (e) {
      console.error(e);
      Alert.alert('Analysis Failed', 'Could not estimate nutrition. You can still enter it manually.');
      setAnalyzed(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!foodName || !cals) {
      Alert.alert('Incomplete', 'Please enter at least a meal name and calories.');
      return;
    }

    try {
      const existingMeals = nutrition?.meals || [];
      const mealIdx = existingMeals.findIndex(m => m.name === resolvedMealName);
      let updatedMeals = [...existingMeals];

      const newMealData: Meal = {
        name: resolvedMealName,
        calories: Number(cals),
        protein: Number(pro) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fiber: Number(fiber) || 0,
        sugar: Number(sugar) || 0,
      };

      const newItem = {
        name: foodName,
        serving: portion || '1 serving',
        calories: Number(cals),
        protein: Number(pro) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      };

      if (mealIdx >= 0) {
        updatedMeals[mealIdx] = {
          name: resolvedMealName,
          calories: (Number(updatedMeals[mealIdx].calories) || 0) + newMealData.calories,
          protein: (Number(updatedMeals[mealIdx].protein) || 0) + newMealData.protein,
          carbs: (Number(updatedMeals[mealIdx].carbs) || 0) + newMealData.carbs,
          fat: (Number(updatedMeals[mealIdx].fat) || 0) + newMealData.fat,
          fiber: (Number(updatedMeals[mealIdx].fiber) || 0) + (newMealData.fiber || 0),
          sugar: (Number(updatedMeals[mealIdx].sugar) || 0) + (newMealData.sugar || 0),
          isAiParsed: (updatedMeals[mealIdx] as any).isAiParsed || wasAiAnalyzed,
          items: [...(updatedMeals[mealIdx].items || []), newItem],
        };
      } else {
        updatedMeals.push({ ...newMealData, isAiParsed: wasAiAnalyzed, items: [newItem] });
      }

      await updateNutrition({
        meals: updatedMeals,
        totalCalories: (Number(nutrition?.totalCalories) || 0) + newMealData.calories,
        waterMl: (Number(nutrition?.waterMl) || 0) + (Number(waterMl) || 0),
      });

      router.back();
    } catch (e: any) {
      console.error('Save Meal Error:', e);
      Alert.alert('Error', e?.message || 'Failed to save meal.');
    }
  };

  return {
    description, setDescription,
    isAnalyzing,
    analyzed, setAnalyzed,
    wasAiAnalyzed,
    resolvedMealName,
    confidence,
    analysisNotes,
    foodName, setFoodName,
    portion, setPortion,
    cals, setCals,
    pro, setPro,
    carbs, setCarbs,
    fat, setFat,
    fiber, setFiber,
    sugar, setSugar,
    waterMl, setWaterMl,
    analyzeMeal,
    handleSave,
  };
}
