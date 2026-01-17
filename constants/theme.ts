/**
 * Pócima Salvage - Theme Configuration
 * Iron Man / JARVIS Holographic Blue Style
 * Inspired by Tony Stark's technology interface
 */

import { Platform } from "react-native";

// Iron Man / JARVIS Color Palette
export const IronManColors = {
  // Primary holographic blues
  arcReactorBlue: "#00D4FF",
  arcReactorGlow: "#00A8CC",
  holographicCyan: "#00E5FF",
  holographicTeal: "#00BCD4",
  
  // Secondary accent colors
  jarvisGold: "#FFD700",
  jarvisAmber: "#FFC107",
  warningRed: "#FF1744",
  
  // Transparent overlays
  glassBlue: "rgba(0, 212, 255, 0.15)",
  glassBlueMedium: "rgba(0, 212, 255, 0.25)",
  glassBlueStrong: "rgba(0, 212, 255, 0.40)",
  
  // Holographic gradients base colors
  holoStart: "rgba(0, 229, 255, 0.8)",
  holoMid: "rgba(0, 188, 212, 0.6)",
  holoEnd: "rgba(0, 150, 180, 0.4)",
  
  // Glow effects
  glowBlue: "rgba(0, 212, 255, 0.6)",
  glowCyan: "rgba(0, 229, 255, 0.5)",
  glowTeal: "rgba(0, 188, 212, 0.4)",
  
  // Border colors
  borderHolo: "rgba(0, 212, 255, 0.5)",
  borderHoloStrong: "rgba(0, 212, 255, 0.8)",
  borderHoloSubtle: "rgba(0, 212, 255, 0.25)",
};

export const Colors = {
  light: {
    // Text colors
    text: "#E0F7FA",
    textSecondary: "#B2EBF2",
    textTertiary: "#80DEEA",
    textInverse: "#0A1929",
    
    // Background colors - dark for holographic effect
    background: "#0A1929",
    backgroundGradientStart: "#0D2137",
    backgroundGradientEnd: "#051221",
    surface: "rgba(13, 33, 55, 0.85)",
    surfaceElevated: "rgba(20, 50, 80, 0.9)",
    
    // Primary tint - Arc Reactor Blue
    tint: IronManColors.arcReactorBlue,
    tintLight: IronManColors.holographicCyan,
    tintDark: IronManColors.arcReactorGlow,
    
    // Icon colors
    icon: IronManColors.holographicCyan,
    tabIconDefault: "rgba(0, 212, 255, 0.5)",
    tabIconSelected: IronManColors.arcReactorBlue,
    
    // Border colors
    border: IronManColors.borderHolo,
    borderStrong: IronManColors.borderHoloStrong,
    borderSubtle: IronManColors.borderHoloSubtle,
    
    // Status colors
    danger: IronManColors.warningRed,
    warning: IronManColors.jarvisAmber,
    success: "#00E676",
    
    // Glass effects
    glass: IronManColors.glassBlue,
    glassMedium: IronManColors.glassBlueMedium,
    glassStrong: IronManColors.glassBlueStrong,
    
    // Glow effects
    glow: IronManColors.glowBlue,
    glowStrong: IronManColors.glowCyan,
    
    // Card shadows with blue glow
    cardShadow: "rgba(0, 212, 255, 0.3)",
    cardShadowStrong: "rgba(0, 212, 255, 0.5)",
    
    // Holographic accent
    holoAccent: IronManColors.jarvisGold,
  },
  dark: {
    // Text colors
    text: "#E0F7FA",
    textSecondary: "#B2EBF2",
    textTertiary: "#80DEEA",
    textInverse: "#0A1929",
    
    // Background colors - deeper dark for contrast
    background: "#050D15",
    backgroundGradientStart: "#0A1929",
    backgroundGradientEnd: "#030810",
    surface: "rgba(10, 25, 41, 0.9)",
    surfaceElevated: "rgba(15, 35, 55, 0.95)",
    
    // Primary tint - Arc Reactor Blue (brighter in dark mode)
    tint: IronManColors.holographicCyan,
    tintLight: IronManColors.arcReactorBlue,
    tintDark: IronManColors.holographicTeal,
    
    // Icon colors
    icon: IronManColors.arcReactorBlue,
    tabIconDefault: "rgba(0, 229, 255, 0.4)",
    tabIconSelected: IronManColors.holographicCyan,
    
    // Border colors
    border: IronManColors.borderHolo,
    borderStrong: IronManColors.borderHoloStrong,
    borderSubtle: IronManColors.borderHoloSubtle,
    
    // Status colors
    danger: "#FF5252",
    warning: IronManColors.jarvisGold,
    success: "#69F0AE",
    
    // Glass effects
    glass: IronManColors.glassBlue,
    glassMedium: IronManColors.glassBlueMedium,
    glassStrong: IronManColors.glassBlueStrong,
    
    // Glow effects
    glow: IronManColors.glowCyan,
    glowStrong: IronManColors.glowBlue,
    
    // Card shadows with cyan glow
    cardShadow: "rgba(0, 229, 255, 0.25)",
    cardShadowStrong: "rgba(0, 229, 255, 0.45)",
    
    // Holographic accent
    holoAccent: IronManColors.jarvisAmber,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Holographic border widths
export const BorderWidth = {
  thin: 1,
  medium: 1.5,
  thick: 2,
  glow: 3,
};

// Font configuration with futuristic feel
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
    display: "SF Pro Display",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
    display: "normal",
  },
  web: {
    sans: "'Rajdhani', 'Orbitron', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: "'Orbitron', 'Rajdhani', 'Exo 2', sans-serif",
  },
});

// Animation durations for holographic effects
export const Animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  pulse: 2000,
  glow: 1500,
};

// Shadow presets for holographic glow effect
export const Shadows = {
  small: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: IronManColors.holographicCyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  glow: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Gradient presets for holographic backgrounds
export const Gradients = {
  background: ["#0A1929", "#0D2137", "#051221"],
  surface: ["rgba(0, 212, 255, 0.1)", "rgba(0, 188, 212, 0.05)", "rgba(0, 150, 180, 0.02)"],
  button: ["rgba(0, 212, 255, 0.8)", "rgba(0, 188, 212, 0.6)"],
  card: ["rgba(13, 33, 55, 0.9)", "rgba(10, 25, 41, 0.95)"],
  glow: ["rgba(0, 229, 255, 0.4)", "rgba(0, 212, 255, 0.2)", "transparent"],
};

// Export holographic style utilities
export const HolographicStyles = {
  // Glass morphism effect
  glassCard: {
    backgroundColor: IronManColors.glassBlue,
    borderWidth: BorderWidth.medium,
    borderColor: IronManColors.borderHolo,
    borderRadius: BorderRadius.lg,
  },
  
  // Glowing border effect
  glowBorder: {
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.borderHoloStrong,
    ...Shadows.glow,
  },
  
  // Holographic text glow
  textGlow: {
    textShadowColor: IronManColors.arcReactorBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  
  // Arc reactor pulse effect colors
  pulseColors: {
    start: IronManColors.arcReactorBlue,
    mid: IronManColors.holographicCyan,
    end: IronManColors.holographicTeal,
  },
};
