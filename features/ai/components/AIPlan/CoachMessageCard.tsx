import { Sparkles } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { MascotImage } from '../../../../components/common/MascotImage';

export function CoachMessageCard({ message, T }: { message: string, T: any }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 24, marginTop: 16, alignItems: 'center' }}>
      <View style={{ marginRight: 12, zIndex: 2, alignItems: 'center', justifyContent: 'center', width: 76 }}>
        <MascotImage mascot="nutrition" width={100} height={100} accessibilityLabel="Nutrition Coach Mascot" />
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        <View style={{
          position: 'absolute', left: -9, top: 23, width: 0, height: 0,
          backgroundColor: 'transparent', borderStyle: 'solid', borderTopWidth: 9, borderBottomWidth: 9, borderRightWidth: 10,
          borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: T.colors.b1, zIndex: 0,
        }} />
        <View style={{
          position: 'absolute', left: -7, top: 24, width: 0, height: 0,
          backgroundColor: 'transparent', borderStyle: 'solid', borderTopWidth: 8, borderBottomWidth: 8, borderRightWidth: 9,
          borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: T.colors.bg1, zIndex: 2,
        }} />
        <View style={{
          backgroundColor: T.colors.bg1, ...T.shadows.lift, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: T.colors.b1, zIndex: 1,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Sparkles size={14} color={T.colors.forge} />
            <Text style={{ fontSize: 12, fontWeight: '800', color: T.colors.t1, letterSpacing: 0.5 }}>AI COACH TIP</Text>
          </View>
          <Text style={{ fontSize: 13, color: T.colors.t2, lineHeight: 18 }}>{message}</Text>
        </View>
      </View>
    </View>
  );
}
