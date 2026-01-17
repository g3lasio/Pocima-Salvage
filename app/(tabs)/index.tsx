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
import { HolographicIcon } from "@/components/ui/holographic-icons";
import { Colors, Spacing, IronManColors, Fonts, HolographicStyles } from "@/constants/theme";
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
    <HolographicCard
      onPress={() => handleEnfermedadPress(item)}
      variant="subtle"
      style={styles.enfermedadCard}
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
        <ThemedText style={styles.arrowIcon}>›</ThemedText>
      </View>
    </HolographicCard>
  ), [colors, handleEnfermedadPress]);

  const renderSistemaCard = useCallback(({ item }: { item: SistemaCorporal }) => {
    const isExpanded = expandedSistema === item.id;
    const enfermedadesToShow = isExpanded ? item.enfermedades : item.enfermedades.slice(0, 3);
    
    return (
      <HolographicCard
        variant={isExpanded ? "elevated" : "default"}
        style={styles.sistemaCard}
      >
        <Pressable
          onPress={() => toggleSistema(item.id)}
          style={({ pressed }) => [
            styles.sistemaHeader,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <HolographicIcon 
            icon={item.icono} 
            size="medium" 
            variant={isExpanded ? "glow" : "default"}
          />
          <View style={styles.sistemaInfo}>
            <ThemedText type="defaultSemiBold" style={styles.sistemaNombre}>
              {item.nombre}
            </ThemedText>
            <ThemedText style={styles.sistemaCount}>
              {item.enfermedades.length} enfermedades
            </ThemedText>
          </View>
          <ThemedText style={styles.expandIcon}>
            {isExpanded ? "▼" : "▶"}
          </ThemedText>
        </Pressable>

        {enfermedadesToShow.length > 0 && (
          <View style={[styles.enfermedadesPreview, { borderTopColor: colors.borderSubtle }]}>
            {enfermedadesToShow.map((enf) => (
              <Pressable
                key={enf.id}
                onPress={() => handleEnfermedadPress(enf)}
                style={({ pressed }) => [
                  styles.enfermedadPreviewItem,
                  { 
                    backgroundColor: pressed ? IronManColors.glassBlue : 'transparent',
                    borderBottomColor: colors.borderSubtle,
                  },
                ]}
              >
                <ThemedText style={styles.enfermedadPreviewText} numberOfLines={1}>
                  {enf.nombre}
                </ThemedText>
                <ThemedText style={styles.previewArrow}>›</ThemedText>
              </Pressable>
            ))}
            {!isExpanded && item.enfermedades.length > 3 && (
              <Pressable
                onPress={() => toggleSistema(item.id)}
                style={styles.verMasButton}
              >
                <ThemedText style={styles.verMasText}>
                  Ver {item.enfermedades.length - 3} más...
                </ThemedText>
              </Pressable>
            )}
          </View>
        )}
      </HolographicCard>
    );
  }, [colors, expandedSistema, toggleSistema, handleEnfermedadPress]);

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
          Enfermedades
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {totalEnfermedades} enfermedades en {sistemasCorporales.length} sistemas
        </ThemedText>
        
        <View style={[styles.searchContainer, HolographicStyles.inputField]}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: Fonts.regular }]}
            placeholder="Buscar enfermedad..."
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
          keyExtractor={(item) => `${item.sistemaId}-${item.id}`}
          renderItem={renderEnfermedadItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <HolographicIcon icon="🔍" size="xlarge" variant="glow" animated />
              <ThemedText style={styles.emptyText}>
                No se encontraron enfermedades
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
          data={sistemasCorporales}
          keyExtractor={(item) => item.id}
          renderItem={renderSistemaCard}
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
  // Sistema Card Styles
  sistemaCard: {
    marginBottom: Spacing.md,
    padding: 0,
  },
  sistemaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  sistemaInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  sistemaNombre: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 2,
  },
  sistemaCount: {
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
  enfermedadesPreview: {
    borderTopWidth: 1,
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
    fontFamily: Fonts.regular,
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
  // Enfermedad Card Styles (for search results)
  enfermedadCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  enfermedadContent: {
    flexDirection: "row",
    alignItems: "center",
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
