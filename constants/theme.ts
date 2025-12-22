/**
 * Pócima Salvage - Theme Configuration
 * Natural green palette for medicinal plants app
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1B1B1B",
    textSecondary: "#5C5C5C",
    textTertiary: "#9E9E9E",
    background: "#FAFDF7",
    surface: "#FFFFFF",
    tint: "#2E7D32",
    tintLight: "#81C784",
    icon: "#5C5C5C",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: "#2E7D32",
    border: "#E8E8E8",
    danger: "#D32F2F",
    warning: "#F57C00",
    cardShadow: "rgba(0, 0, 0, 0.08)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#A0A0A0",
    textTertiary: "#6B6B6B",
    background: "#121212",
    surface: "#1E1E1E",
    tint: "#66BB6A",
    tintLight: "#388E3C",
    icon: "#A0A0A0",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: "#66BB6A",
    border: "#2C2C2C",
    danger: "#EF5350",
    warning: "#FFB74D",
    cardShadow: "rgba(0, 0, 0, 0.3)",
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

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
