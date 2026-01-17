import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Platform,
} from "react-native";
import { Colors, BorderRadius, Shadows, IronManColors, BorderWidth } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface HolographicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "glow" | "intense";
  animated?: boolean;
  borderGlow?: boolean;
}

export function HolographicCard({
  children,
  style,
  variant = "default",
  animated = false,
  borderGlow = true,
}: HolographicCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animated, pulseAnim]);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          ...Shadows.medium,
          backgroundColor: colors.surfaceElevated,
        };
      case "glow":
        return {
          ...Shadows.glow,
          backgroundColor: colors.glass,
        };
      case "intense":
        return {
          ...Shadows.large,
          backgroundColor: colors.glassMedium,
        };
      default:
        return {
          ...Shadows.small,
          backgroundColor: colors.glass,
        };
    }
  };

  const borderStyle: ViewStyle = borderGlow
    ? {
        borderWidth: BorderWidth.medium,
        borderColor: colors.border,
      }
    : {};

  if (Platform.OS === "web") {
    // Web-specific styling with CSS backdrop-filter
    return (
      <View
        style={[
          styles.container,
          getVariantStyles(),
          borderStyle,
          {
            // @ts-ignore - web-specific property
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        getVariantStyles(),
        borderStyle,
        animated && {
          shadowOpacity: pulseAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Holographic border component for wrapping elements
export function HolographicBorder({
  children,
  style,
  glowIntensity = "medium",
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  glowIntensity?: "low" | "medium" | "high";
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const intensityStyles = {
    low: { borderWidth: 1, shadowRadius: 4 },
    medium: { borderWidth: 1.5, shadowRadius: 8 },
    high: { borderWidth: 2, shadowRadius: 12 },
  };

  return (
    <View
      style={[
        styles.borderContainer,
        {
          borderColor: colors.borderStrong,
          borderWidth: intensityStyles[glowIntensity].borderWidth,
          shadowColor: IronManColors.arcReactorBlue,
          shadowRadius: intensityStyles[glowIntensity].shadowRadius,
          shadowOpacity: 0.5,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Animated glow ring component
export function GlowRing({
  size = 48,
  color = IronManColors.arcReactorBlue,
  animated = true,
}: {
  size?: number;
  color?: string;
  animated?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [animated, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.glowRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  borderContainer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  glowRing: {
    borderWidth: 2,
    position: "absolute",
  },
});
