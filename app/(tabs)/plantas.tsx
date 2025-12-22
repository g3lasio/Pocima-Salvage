import { useRouter } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { plantas, buscarPlantas, Planta } from "@/data/medicinal-data";

export default function PlantasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlantas = useMemo(() => {
    if (!searchQuery.trim()) return plantas;
    return buscarPlantas(searchQuery);
  }, [searchQuery]);

  const handlePlantaPress = useCallback((planta: Planta) => {
    router.push({
      pathname: "/planta-detail",
      params: { id: planta.id },
    });
  }, [router]);

  const renderPlanta = useCallback(({ item }: { item: Planta }) => (
    <Pressable
      onPress={() => handlePlantaPress(item)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={[styles.cardIcon, { backgroundColor: `${colors.tint}15` }]}>
          <ThemedText style={styles.cardEmoji}>🌿</ThemedText>
        </View>
        <View style={styles.cardTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {item.nombre}
          </ThemedText>
          <ThemedText style={[styles.cardCientifico, { color: colors.textTertiary }]}>
            {item.nombreCientifico}
          </ThemedText>
          <View style={styles.propiedadesContainer}>
            {item.propiedades.slice(0, 3).map((prop, index) => (
              <View
                key={index}
                style={[styles.propiedadBadge, { backgroundColor: `${colors.tint}10` }]}
              >
                <ThemedText style={[styles.propiedadText, { color: colors.tint }]}>
                  {prop}
                </ThemedText>
              </View>
            ))}
            {item.propiedades.length > 3 && (
              <View style={[styles.propiedadBadge, { backgroundColor: `${colors.textTertiary}20` }]}>
                <ThemedText style={[styles.propiedadText, { color: colors.textTertiary }]}>
                  +{item.propiedades.length - 3}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cardArrow}>
          <ThemedText style={{ color: colors.textTertiary, fontSize: 20 }}>›</ThemedText>
        </View>
      </View>
    </Pressable>
  ), [colors, handlePlantaPress]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20),
            backgroundColor: colors.background,
          },
        ]}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Plantas Medicinales
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Explora el poder de la naturaleza
        </ThemedText>
        
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar planta o propiedad..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <ThemedText style={{ color: colors.textTertiary }}>✕</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPlantas}
        keyExtractor={(item) => item.id}
        renderItem={renderPlanta}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyEmoji}>🌱</ThemedText>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No se encontraron plantas
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.lg,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  cardCientifico: {
    fontSize: 13,
    lineHeight: 16,
    fontStyle: "italic",
    marginBottom: Spacing.sm,
  },
  propiedadesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  propiedadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  propiedadText: {
    fontSize: 11,
    fontWeight: "500",
  },
  cardArrow: {
    marginLeft: Spacing.sm,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
  },
});
