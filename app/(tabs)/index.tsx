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
import { enfermedades, buscarEnfermedades, Enfermedad } from "@/data/medicinal-data";

export default function EnfermedadesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEnfermedades = useMemo(() => {
    if (!searchQuery.trim()) return enfermedades;
    return buscarEnfermedades(searchQuery);
  }, [searchQuery]);

  const handleEnfermedadPress = useCallback((enfermedad: Enfermedad) => {
    router.push({
      pathname: "/enfermedad-detail",
      params: { id: enfermedad.id },
    });
  }, [router]);

  const renderEnfermedad = useCallback(({ item }: { item: Enfermedad }) => (
    <Pressable
      onPress={() => handleEnfermedadPress(item)}
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
        <View style={styles.cardIcon}>
          <ThemedText style={styles.cardEmoji}>🩺</ThemedText>
        </View>
        <View style={styles.cardTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {item.nombre}
          </ThemedText>
          <ThemedText
            style={[styles.cardSubtitle, { color: colors.textSecondary }]}
          >
            {item.plantasRecomendadas.length} planta{item.plantasRecomendadas.length !== 1 ? "s" : ""} recomendada{item.plantasRecomendadas.length !== 1 ? "s" : ""}
          </ThemedText>
        </View>
        <View style={styles.cardArrow}>
          <ThemedText style={{ color: colors.textTertiary }}>›</ThemedText>
        </View>
      </View>
    </Pressable>
  ), [colors, handleEnfermedadPress]);

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
          Enfermedades
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Encuentra tratamientos naturales
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
            placeholder="Buscar enfermedad..."
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
        data={filteredEnfermedades}
        keyExtractor={(item) => item.id}
        renderItem={renderEnfermedad}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyEmoji}>🔍</ThemedText>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No se encontraron enfermedades
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
    alignItems: "center",
    padding: Spacing.lg,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(46, 125, 50, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  cardArrow: {
    fontSize: 24,
    marginLeft: Spacing.sm,
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
