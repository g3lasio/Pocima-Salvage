import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts } from "@/constants/theme";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <GlassBackground showGrid={true} showCorners={true}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Términos</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.lastUpdated}>Última actualización: Enero 2025</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>1. Aceptación</ThemedText>
          <ThemedText style={styles.sectionText}>
            Al usar Pócima Salvaje, acepta estos términos. Si no está de acuerdo, no use la aplicación.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>2. Servicio</ThemedText>
          <ThemedText style={styles.sectionText}>
            Pócima Salvaje es una aplicación informativa sobre medicina natural. No constituye consejo médico profesional.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>3. Aviso Médico</ThemedText>
          <ThemedText style={styles.sectionText}>
            La información es solo educativa. Siempre consulte a un profesional de salud antes de cualquier tratamiento.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>4. Propiedad Intelectual</ThemedText>
          <ThemedText style={styles.sectionText}>
            Todo el contenido es propiedad de Chyrris y está protegido por leyes de propiedad intelectual.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>5. Contacto</ThemedText>
          <ThemedText style={styles.sectionText}>
            Para preguntas: info@chyrris.com
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
