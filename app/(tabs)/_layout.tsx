import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { IronManColors, Shadows, Fonts } from "@/constants/theme";

/**
 * HolographicTabIcon - Tab icon with animated glass effect and glow
 */
function HolographicTabIcon({ 
  name,
  color,
  focused 
}: { 
  name: string;
  color: string;
  focused: boolean;
}) {
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [focused, glowAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          backgroundColor: focused 
            ? IronManColors.glassBlueMedium 
            : IronManColors.glassBlue,
          borderColor: focused 
            ? IronManColors.arcReactorBlue 
            : IronManColors.borderHoloSubtle,
          transform: [{ scale: scaleAnim }],
          ...(focused ? Shadows.glow : {}),
        },
      ]}
    >
      <Animated.View style={{ opacity: glowAnim }}>
        <IconSymbol size={24} name={name as any} color={color} />
      </Animated.View>
    </Animated.View>
  );
}

export default function TabLayout() {
  
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: IronManColors.arcReactorBlue,
        tabBarInactiveTintColor: IronManColors.textTertiary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 75 + insets.bottom,
          backgroundColor: IronManColors.glassDarkMedium,
          borderTopColor: IronManColors.borderHolo,
          borderTopWidth: 2,
          ...Platform.select({
            ios: {
              shadowColor: IronManColors.arcReactorBlue,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
            },
            android: {
              elevation: 10,
            },
            web: {
              boxShadow: `0 -4px 24px ${IronManColors.glowBlue}`,
            },
          }),
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bold,
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarActiveBackgroundColor: "transparent",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Enfermedades",
          tabBarIcon: ({ color, focused }) => (
            <HolographicTabIcon name="cross.case.fill" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="moldoctor"
        options={{
          title: "MolDoctor",
          tabBarIcon: ({ color, focused }) => (
            <HolographicTabIcon name="stethoscope" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="plantas"
        options={{
          title: "Plantas",
          tabBarIcon: ({ color, focused }) => (
            <HolographicTabIcon name="leaf.fill" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
});
