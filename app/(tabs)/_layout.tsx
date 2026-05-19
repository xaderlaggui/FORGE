import { useForgeTheme } from "@/hooks/useForgeTheme";
import { useUIStore } from '@/stores/uiStore';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import { Dumbbell, Home, PieChart, Settings, Sparkles, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ForgeFAB() {
  const { T } = useForgeTheme();
  const styles = useStyles(T);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const aiColor = '#BF5AF2'; // Distinct purple for AI Coach

  const isTabBarVisible = useUIStore(s => s.isTabBarVisible);
  const translateY = useDerivedValue(() => {
    return withTiming(isTabBarVisible ? 0 : 150, { duration: 300, easing: Easing.out(Easing.exp) });
  }, [isTabBarVisible]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View style={[styles.fabWrapper, animatedStyle, { bottom: 104 }]}>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: aiColor, shadowColor: aiColor }]}
        onPress={() => router.push('/chat')}
        activeOpacity={0.85}
        accessibilityLabel="AI Coach"
        accessibilityRole="button"
      >
        <Sparkles size={24} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TabLayout() {
  const { T } = useForgeTheme();
  const styles = useStyles(T);
  const isTabBarVisible = useUIStore(s => s.isTabBarVisible);
  const insets = useSafeAreaInsets();

  const translateY = useDerivedValue(() => {
    return withTiming(isTabBarVisible ? 0 : 150, { duration: 300, easing: Easing.out(Easing.exp) });
  }, [isTabBarVisible]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <View style={{ flex: 1, backgroundColor: T.colors.bg0 }}>
      <Tabs
        tabBar={(props) => (
          <Animated.View style={[{ position: 'absolute', bottom: 24, left: 24, right: 24, zIndex: 50 }, animatedStyle]}>
            <BottomTabBar {...props} />
          </Animated.View>
        )}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: T.colors.forge,
          tabBarInactiveTintColor: T.colors.t3,
          tabBarStyle: {
            backgroundColor: T.colors.bg1,
            borderWidth: 1,
            borderColor: T.colors.b1,
            height: 64,
            paddingBottom: 0,
            paddingTop: 0,
            borderRadius: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            paddingBottom: 8,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <Dumbbell size={22} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color }) => <PieChart size={22} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <TrendingUp size={22} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2.5} />,
          }}
        />
      </Tabs>

      {/* Floating Action Button (Global) */}
      <ForgeFAB />
    </View>
  );
}

const useStyles = (T: any) => StyleSheet.create({
  fabWrapper: {
    position: 'absolute',
    right: T.spacing.page,
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.colors.forge,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.colors.forge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
});
