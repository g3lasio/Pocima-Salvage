import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  Pressable,
  ViewStyle,
} from "react-native";
import { 
  IronManColors, 
  BorderRadius, 
  Shadows, 
  BorderWidth,

} from "@/constants/theme";

interface HolographicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "intense" | "subtle";
  animated?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * HolographicCard - A glass morphism card with animated holographic border
 * 
 * Features:
 * - Pulsing glow animation
 * - Glass background with transparency
 * - Holographic border with glow effect
 * - Corner accent decorations
 * - Press feedback with enhanced glow
 */
export function HolographicCard({
  children,
  style,
  variant = "default",
  animated = true,
  onPress,
  disabled = false,
}: HolographicCardProps) {
  const glowAnim = useRef(new Animated.Value(0.6)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: IronManColors.glassDarkMedium,
          borderColor: IronManColors.borderHoloStrong,
          borderWidth: BorderWidth.heavy,
          ...Shadows.glowIntense,
        };
      case "intense":
        return {
          backgroundColor: IronManColors.glassBlueStrong,
          borderColor: IronManColors.borderHoloBright,
          borderWidth: BorderWidth.heavy,
          ...Shadows.glowCyan,
        };
      case "subtle":
        return {
          backgroundColor: IronManColors.glassDarkTransparent,
          borderColor: IronManColors.borderHoloSubtle,
          borderWidth: BorderWidth.thin,
          ...Shadows.small,
        };
      default:
        return {
          backgroundColor: IronManColors.glassDark,
          borderColor: IronManColors.borderHolo,
          borderWidth: BorderWidth.thick,
          ...Shadows.glow,
        };
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        getVariantStyles(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Inner glow overlay */}
      <View style={styles.innerGlow} />
      
      {/* Top edge glow line */}
      <Animated.View 
        style={[
          styles.topEdgeGlow,
          { opacity: glowAnim },
        ]} 
      />
      
      {/* Corner decorations */}
      <View style={[styles.cornerDot, styles.cornerTopLeft]} />
      <View style={[styles.cornerDot, styles.cornerTopRight]} />
      <View style={[styles.cornerDot, styles.cornerBottomLeft]} />
      <View style={[styles.cornerDot, styles.cornerBottomRight]} />
      
      {/* Content */}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

/**
 * HolographicButton - A button with holographic glow effect
 */
interface HolographicButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export function HolographicButton({
  children,
  onPress,
  style,
  variant = "primary",
  disabled = false,
  size = "medium",
}: HolographicButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: IronManColors.glassDark,
          borderColor: IronManColors.borderHolo,
          shadowColor: IronManColors.arcReactorBlue,
        };
      case "danger":
        return {
          backgroundColor: "rgba(255, 68, 68, 0.2)",
          borderColor: IronManColors.warningRed,
          shadowColor: IronManColors.warningRed,
        };
      default:
        return {
          backgroundColor: IronManColors.glassBlueMedium,
          borderColor: IronManColors.arcReactorBlue,
          shadowColor: IronManColors.arcReactorBlue,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 18, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          getSizeStyles(),
          {
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
            shadowColor: variantStyles.shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: 8,
          },
          style,
        ]}
      >
        {/* Glow overlay */}
        <Animated.View 
          style={[
            styles.buttonGlow,
            { 
              opacity: glowAnim,
              backgroundColor: variantStyles.borderColor,
            },
          ]} 
        />
        {children}
      </Animated.View>
    </Pressable>
  );
}

/**
 * HolographicInput - An input field with holographic styling
 */
interface HolographicInputContainerProps {
  children: React.ReactNode;
  focused?: boolean;
  style?: ViewStyle;
}

export function HolographicInputContainer({
  children,
  focused = false,
  style,
}: HolographicInputContainerProps) {
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, focusAnim]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [IronManColors.borderHolo, IronManColors.arcReactorBlue],
  });

  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.inputContainer,
        {
          borderColor,
          shadowOpacity,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * GlowingDivider - A horizontal divider with glow effect
 */
export function GlowingDivider({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.divider, style]}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerGlow} />
    </View>
  );
}

/**
 * ArcReactorLoader - A loading indicator inspired by the arc reactor
 */
export function ArcReactorLoader({ size = 60 }: { size?: number }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, pulseAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.arcReactor, { width: size, height: size }]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.arcRingOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate }],
          },
        ]}
      />
      {/* Middle ring */}
      <Animated.View
        style={[
          styles.arcRingMiddle,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            transform: [{ rotate: rotate }, { scale: pulseAnim }],
          },
        ]}
      />
      {/* Core */}
      <Animated.View
        style={[
          styles.arcCore,
          {
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: (size * 0.35) / 2,
            opacity: pulseAnim,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.glassBlue,
    opacity: 0.4,
  },
  topEdgeGlow: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: IronManColors.arcReactorBlue,
    borderRadius: 1,
    ...Platform.select({
      ios: {
        shadowColor: IronManColors.arcReactorBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  cornerDot: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: IronManColors.arcReactorBlue,
    borderRadius: 3,
    ...Shadows.glow,
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  button: {
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  inputContainer: {
    backgroundColor: IronManColors.glassDark,
    borderWidth: BorderWidth.normal,
    borderRadius: BorderRadius.md,
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 4,
  },
  divider: {
    height: 2,
    position: "relative",
    marginVertical: 16,
  },
  dividerLine: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.borderHolo,
    opacity: 0.5,
  },
  dividerGlow: {
    position: "absolute",
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: IronManColors.arcReactorBlue,
    ...Shadows.glow,
  },
  arcReactor: {
    justifyContent: "center",
    alignItems: "center",
  },
  arcRingOuter: {
    position: "absolute",
    borderWidth: 3,
    borderColor: IronManColors.arcReactorBlue,
    borderStyle: "dashed",
    opacity: 0.6,
  },
  arcRingMiddle: {
    position: "absolute",
    borderWidth: 2,
    borderColor: IronManColors.holographicCyan,
  },
  arcCore: {
    backgroundColor: IronManColors.arcReactorBlue,
    ...Shadows.glowIntense,
  },
});
