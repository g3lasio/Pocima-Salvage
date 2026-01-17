import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Platform, View, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Linking, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { IronManColors, Shadows, Fonts, Spacing, BorderRadius } from "@/constants/theme";
import { useApp } from "@/contexts/app-context";

/**
 * HolographicTabIcon - Tab icon with animated glass effect and glow
 */
function HolographicTabIcon({ 
  name,
  color,
  focused 
}: { 
  name: string;
  color: string;
  focused: boolean;
}) {
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [focused, glowAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          backgroundColor: focused 
            ? IronManColors.glassBlueMedium 
            : IronManColors.glassBlue,
          borderColor: focused 
            ? IronManColors.arcReactorBlue 
            : IronManColors.borderHoloSubtle,
          transform: [{ scale: scaleAnim }],
          ...(focused ? Shadows.glow : {}),
        },
      ]}
    >
      <Animated.View style={{ opacity: glowAnim }}>
        <IconSymbol size={22} name={name as any} color={color} />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * MenuTabIcon - Hamburger menu icon for sidebar
 */
function MenuTabIcon({ 
  color,
  focused,
  onPress 
}: { 
  color: string;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: focused 
              ? IronManColors.glassBlueMedium 
              : IronManColors.glassBlue,
            borderColor: focused 
              ? IronManColors.arcReactorBlue 
              : IronManColors.borderHoloSubtle,
          },
        ]}
      >
        <ThemedText style={[styles.menuIcon, { color }]}>☰</ThemedText>
      </View>
    </Pressable>
  );
}

/**
 * Sidebar Modal Component
 */
