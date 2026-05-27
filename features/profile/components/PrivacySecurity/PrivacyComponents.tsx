import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { VisibilityOption, VISIBILITY_OPTIONS } from '../../hooks/usePrivacySecurity';

export function SectionHeader({ title, T }: { title: string; T: any }) {
  return (
    <Text style={{
      fontSize: 12, fontWeight: '700', color: T.colors.t3, letterSpacing: 0.8,
      textTransform: 'uppercase', marginBottom: 8, marginTop: 24, paddingHorizontal: 16,
    }}>
      {title}
    </Text>
  );
}

export function SettingRow({
  icon, label, onPress, isDanger, rightContent, T,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isDanger?: boolean;
  rightContent?: React.ReactNode;
  T: any;
}) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: isDanger ? T.colors.redDim : T.colors.bg2,
        alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </View>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: isDanger ? T.colors.red : T.colors.t1 }}>
        {label}
      </Text>
      {rightContent ?? (onPress && <ChevronRight size={18} color={T.colors.t3} />)}
    </TouchableOpacity>
  );
}

export function Divider({ T }: { T: any }) {
  return <View style={{ height: 0.5, backgroundColor: T.colors.b1, marginLeft: 66 }} />;
}

export function VisibilityControl({ label, value, onChange, T }: {
  label: string; value: VisibilityOption; onChange: (v: VisibilityOption) => void; T: any;
}) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: T.colors.t2, marginBottom: 10 }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {VISIBILITY_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
              backgroundColor: value === opt ? T.colors.forge : T.colors.bg2,
            }}
          >
            <Text style={{
              fontSize: 12, fontWeight: '700',
              color: value === opt ? '#FFF' : T.colors.t3,
            }}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
