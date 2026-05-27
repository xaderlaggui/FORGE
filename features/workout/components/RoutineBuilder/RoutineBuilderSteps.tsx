import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AlertTriangle, Plus, X, Sparkles, Check } from 'lucide-react-native';
import { SPLITS, PURPOSES, SplitType, PurposeType } from './constants';

export const Step1NameSplit = ({ s, T, name, setName, split, setSplit, handleNext }: any) => (
  <View>
    <Text style={s.stepLabel}>STEP 1 OF 4 — NAME & SPLIT</Text>
    <Text style={s.fieldLabel}>ROUTINE NAME</Text>
    <TextInput
      style={s.input}
      placeholder="e.g. My Push Day"
      placeholderTextColor={T.colors.t3}
      value={name}
      onChangeText={setName}
    />
    <Text style={s.fieldLabel}>CHOOSE SPLIT TYPE</Text>
    <View style={s.splitGrid}>
      {(Object.keys(SPLITS) as SplitType[]).map((key) => {
        const sp   = SPLITS[key as SplitType];
        const Icon = sp.icon;
        const active = split === key;
        return (
          <TouchableOpacity
            key={key}
            style={[s.splitCard, active && { backgroundColor: sp.color + '18', borderColor: sp.color }]}
            onPress={() => setSplit(key)}
            activeOpacity={0.7}
          >
            <Icon size={24} color={active ? sp.color : T.colors.t2} style={{ marginBottom: 6 }} />
            <Text style={[s.scName, active && { color: sp.color }]}>{sp.label}</Text>
            <Text style={s.scHint}>{sp.hint}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
    <TouchableOpacity style={s.nextBtn} onPress={handleNext}>
      <Text style={s.nextBtnText}>Next Step →</Text>
    </TouchableOpacity>
  </View>
);

export const Step2Purpose = ({ s, T, purpose, setPurpose, goBack, handleNext }: any) => (
  <View>
    <Text style={s.stepLabel}>STEP 2 OF 4 — TRAINING PURPOSE</Text>
    <Text style={[s.fieldLabel, { marginBottom: 14 }]}>WHAT IS YOUR GOAL FOR THIS SESSION?</Text>
    <View style={s.purposeGrid}>
      {(Object.keys(PURPOSES) as PurposeType[]).map((key) => {
        const p    = PURPOSES[key as PurposeType];
        const Icon = p.icon;
        const active = purpose === key;
        return (
          <TouchableOpacity
            key={key}
            style={[s.purposeCard, active && { borderColor: p.color, backgroundColor: p.color + '12' }]}
            onPress={() => setPurpose(key)}
            activeOpacity={0.75}
          >
            <View style={[s.purposeIconWrap, { backgroundColor: p.color + '22' }]}>
              <Icon size={20} color={p.color} />
            </View>
            <Text style={[s.purposeLabel, active && { color: p.color }]}>{p.label}</Text>
            <Text style={s.purposeHint} numberOfLines={2}>{p.hint}</Text>
            <View style={s.presetPreview}>
              {p.presets.slice(0, 2).map((preset: string) => (
                <View key={preset} style={[s.presetTag, active && { borderColor: p.color + '90', backgroundColor: p.color + '16' }]}>
                  <Text style={[s.presetTagText, active && { color: p.color }]}>{preset}</Text>
                </View>
              ))}
            </View>
            {active && (
              <View style={[s.activeCheck, { backgroundColor: p.color }]}>
              <Check size={11} color="#000" strokeWidth={3} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
    <View style={[s.purposeDescCard, { borderColor: PURPOSES[purpose as PurposeType]?.color + '40', backgroundColor: PURPOSES[purpose as PurposeType]?.color + '08' }]}>
      <Text style={[s.purposeDescText, { color: PURPOSES[purpose as PurposeType]?.color }]}>{PURPOSES[purpose as PurposeType]?.description}</Text>
    </View>
    <View style={s.navRow}>
      <TouchableOpacity style={s.navBack} onPress={goBack}><Text style={s.navBackText}>Back</Text></TouchableOpacity>
      <TouchableOpacity style={s.navNext} onPress={handleNext}><Text style={s.navNextText}>Next →</Text></TouchableOpacity>
    </View>
  </View>
);

export const Step3Exercises = ({ 
  s, T, purpose, split, exercises, overlapWarning, isAiGenerating, 
  generateWithAI, autoPopulate, handlePreview, removeEx, presets, 
  setPreset, setShowPicker, goBack, handleNext 
}: any) => (
  <View>
    <Text style={s.stepLabel}>STEP 3 OF 4 — EXERCISES</Text>
    <View style={[s.purposeBanner, { borderColor: PURPOSES[purpose as PurposeType]?.color + '50', backgroundColor: PURPOSES[purpose as PurposeType]?.color + '0D' }]}>
      {React.createElement(PURPOSES[purpose as PurposeType]?.icon, { size: 14, color: PURPOSES[purpose as PurposeType]?.color })}
      <Text style={[s.purposeBannerText, { color: PURPOSES[purpose as PurposeType]?.color }]}>
        {PURPOSES[purpose as PurposeType]?.label} · {SPLITS[split as SplitType]?.label}
      </Text>
    </View>
    {overlapWarning && (
      <View style={s.warnCard}>
        <AlertTriangle size={16} color={T.colors.gold} style={{ marginTop: 2 }} />
        <Text style={s.warnText}>{overlapWarning}</Text>
      </View>
    )}
    <Text style={s.fieldLabel}>{SPLITS[split as SplitType]?.label} — {PURPOSES[purpose as PurposeType]?.label} EXERCISES</Text>
    {exercises.length === 0 && (
      <View style={s.emptyExState}>
        {isAiGenerating ? (
          <View style={s.aiLoadingWrap}>
            <ActivityIndicator color={T.colors.forge} size="large" />
            <Text style={s.aiLoadingText}>AI is building your {PURPOSES[purpose as PurposeType]?.label.toLowerCase()} session…</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={s.aiGenBtn} onPress={generateWithAI}>
              <Sparkles size={18} color="#000" strokeWidth={2.5} />
              <Text style={s.aiGenBtnText}>Generate with AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.autoFillBtn} onPress={autoPopulate}>
              <Text style={s.autoFillText}>Use Smart Suggestions</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    )}
    {exercises.map((ex: any, idx: number) => (
      <View key={idx} style={s.exItem}>
        <View style={s.exItemTop}>
          <TouchableOpacity onPress={() => handlePreview(ex.name)} style={{ flex: 1 }}>
            <Text style={s.exItemName}>{ex.name}</Text>
            {ex.purpose && (
              <Text style={[s.exPurposeBadge, { color: PURPOSES[ex.purpose as PurposeType]?.color ?? T.colors.t3 }]}>
                {ex.purpose.toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeEx(idx)} style={{ padding: 4 }}>
            <X size={16} color={T.colors.t3} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.presetRow}>
          {presets.map((p: string) => (
            <TouchableOpacity
              key={p}
              style={[s.presetPill, ex.preset === p && s.presetPillOn]}
              onPress={() => setPreset(idx, p)}
            >
              <Text style={[s.presetPillText, ex.preset === p && { color: PURPOSES[purpose as PurposeType]?.color }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    ))}
    <TouchableOpacity style={s.addExBtn} onPress={() => setShowPicker(true)}>
      <Plus size={18} color={T.colors.forge} />
      <Text style={s.addExText}>Add Exercise</Text>
    </TouchableOpacity>
    <View style={s.navRow}>
      <TouchableOpacity style={s.navBack} onPress={goBack}><Text style={s.navBackText}>Back</Text></TouchableOpacity>
      <TouchableOpacity style={s.navNext} onPress={handleNext}><Text style={s.navNextText}>Review →</Text></TouchableOpacity>
    </View>
  </View>
);

export const Step4Review = ({ s, T, name, split, purpose, exercises, handleSave, goBack }: any) => (
  <View>
    <Text style={s.stepLabel}>STEP 4 OF 4 — REVIEW & SAVE</Text>
    <Text style={s.fieldLabel}>ROUTINE DETAILS</Text>
    <View style={s.reviewCard}>
      <View style={s.rvRow}>
        <Text style={s.rvName}>{name || 'My Routine'}</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={[s.badge, { backgroundColor: SPLITS[split as SplitType]?.color + '26' }]}>
            <Text style={[s.badgeText, { color: SPLITS[split as SplitType]?.color }]}>{SPLITS[split as SplitType]?.label}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: PURPOSES[purpose as PurposeType]?.color + '26' }]}>
            <Text style={[s.badgeText, { color: PURPOSES[purpose as PurposeType]?.color }]}>{PURPOSES[purpose as PurposeType]?.label}</Text>
          </View>
        </View>
      </View>
    </View>
    <Text style={[s.fieldLabel, { marginTop: 16 }]}>EXERCISES ({exercises.length})</Text>
    <View style={s.reviewCard}>
      {exercises.map((ex: any, idx: number) => (
        <View key={idx} style={[s.rvRow, idx < exercises.length - 1 && s.rvBorder]}>
          <View>
            <Text style={s.rvName}>{ex.name}</Text>
            {ex.purpose && (
              <Text style={[s.exPurposeBadge, { color: PURPOSES[ex.purpose as PurposeType]?.color ?? T.colors.t3 }]}>
                {ex.purpose.toUpperCase()}
              </Text>
            )}
          </View>
          <Text style={s.rvPreset}>{ex.preset}</Text>
        </View>
      ))}
    </View>
    <TouchableOpacity style={[s.nextBtn, { marginTop: 24 }]} onPress={handleSave}>
      <Text style={s.nextBtnText}>Save Routine</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[s.navBack, { marginTop: 12, borderWidth: 0, paddingVertical: 16 }]} onPress={goBack}>
      <Text style={s.navBackText}>Back</Text>
    </TouchableOpacity>
  </View>
);
