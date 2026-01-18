import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,

  ViewStyle,
} from "react-native";
import { 
  IronManColors, 
  BorderRadius, 
  Shadows, 
  BorderWidth,
} from "@/constants/theme";
import { ThemedText } from "../../components/themed-text";

interface HolographicIconProps {
  icon: string; // Emoji or text icon
  size?: "small" | "medium" | "large" | "xlarge";
  variant?: "default" | "glow" | "intense" | "subtle";
  animated?: boolean;
  style?: ViewStyle;
}

/**
 * HolographicIcon - An icon with glass morphism and holographic effects
 * 
 * Features:
 * - Glass background with transparency
 * - Holographic border with glow
 * - Pulsing animation option
 * - Multiple size variants
 */
export function HolographicIcon({
  icon,
  size = "medium",
  variant = "default",
  animated = false,
  style,
}: HolographicIconProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (animated) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, pulseAnim, glowAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { container: 36, icon: 18, border: BorderWidth.thin };
      case "large":
        return { container: 64, icon: 32, border: BorderWidth.thick };
      case "xlarge":
        return { container: 80, icon: 40, border: BorderWidth.heavy };
      default:
        return { container: 48, icon: 24, border: BorderWidth.normal };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "glow":
        return {
          backgroundColor: IronManColors.glassBlueMedium,
          borderColor: IronManColors.borderHoloStrong,
          ...Shadows.glow,
        };
      case "intense":
        return {
          backgroundColor: IronManColors.glassBlueStrong,
          borderColor: IronManColors.borderHoloBright,
          ...Shadows.glowIntense,
        };
      case "subtle":
        return {
          backgroundColor: IronManColors.glassBlue,
          borderColor: IronManColors.borderHoloSubtle,
          ...Shadows.small,
        };
      default:
        return {
          backgroundColor: IronManColors.glassDark,
          borderColor: IronManColors.borderHolo,
          ...Shadows.medium,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          width: sizeStyles.container,
          height: sizeStyles.container,
          borderRadius: sizeStyles.container / 2,
          borderWidth: sizeStyles.border,
          ...variantStyles,
          transform: [{ scale: animated ? pulseAnim : 1 }],
        },
        style,
      ]}
    >
      {/* Inner glow */}
      <Animated.View 
        style={[
          styles.innerGlow,
          { 
            opacity: animated ? glowAnim : 0.3,
            borderRadius: sizeStyles.container / 2,
          },
        ]} 
      />
      
      {/* Icon */}
      <ThemedText style={{ fontSize: sizeStyles.icon }}>
        {icon}
      </ThemedText>
    </Animated.View>
  );
}

/**
 * HolographicBadge - A badge/chip with holographic styling
 */
interface HolographicBadgeProps {
  text: string;
  icon?: string;
  variant?: "info" | "success" | "warning" | "danger";
  size?: "small" | "medium";
  style?: ViewStyle;
}

