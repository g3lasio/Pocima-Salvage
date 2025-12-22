// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Pócima Salvage
 */
const MAPPING = {
  // Tab bar icons
  "house.fill": "home",
  "cross.case.fill": "medical-services",
  "leaf.fill": "eco",
  // Navigation
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  // Actions
  "magnifyingglass": "search",
  "info.circle": "info",
  "exclamationmark.triangle.fill": "warning",
  // Content
  "heart.fill": "favorite",
  "drop.fill": "water-drop",
  "flame.fill": "local-fire-department",
  "pills.fill": "medication",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
