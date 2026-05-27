import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';

export function ProfileAvatar({
  photoUri,
  displayName,
  pickAvatar,
  s,
  T
}: any) {
  return (
    <View style={s.avatarSection}>
      <TouchableOpacity style={s.avatarWrap} onPress={pickAvatar}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={s.avatarImg} />
        ) : (
          <View style={[s.avatarImg, { backgroundColor: T.colors.forgeDim, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: T.colors.forge }}>
              {displayName?.[0]?.toUpperCase() || 'A'}
            </Text>
          </View>
        )}
        <View style={s.cameraOverlay}>
          <Camera size={16} color="#FFF" />
        </View>
      </TouchableOpacity>
      <Text style={s.avatarHint}>Tap to change photo</Text>
    </View>
  );
}
