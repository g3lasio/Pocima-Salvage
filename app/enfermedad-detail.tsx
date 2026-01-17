import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useCallback, useEffect } from "react";
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
import { getEnfermedadById, getPlantaById } from "@/data/medicinal-data";
import { useApp } from "@/contexts/app-context";

export default function EnfermedadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const enfermedad = useMemo(() => getEnfermedadById(id || ""), [id]);
  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useApp();
  const isFav = enfermedad ? isFavorite(enfermedad.id) : false;

  // Add to history when viewing
  useEffect(() => {
    if (enfermedad) {
      addToHistory({
        id: enfermedad.id,
        type: "enfermedad",
        nombre: enfermedad.nombre,
      });
    }
  }, [enfermedad?.id]);

  const toggleFavorite = () => {
    if (!enfermedad) return;
    if (isFav) {
      removeFavorite(enfermedad.id);
    } else {
      addFavorite({
        id: enfermedad.id,
        type: "enfermedad",
        nombre: enfermedad.nombre,
        descripcion: enfermedad.descripcion,
      });
    }
  };

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
        <Pressable onPress={toggleFavorite} style={styles.favoriteButton}>
          <ThemedText style={styles.favoriteIcon}>{isFav ? "⭐" : "☆"}</ThemedText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.mainIcon, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.mainIconEmoji}>🩺</ThemedText>
          </View>
        </View>

        <ThemedText type="title" style={styles.title}>
          {enfermedad.nombre}
        </ThemedText>

        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {enfermedad.descripcion}
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🌿 Plantas Recomendadas
          </ThemedText>

          {enfermedad.plantasRecomendadas.map((rec) => {
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

        <View style={[styles.disclaimer, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <ThemedText style={styles.disclaimerIcon}>⚠️</ThemedText>
          <ThemedText style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Esta información es solo orientativa. Consulta siempre con un profesional de la salud antes de usar plantas medicinales.
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
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 22,
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
  },
  mainIconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    textAlign: "center",
    marginBottom: Spacing.md,
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
