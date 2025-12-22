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
import { 
  categoriasPlantas, 
  buscarPlantasExpandidas, 
  PlantaExpandida,
  CategoriaPlanta,
  totalPlantas
} from "@/data/plantas-expandidas";

type ViewMode = "categorias" | "busqueda";

// Iconos para categorías
const categoriaIconos: Record<string, string> = {
  "hierbas-aromaticas-culinarias": "🌿",
  "hierbas-silvestres-medicinales": "🍀",
  "arboles-medicinales": "🌳",
  "arbustos-medicinales": "🌲",
  "plantas-tropicales-medicinales": "🌴",
  "raices-tuberculos-medicinales": "🥕",
  "flores-medicinales": "🌸",
  "hongos-medicinales": "🍄",
  "algas-plantas-acuaticas-medicinales": "🌊",
  "frutas-citricas-medicinales": "🍋",
  "frutas-tropicales-medicinales": "🥭",
  "frutas-clima-templado-medicinales": "🍎",
  "bayas-frutos-bosque-medicinales": "🫐",
  "semillas-frutos-secos-medicinales": "🥜",
  "especias-medicinales": "🌶️",
  "plantas-suculentas-cactus-medicinales": "🌵",
  "plantas-adaptogenas": "⚡",
};

export default function PlantasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategoria, setExpandedCategoria] = useState<string | null>(null);

  const viewMode: ViewMode = searchQuery.trim() ? "busqueda" : "categorias";

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return buscarPlantasExpandidas(searchQuery);
  }, [searchQuery]);

  const handlePlantaPress = useCallback((planta: PlantaExpandida) => {
    router.push({
      pathname: "/planta-expandida-detail",
      params: { id: planta.id },
    });
  }, [router]);

  const toggleCategoria = useCallback((categoriaId: string) => {
    setExpandedCategoria(prev => prev === categoriaId ? null : categoriaId);
  }, []);

  const renderPlantaItem = useCallback(({ item }: { item: PlantaExpandida }) => (
    <Pressable
      onPress={() => handlePlantaPress(item)}
      style={({ pressed }) => [
        styles.plantaCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.plantaContent}>
        <View style={[styles.plantaIconSmall, { backgroundColor: `${colors.tint}15` }]}>
          <ThemedText style={styles.plantaEmoji}>🌿</ThemedText>
        </View>
        <View style={styles.plantaTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.plantaTitle} numberOfLines={1}>
            {item.nombre}
          </ThemedText>
          <ThemedText style={[styles.plantaCientifico, { color: colors.textTertiary }]} numberOfLines={1}>
            {item.nombreCientifico}
          </ThemedText>
          <ThemedText style={[styles.plantaPropiedades, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.propiedades.slice(0, 3).join(" • ")}
          </ThemedText>
        </View>
        <ThemedText style={{ color: colors.textTertiary, fontSize: 18 }}>›</ThemedText>
      </View>
    </Pressable>
  ), [colors, handlePlantaPress]);

  const renderCategoriaCard = useCallback(({ item }: { item: CategoriaPlanta }) => {
    const isExpanded = expandedCategoria === item.id;
    const plantasToShow = isExpanded ? item.plantas : item.plantas.slice(0, 3);
    const icono = categoriaIconos[item.id] || "🌿";
    
    return (
      <View style={[styles.categoriaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => toggleCategoria(item.id)}
          style={({ pressed }) => [
            styles.categoriaHeader,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={[styles.categoriaIconContainer, { backgroundColor: `${colors.tint}15` }]}>
            <ThemedText style={styles.categoriaIcon}>{icono}</ThemedText>
          </View>
          <View style={styles.categoriaInfo}>
            <ThemedText type="defaultSemiBold" style={styles.categoriaNombre}>
              {item.nombre}
            </ThemedText>
            <ThemedText style={[styles.categoriaCount, { color: colors.textSecondary }]}>
              {item.plantas.length} plantas
            </ThemedText>
          </View>
          <ThemedText style={[styles.expandIcon, { color: colors.tint }]}>
            {isExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>

        {plantasToShow.length > 0 && (
          <View style={styles.plantasPreview}>
            {plantasToShow.map((planta) => (
              <Pressable
                key={planta.id}
                onPress={() => handlePlantaPress(planta)}
                style={({ pressed }) => [
                  styles.plantaPreviewItem,
                  { 
                    backgroundColor: pressed ? `${colors.tint}10` : 'transparent',
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View style={styles.plantaPreviewContent}>
                  <ThemedText style={styles.plantaPreviewText} numberOfLines={1}>
                    {planta.nombre}
                  </ThemedText>
                  <ThemedText style={[styles.plantaPreviewCientifico, { color: colors.textTertiary }]} numberOfLines={1}>
                    {planta.nombreCientifico}
                  </ThemedText>
                </View>
                <ThemedText style={{ color: colors.textTertiary, fontSize: 14 }}>›</ThemedText>
              </Pressable>
            ))}
            {!isExpanded && item.plantas.length > 3 && (
              <Pressable
                onPress={() => toggleCategoria(item.id)}
                style={styles.verMasButton}
              >
                <ThemedText style={[styles.verMasText, { color: colors.tint }]}>
                  Ver {item.plantas.length - 3} más...
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  }, [colors, expandedCategoria, toggleCategoria, handlePlantaPress]);

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
          {totalPlantas} plantas en {categoriasPlantas.length} categorías
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

      {viewMode === "busqueda" ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => `${item.categoriaId}-${item.id}`}
          renderItem={renderPlantaItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyEmoji}>🔍</ThemedText>
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No se encontraron plantas
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
          data={categoriasPlantas}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoriaCard}
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
  // Categoria Card Styles
  categoriaCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  categoriaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  categoriaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  categoriaIcon: {
    fontSize: 24,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNombre: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  categoriaCount: {
    fontSize: 13,
    lineHeight: 16,
  },
  expandIcon: {
    fontSize: 12,
    marginLeft: Spacing.sm,
  },
  plantasPreview: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  plantaPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  plantaPreviewContent: {
    flex: 1,
  },
  plantaPreviewText: {
    fontSize: 15,
  },
  plantaPreviewCientifico: {
    fontSize: 12,
    fontStyle: "italic",
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
  // Planta Card Styles (for search results)
  plantaCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  plantaContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  plantaIconSmall: {
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
  plantaTextContainer: {
    flex: 1,
  },
  plantaTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  plantaCientifico: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: "italic",
  },
  plantaPropiedades: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
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
