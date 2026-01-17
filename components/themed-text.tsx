import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors, IronManColors, HolographicStyles } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "glow" | "holographic";
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
            textShadowRadius: 4,
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
            textShadowColor: IronManColors.holographicCyan,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
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
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
