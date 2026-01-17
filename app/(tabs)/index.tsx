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
import { Colors, Spacing, IronManColors, Fonts, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { 
  sistemasCorporales, 
  buscarEnfermedadesExpandidas, 
  EnfermedadExpandida,
  SistemaCorporal,
  totalEnfermedades
} from "@/data/enfermedades-expandidas";

export default function EnfermedadesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSistema, setSelectedSistema] = useState<string | null>(null);

  // Enfermedades filtradas
  const displayedEnfermedades = useMemo(() => {
    if (searchQuery.trim()) {
      return buscarEnfermedadesExpandidas(searchQuery);
    }
    if (selectedSistema) {
      const sistema = sistemasCorporales.find(s => s.id === selectedSistema);
      return sistema?.enfermedades || [];
    }
    return [];
  }, [searchQuery, selectedSistema]);

  const handleEnfermedadPress = useCallback((enfermedad: EnfermedadExpandida) => {
    router.push({
      pathname: "/enfermedad-expandida-detail",
      params: { id: enfermedad.id, sistemaId: enfermedad.sistemaId },
    });
  }, [router]);

  const handleSistemaPress = useCallback((sistemaId: string) => {
    setSelectedSistema(prev => prev === sistemaId ? null : sistemaId);
    setSearchQuery("");
  }, []);

  // Renderizar item de enfermedad
  const renderEnfermedadItem = useCallback(({ item }: { item: EnfermedadExpandida }) => {
    const sistema = sistemasCorporales.find(s => s.id === item.sistemaId);
    return (
      <Pressable
        onPress={() => handleEnfermedadPress(item)}
        style={({ pressed }) => [
          styles.enfermedadItem,
          { backgroundColor: pressed ? IronManColors.glassBlueMedium : IronManColors.glassBlue },
        ]}
      >
        <View style={styles.enfermedadIcon}>
          <ThemedText style={styles.enfermedadEmoji}>{sistema?.icono || "🏥"}</ThemedText>
        </View>
        <View style={styles.enfermedadInfo}>
          <ThemedText style={styles.enfermedadNombre} numberOfLines={1}>
            {item.nombre}
          </ThemedText>
          {item.otrosNombres.length > 0 && (
            <ThemedText style={styles.otrosNombres} numberOfLines={1}>
              {item.otrosNombres.slice(0, 2).join(" • ")}
            </ThemedText>
          )}
          <View style={styles.sistemaTag}>
            <ThemedText style={styles.sistemaTagText}>{sistema?.nombre || "Sistema"}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.arrow}>›</ThemedText>
      </Pressable>
    );
  }, [handleEnfermedadPress]);

  // Renderizar sistema
  const renderSistemaItem = useCallback(({ item }: { item: SistemaCorporal }) => {
    const isSelected = selectedSistema === item.id;
    return (
      <Pressable
        onPress={() => handleSistemaPress(item.id)}
        style={[
          styles.sistemaChip,
          isSelected && styles.sistemaChipSelected,
        ]}
      >
        <ThemedText style={styles.sistemaEmoji}>{item.icono}</ThemedText>
        <ThemedText style={[
          styles.sistemaText,
          isSelected && styles.sistemaTextSelected,
        ]} numberOfLines={1}>
          {item.nombre.replace("Sistema ", "")}
        </ThemedText>
        <View style={[styles.sistemaCount, isSelected && styles.sistemaCountSelected]}>
          <ThemedText style={styles.sistemaCountText}>{item.enfermedades.length}</ThemedText>
        </View>
      </Pressable>
    );
  }, [selectedSistema, handleSistemaPress]);

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      {/* Header con safe area */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <ThemedText type="title" style={styles.title}>Enfermedades</ThemedText>
        <ThemedText style={styles.subtitle}>
          {totalEnfermedades} enfermedades • {sistemasCorporales.length} sistemas
        </ThemedText>

        {/* Barra de búsqueda */}
        <View style={styles.searchBar}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar enfermedad..."
            placeholderTextColor={IronManColors.textTertiary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text) setSelectedSistema(null);
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

      {/* Sistemas horizontales */}
      <View style={styles.sistemasContainer}>
        <FlatList
          data={sistemasCorporales}
          keyExtractor={(item) => item.id}
          renderItem={renderSistemaItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sistemasContent}
        />
      </View>

      {/* Lista de enfermedades o mensaje */}
      {displayedEnfermedades.length > 0 ? (
        <FlatList
          data={displayedEnfermedades}
          keyExtractor={(item) => `${item.sistemaId}-${item.id}`}
          renderItem={renderEnfermedadItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ThemedText style={styles.resultCount}>
              {displayedEnfermedades.length} {displayedEnfermedades.length === 1 ? "resultado" : "resultados"}
            </ThemedText>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyEmoji}>🏥</ThemedText>
          <ThemedText style={styles.emptyTitle}>
            {searchQuery ? "Sin resultados" : "Selecciona un sistema"}
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {searchQuery 
              ? "Intenta con otro término de búsqueda"
              : "O busca una enfermedad por nombre"}
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
  sistemasContainer: {
    marginBottom: Spacing.sm,
  },
  sistemasContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  sistemaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: IronManColors.glassBlue,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 6,
    maxWidth: 150,
  },
  sistemaChipSelected: {
    backgroundColor: IronManColors.glassBlueMedium,
    borderColor: IronManColors.arcReactorBlue,
  },
  sistemaEmoji: {
    fontSize: 14,
  },
  sistemaText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textSecondary,
    flexShrink: 1,
  },
  sistemaTextSelected: {
    color: IronManColors.arcReactorBlue,
  },
  sistemaCount: {
    backgroundColor: IronManColors.glassDarkMedium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sistemaCountSelected: {
    backgroundColor: IronManColors.arcReactorBlue,
  },
  sistemaCountText: {
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
  enfermedadItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    marginBottom: Spacing.sm,
  },
  enfermedadIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  enfermedadEmoji: {
    fontSize: 22,
  },
  enfermedadInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  enfermedadNombre: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: 2,
  },
  otrosNombres: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    marginBottom: 4,
  },
  sistemaTag: {
    backgroundColor: IronManColors.glassDarkMedium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  sistemaTagText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: IronManColors.holographicCyan,
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
