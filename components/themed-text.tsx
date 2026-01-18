import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "../hooks/use-theme-color";
import { Colors, IronManColors, HolographicStyles, Fonts } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "glow" | "holographic" | "label";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const getTypeStyles = () => {
    switch (type) {
      case "title":
        return [
          styles.title,
          {
            color: IronManColors.arcReactorBlue,
            ...HolographicStyles.textGlow,
          },
        ];
      case "subtitle":
        return [
          styles.subtitle,
          {
            color: colors.tint,
            textShadowColor: IronManColors.arcReactorBlue,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          },
        ];
      case "glow":
        return [
          styles.default,
          {
            color: IronManColors.holographicCyan,
            ...HolographicStyles.textGlow,
          },
        ];
      case "holographic":
        return [
          styles.defaultSemiBold,
          {
            color: IronManColors.arcReactorBlue,
            ...HolographicStyles.textGlowIntense,
          },
        ];
      case "label":
        return [
          styles.label,
          {
            color: IronManColors.arcReactorBlue,
            ...HolographicStyles.textGlow,
          },
        ];
      case "link":
        return [
          styles.link,
          { color: IronManColors.holographicCyan },
        ];
      case "defaultSemiBold":
        return [styles.defaultSemiBold, { color }];
      default:
        return [styles.default, { color }];
    }
  };

  return (
    <Text
      style={[...getTypeStyles(), style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  defaultSemiBold: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.8,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  link: {
    fontFamily: Fonts.regular,
    lineHeight: 30,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
