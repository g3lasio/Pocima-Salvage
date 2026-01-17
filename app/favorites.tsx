import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/themed-text";
import { GlassBackground } from "@/components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "@/constants/theme";

interface FavoriteItem {
  id: string;
  type: "planta" | "enfermedad";
  nombre: string;
  descripcion?: string;
  addedAt: number;
}

const FAVORITES_KEY = "@pocima_favorites";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const updated = favorites.filter(f => f.id !== id);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleItemPress = (item: FavoriteItem) => {
    if (item.type === "planta") {
      router.push({
        pathname: "/planta-expandida-detail",
        params: { id: item.id },
      });
    } else {
      router.push({
        pathname: "/enfermedad-expandida-detail",
        params: { id: item.id },
      });
    }
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <Pressable
      onPress={() => handleItemPress(item)}
      style={({ pressed }) => [
        styles.favoriteItem,
        { backgroundColor: pressed ? IronManColors.glassBlueMedium : IronManColors.glassBlue },
      ]}
    >
      <View style={styles.itemIcon}>
        <ThemedText style={styles.itemEmoji}>
          {item.type === "planta" ? "🌿" : "🏥"}
        </ThemedText>
      </View>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemNombre} numberOfLines={1}>
          {item.nombre}
        </ThemedText>
        <ThemedText style={styles.itemType}>
          {item.type === "planta" ? "Planta medicinal" : "Enfermedad"}
        </ThemedText>
      </View>
      <Pressable 
        onPress={() => removeFavorite(item.id)}
        style={styles.removeButton}
      >
        <ThemedText style={styles.removeIcon}>✕</ThemedText>
      </Pressable>
    </Pressable>
  );

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Favoritos</ThemedText>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ThemedText style={styles.countText}>
              {favorites.length} {favorites.length === 1 ? "favorito" : "favoritos"}
            </ThemedText>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyEmoji}>⭐</ThemedText>
          <ThemedText style={styles.emptyTitle}>Sin favoritos</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Agrega plantas o enfermedades a tus favoritos para acceder rápidamente
          </ThemedText>
        </View>
      )}
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: IronManColors.glassBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: IronManColors.textPrimary,
  },
  title: {
    fontSize: 24,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  countText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
    marginBottom: Spacing.md,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    marginBottom: Spacing.sm,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemNombre: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: IronManColors.textPrimary,
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    fontSize: 14,
    color: IronManColors.textTertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
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
