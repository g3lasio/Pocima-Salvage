/**
 * Pócima Salvage - Iron Man / JARVIS Holographic Theme
 * 
 * A futuristic UI theme inspired by Tony Stark's technology
 * with transparent glass effects, holographic borders, arc reactor blue colors,
 * and Quantico font family.
 */

import { Platform } from "react-native";

// Iron Man / JARVIS Color Palette
export const IronManColors = {
  // Arc Reactor Blues - Primary
  arcReactorBlue: "#00D4FF",
  arcReactorBlueBright: "#00E5FF",
  arcReactorBlueDeep: "#0099CC",
  arcReactorGlow: "#00A8CC",
  
  // Holographic Cyans
  holographicCyan: "#00FFFF",
  holographicTeal: "#00CED1",
  holographicAqua: "#7FFFD4",
  
  // JARVIS Interface Colors
  jarvisGold: "#FFD700",
  jarvisAmber: "#FFC107",
  jarvisOrange: "#FF8C00",
  
  // Warning/Alert Colors
  warningRed: "#FF4444",
  warningRedGlow: "rgba(255, 68, 68, 0.6)",
  successGreen: "#00E676",
  successGreenGlow: "rgba(0, 230, 118, 0.6)",
  
  // Dark Backgrounds
  darkBackground: "#050D15",
  darkBackgroundAlt: "#0A1929",
  darkSurface: "#0D2137",
  darkSurfaceElevated: "#122A42",
  
  // Glass Effects - Transparent Blues (REAL GLASS)
  glassBlue: "rgba(0, 212, 255, 0.08)",
  glassBlueMedium: "rgba(0, 212, 255, 0.15)",
  glassBlueStrong: "rgba(0, 212, 255, 0.25)",
  glassBlueIntense: "rgba(0, 212, 255, 0.35)",
  
  // Glass Backgrounds - Dark with transparency
  glassDark: "rgba(5, 13, 21, 0.85)",
  glassDarkMedium: "rgba(10, 25, 41, 0.90)",
  glassDarkLight: "rgba(13, 33, 55, 0.80)",
  glassDarkTransparent: "rgba(5, 13, 21, 0.6)",
  
  // Border Holographic Effects
  borderHolo: "rgba(0, 212, 255, 0.5)",
  borderHoloStrong: "rgba(0, 212, 255, 0.8)",
  borderHoloSubtle: "rgba(0, 212, 255, 0.25)",
  borderHoloGlow: "rgba(0, 229, 255, 0.6)",
  borderHoloBright: "rgba(0, 255, 255, 0.7)",
  
  // Glow Effects
  glowBlue: "rgba(0, 212, 255, 0.4)",
  glowBlueBright: "rgba(0, 229, 255, 0.6)",
  glowBlueIntense: "rgba(0, 212, 255, 0.8)",
  glowCyan: "rgba(0, 255, 255, 0.4)",
  glowCyanBright: "rgba(0, 255, 255, 0.7)",
  
  // Text Colors
  textPrimary: "#E8F4FF",
  textSecondary: "#A8C8E8",
  textTertiary: "#6B8CAA",
  textHolo: "#00D4FF",
  textHoloBright: "#00FFFF",
};

// Font Family Configuration - Quantico
export const Fonts = {
  regular: "Quantico-Regular",
  bold: "Quantico-Bold",
  italic: "Quantico-Italic",
  boldItalic: "Quantico-BoldItalic",
  // Fallback
  system: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "System",
  }),
};

// Typography Styles with Quantico
export const Typography = {
  // Display / Hero text
  display: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 2,
    color: IronManColors.arcReactorBlue,
  },
  // Title
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 1.5,
    color: IronManColors.textPrimary,
  },
  // Subtitle
  subtitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 1,
    color: IronManColors.textPrimary,
  },
  // Body
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: IronManColors.textPrimary,
  },
  // Caption
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    color: IronManColors.textSecondary,
  },
  // Label (for buttons, tabs)
  label: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: "uppercase" as const,
    color: IronManColors.arcReactorBlue,
  },
};

// Spacing Scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
  full: 9999,
};

// Border Width
export const BorderWidth = {
  thin: 1,
  normal: 1.5,
  medium: 1.5,
  thick: 2,
  heavy: 3,
  glow: 3,
};

