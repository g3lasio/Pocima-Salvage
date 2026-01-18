import { View, type ViewProps } from "react-native";

import { useThemeColor } from "../hooks/use-theme-color";
import { Colors, Shadows } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "surface" | "elevated" | "glass" | "glow";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "default",
  ...otherProps
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const getVariantStyles = () => {
    switch (variant) {
      case "surface":
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        };
      case "elevated":
        return {
          backgroundColor: colors.surfaceElevated,
          ...Shadows.medium,
        };
      case "glass":
        return {
          backgroundColor: colors.glass,
          borderWidth: 1.5,
          borderColor: colors.border,
          ...Shadows.small,
        };
      case "glow":
        return {
          backgroundColor: colors.glassMedium,
          borderWidth: 2,
          borderColor: colors.borderStrong,
          ...Shadows.glow,
        };
      default:
        return { backgroundColor };
    }
  };

  return <View style={[getVariantStyles(), style]} {...otherProps} />;
}
