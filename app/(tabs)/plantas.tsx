import { useRouter } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { Colors, Spacing, IronManColors, Fonts, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { 
  categoriasPlantas, 
  buscarPlantasExpandidas, 
  PlantaExpandida,
  CategoriaPlanta,
  totalPlantas
} from "@/data/plantas-expandidas";

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

// Nombres cortos para categorías
const categoriaNombresCortos: Record<string, string> = {
  "hierbas-aromaticas-culinarias": "Aromáticas",
  "hierbas-silvestres-medicinales": "Silvestres",
  "arboles-medicinales": "Árboles",
  "arbustos-medicinales": "Arbustos",
  "plantas-tropicales-medicinales": "Tropicales",
  "raices-tuberculos-medicinales": "Raíces",
  "flores-medicinales": "Flores",
  "hongos-medicinales": "Hongos",
  "algas-plantas-acuaticas-medicinales": "Acuáticas",
  "frutas-citricas-medicinales": "Cítricos",
  "frutas-tropicales-medicinales": "Frutas",
  "frutas-clima-templado-medicinales": "Templadas",
  "bayas-frutos-bosque-medicinales": "Bayas",
  "semillas-frutos-secos-medicinales": "Semillas",
  "especias-medicinales": "Especias",
  "plantas-suculentas-cactus-medicinales": "Suculentas",
  "plantas-adaptogenas": "Adaptógenas",
};

export default function PlantasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  // Plantas filtradas
  const displayedPlantas = useMemo(() => {
    if (searchQuery.trim()) {
      return buscarPlantasExpandidas(searchQuery);
    }
    if (selectedCategoria) {
      const categoria = categoriasPlantas.find(c => c.id === selectedCategoria);
      return categoria?.plantas || [];
    }
    return [];
  }, [searchQuery, selectedCategoria]);

  const handlePlantaPress = useCallback((planta: PlantaExpandida) => {
    router.push({
      pathname: "/planta-expandida-detail",
      params: { id: planta.id },
    });
  }, [router]);

  const handleCategoriaPress = useCallback((categoriaId: string) => {
    setSelectedCategoria(prev => prev === categoriaId ? null : categoriaId);
    setSearchQuery("");
  }, []);

  // Renderizar item de planta
  const renderPlantaItem = useCallback(({ item }: { item: PlantaExpandida }) => (
    <Pressable
      onPress={() => handlePlantaPress(item)}
      style={({ pressed }) => [
        styles.plantaItem,
        { backgroundColor: pressed ? IronManColors.glassBlueMedium : IronManColors.glassBlue },
      ]}
    >
      <View style={styles.plantaIcon}>
        <ThemedText style={styles.plantaEmoji}>
          {categoriaIconos[item.categoriaId] || "🌿"}
        </ThemedText>
      </View>
      <View style={styles.plantaInfo}>
        <ThemedText style={styles.plantaNombre} numberOfLines={1}>
          {item.nombre}
        </ThemedText>
        <ThemedText style={styles.plantaCientifico} numberOfLines={1}>
          {item.nombreCientifico}
        </ThemedText>
        <View style={styles.propiedadesRow}>
          {item.propiedades.slice(0, 2).map((prop, idx) => (
            <View key={idx} style={styles.propiedadTag}>
              <ThemedText style={styles.propiedadText}>{prop}</ThemedText>
            </View>
          ))}
          {item.propiedades.length > 2 && (
            <ThemedText style={styles.moreText}>+{item.propiedades.length - 2}</ThemedText>
          )}
        </View>
      </View>
      <ThemedText style={styles.arrow}>›</ThemedText>
    </Pressable>
  ), [handlePlantaPress]);

  // Renderizar categoría
  const renderCategoriaItem = useCallback(({ item }: { item: CategoriaPlanta }) => {
    const isSelected = selectedCategoria === item.id;
    return (
      <Pressable
        onPress={() => handleCategoriaPress(item.id)}
        style={[
          styles.categoriaChip,
          isSelected && styles.categoriaChipSelected,
        ]}
      >
        <ThemedText style={styles.categoriaEmoji}>
          {categoriaIconos[item.id] || "🌿"}
        </ThemedText>
        <ThemedText style={[
          styles.categoriaText,
          isSelected && styles.categoriaTextSelected,
        ]}>
          {categoriaNombresCortos[item.id] || item.nombre}
        </ThemedText>
        <View style={[styles.categoriaCount, isSelected && styles.categoriaCountSelected]}>
          <ThemedText style={styles.categoriaCountText}>{item.plantas.length}</ThemedText>
        </View>
      </Pressable>
    );
  }, [selectedCategoria, handleCategoriaPress]);

  return (
    <GlassBackground showGrid={true} showCorners={true}>
      {/* Header con safe area */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <ThemedText type="title" style={styles.title}>Plantas Medicinales</ThemedText>
        <ThemedText style={styles.subtitle}>
          {totalPlantas} plantas • {categoriasPlantas.length} categorías
        </ThemedText>

        {/* Barra de búsqueda */}
        <View style={styles.searchBar}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar planta..."
            placeholderTextColor={IronManColors.textTertiary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text) setSelectedCategoria(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={styles.clearBtn}>
              <ThemedText style={styles.clearIcon}>✕</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      {/* Categorías horizontales */}
      <View style={styles.categoriasContainer}>
        <FlatList
          data={categoriasPlantas}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoriaItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContent}
        />
      </View>

      {/* Lista de plantas o mensaje */}
      {displayedPlantas.length > 0 ? (
        <FlatList
          data={displayedPlantas}
          keyExtractor={(item) => `${item.categoriaId}-${item.id}`}
          renderItem={renderPlantaItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ThemedText style={styles.resultCount}>
              {displayedPlantas.length} {displayedPlantas.length === 1 ? "resultado" : "resultados"}
            </ThemedText>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyEmoji}>🌿</ThemedText>
          <ThemedText style={styles.emptyTitle}>
            {searchQuery ? "Sin resultados" : "Selecciona una categoría"}
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {searchQuery 
              ? "Intenta con otro término de búsqueda"
              : "O busca una planta por nombre"}
          </ThemedText>
        </View>
      )}
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: IronManColors.holographicCyan,
    marginBottom: Spacing.md,
    fontFamily: Fonts.regular,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  clearIcon: {
    fontSize: 14,
    color: IronManColors.textTertiary,
  },
  categoriasContainer: {
    marginBottom: Spacing.sm,
  },
  categoriasContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoriaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 6,
  },
  categoriaChipSelected: {
    backgroundColor: IronManColors.glassBlueMedium,
    borderColor: IronManColors.arcReactorBlue,
  },
  categoriaEmoji: {
    fontSize: 14,
  },
  categoriaText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textSecondary,
  },
  categoriaTextSelected: {
    color: IronManColors.arcReactorBlue,
  },
  categoriaCount: {
    backgroundColor: IronManColors.glassDarkMedium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoriaCountSelected: {
    backgroundColor: IronManColors.arcReactorBlue,
  },
  categoriaCountText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: IronManColors.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  resultCount: {
    fontSize: 12,
    color: IronManColors.textTertiary,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.regular,
  },
  plantaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    marginBottom: Spacing.sm,
  },
  plantaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  plantaEmoji: {
    fontSize: 22,
  },
  plantaInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  plantaNombre: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: 2,
  },
  plantaCientifico: {
    fontSize: 12,
    fontFamily: Fonts.italic,
    color: IronManColors.textTertiary,
    marginBottom: 4,
  },
  propiedadesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  propiedadTag: {
    backgroundColor: IronManColors.glassDarkMedium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  propiedadText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: IronManColors.holographicCyan,
  },
  moreText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
  arrow: {
    fontSize: 20,
    color: IronManColors.arcReactorBlue,
    marginLeft: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    textAlign: "center",
  },
});