// Shadow Definitions with Holographic Glow
export const Shadows = {
  small: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  medium: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  glow: {
    shadowColor: IronManColors.arcReactorBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  glowIntense: {
    shadowColor: IronManColors.arcReactorBlueBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 12,
  },
  glowCyan: {
    shadowColor: IronManColors.holographicCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
};

// Holographic Style Presets
export const HolographicStyles = {
  // Glass Card with Holographic Border - MAIN CARD STYLE
  glassCard: {
    backgroundColor: IronManColors.glassDark,
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.borderHolo,
    borderRadius: BorderRadius.lg,
    ...Shadows.glow,
  },
  
  // Elevated Glass Card with stronger glow
  glassCardElevated: {
    backgroundColor: IronManColors.glassDarkMedium,
    borderWidth: BorderWidth.heavy,
    borderColor: IronManColors.borderHoloStrong,
    borderRadius: BorderRadius.lg,
    ...Shadows.glowIntense,
  },
  
  // Transparent Glass Surface
  glassSurface: {
    backgroundColor: IronManColors.glassDarkTransparent,
    borderWidth: BorderWidth.normal,
    borderColor: IronManColors.borderHoloSubtle,
    borderRadius: BorderRadius.md,
    ...Shadows.small,
  },
  
  // Text Glow Effect
  textGlow: {
    textShadowColor: IronManColors.arcReactorBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  // Intense Text Glow
  textGlowIntense: {
    textShadowColor: IronManColors.arcReactorBlueBright,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  
  // Cyan Text Glow
  textGlowCyan: {
    textShadowColor: IronManColors.holographicCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  
  // Icon Container - Glass style
  iconContainer: {
    backgroundColor: IronManColors.glassBlue,
    borderWidth: BorderWidth.normal,
    borderColor: IronManColors.borderHoloSubtle,
    borderRadius: BorderRadius.md,
    ...Shadows.small,
  },
  
  // Icon Container Active
  iconContainerActive: {
    backgroundColor: IronManColors.glassBlueMedium,
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.borderHoloStrong,
    borderRadius: BorderRadius.md,
    ...Shadows.glow,
  },
  
  // Button Primary
  buttonPrimary: {
    backgroundColor: IronManColors.glassBlueMedium,
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.arcReactorBlue,
    borderRadius: BorderRadius.md,
    ...Shadows.glow,
  },
  
  // Button Active/Pressed
  buttonActive: {
    backgroundColor: IronManColors.glassBlueStrong,
    borderWidth: BorderWidth.heavy,
    borderColor: IronManColors.arcReactorBlueBright,
    borderRadius: BorderRadius.md,
    ...Shadows.glowIntense,
  },
  
  // Input Field
  inputField: {
    backgroundColor: IronManColors.glassDark,
    borderWidth: BorderWidth.normal,
    borderColor: IronManColors.borderHolo,
    borderRadius: BorderRadius.md,
  },
  
  // Input Field Focused
  inputFieldFocused: {
    backgroundColor: IronManColors.glassDarkLight,
    borderWidth: BorderWidth.thick,
    borderColor: IronManColors.arcReactorBlue,
    borderRadius: BorderRadius.md,
    ...Shadows.glow,
  },
  
  // Tab Bar
  tabBar: {
    backgroundColor: IronManColors.glassDarkMedium,
    borderTopWidth: BorderWidth.thick,
    borderTopColor: IronManColors.borderHolo,
    ...Shadows.glow,
  },
  
  // Header
  header: {
    backgroundColor: IronManColors.glassDark,
    borderBottomWidth: BorderWidth.normal,
    borderBottomColor: IronManColors.borderHolo,
    ...Shadows.medium,
  },
  
  // Glowing border effect
  glowBorder: {
    borderWidth: BorderWidth.heavy,
    borderColor: IronManColors.borderHoloStrong,
    ...Shadows.glowIntense,
  },
  
  // Arc reactor pulse effect colors
  pulseColors: {
    start: IronManColors.arcReactorBlue,
    mid: IronManColors.holographicCyan,
    end: IronManColors.holographicTeal,
  },
};

// Theme Colors for Light/Dark modes (Iron Man style is always dark-themed)
export const Colors = {
  light: {
    // Text colors
    text: IronManColors.textPrimary,
    textSecondary: IronManColors.textSecondary,
    textTertiary: IronManColors.textTertiary,
    textInverse: "#0A1929",
    
    // Background colors - dark for holographic effect
    background: IronManColors.darkBackground,
    backgroundGradientStart: IronManColors.darkBackgroundAlt,
    backgroundGradientEnd: IronManColors.darkBackground,
    surface: IronManColors.darkSurface,
    surfaceElevated: IronManColors.darkSurfaceElevated,
    
    // Primary tint - Arc Reactor Blue
    tint: IronManColors.arcReactorBlue,
    tintLight: IronManColors.holographicCyan,
    tintDark: IronManColors.arcReactorGlow,
    
    // Icon colors
    icon: IronManColors.holographicCyan,
    tabIconDefault: IronManColors.textTertiary,
    tabIconSelected: IronManColors.arcReactorBlue,
    
    // Border colors
    border: IronManColors.borderHolo,
    borderStrong: IronManColors.borderHoloStrong,
    borderSubtle: IronManColors.borderHoloSubtle,
    
    // Status colors
    danger: IronManColors.warningRed,
    warning: IronManColors.jarvisAmber,
    success: IronManColors.successGreen,
    
    // Glass effects
    glass: IronManColors.glassDark,
    glassMedium: IronManColors.glassDarkMedium,
    glassStrong: IronManColors.glassBlueStrong,
    
    // Glow effects
    glow: IronManColors.glowBlue,
    glowStrong: IronManColors.glowBlueBright,
    
    // Card shadows with blue glow
    cardShadow: "rgba(0, 212, 255, 0.3)",
    cardShadowStrong: "rgba(0, 212, 255, 0.5)",
    
    // Holographic accent
    holoAccent: IronManColors.jarvisGold,
  },
  dark: {
    // Text colors
    text: IronManColors.textPrimary,
    textSecondary: IronManColors.textSecondary,
    textTertiary: IronManColors.textTertiary,
    textInverse: "#0A1929",
    
    // Background colors - deeper dark for contrast
    background: IronManColors.darkBackground,
    backgroundGradientStart: IronManColors.darkBackgroundAlt,
    backgroundGradientEnd: IronManColors.darkBackground,
    surface: IronManColors.darkSurface,
    surfaceElevated: IronManColors.darkSurfaceElevated,
    
    // Primary tint - Arc Reactor Blue (brighter in dark mode)
    tint: IronManColors.arcReactorBlueBright,
    tintLight: IronManColors.holographicCyan,
    tintDark: IronManColors.arcReactorBlue,
    
    // Icon colors
    icon: IronManColors.holographicCyan,
    tabIconDefault: IronManColors.textTertiary,
    tabIconSelected: IronManColors.arcReactorBlueBright,
    
    // Border colors
    border: IronManColors.borderHolo,
    borderStrong: IronManColors.borderHoloStrong,
    borderSubtle: IronManColors.borderHoloSubtle,
    
    // Status colors
    danger: "#FF5252",
    warning: IronManColors.jarvisGold,
    success: "#69F0AE",
    
    // Glass effects
    glass: IronManColors.glassDark,
    glassMedium: IronManColors.glassDarkMedium,
    glassStrong: IronManColors.glassBlueStrong,
    
    // Glow effects
    glow: IronManColors.glowBlueBright,
    glowStrong: IronManColors.glowCyanBright,
    
    // Card shadows with cyan glow
    cardShadow: "rgba(0, 229, 255, 0.3)",
    cardShadowStrong: "rgba(0, 229, 255, 0.5)",
    
    // Holographic accent
    holoAccent: IronManColors.jarvisAmber,
  },
};

// Gradient presets for holographic backgrounds
export const Gradients = {
  background: [IronManColors.darkBackgroundAlt, IronManColors.darkBackground, "#030810"],
  surface: ["rgba(0, 212, 255, 0.12)", "rgba(0, 188, 212, 0.06)", "rgba(0, 150, 180, 0.02)"],
  button: ["rgba(0, 212, 255, 0.4)", "rgba(0, 188, 212, 0.25)"],
  card: [IronManColors.glassDarkMedium, IronManColors.glassDark],
  glow: ["rgba(0, 229, 255, 0.5)", "rgba(0, 212, 255, 0.25)", "transparent"],
  holoRing: [IronManColors.arcReactorBlueBright, IronManColors.arcReactorBlue, IronManColors.holographicTeal],
};

// Animation Durations
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  pulse: 1500,
  glow: 2000,
  scanLine: 4000,
};

// Z-Index Layers
export const ZIndex = {
  base: 0,
  elevated: 10,
  modal: 100,
  overlay: 1000,
  toast: 2000,
};

// Legacy export for backwards compatibility
export const Animations = AnimationDurations;
