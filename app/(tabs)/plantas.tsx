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
import { GlassBackground } from "@/components/ui/glass-background";
import { HolographicCard } from "@/components/ui/holographic-card";
import { HolographicIcon, HolographicBadge } from "@/components/ui/holographic-icons";
import { Colors, Spacing, IronManColors, Fonts, HolographicStyles } from "@/constants/theme";
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
    <HolographicCard
      onPress={() => handlePlantaPress(item)}
      variant="subtle"
      style={styles.plantaCard}
    >
      <View style={styles.plantaContent}>
        <HolographicIcon icon="🌿" size="medium" variant="subtle" />
        <View style={styles.plantaTextContainer}>
          <ThemedText type="defaultSemiBold" style={styles.plantaTitle} numberOfLines={1}>
            {item.nombre}
          </ThemedText>
          <ThemedText style={styles.nombreCientifico} numberOfLines={1}>
            {item.nombreCientifico}
          </ThemedText>
          {item.propiedades.length > 0 && (
            <View style={styles.propiedadesRow}>
              {item.propiedades.slice(0, 2).map((prop, idx) => (
                <HolographicBadge 
                  key={idx} 
                  text={prop} 
                  size="small" 
                  variant="info"
                  style={styles.propiedadBadge}
                />
              ))}
              {item.propiedades.length > 2 && (
                <ThemedText style={styles.moreBadge}>
                  +{item.propiedades.length - 2}
                </ThemedText>
              )}
            </View>
          )}
        </View>
        <ThemedText style={styles.arrowIcon}>›</ThemedText>
      </View>
    </HolographicCard>
  ), [handlePlantaPress]);

  const renderCategoriaCard = useCallback(({ item }: { item: CategoriaPlanta }) => {
    const isExpanded = expandedCategoria === item.id;
    const plantasToShow = isExpanded ? item.plantas : item.plantas.slice(0, 3);
    const icono = categoriaIconos[item.id] || "🌿";
    
    return (
      <HolographicCard
        variant={isExpanded ? "elevated" : "default"}
        style={styles.categoriaCard}
      >
        <Pressable
          onPress={() => toggleCategoria(item.id)}
          style={({ pressed }) => [
            styles.categoriaHeader,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <HolographicIcon 
            icon={icono} 
            size="medium" 
            variant={isExpanded ? "glow" : "default"}
          />
          <View style={styles.categoriaInfo}>
            <ThemedText type="defaultSemiBold" style={styles.categoriaNombre}>
              {item.nombre}
            </ThemedText>
            <ThemedText style={styles.categoriaCount}>
              {item.plantas.length} plantas medicinales
            </ThemedText>
          </View>
          <ThemedText style={styles.expandIcon}>
            {isExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>

        {plantasToShow.length > 0 && (
          <View style={[styles.plantasPreview, { borderTopColor: colors.borderSubtle }]}>
            {plantasToShow.map((planta) => (
              <Pressable
                key={planta.id}
                onPress={() => handlePlantaPress(planta)}
                style={({ pressed }) => [
                  styles.plantaPreviewItem,
                  { 
                    backgroundColor: pressed ? IronManColors.glassBlue : 'transparent',
                    borderBottomColor: colors.borderSubtle,
                  },
                ]}
              >
                <View style={styles.plantaPreviewContent}>
                  <ThemedText style={styles.plantaPreviewIcon}>🌿</ThemedText>
                  <View style={styles.plantaPreviewTextContainer}>
                    <ThemedText style={styles.plantaPreviewText} numberOfLines={1}>
                      {planta.nombre}
                    </ThemedText>
                    <ThemedText style={styles.plantaPreviewCientifico} numberOfLines={1}>
                      {planta.nombreCientifico}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.previewArrow}>›</ThemedText>
              </Pressable>
            ))}
            {!isExpanded && item.plantas.length > 3 && (
              <Pressable
                onPress={() => toggleCategoria(item.id)}
                style={styles.verMasButton}
              >
                <ThemedText style={styles.verMasText}>
                  Ver {item.plantas.length - 3} más...
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </HolographicCard>
    );
  }, [colors, expandedCategoria, toggleCategoria, handlePlantaPress]);

  return (
    <GlassBackground showGrid={true} showScanLine={true} showCorners={true}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20) + 10,
          },
        ]}
      >
        <ThemedText type="title" style={styles.headerTitle}>
          Plantas Medicinales
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {totalPlantas} plantas en {categoriasPlantas.length} categorías
        </ThemedText>
        
        <View style={[styles.searchContainer, HolographicStyles.inputField]}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: Fonts.regular }]}
            placeholder="Buscar planta o propiedad..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <ThemedText style={styles.clearIcon}>✕</ThemedText>
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
            { paddingBottom: Math.max(insets.bottom, 20) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <HolographicIcon icon="🌿" size="xlarge" variant="glow" animated />
              <ThemedText style={styles.emptyText}>
                No se encontraron plantas
              </ThemedText>
            </View>
          }
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <ThemedText style={styles.resultCount}>
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
            { paddingBottom: Math.max(insets.bottom, 20) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: IronManColors.holographicCyan,
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
    fontFamily: Fonts.regular,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    letterSpacing: 0.3,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  clearIcon: {
    color: IronManColors.holographicCyan,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  resultCount: {
    fontSize: 14,
    color: IronManColors.holographicCyan,
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
    fontFamily: Fonts.regular,
  },
  // Categoria Card Styles
  categoriaCard: {
    marginBottom: Spacing.md,
    padding: 0,
  },
  categoriaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  categoriaInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoriaNombre: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  categoriaCount: {
    fontSize: 13,
    color: IronManColors.holographicCyan,
    letterSpacing: 0.3,
    fontFamily: Fonts.regular,
  },
  expandIcon: {
    fontSize: 12,
    color: IronManColors.arcReactorBlue,
    marginLeft: Spacing.sm,
  },
  plantasPreview: {
    borderTopWidth: 1,
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  plantaPreviewIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  plantaPreviewTextContainer: {
    flex: 1,
  },
  plantaPreviewText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  plantaPreviewCientifico: {
    fontSize: 12,
    color: IronManColors.textTertiary,
    fontStyle: "italic",
    fontFamily: Fonts.italic,
  },
  previewArrow: {
    color: IronManColors.holographicCyan,
    fontSize: 16,
  },
  verMasButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  verMasText: {
    fontSize: 14,
    color: IronManColors.arcReactorBlue,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
  },
  // Planta Card Styles (for search results)
  plantaCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  plantaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  plantaTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  plantaTitle: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 2,
  },
  nombreCientifico: {
    fontSize: 13,
    color: IronManColors.textTertiary,
    fontStyle: "italic",
    marginBottom: 4,
    fontFamily: Fonts.italic,
  },
  propiedadesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  propiedadBadge: {
    marginRight: 4,
    marginBottom: 2,
  },
  moreBadge: {
    fontSize: 11,
    color: IronManColors.holographicCyan,
    fontFamily: Fonts.regular,
  },
  arrowIcon: {
    color: IronManColors.arcReactorBlue,
    fontSize: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: IronManColors.textSecondary,
    marginTop: Spacing.lg,
    fontFamily: Fonts.regular,
  },
});
