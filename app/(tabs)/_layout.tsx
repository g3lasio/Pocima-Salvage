import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, IronManColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: IronManColors.arcReactorBlue,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 70 + insets.bottom,
          backgroundColor: colors.surface,
          borderTopColor: IronManColors.borderHolo,
          borderTopWidth: 1.5,
          // Holographic glow effect
          ...Platform.select({
            ios: {
              shadowColor: IronManColors.arcReactorBlue,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
            web: {
              boxShadow: `0 -4px 20px ${IronManColors.glowBlue}`,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        // Active tab indicator glow
        tabBarActiveBackgroundColor: "transparent",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Enfermedades",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconGlow : undefined}>
              <IconSymbol size={26} name="cross.case.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="moldoctor"
        options={{
          title: "MolDoctor",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconGlow : undefined}>
              <IconSymbol size={26} name="stethoscope" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="plantas"
        options={{
          title: "Plantas",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.iconGlow : undefined}>
              <IconSymbol size={26} name="leaf.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconGlow: {
    ...Platform.select({
      ios: {
        shadowColor: IronManColors.arcReactorBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        // @ts-ignore
        filter: `drop-shadow(0 0 8px ${IronManColors.arcReactorBlue})`,
      },
    }),
  },
});
