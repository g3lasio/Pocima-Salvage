import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { 
  getEnfermedadExpandidaById, 
  sistemasCorporales,
} from "@/data/enfermedades-expandidas";
import { plantas, getPlantaById } from "@/data/medicinal-data";

// Mapeo simple de enfermedades a plantas recomendadas basado en propiedades
const getPlantasRecomendadas = (enfermedadId: string, sistemaId: string) => {
  // Mapeo de sistemas a propiedades de plantas relevantes
  const sistemaToProperties: Record<string, string[]> = {
    "sistema-respiratorio": ["Expectorante", "Descongestionante", "Antiséptico", "Antitusivo", "Antibacteriano"],
    "sistema-digestivo": ["Digestiva", "Carminativa", "Hepatoprotector", "Antiespasmódica", "Colerético"],
    "sistema-cardiovascular": ["Hipotensor", "Estimulante circulatorio", "Antioxidante"],
    "sistema-nervioso": ["Sedante", "Ansiolítica", "Calmante", "Relajante", "Inductora del sueño"],
    "sistema-inmunologico": ["Inmunoestimulante", "Antibacteriana", "Antiviral", "Antiinflamatoria"],
    "sistema-endocrino": ["Antioxidante", "Antiinflamatorio"],
    "sistema-musculoesqueletico": ["Antiinflamatoria", "Analgésica", "Relajante muscular"],
    "sistema-urinario": ["Diurético", "Antiséptico", "Depurativo"],
    "sistema-reproductor": ["Antiespasmódica", "Sedante suave", "Antiinflamatoria"],
    "enfermedades-piel": ["Cicatrizante", "Antiséptica", "Antiinflamatoria", "Emoliente", "Hidratante"],
    "sistema-linfatico": ["Depurativo", "Diurético", "Inmunoestimulante"],
    "trastornos-mentales-emocionales": ["Ansiolítica", "Sedante", "Calmante", "Relajante"],
    "enfermedades-ojos-oidos-nariz-garganta": ["Antiséptica", "Antiinflamatoria", "Astringente", "Descongestionante"],
  };

  const relevantProperties = sistemaToProperties[sistemaId] || [];
  
  // Encontrar plantas que tengan propiedades relevantes
  const plantasRelevantes = plantas.filter(planta => 
    planta.propiedades.some(prop => 
      relevantProperties.some(relProp => 
        prop.toLowerCase().includes(relProp.toLowerCase())
      )
    )
  ).slice(0, 4); // Máximo 4 plantas

  return plantasRelevantes.map(planta => ({
    plantaId: planta.id,
    razon: `Propiedades: ${planta.propiedades.slice(0, 3).join(", ")}`
  }));
};

export default function EnfermedadExpandidaDetailScreen() {
  const { id, sistemaId } = useLocalSearchParams<{ id: string; sistemaId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const enfermedad = useMemo(() => getEnfermedadExpandidaById(id || ""), [id]);
  const sistema = useMemo(() => 
    sistemasCorporales.find(s => s.id === sistemaId), 
    [sistemaId]
  );
  const plantasRecomendadas = useMemo(() => 
    getPlantasRecomendadas(id || "", sistemaId || ""),
    [id, sistemaId]
  );

  const handlePlantaPress = useCallback((plantaId: string) => {
    router.push({
      pathname: "/planta-detail",
      params: { id: plantaId },
    });
  }, [router]);

  if (!enfermedad) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorEmoji}>❌</ThemedText>
          <ThemedText>Enfermedad no encontrada</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20),
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <ThemedText style={[styles.closeButtonText, { color: colors.tint }]}>✕</ThemedText>
        </Pressable>
        <ThemedText type="subtitle" style={styles.headerTitle} numberOfLines={1}>
          {enfermedad.nombre}
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon and Sistema Badge */}
        <View style={styles.iconContainer}>
          <View style={[styles.mainIcon, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.mainIconEmoji}>{sistema?.icono || "🩺"}</ThemedText>
          </View>
          {sistema && (
            <View style={[styles.sistemaBadge, { backgroundColor: `${colors.tint}15` }]}>
              <ThemedText style={[styles.sistemaBadgeText, { color: colors.tint }]}>
                {sistema.nombre}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="title" style={styles.title}>
          {enfermedad.nombre}
        </ThemedText>

        {/* Otros nombres */}
        {enfermedad.otrosNombres.length > 0 && (
          <View style={styles.otrosNombresContainer}>
            <ThemedText style={[styles.otrosNombresLabel, { color: colors.textTertiary }]}>
              También conocida como:
            </ThemedText>
            <View style={styles.otrosNombresBadges}>
              {enfermedad.otrosNombres.map((nombre, index) => (
                <View 
                  key={index} 
                  style={[styles.nombreBadge, { backgroundColor: `${colors.textTertiary}15` }]}
                >
                  <ThemedText style={[styles.nombreBadgeText, { color: colors.textSecondary }]}>
                    {nombre}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {enfermedad.descripcion}
        </ThemedText>

        {/* Plantas Recomendadas */}
        {plantasRecomendadas.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🌿 Plantas Medicinales Sugeridas
            </ThemedText>
            <ThemedText style={[styles.sectionNote, { color: colors.textTertiary }]}>
              Basado en las propiedades terapéuticas relacionadas con este sistema
            </ThemedText>

            {plantasRecomendadas.map((rec) => {
              const planta = getPlantaById(rec.plantaId);
              if (!planta) return null;

              return (
                <Pressable
                  key={rec.plantaId}
                  onPress={() => handlePlantaPress(rec.plantaId)}
                  style={({ pressed }) => [
                    styles.plantaCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.plantaHeader}>
                    <View style={[styles.plantaIcon, { backgroundColor: `${colors.tint}15` }]}>
                      <ThemedText style={styles.plantaEmoji}>🌿</ThemedText>
                    </View>
                    <View style={styles.plantaInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.plantaName}>
                        {planta.nombre}
                      </ThemedText>
                      <ThemedText style={[styles.plantaCientifico, { color: colors.textTertiary }]}>
                        {planta.nombreCientifico}
                      </ThemedText>
                    </View>
                    <ThemedText style={{ color: colors.textTertiary, fontSize: 20 }}>›</ThemedText>
                  </View>
                  <ThemedText style={[styles.plantaRazon, { color: colors.textSecondary }]}>
                    {rec.razon}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <ThemedText style={styles.disclaimerIcon}>⚠️</ThemedText>
          <ThemedText style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Esta información es solo orientativa y no sustituye el diagnóstico médico profesional. Consulta siempre con un profesional de la salud.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  mainIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  mainIconEmoji: {
    fontSize: 40,
  },
  sistemaBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  sistemaBadgeText: {
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  otrosNombresContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  otrosNombresLabel: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  otrosNombresBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  nombreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  nombreBadgeText: {
    fontSize: 13,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  sectionNote: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  plantaCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  plantaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  plantaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  plantaEmoji: {
    fontSize: 20,
  },
  plantaInfo: {
    flex: 1,
  },
  plantaName: {
    fontSize: 16,
    lineHeight: 20,
  },
  plantaCientifico: {
    fontSize: 13,
    lineHeight: 16,
    fontStyle: "italic",
  },
  plantaRazon: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  disclaimer: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  disclaimerIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
});
