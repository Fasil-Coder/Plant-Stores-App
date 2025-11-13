import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      {/* Login Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in" color={color} size={size ?? 28} />
          ),
        }}
      />

      {/* Sign Up Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" color={color} size={size ?? 28} />
          ),
        }}
      />

      {/* Converter Project Tab */}
      <Tabs.Screen
        name="Home"
        options={{
          title: 'CL Project',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator" color={color} size={size ?? 28} />
          ),
        }}
      />
    </Tabs>
  );
}