function SidebarModal({ 
  visible, 
  onClose 
}: { 
  visible: boolean; 
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSetting, t } = useApp();

  const navigateTo = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 100);
  };

  const menuItems = [
    { icon: "🩺", label: "MolDoctor", route: "/(tabs)/moldoctor" },
    { icon: "🌿", label: t("Plantas", "Plants"), route: "/(tabs)/plantas" },
    { icon: "🏥", label: t("Enfermedades", "Diseases"), route: "/(tabs)" },
    { divider: true },
    { icon: "⭐", label: t("Favoritos", "Favorites"), route: "/favorites" },
    { icon: "🕐", label: t("Historial", "History"), route: "/history" },
    { divider: true },
    { icon: "ℹ️", label: t("Acerca de", "About Us"), route: "/about" },
    { icon: "⚙️", label: t("Configuración", "Settings"), route: "/settings" },
    { icon: "❓", label: t("Ayuda", "Help"), route: "/help" },
    { icon: "📧", label: t("Contacto", "Contact"), action: () => Linking.openURL("mailto:info@chyrris.com") },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.sidebar,
              { 
                paddingTop: insets.top + Spacing.md,
                paddingBottom: insets.bottom + Spacing.md,
              }
            ]}>
              {/* Header */}
              <View style={styles.sidebarHeader}>
                <View style={styles.logoContainer}>
                  <ThemedText style={styles.logoEmoji}>🌿</ThemedText>
                  <View>
                    <ThemedText style={styles.appName}>Pócima Salvaje</ThemedText>
                    <ThemedText style={styles.appTagline}>
                      {t("Medicina Natural", "Natural Medicine")}
                    </ThemedText>
                  </View>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <ThemedText style={styles.closeIcon}>✕</ThemedText>
                </Pressable>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
                {menuItems.map((item, index) => {
                  if (item.divider) {
                    return <View key={index} style={styles.divider} />;
                  }
                  return (
                    <Pressable
                      key={index}
                      onPress={() => item.action ? item.action() : navigateTo(item.route!)}
                      style={({ pressed }) => [
                        styles.menuItem,
                        { backgroundColor: pressed ? IronManColors.glassBlue : "transparent" },
                      ]}
                    >
                      <ThemedText style={styles.menuItemIcon}>{item.icon}</ThemedText>
                      <ThemedText style={styles.menuItemLabel}>{item.label}</ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Language Toggle */}
              <View style={styles.languageContainer}>
                <ThemedText style={styles.languageLabel}>
                  {t("Idioma", "Language")}
                </ThemedText>
                <View style={styles.languageToggle}>
                  <ThemedText style={[
                    styles.languageOption,
                    settings.language === "es" && styles.languageOptionActive
                  ]}>🇪🇸 ES</ThemedText>
                  <Switch
                    value={settings.language === "en"}
                    onValueChange={(value) => updateSetting("language", value ? "en" : "es")}
                    trackColor={{ false: IronManColors.glassBlue, true: IronManColors.arcReactorBlue }}
                    thumbColor={IronManColors.textPrimary}
                    style={styles.languageSwitch}
                  />
                  <ThemedText style={[
                    styles.languageOption,
                    settings.language === "en" && styles.languageOptionActive
                  ]}>🇺🇸 EN</ThemedText>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.sidebarFooter}>
                <ThemedText style={styles.version}>v1.0.0</ThemedText>
                <ThemedText style={styles.copyright}>© 2025 Chyrris</ThemedText>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Try to use app context, but provide fallback if not available
  let t = (es: string, en: string) => es;
  try {
    const appContext = useApp();
    t = appContext.t;
  } catch (e) {
    // Context not available yet, use Spanish as default
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: IronManColors.arcReactorBlue,
          tabBarInactiveTintColor: IronManColors.textTertiary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 70 + (insets.bottom > 0 ? insets.bottom : 8),
            backgroundColor: IronManColors.glassDarkMedium,
            borderTopColor: IronManColors.borderHolo,
            borderTopWidth: 1.5,
            ...Platform.select({
              ios: {
                shadowColor: IronManColors.arcReactorBlue,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          },
          tabBarLabelStyle: {
            fontFamily: Fonts.bold,
            fontSize: 9,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarActiveBackgroundColor: "transparent",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("Enfermedades", "Diseases"),
            tabBarIcon: ({ color, focused }) => (
              <HolographicTabIcon name="cross.case.fill" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="moldoctor"
          options={{
            title: "MolDoctor",
            tabBarIcon: ({ color, focused }) => (
              <HolographicTabIcon name="stethoscope" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="plantas"
          options={{
            title: t("Plantas", "Plants"),
            tabBarIcon: ({ color, focused }) => (
              <HolographicTabIcon name="leaf.fill" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: t("Menú", "Menu"),
            tabBarIcon: ({ color, focused }) => (
              <MenuTabIcon color={color} focused={focused} onPress={() => setSidebarVisible(true)} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setSidebarVisible(true);
            },
          }}
        />
      </Tabs>

      <SidebarModal visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  menuIcon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-start",
  },
  sidebar: {
    width: "85%",
    maxWidth: 320,
    height: "100%",
    backgroundColor: IronManColors.darkBackground,
    borderRightWidth: 1.5,
    borderRightColor: IronManColors.borderHolo,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: IronManColors.borderHolo,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: IronManColors.arcReactorBlue,
  },
  appTagline: {
    fontSize: 11,
    color: IronManColors.textTertiary,
    fontFamily: Fonts.regular,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: IronManColors.glassBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 16,
    color: IronManColors.textSecondary,
  },
  menuScroll: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.sm,
    marginBottom: 2,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: IronManColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: IronManColors.borderHoloSubtle,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: IronManColors.borderHoloSubtle,
  },
  languageLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textSecondary,
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  languageOption: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: IronManColors.textTertiary,
  },
  languageOptionActive: {
    color: IronManColors.arcReactorBlue,
  },
  languageSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  sidebarFooter: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: IronManColors.borderHoloSubtle,
  },
  version: {
    fontSize: 11,
    color: IronManColors.textTertiary,
    fontFamily: Fonts.regular,
  },
  copyright: {
    fontSize: 10,
    color: IronManColors.textTertiary,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
});
