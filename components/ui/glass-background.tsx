import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { IronManColors, Shadows } from "@/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface GlassBackgroundProps {
  children: React.ReactNode;
  showGrid?: boolean;
  showScanLine?: boolean;
  showCorners?: boolean;
  showHexPattern?: boolean;
  intensity?: "low" | "medium" | "high";
}

/**
 * GlassBackground - Iron Man / JARVIS style holographic background
 * 
 * Creates a futuristic glass effect with:
 * - Animated scan line
 * - Grid pattern overlay
 * - Corner decorations
 * - Hexagonal pattern (optional)
 */
export function GlassBackground({
  children,
  showGrid = true,
  showScanLine = true,
  showCorners = true,
  showHexPattern = false,
  intensity = "medium",
}: GlassBackgroundProps) {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Scan line animation
    if (showScanLine) {
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    }

    // Pulse animation for grid
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [showScanLine, scanLineAnim, pulseAnim]);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, SCREEN_HEIGHT + 50],
  });

  const getIntensityOpacity = () => {
    switch (intensity) {
      case "low": return 0.15;
      case "high": return 0.4;
      default: return 0.25;
    }
  };

  return (
    <View style={styles.container}>
      {/* Base dark background */}
      <View style={styles.baseBackground} />
      
      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Grid pattern */}
      {showGrid && (
        <Animated.View style={[styles.gridContainer, { opacity: pulseAnim }]}>
          {/* Horizontal lines */}
          {Array.from({ length: 25 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineHorizontal,
                {
                  top: `${(i + 1) * 4}%`,
                  opacity: getIntensityOpacity(),
                },
              ]}
            />
          ))}
          {/* Vertical lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineVertical,
                {
                  left: `${(i + 1) * 6.66}%`,
                  opacity: getIntensityOpacity(),
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Hexagonal pattern overlay */}
      {showHexPattern && (
        <View style={[styles.hexPatternContainer, { opacity: getIntensityOpacity() * 0.5 }]}>
          {Array.from({ length: 8 }).map((_, row) => (
            <View key={row} style={[styles.hexRow, { marginLeft: row % 2 === 0 ? 0 : 40 }]}>
              {Array.from({ length: 6 }).map((_, col) => (
                <View key={col} style={styles.hexagon} />
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Scan line effect */}
      {showScanLine && (
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [{ translateY: scanLineTranslateY }],
            },
          ]}
        />
      )}

      {/* Corner decorations */}
      {showCorners && (
        <>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          
          {/* Inner corner accents */}
          <View style={[styles.cornerAccent, styles.cornerAccentTopLeft]} />
          <View style={[styles.cornerAccent, styles.cornerAccentTopRight]} />
          <View style={[styles.cornerAccent, styles.cornerAccentBottomLeft]} />
          <View style={[styles.cornerAccent, styles.cornerAccentBottomRight]} />
        </>
      )}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * GlassPanel - A glass morphism panel with holographic border
 */
interface GlassPanelProps {
  children: React.ReactNode;
  style?: object;
  glowIntensity?: "none" | "low" | "medium" | "high";
  borderWidth?: number;
}

export function GlassPanel({
  children,
  style,
  glowIntensity = "medium",
  borderWidth = 1.5,
}: GlassPanelProps) {
  const getShadow = () => {
    switch (glowIntensity) {
      case "none": return {};
      case "low": return Shadows.small;
      case "high": return Shadows.glowIntense;
      default: return Shadows.glow;
    }
  };

  return (
    <View
      style={[
        styles.glassPanel,
        { borderWidth },
        getShadow(),
        style,
      ]}
    >
      {/* Inner glow effect */}
      <View style={styles.innerGlow} />
      {children}
    </View>
  );
}

/**
 * HolographicBorder - Animated holographic border effect
 */
interface HolographicBorderProps {
  children: React.ReactNode;
  style?: object;
  animated?: boolean;
}

export function HolographicBorder({
  children,
  style,
  animated = true,
}: HolographicBorderProps) {
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, glowAnim]);

  return (
    <Animated.View
      style={[
        styles.holoBorder,
        {
          opacity: animated ? glowAnim : 1,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: IronManColors.darkBackground,
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.darkBackground,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.darkBackgroundAlt,
    opacity: 0.5,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: IronManColors.arcReactorBlue,
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: IronManColors.arcReactorBlue,
  },
  hexPatternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  hexRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  hexagon: {
    width: 80,
    height: 46,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    marginRight: 10,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: IronManColors.arcReactorBlue,
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowColor: IronManColors.arcReactorBlue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: IronManColors.arcReactorBlue,
    borderWidth: 2,
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cornerAccent: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: IronManColors.arcReactorBlue,
    ...Shadows.glow,
  },
  cornerAccentTopLeft: {
    top: 8,
    left: 8,
  },
  cornerAccentTopRight: {
    top: 8,
    right: 8,
  },
  cornerAccentBottomLeft: {
    bottom: 8,
    left: 8,
  },
  cornerAccentBottomRight: {
    bottom: 8,
    right: 8,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  glassPanel: {
    backgroundColor: IronManColors.glassDark,
    borderColor: IronManColors.borderHolo,
    borderRadius: 16,
    overflow: "hidden",
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: IronManColors.glassBlue,
    opacity: 0.3,
  },
  holoBorder: {
    borderWidth: 2,
    borderColor: IronManColors.borderHoloStrong,
    borderRadius: 16,
    ...Shadows.glowIntense,
  },
});
