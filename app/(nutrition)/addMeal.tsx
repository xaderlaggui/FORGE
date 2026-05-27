import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AlertCircle, Candy, Droplets, Dumbbell, Flame, Leaf, Save, Sparkles, Star, Wheat } from 'lucide-react-native';
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { useAddMeal } from '../../features/nutrition/hooks/useAddMeal';

export default function AddMealScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);

  const {
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
  } = useAddMeal();

  const confidenceColor = {
    high: '#4CAF50',
    medium: '#FF9800',
    low: '#F44336',
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
          <Text style={s.title}>
            <Text style={{ color: T.colors.forge }}>LOG</Text> {resolvedMealName.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={s.scroll}>
        {!analyzed ? (
          <View style={s.analyzeWrap}>
            <Text style={s.aiPrompt}>What did you eat?</Text>
            <TextInput
              style={s.aiInput}
              placeholder="e.g. 'I had a bowl of sinigang with 1 cup of white rice' or '2 scrambled eggs'"
              placeholderTextColor={T.colors.t3}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              style={[s.aiBtn, isAnalyzing && { opacity: 0.7 }]}
              onPress={analyzeMeal}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Sparkles size={18} color="#000" strokeWidth={3} />
                  <Text style={s.aiBtnText}>Analyze Meal</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAnalyzed(true)} style={{ marginTop: 24, padding: 12 }}>
              <Text style={{ color: T.colors.t3, textAlign: 'center', fontSize: 14, fontWeight: '600' }}>
                Or enter manually
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.formWrap}>
            {/* AI confidence badge */}
            {wasAiAnalyzed && confidence && (
              <View style={[s.badgePill, { borderColor: confidenceColor[confidence], shadowColor: confidenceColor[confidence] }]}>
                <Star size={12} color={confidenceColor[confidence]} fill={confidenceColor[confidence]} />
                <Text style={[s.badgeText, { color: confidenceColor[confidence] }]}>
                  {confidence.toUpperCase()} CONFIDENCE
                </Text>
              </View>
            )}

            <View style={s.headerWrap}>
              <TextInput style={s.foodNameInput} multiline={true} value={foodName} onChangeText={setFoodName} placeholder="FOOD NAME" placeholderTextColor={T.colors.t3} textAlign="center" />
              <TextInput style={s.portionInput} multiline={true} value={portion} onChangeText={setPortion} placeholder="portion" placeholderTextColor={T.colors.t3} textAlign="center" />
            </View>

            <View style={s.caloriesRing}>
              <TextInput style={s.caloriesValue} value={cals} onChangeText={setCals} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} textAlign="center" />
              <Text style={s.caloriesLabel}>CALORIES</Text>
            </View>

            <View style={s.grid}>
              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Flame size={16} color={T.colors.forge} />
                  <Text style={s.cardLabel}>FAT</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={fat} onChangeText={setFat} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>g</Text>
                </View>
              </View>

              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Dumbbell size={16} color="#A29E9A" />
                  <Text style={s.cardLabel}>PROTEIN</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={pro} onChangeText={setPro} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>g</Text>
                </View>
              </View>

              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Wheat size={16} color="#D4A373" />
                  <Text style={s.cardLabel}>CARBS</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>g</Text>
                </View>
              </View>

              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Leaf size={16} color="#4CAF50" />
                  <Text style={s.cardLabel}>FIBER</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={fiber} onChangeText={setFiber} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>g</Text>
                </View>
              </View>

              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Candy size={16} color="#FF9A8B" />
                  <Text style={s.cardLabel}>SUGARS</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={sugar} onChangeText={setSugar} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>g</Text>
                </View>
              </View>

              <View style={s.card}>
                <View style={s.cardHeader}>
                  <Droplets size={16} color="#42A5F5" />
                  <Text style={s.cardLabel}>WATER</Text>
                </View>
                <View style={s.cardValueRow}>
                  <TextInput style={s.cardValue} value={waterMl} onChangeText={setWaterMl} keyboardType="numeric" placeholder="0" placeholderTextColor={T.colors.t3} />
                  <Text style={s.cardUnit}>ML</Text>
                </View>
              </View>
            </View>

            {!!analysisNotes && (
              <View style={s.notesRow}>
                <AlertCircle size={14} color={T.colors.forge} />
                <Text style={s.notesText}>{analysisNotes}</Text>
              </View>
            )}

            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Save size={18} color="#000" strokeWidth={2.5} />
              <Text style={s.saveBtnText}>SAVE MEAL</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { backgroundColor: T.colors.bg0 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: T.colors.t1, letterSpacing: 1, marginBottom: 4 },
  scroll: { padding: 16, },

  analyzeWrap: { marginTop: 0 },
  aiPrompt: { fontSize: 24, fontWeight: '700', color: T.colors.t1, marginBottom: 16 },
  aiInput: {
    backgroundColor: T.colors.bg1, borderWidth: 1, borderColor: T.colors.b1,
    borderRadius: 16, padding: 16, color: T.colors.t1,
    fontSize: 16, minHeight: 120, marginBottom: 20, lineHeight: 24,
  },
  aiBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: T.colors.forge, padding: 16, borderRadius: 999,
    shadowColor: T.colors.forge, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8,
  },
  aiBtnText: { color: '#000', fontSize: 16, fontWeight: '800', letterSpacing: 1 },

  formWrap: { alignItems: 'center' },

  badgePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
    borderWidth: 1, marginBottom: 12, backgroundColor: T.colors.bg1,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 4
  },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  headerWrap: { alignItems: 'center', marginBottom: 16, width: '100%' },
  foodNameInput: { fontSize: 24, fontWeight: '900', color: T.colors.t1, textTransform: 'uppercase', textAlign: 'center', width: '100%' },
  portionInput: { fontSize: 14, fontWeight: '600', color: T.colors.t3, textAlign: 'center', width: '100%', marginTop: 2 },

  caloriesRing: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 25, paddingHorizontal: 32,
    borderRadius: 999,
    borderWidth: 1, borderColor: T.colors.forge + '4D',
    marginBottom: 15,
    shadowColor: T.colors.forge, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 24, elevation: 12,
    backgroundColor: T.colors.bg1
  },
  caloriesValue: { fontSize: 42, fontWeight: '900', color: T.colors.forge, textAlign: 'center', minWidth: 80, padding: 0 },
  caloriesLabel: { fontSize: 10, fontWeight: '800', color: T.colors.t2, letterSpacing: 2, marginTop: -4 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: '100%', marginBottom: 10
  },
  card: {
    flex: 1, minWidth: '33%',
    backgroundColor: T.colors.bg1,
    borderRadius: 15, padding: 18,
    borderWidth: 1, borderColor: T.colors.b1
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8
  },
  cardLabel: { fontSize: 11, fontWeight: '700', color: T.colors.t2, letterSpacing: 1 },
  cardValueRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 1 },
  cardValue: { fontSize: 23, fontWeight: '900', color: T.colors.t1, textAlign: 'center', minWidth: 30, padding: 0 },
  cardUnit: { fontSize: 11, fontWeight: '600', color: T.colors.t3, marginBottom: 2 },

  notesRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    width: '100%', paddingHorizontal: 8, marginBottom: 10
  },
  notesText: { flex: 1, fontSize: 11, fontWeight: '500', color: T.colors.t3, lineHeight: 16 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%',
    backgroundColor: T.colors.forge, padding: 16, borderRadius: 999, marginTop: 8,
    shadowColor: T.colors.forge, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 10,
  },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
