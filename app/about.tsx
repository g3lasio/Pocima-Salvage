import { StyleSheet, View, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "@/constants/theme";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <GlassBackground showGrid={true} showCorners={true}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Acerca de</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y nombre */}
        <View style={styles.logoSection}>
          <ThemedText style={styles.logoEmoji}>🌿</ThemedText>
          <ThemedText style={styles.appName}>Pócima Salvaje</ThemedText>
          <ThemedText style={styles.appVersion}>Versión 1.0.0</ThemedText>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nuestra Misión</ThemedText>
          <ThemedText style={styles.sectionText}>
            Pócima Salvaje es tu compañero de medicina natural. Combinamos el conocimiento 
            ancestral de las plantas medicinales con la tecnología moderna para brindarte 
            información confiable sobre remedios naturales.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Qué Ofrecemos?</ThemedText>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🩺</ThemedText>
              <View style={styles.featureText}>
                <ThemedText style={styles.featureTitle}>MolDoctor</ThemedText>
                <ThemedText style={styles.featureDesc}>
                  Tu doctor virtual especializado en medicina natural y plantas medicinales.
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🌿</ThemedText>
              <View style={styles.featureText}>
                <ThemedText style={styles.featureTitle}>Base de Plantas</ThemedText>
                <ThemedText style={styles.featureDesc}>
                  Más de 690 plantas medicinales con información detallada.
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>🏥</ThemedText>
              <View style={styles.featureText}>
                <ThemedText style={styles.featureTitle}>Enfermedades</ThemedText>
                <ThemedText style={styles.featureDesc}>
                  Información sobre condiciones de salud y tratamientos naturales.
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Aviso Importante</ThemedText>
          <View style={styles.warningBox}>
            <ThemedText style={styles.warningText}>
              La información proporcionada es solo con fines educativos. No reemplaza 
              el consejo médico profesional. Siempre consulta a un profesional de la 
              salud antes de iniciar cualquier tratamiento.
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contacto</ThemedText>
          <Pressable 
            onPress={() => Linking.openURL("mailto:info@chyrris.com")}
            style={styles.contactButton}
          >
            <ThemedText style={styles.contactIcon}>📧</ThemedText>
            <ThemedText style={styles.contactText}>info@chyrris.com</ThemedText>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Desarrollado con 💚 por Chyrris</ThemedText>
          <ThemedText style={styles.copyright}>© 2025 Todos los derechos reservados</ThemedText>
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
  logoSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: IronManColors.arcReactorBlue,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: IronManColors.textSecondary,
    lineHeight: 24,
  },
  featureList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.3)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  warningText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textSecondary,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  contactIcon: {
    fontSize: 24,
  },
  contactText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.arcReactorBlue,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: IronManColors.borderHoloSubtle,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  copyright: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
});
