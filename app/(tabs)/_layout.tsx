import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Platform, View, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { HapticTab } from "../../components/haptic-tab";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { ThemedText } from "../../components/themed-text";
import { IronManColors, Shadows, Fonts, Spacing, BorderRadius } from "../../constants/theme";

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

  const navigateTo = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 100);
  };

  const menuItems = [
    { icon: "🩺", label: "MolDoctor", route: "/(tabs)/moldoctor" },
    { icon: "🌿", label: "Plantas", route: "/(tabs)/plantas" },
    { icon: "🏥", label: "Enfermedades", route: "/(tabs)" },
    { divider: true },
    { icon: "⭐", label: "Favoritos", route: "/favorites" },
    { icon: "🕐", label: "Historial", route: "/history" },
    { divider: true },
    { icon: "ℹ️", label: "Acerca de", route: "/about" },
    { icon: "⚙️", label: "Configuración", route: "/settings" },
    { icon: "❓", label: "Ayuda", route: "/help" },
    { icon: "📧", label: "Contacto", action: () => Linking.openURL("mailto:info@chyrris.com") },
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
                    <ThemedText style={styles.appTagline}>Medicina Natural</ThemedText>
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

              {/* Footer */}
              <View style={styles.sidebarFooter}>
                <ThemedText style={styles.version}>v1.0.0</ThemedText>
                <ThemedText style={styles.copyright}>© 2025 Chyrris Technologies</ThemedText>
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

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: IronManColors.arcReactorBlue,
          tabBarInactiveTintColor: IronManColors.textTertiary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            height: 80 + (insets.bottom > 0 ? insets.bottom : 10),
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
            letterSpacing: 0.3,
            textTransform: "uppercase",
            marginTop: 6,
            marginBottom: 2,
          },
          tabBarIconStyle: {
            marginTop: 6,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
            gap: 4,
          },
          tabBarActiveBackgroundColor: "transparent",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Enfermedades",
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
            title: "Plantas",
            tabBarIcon: ({ color, focused }) => (
              <HolographicTabIcon name="leaf.fill" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menú",
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
