import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts } from "@/constants/theme";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Privacidad</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.lastUpdated}>Última actualización: Enero 2025</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>1. Información Recopilada</ThemedText>
          <ThemedText style={styles.sectionText}>
            Recopilamos información mínima: preferencias, historial y favoritos (almacenados localmente).
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>2. Uso de Datos</ThemedText>
          <ThemedText style={styles.sectionText}>
            Solo para mejorar su experiencia. No vendemos ni compartimos datos con terceros.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>3. Almacenamiento</ThemedText>
          <ThemedText style={styles.sectionText}>
            Datos almacenados localmente. Las conversaciones con MolDoctor no se guardan permanentemente.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>4. Sus Derechos</ThemedText>
          <ThemedText style={styles.sectionText}>
            Puede eliminar sus datos desde Configuración en cualquier momento.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>5. Contacto</ThemedText>
          <ThemedText style={styles.sectionText}>
            Preguntas sobre privacidad: info@chyrris.com
          </ThemedText>
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
  lastUpdated: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textSecondary,
    lineHeight: 22,
  },
});
