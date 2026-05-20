import { useForgeTheme } from "@/hooks/useForgeTheme";
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { MascotImage } from '../../components/common/MascotImage';
import { supabase } from '../../services/supabase';

export default function PasswordScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Entrance animation
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  React.useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));
  }, []);
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleSetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please enter and confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // Navigate to Hooray screen
      router.push('./hooray');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <View style={s.innerWrapper}>
        <Animated.View style={[s.inner, animStyle]}>

          {/* Title and Mascot */}
          <MascotImage
            mascot="welcome"
            width={120}
            height={120}
            animation="slideUp"
            accessibilityLabel="Forge the bear ready for the final step"
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />
          <Text style={s.title}>Secure your account</Text>
          <Text style={s.subtitle}>Set a password for your new account.</Text>

          {/* Password Input */}
          <View style={[s.inputWrap, focusedField === 'password' && s.inputWrapFocused]}>
            <Lock size={18} color={focusedField === 'password' ? T.colors.forge : T.colors.t3} />
            <TextInput
              style={s.input}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor={T.colors.t3}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Confirm Password Input */}
          <View style={[s.inputWrap, focusedField === 'confirm' && s.inputWrapFocused]}>
            <Lock size={18} color={focusedField === 'confirm' ? T.colors.forge : T.colors.t3} />
            <TextInput
              style={s.input}
              placeholder="Confirm password"
              placeholderTextColor={T.colors.t3}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="done"
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={handleSetPassword}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.7 }]}
            onPress={handleSetPassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Set Password</Text>
            }
          </TouchableOpacity>

        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const useS = (T: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: T.colors.bg0 },
  innerWrapper: { flex: 1 },
  inner: {
    flex: 1, paddingHorizontal: 24,
    paddingTop: 54, paddingBottom: 24,
    alignItems: 'center', justifyContent: 'center'
  },

  title: { fontSize: 22, fontWeight: '700', color: T.colors.t1, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: T.colors.t2, textAlign: 'center', marginBottom: 32, lineHeight: 22 },

  // Inputs
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    width: '100%', height: 56,
    backgroundColor: T.colors.bg2,
    borderRadius: 16, paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1, borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderColor: T.colors.forge,
    backgroundColor: T.colors.bg1,
  },
  input: { flex: 1, color: T.colors.t1, fontSize: 15 },

  // Button
  btn: {
    width: '100%', height: 56,
    backgroundColor: T.colors.forge,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
    shadowColor: T.colors.forge,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
