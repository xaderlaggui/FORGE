import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useForgeTheme } from "@/hooks/useForgeTheme";
import { useAuthStore } from '../../stores/authStore';

export default function OtpScreen() {
  const { T } = useForgeTheme();
  const s = useS(T);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email || '';
  
  const [otp, setOtp] = useState('');
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

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit code.');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });
      if (error) throw error;
      
      // The user wanted to NOT be auto-logged in. So we sign them out immediately.
      await supabase.auth.signOut();
      useAuthStore.getState().setUser(null);

      // Successfully authenticated and verified. Navigate to hooray.
      router.push('/(auth)/hooray');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      Alert.alert('Sent', 'A new verification code has been sent to your email.');
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

          {/* Back */}
          <TouchableOpacity style={s.backRow} onPress={() => router.back()}>
            <Text style={s.backText}>← Back to Signup</Text>
          </TouchableOpacity>

          <MascotImage
            mascot="welcome"
            width={120}
            height={120}
            animation="slideUp"
            accessibilityLabel="Forge the bear waiting for verification"
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />
          {/* Title */}
          <Text style={s.title}>Check your email</Text>
          <Text style={s.subtitle}>
            We sent a verification code to{'\n'}
            <Text style={{ fontWeight: '600', color: T.colors.t1 }}>{email}</Text>
          </Text>

          {/* OTP Input */}
          <View style={[s.inputWrap, focusedField === 'otp' && s.inputWrapFocused]}>
            <Lock size={18} color={focusedField === 'otp' ? T.colors.forge : T.colors.t3} />
            <TextInput
              style={[s.input, { textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: 'bold' }]}
              placeholder="••••••"
              placeholderTextColor={T.colors.t3}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="done"
              onFocus={() => setFocusedField('otp')}
              onBlur={() => setFocusedField(null)}
              onSubmitEditing={handleVerify}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Verify</Text>
            }
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity style={{ marginTop: 24 }} onPress={handleResend} disabled={loading}>
            <Text style={s.resendText}>
              Didn't receive a code? <Text style={{ color: T.colors.forge, fontWeight: '600' }}>Resend</Text>
            </Text>
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

  backRow: { alignSelf: 'flex-start', marginBottom: 28 },
  backText: { fontSize: 13, color: T.colors.t3, fontWeight: '500' },

  title: { fontSize: 22, fontWeight: '700', color: T.colors.t1, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: T.colors.t2, textAlign: 'center', marginBottom: 32, lineHeight: 22 },

  // Inputs
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    width: '100%', height: 64,
    backgroundColor: T.colors.bg2,
    borderRadius: 16, paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1, borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderColor: T.colors.forge,
    backgroundColor: T.colors.bg1,
  },
  input: { flex: 1, color: T.colors.t1 },

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

  resendText: { fontSize: 13, color: T.colors.t3 },
});
