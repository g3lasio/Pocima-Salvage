import { StyleSheet, View, ScrollView, Pressable, Switch, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "@/constants/theme";

const SETTINGS_KEY = "@pocima_settings";

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  saveHistory: boolean;
  language: "es" | "en";
}

const defaultSettings: Settings = {
  notifications: true,
  darkMode: true,
  saveHistory: true,
  language: "es",
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const updateSetting = async (key: keyof Settings, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "Borrar datos",
      "¿Estás seguro de que quieres borrar todos los datos? Esto incluye favoritos, historial y configuración.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings(defaultSettings);
              Alert.alert("Listo", "Todos los datos han sido borrados");
            } catch (error) {
              console.error("Error clearing data:", error);
            }
          }
        },
      ]
    );
  };

  return (
    <GlassBackground showGrid={true} showCorners={true}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Configuración</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferencias */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferencias</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingIcon}>🔔</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Notificaciones</ThemedText>
                <ThemedText style={styles.settingDesc}>Recibir consejos de salud</ThemedText>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting("notifications", value)}
              trackColor={{ false: IronManColors.glassBlue, true: IronManColors.arcReactorBlue }}
              thumbColor={IronManColors.textPrimary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingIcon}>🌙</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Modo oscuro</ThemedText>
                <ThemedText style={styles.settingDesc}>Tema de la aplicación</ThemedText>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSetting("darkMode", value)}
              trackColor={{ false: IronManColors.glassBlue, true: IronManColors.arcReactorBlue }}
              thumbColor={IronManColors.textPrimary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingIcon}>🕐</ThemedText>
              <View>
                <ThemedText style={styles.settingLabel}>Guardar historial</ThemedText>
                <ThemedText style={styles.settingDesc}>Recordar búsquedas recientes</ThemedText>
              </View>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={(value) => updateSetting("saveHistory", value)}
              trackColor={{ false: IronManColors.glassBlue, true: IronManColors.arcReactorBlue }}
              thumbColor={IronManColors.textPrimary}
            />
          </View>
        </View>

        {/* Idioma */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Idioma</ThemedText>
          
          <Pressable
            onPress={() => updateSetting("language", "es")}
            style={[
              styles.languageOption,
              settings.language === "es" && styles.languageOptionSelected,
            ]}
          >
            <ThemedText style={styles.languageFlag}>🇪🇸</ThemedText>
            <ThemedText style={styles.languageText}>Español</ThemedText>
            {settings.language === "es" && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={() => updateSetting("language", "en")}
            style={[
              styles.languageOption,
              settings.language === "en" && styles.languageOptionSelected,
            ]}
          >
            <ThemedText style={styles.languageFlag}>🇺🇸</ThemedText>
            <ThemedText style={styles.languageText}>English</ThemedText>
            {settings.language === "en" && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Soporte */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Soporte</ThemedText>
          
          <Pressable
            onPress={() => router.push("/help")}
            style={styles.linkItem}
          >
            <ThemedText style={styles.linkIcon}>❓</ThemedText>
            <ThemedText style={styles.linkText}>Centro de ayuda</ThemedText>
            <ThemedText style={styles.linkArrow}>›</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("mailto:info@chyrris.com")}
            style={styles.linkItem}
          >
            <ThemedText style={styles.linkIcon}>📧</ThemedText>
            <ThemedText style={styles.linkText}>Contactar soporte</ThemedText>
            <ThemedText style={styles.linkArrow}>›</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/terms")}
            style={styles.linkItem}
          >
            <ThemedText style={styles.linkIcon}>📄</ThemedText>
            <ThemedText style={styles.linkText}>Términos y condiciones</ThemedText>
            <ThemedText style={styles.linkArrow}>›</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/privacy")}
            style={styles.linkItem}
          >
            <ThemedText style={styles.linkIcon}>🔒</ThemedText>
            <ThemedText style={styles.linkText}>Política de privacidad</ThemedText>
            <ThemedText style={styles.linkArrow}>›</ThemedText>
          </Pressable>
        </View>

        {/* Datos */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Datos</ThemedText>
          
          <Pressable
            onPress={clearAllData}
            style={[styles.linkItem, styles.dangerItem]}
          >
            <ThemedText style={styles.linkIcon}>🗑️</ThemedText>
            <ThemedText style={[styles.linkText, styles.dangerText]}>Borrar todos los datos</ThemedText>
          </Pressable>
        </View>

        {/* Versión */}
        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>Pócima Salvaje v1.0.0</ThemedText>
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: IronManColors.glassBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: IronManColors.textPrimary,
  },
  title: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: IronManColors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  languageOptionSelected: {
    borderWidth: 1,
    borderColor: IronManColors.arcReactorBlue,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    color: IronManColors.arcReactorBlue,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  linkIcon: {
    fontSize: 20,
  },
  linkText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: IronManColors.textPrimary,
    flex: 1,
  },
  linkArrow: {
    fontSize: 18,
    color: IronManColors.textTertiary,
  },
  dangerItem: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  dangerText: {
    color: "#EF4444",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  versionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
});