export function HolographicBadge({
  text,
  icon,
  variant = "info",
  size = "medium",
  style,
}: HolographicBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: "rgba(0, 230, 118, 0.15)",
          borderColor: IronManColors.successGreen,
          textColor: IronManColors.successGreen,
        };
      case "warning":
        return {
          backgroundColor: "rgba(255, 193, 7, 0.15)",
          borderColor: IronManColors.jarvisAmber,
          textColor: IronManColors.jarvisAmber,
        };
      case "danger":
        return {
          backgroundColor: "rgba(255, 68, 68, 0.15)",
          borderColor: IronManColors.warningRed,
          textColor: IronManColors.warningRed,
        };
      default:
        return {
          backgroundColor: IronManColors.glassBlue,
          borderColor: IronManColors.borderHolo,
          textColor: IronManColors.arcReactorBlue,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          paddingVertical: isSmall ? 4 : 6,
          paddingHorizontal: isSmall ? 8 : 12,
        },
        style,
      ]}
    >
      {icon && (
        <ThemedText style={[styles.badgeIcon, { fontSize: isSmall ? 12 : 14 }]}>
          {icon}
        </ThemedText>
      )}
      <ThemedText
        style={[
          styles.badgeText,
          {
            color: variantStyles.textColor,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {text}
      </ThemedText>
    </View>
  );
}

/**
 * HolographicAvatar - An avatar with holographic ring effect
 */
interface HolographicAvatarProps {
  icon: string;
  size?: number;
  online?: boolean;
  style?: ViewStyle;
}

export function HolographicAvatar({
  icon,
  size = 56,
  online = false,
  style,
}: HolographicAvatarProps) {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [ringAnim]);

  const ringRotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.avatarContainer, { width: size + 12, height: size + 12 }, style]}>
      {/* Animated outer ring */}
      <Animated.View
        style={[
          styles.avatarRing,
          {
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
            transform: [{ rotate: ringRotate }],
          },
        ]}
      />
      
      {/* Avatar content */}
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <ThemedText style={{ fontSize: size * 0.5 }}>{icon}</ThemedText>
      </View>

      {/* Online indicator */}
      {online && (
        <View style={[styles.onlineIndicator, { right: 0, bottom: 0 }]} />
      )}
    </View>
  );
}

/**
 * HolographicStatusDot - A status indicator with glow effect
 */
interface HolographicStatusDotProps {
  status: "online" | "away" | "busy" | "offline";
  size?: number;
  animated?: boolean;
}

export function HolographicStatusDot({
  status,
  size = 12,
  animated = true,
}: HolographicStatusDotProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated && status === "online") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, status, pulseAnim]);

  const getStatusColor = () => {
    switch (status) {
      case "online": return IronManColors.successGreen;
      case "away": return IronManColors.jarvisAmber;
      case "busy": return IronManColors.warningRed;
      default: return IronManColors.textTertiary;
    }
  };

  const color = getStatusColor();

  return (
    <Animated.View
      style={[
        styles.statusDot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale: animated && status === "online" ? pulseAnim : 1 }],
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
        },
      ]}
    />
  );
}

/**
 * HolographicProgressRing - A circular progress indicator
 */
interface HolographicProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function HolographicProgressRing({
  progress,
  size = 80,
  strokeWidth = 4,
  children,
}: HolographicProgressRingProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedProgress]);

  // Calculate the circumference and offset
  // const radius = (size - strokeWidth) / 2;
  // const circumference = 2 * Math.PI * radius;
  
  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.progressRingBg,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />
      
      {/* Progress indicator (simplified for RN) */}
      <View
        style={[
          styles.progressRingFill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: IronManColors.arcReactorBlue,
            borderTopColor: "transparent",
            borderRightColor: progress > 0.25 ? IronManColors.arcReactorBlue : "transparent",
            borderBottomColor: progress > 0.5 ? IronManColors.arcReactorBlue : "transparent",
            borderLeftColor: progress > 0.75 ? IronManColors.arcReactorBlue : "transparent",
            transform: [{ rotate: "-90deg" }],
          },
        ]}
      />
      
      {/* Center content */}
      <View style={styles.progressRingContent}>
        {children || (
          <ThemedText style={styles.progressText}>
            {Math.round(progress * 100)}%
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.glassBlue,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.round,
    borderWidth: BorderWidth.thin,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: IronManColors.arcReactorBlue,
    borderStyle: "dashed",
    opacity: 0.6,
  },
  avatar: {
    backgroundColor: IronManColors.glassDark,
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.borderHolo,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.glow,
  },
  onlineIndicator: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: IronManColors.successGreen,
    borderWidth: 2,
    borderColor: IronManColors.darkBackground,
    ...Shadows.small,
  },
  statusDot: {
    elevation: 4,
  },
  progressRing: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressRingBg: {
    position: "absolute",
    borderColor: IronManColors.borderHoloSubtle,
  },
  progressRingFill: {
    position: "absolute",
    ...Shadows.glow,
  },
  progressRingContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: IronManColors.arcReactorBlue,
  },
});
