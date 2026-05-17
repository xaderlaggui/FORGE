import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ForgeTheme } from '../../constants/ForgeTheme';
import { useNutrition } from '../../hooks/useNutrition';
export default function NutritionScreen() {
  const router = useRouter();
  const { data: nutrition, isLoading } = useNutrition();

  if (isLoading || !nutrition) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={ForgeTheme.colors.forge} />
      </View>
    );
  }

  // Calculate totals
  const totalProtein = nutrition.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = nutrition.meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = nutrition.meals.reduce((sum, m) => sum + m.fat, 0);
  const totalCal = nutrition.meals.reduce((sum, m) => sum + m.calories, 0);
  const waterLiters = ((nutrition.waterMl || 0) / 1000).toFixed(1);

  const goalCal = 2500;
  const calPercent = Math.min((totalCal / goalCal) * 100, 100);

  const renderMealSection = (title: string, emoji: string, meal: any) => {
    return (
      <View style={styles.mealSection}>
        <View style={styles.mealSectionHeader}>
          <View>
            <Text style={styles.mealSectionTitle}>{emoji} {title}</Text>
            <Text style={[styles.mealKcal, meal.calories === 0 && { color: ForgeTheme.colors.t3 }]}>
              {meal.calories} kcal
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push({ pathname: '/addMeal', params: { mealName: meal.name } })}>
            <Text style={styles.addMealBtn}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, meal.calories === 0 && { opacity: 0.5 }]}>
          {meal.calories > 0 ? (
            <View style={styles.mealItem}>
              <View>
                <Text style={styles.mealItemName}>{meal.name} Summary</Text>
                <View style={styles.macroChips}>
                  <Text style={[styles.macroChip, styles.macroChipP]}>{meal.protein}g P</Text>
                  <Text style={[styles.macroChip, styles.macroChipC]}>{meal.carbs}g C</Text>
                  <Text style={[styles.macroChip, styles.macroChipF]}>{meal.fat}g F</Text>
                </View>
              </View>
              <Text style={styles.mealItemKcal}>{meal.calories}</Text>
            </View>
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: ForgeTheme.colors.t3 }}>No meals logged yet</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <View style={styles.todayTag}>
          <Text style={styles.todayTagText}>Today</Text>
        </View>
      </View>

      {/* Daily Summary */}
      <View style={styles.nutritionSummary}>
        <View style={styles.calRow}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.calConsumed}>{totalCal}</Text>
            <Text style={styles.calGoal}> / {goalCal} kcal</Text>
          </View>
          <Text style={{ fontSize: 11, color: ForgeTheme.colors.green, fontWeight: '600' }}>{Math.round(calPercent)}%</Text>
        </View>
        <View style={styles.calBarWrap}>
          <LinearGradient
            colors={[ForgeTheme.colors.forge, ForgeTheme.colors.forgeHover]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.calBar, { width: `${calPercent}%` }]}
          />
        </View>
        <View style={styles.macroRow}>
          <View style={styles.macroStat}>
            <Text style={[styles.macroStatNum, { color: ForgeTheme.colors.green }]}>{totalProtein}g</Text>
            <Text style={styles.macroStatLabel}>Protein</Text>
          </View>
          <View style={styles.macroStat}>
            <Text style={[styles.macroStatNum, { color: ForgeTheme.colors.blue }]}>{totalCarbs}g</Text>
            <Text style={styles.macroStatLabel}>Carbs</Text>
          </View>
          <View style={styles.macroStat}>
            <Text style={[styles.macroStatNum, { color: '#FFD60A' }]}>{totalFat}g</Text>
            <Text style={styles.macroStatLabel}>Fat</Text>
          </View>
          <View style={styles.macroStat}>
            <Text style={[styles.macroStatNum, { color: ForgeTheme.colors.blue }]}>{waterLiters}L</Text>
            <Text style={styles.macroStatLabel}>Water</Text>
          </View>
        </View>
      </View>

      {/* Meals */}
      {renderMealSection('Breakfast', '🌅', nutrition.meals.find(m => m.name === 'Breakfast') || nutrition.meals[0])}
      {renderMealSection('Lunch', '☀️', nutrition.meals.find(m => m.name === 'Lunch') || nutrition.meals[1])}
      {renderMealSection('Dinner', '🌙', nutrition.meals.find(m => m.name === 'Dinner') || nutrition.meals[2])}
      {renderMealSection('Snacks', '🍎', nutrition.meals.find(m => m.name === 'Snacks') || nutrition.meals[3])}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ForgeTheme.colors.bg0 },
  scrollContent: { paddingBottom: 100 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: ForgeTheme.colors.t1 },
  todayTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, backgroundColor: ForgeTheme.colors.forge },
  todayTagText: { fontSize: 11, fontWeight: '600', color: '#fff' },

  nutritionSummary: { marginHorizontal: 20, marginTop: 12, marginBottom: 24, backgroundColor: ForgeTheme.colors.bg1, borderRadius: 16, borderWidth: 0.5, borderColor: ForgeTheme.colors.b1, padding: 16 },
  calRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  calConsumed: { fontSize: 22, fontWeight: '800', color: ForgeTheme.colors.t1 },
  calGoal: { fontSize: 12, color: ForgeTheme.colors.t2 },
  calBarWrap: { height: 6, backgroundColor: ForgeTheme.colors.bg3, borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  calBar: { height: 6, borderRadius: 3 },

  macroRow: { flexDirection: 'row', gap: 8 },
  macroStat: { flex: 1, alignItems: 'center' },
  macroStatNum: { fontSize: 14, fontWeight: '700' },
  macroStatLabel: { fontSize: 10, color: ForgeTheme.colors.t3, marginTop: 2 },

  mealSection: { marginHorizontal: 20, marginBottom: 16 },
  mealSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  mealSectionTitle: { fontSize: 13, fontWeight: '600', color: ForgeTheme.colors.t1 },
  mealKcal: { fontSize: 11, color: ForgeTheme.colors.t2 },
  addMealBtn: { fontSize: 11, fontWeight: '600', color: ForgeTheme.colors.forge },

  card: { backgroundColor: ForgeTheme.colors.bg1, borderRadius: 16, borderWidth: 0.5, borderColor: ForgeTheme.colors.b1, overflow: 'hidden' },
  mealItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  mealItemName: { fontSize: 13, color: ForgeTheme.colors.t1, fontWeight: '600' },
  mealItemKcal: { fontSize: 13, fontWeight: '700', color: ForgeTheme.colors.t2 },

  macroChips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 6 },
  macroChip: { fontSize: 10, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 100, fontWeight: '600', overflow: 'hidden' },
  macroChipP: { backgroundColor: 'rgba(52,199,89,0.15)', color: ForgeTheme.colors.green },
  macroChipC: { backgroundColor: 'rgba(10,132,255,0.15)', color: ForgeTheme.colors.blue },
  macroChipF: { backgroundColor: 'rgba(255,214,10,0.15)', color: '#FFD60A' },
});
