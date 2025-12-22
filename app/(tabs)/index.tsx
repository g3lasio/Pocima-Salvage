import { useRouter } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  SectionList,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { 
  sistemasCorporales, 
  buscarEnfermedadesExpandidas, 
  EnfermedadExpandida,
  SistemaCorporal,
  totalEnfermedades
} from "@/data/enfermedades-expandidas";

type ViewMode = "sistemas" | "busqueda";

export default function EnfermedadesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSistema, setExpandedSistema] = useState<string | null>(null);

  const viewMode: ViewMode = searchQuery.trim() ? "busqueda" : "sistemas";

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return buscarEnfermedadesExpandidas(searchQuery);
  }, [searchQuery]);

  const handleEnfermedadPress = useCallback((enfermedad: EnfermedadExpandida) => {
    router.push({
      pathname: "/enfermedad-expandida-detail",
      params: { id: enfermedad.id, sistemaId: enfermedad.sistemaId },
    });
  }, [router]);

  const toggleSistema = useCallback((sistemaId: string) => {
    setExpandedSistema(prev => prev === sistemaId ? null : sistemaId);
  }, []);

  const renderEnfermedadItem = useCallback(({ item }: { item: EnfermedadExpandida }) => (
    <Pressable
      onPress={() => handleEnfermedadPress(item)}
      style={({ pressed }) => [
        styles.enfermedadCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.enfermedadContent}>
        <View style={styles.enfermedadTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.enfermedadTitle} numberOfLines={1}>
            {item.nombre}
          </ThemedText>
          {item.otrosNombres.length > 0 && (
            <ThemedText style={[styles.otrosNombres, { color: colors.textTertiary }]} numberOfLines={1}>
              {item.otrosNombres.join(" • ")}
            </ThemedText>
          )}
        </View>
        <ThemedText style={{ color: colors.textTertiary, fontSize: 18 }}>›</ThemedText>
      </View>
    </Pressable>
  ), [colors, handleEnfermedadPress]);

  const renderSistemaCard = useCallback(({ item }: { item: SistemaCorporal }) => {
    const isExpanded = expandedSistema === item.id;
    const enfermedadesToShow = isExpanded ? item.enfermedades : item.enfermedades.slice(0, 3);
    
    return (
      <View style={[styles.sistemaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => toggleSistema(item.id)}
          style={({ pressed }) => [
            styles.sistemaHeader,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={[styles.sistemaIconContainer, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.sistemaIcon}>{item.icono}</ThemedText>
          </View>
          <View style={styles.sistemaInfo}>
            <ThemedText type="defaultSemiBold" style={styles.sistemaNombre}>
              {item.nombre}
            </ThemedText>
            <ThemedText style={[styles.sistemaCount, { color: colors.textSecondary }]}>
              {item.enfermedades.length} enfermedades
            </ThemedText>
          </View>
          <ThemedText style={[styles.expandIcon, { color: colors.tint }]}>
            {isExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>

        {enfermedadesToShow.length > 0 && (
          <View style={styles.enfermedadesPreview}>
            {enfermedadesToShow.map((enf) => (
              <Pressable
                key={enf.id}
                onPress={() => handleEnfermedadPress(enf)}
                style={({ pressed }) => [
                  styles.enfermedadPreviewItem,
                  { 
                    backgroundColor: pressed ? `${colors.tint}10` : 'transparent',
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <ThemedText style={styles.enfermedadPreviewText} numberOfLines={1}>
                  {enf.nombre}
                </ThemedText>
                <ThemedText style={{ color: colors.textTertiary, fontSize: 14 }}>›</ThemedText>
              </Pressable>
            ))}
            {!isExpanded && item.enfermedades.length > 3 && (
              <Pressable
                onPress={() => toggleSistema(item.id)}
                style={styles.verMasButton}
              >
                <ThemedText style={[styles.verMasText, { color: colors.tint }]}>
                  Ver {item.enfermedades.length - 3} más...
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  }, [colors, expandedSistema, toggleSistema, handleEnfermedadPress]);

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
          {totalEnfermedades} enfermedades en {sistemasCorporales.length} sistemas
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

      {viewMode === "busqueda" ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.sistemaId}-${item.id}`}
          renderItem={renderEnfermedadItem}
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
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <ThemedText style={[styles.resultCount, { color: colors.textSecondary }]}>
                {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""}
              </ThemedText>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={sistemasCorporales}
          keyExtractor={(item) => item.id}
          renderItem={renderSistemaCard}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  resultCount: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  // Sistema Card Styles
  sistemaCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  sistemaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  sistemaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  sistemaIcon: {
    fontSize: 24,
  },
  sistemaInfo: {
    flex: 1,
  },
  sistemaNombre: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  sistemaCount: {
    fontSize: 13,
    lineHeight: 16,
  },
  expandIcon: {
    fontSize: 12,
    marginLeft: Spacing.sm,
  },
  enfermedadesPreview: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  enfermedadPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  enfermedadPreviewText: {
    fontSize: 15,
    flex: 1,
  },
  verMasButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  verMasText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Enfermedad Card Styles (for search results)
  enfermedadCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  enfermedadContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  enfermedadTextContainer: {
    flex: 1,
  },
  enfermedadTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  otrosNombres: {
    fontSize: 13,
    lineHeight: 16,
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
