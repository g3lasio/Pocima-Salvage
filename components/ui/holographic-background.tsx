import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Colors, IronManColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface HolographicBackgroundProps {
  children: React.ReactNode;
  showGrid?: boolean;
  showParticles?: boolean;
  showScanLine?: boolean;
}

export function HolographicBackground({
  children,
  showGrid = true,
  showParticles = false,
  showScanLine = true,
}: HolographicBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showScanLine) {
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [showScanLine, scanLineAnim]);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, SCREEN_HEIGHT + 50],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Base gradient overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: colors.backgroundGradientStart }]} />
      
      {/* Grid pattern */}
      {showGrid && (
        <View style={styles.gridContainer}>
          {/* Horizontal lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineHorizontal,
                {
                  top: `${(i + 1) * 5}%`,
                  backgroundColor: colors.borderSubtle,
                },
              ]}
            />
          ))}
          {/* Vertical lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineVertical,
                {
                  left: `${(i + 1) * 8.33}%`,
                  backgroundColor: colors.borderSubtle,
                },
              ]}
            />
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
      <View style={[styles.cornerDecoration, styles.cornerTopLeft, { borderColor: colors.border }]} />
      <View style={[styles.cornerDecoration, styles.cornerTopRight, { borderColor: colors.border }]} />
      <View style={[styles.cornerDecoration, styles.cornerBottomLeft, { borderColor: colors.border }]} />
      <View style={[styles.cornerDecoration, styles.cornerBottomRight, { borderColor: colors.border }]} />

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

// Hexagon grid pattern for futuristic effect
export function HexagonPattern({ opacity = 0.1 }: { opacity?: number }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS !== "web") {
    // Simplified pattern for native
    return (
      <View style={[styles.hexPattern, { opacity }]}>
        {Array.from({ length: 6 }).map((_, row) => (
          <View key={row} style={styles.hexRow}>
            {Array.from({ length: 4 }).map((_, col) => (
              <View
                key={col}
                style={[
                  styles.hexagon,
                  {
                    borderColor: colors.border,
                    marginLeft: row % 2 === 0 ? 0 : 30,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.hexPattern,
        {
          opacity,
          // @ts-ignore - web-specific
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpath fill='none' stroke='%2300D4FF' stroke-width='0.5' d='M30 0l25.98 15v30L30 60 4.02 45V15z'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 52px",
        },
      ]}
    />
  );
}

// Arc reactor center piece decoration
export function ArcReactorDecoration({
  size = 120,
  animated = true,
}: {
  size?: number;
  animated?: boolean;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, rotateAnim, pulseAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.arcReactorContainer, { width: size, height: size }]}>
      {/* Outer ring */}
      <Animated.View
        style={[
          styles.arcRing,
          styles.arcRingOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate }, { scale: pulseAnim }],
          },
        ]}
      />
      {/* Middle ring */}
      <Animated.View
        style={[
          styles.arcRing,
          styles.arcRingMiddle,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: (size * 0.7) / 2,
            transform: [{ rotate: rotate }],
          },
        ]}
      />
      {/* Inner core */}
      <View
        style={[
          styles.arcCore,
          {
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: (size * 0.3) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    opacity: 0.3,
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    opacity: 0.3,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: IronManColors.arcReactorBlue,
    opacity: 0.4,
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cornerDecoration: {
    position: "absolute",
    width: 30,
    height: 30,
    borderWidth: 2,
  },
  cornerTopLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  hexPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  hexRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  hexagon: {
    width: 60,
    height: 35,
    borderWidth: 1,
    marginRight: 10,
  },
  arcReactorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  arcRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: IronManColors.arcReactorBlue,
  },
  arcRingOuter: {
    borderStyle: "dashed",
    opacity: 0.6,
  },
  arcRingMiddle: {
    borderStyle: "solid",
    opacity: 0.8,
  },
  arcCore: {
    backgroundColor: IronManColors.arcReactorBlue,
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
});
