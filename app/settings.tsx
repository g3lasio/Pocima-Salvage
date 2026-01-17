import { StyleSheet, View, ScrollView, Pressable, Switch, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "@/constants/theme";
import { useApp } from "@/contexts/app-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSetting, clearHistory } = useApp();

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
              await clearHistory();
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
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
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
        {/* Historial */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>HISTORIAL</ThemedText>
          
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

        {/* Soporte */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>SOPORTE</ThemedText>
          
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
          <ThemedText style={styles.sectionTitle}>DATOS</ThemedText>
          
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
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: IronManColors.textTertiary,
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
