import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          backgroundColor: Colors[colorScheme ?? "light"].surface,
          borderTopColor: Colors[colorScheme ?? "light"].border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Enfermedades",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="cross.case.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="moldoctor"
        options={{
          title: "MolDoctor",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="stethoscope" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plantas"
        options={{
          title: "Plantas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="leaf.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
