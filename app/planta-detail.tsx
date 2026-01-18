import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { getPlantaById, contraindicacionIconos, contraindicacionLabels } from "../data/medicinal-data";
import { useApp } from "../contexts/app-context";

export default function PlantaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const planta = useMemo(() => getPlantaById(id || ""), [id]);
  const { addToHistory, addFavorite, removeFavorite, isFavorite } = useApp();
  const isFav = planta ? isFavorite(planta.id) : false;

  // Add to history when viewing
  useEffect(() => {
    if (planta) {
      addToHistory({
        id: planta.id,
        type: "planta",
        nombre: planta.nombre,
      });
    }
  }, [planta?.id]);

  const toggleFavorite = () => {
    if (!planta) return;
    if (isFav) {
      removeFavorite(planta.id);
    } else {
      addFavorite({
        id: planta.id,
        type: "planta",
        nombre: planta.nombre,
        descripcion: planta.descripcion,
      });
    }
  };

  if (!planta) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorEmoji}>❌</ThemedText>
          <ThemedText>Planta no encontrada</ThemedText>
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
          {planta.nombre}
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
        {/* Icon and Title */}
        <View style={styles.iconContainer}>
          <View style={[styles.mainIcon, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.mainIconEmoji}>🌿</ThemedText>
          </View>
        </View>

        <ThemedText type="title" style={styles.title}>
          {planta.nombre}
        </ThemedText>
        <ThemedText style={[styles.cientificoName, { color: colors.textTertiary }]}>
          {planta.nombreCientifico}
        </ThemedText>

        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {planta.descripcion}
        </ThemedText>

        {/* Propiedades */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ✨ Propiedades Curativas
          </ThemedText>
          <View style={styles.badgesContainer}>
            {planta.propiedades.map((prop, index) => (
              <View
                key={index}
                style={[styles.badge, { backgroundColor: `${colors.tint}15` }]}
              >
                <ThemedText style={[styles.badgeText, { color: colors.tint }]}>
                  {prop}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Parte Usable */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🌱 Parte Utilizable
          </ThemedText>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={styles.infoText}>{planta.parteUsable}</ThemedText>
          </View>
        </View>

        {/* Dosis */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💊 Dosis Recomendada
          </ThemedText>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={styles.infoText}>{planta.dosis}</ThemedText>
          </View>
        </View>

        {/* Preparación */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🫖 Preparación
          </ThemedText>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={styles.infoText}>{planta.preparacion}</ThemedText>
          </View>
        </View>

        {/* Fuente */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 Fuente
          </ThemedText>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={[styles.infoText, { fontStyle: "italic" }]}>{planta.fuente}</ThemedText>
          </View>
        </View>

        {/* Contraindicaciones */}
        {planta.contraindicaciones.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.danger }]}>
              ⚠️ Contraindicaciones
            </ThemedText>
            <View style={[styles.contraindicacionesContainer, { backgroundColor: `${colors.danger}08`, borderColor: colors.danger }]}>
              {planta.contraindicaciones.map((contra, index) => (
                <View key={index} style={styles.contraindicacionItem}>
                  <View style={styles.contraindicacionHeader}>
                    <ThemedText style={styles.contraindicacionIcon}>
                      {contraindicacionIconos[contra.tipo]}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={[styles.contraindicacionLabel, { color: colors.danger }]}>
                      {contraindicacionLabels[contra.tipo]}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.contraindicacionText, { color: colors.textSecondary }]}>
                    {contra.descripcion}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
          <ThemedText style={styles.disclaimerIcon}>⚠️</ThemedText>
          <ThemedText style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Esta información es solo orientativa y no sustituye el consejo médico profesional. Consulta siempre con un profesional de la salud antes de usar plantas medicinales.
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
    marginBottom: 4,
  },
  cientificoName: {
    fontSize: 15,
    lineHeight: 20,
    fontStyle: "italic",
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
    fontSize: 17,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  contraindicacionesContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  contraindicacionItem: {
    marginBottom: Spacing.md,
  },
  contraindicacionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  contraindicacionIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  contraindicacionLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  contraindicacionText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 28,
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
