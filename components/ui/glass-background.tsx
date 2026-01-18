import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IronManColors, Shadows } from "../../constants/theme";

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
 * - Grid pattern overlay
 * - Corner decorations (respecting safe areas)
 * - Hexagonal pattern (optional)
 * - Subtle ambient glow (replaces scan line)
 */
export function GlassBackground({
  children,
  showGrid = true,
  showScanLine = false, // Disabled by default - too distracting
  showCorners = true,
  showHexPattern = false,
  intensity = "medium",
}: GlassBackgroundProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
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

    // Subtle ambient glow animation (replaces scan line)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, glowAnim]);

  const getIntensityOpacity = () => {
    switch (intensity) {
      case "low": return 0.1;
      case "high": return 0.3;
      default: return 0.15;
    }
  };

  // Calculate safe positions for corners
  const cornerOffset = 12;
  const cornerTopOffset = Math.max(insets.top + cornerOffset, cornerOffset + 50); // Respect notch
  const cornerBottomOffset = Math.max(insets.bottom + cornerOffset, cornerOffset + 30); // Respect home indicator

  return (
    <View style={styles.container}>
      {/* Base dark background */}
      <View style={styles.baseBackground} />
      
      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Subtle ambient glow at top (replaces scan line) */}
      <Animated.View
        style={[
          styles.ambientGlow,
          styles.ambientGlowTop,
          { opacity: glowAnim, top: insets.top },
        ]}
      />

      {/* Grid pattern - more subtle */}
      {showGrid && (
        <Animated.View style={[styles.gridContainer, { opacity: pulseAnim }]}>
          {/* Horizontal lines - fewer and more subtle */}
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineHorizontal,
                {
                  top: `${(i + 1) * 8}%`,
                  opacity: getIntensityOpacity(),
                },
              ]}
            />
          ))}
          {/* Vertical lines - fewer and more subtle */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineVertical,
                {
                  left: `${(i + 1) * 12}%`,
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

      {/* Corner decorations - smaller and respecting safe areas */}
      {showCorners && (
        <>
          <View style={[styles.corner, styles.cornerTopLeft, { top: cornerTopOffset, left: cornerOffset }]} />
          <View style={[styles.corner, styles.cornerTopRight, { top: cornerTopOffset, right: cornerOffset }]} />
          <View style={[styles.corner, styles.cornerBottomLeft, { bottom: cornerBottomOffset, left: cornerOffset }]} />
          <View style={[styles.corner, styles.cornerBottomRight, { bottom: cornerBottomOffset, right: cornerOffset }]} />
          
          {/* Inner corner accents - smaller */}
          <View style={[styles.cornerAccent, { top: cornerTopOffset, left: cornerOffset }]} />
          <View style={[styles.cornerAccent, { top: cornerTopOffset, right: cornerOffset }]} />
          <View style={[styles.cornerAccent, { bottom: cornerBottomOffset, left: cornerOffset }]} />
          <View style={[styles.cornerAccent, { bottom: cornerBottomOffset, right: cornerOffset }]} />
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
  ambientGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 100,
  },
  ambientGlowTop: {
    backgroundColor: IronManColors.arcReactorBlue,
    opacity: 0.1,
    ...Platform.select({
      ios: {
        shadowColor: IronManColors.arcReactorBlue,
        shadowOffset: { width: 0, height: 50 },
        shadowOpacity: 0.3,
        shadowRadius: 50,
      },
    }),
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: IronManColors.arcReactorBlue,
    borderWidth: 1.5,
    opacity: 0.6,
  },
  cornerTopLeft: {
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cornerAccent: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: IronManColors.arcReactorBlue,
    opacity: 0.8,
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
