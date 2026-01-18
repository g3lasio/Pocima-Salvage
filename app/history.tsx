import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "../components/themed-text";
import { GlassBackground } from "../components/ui/glass-background";
import { IronManColors, Spacing, Fonts, BorderRadius } from "../constants/theme";

interface HistoryItem {
  id: string;
  type: "planta" | "enfermedad" | "busqueda";
  nombre: string;
  timestamp: number;
}

const HISTORY_KEY = "@pocima_history";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        // Ordenar por más reciente
        items.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
        setHistory(items);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleItemPress = (item: HistoryItem) => {
    if (item.type === "planta") {
      router.push({
        pathname: "/planta-expandida-detail",
        params: { id: item.id },
      });
    } else if (item.type === "enfermedad") {
      router.push({
        pathname: "/enfermedad-expandida-detail",
        params: { id: item.id },
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "planta": return "🌿";
      case "enfermedad": return "🏥";
      case "busqueda": return "🔍";
      default: return "📄";
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Pressable
      onPress={() => handleItemPress(item)}
      style={({ pressed }) => [
        styles.historyItem,
        { backgroundColor: pressed ? IronManColors.glassBlueMedium : IronManColors.glassBlue },
      ]}
    >
      <View style={styles.itemIcon}>
        <ThemedText style={styles.itemEmoji}>{getIcon(item.type)}</ThemedText>
      </View>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemNombre} numberOfLines={1}>
          {item.nombre}
        </ThemedText>
        <ThemedText style={styles.itemDate}>
          {formatDate(item.timestamp)}
        </ThemedText>
      </View>
      <ThemedText style={styles.arrow}>›</ThemedText>
    </Pressable>
  );

  return (
    <GlassBackground showGrid={true} showCorners={true} showScanLine={false}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>←</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Historial</ThemedText>
        {history.length > 0 && (
          <Pressable onPress={clearHistory} style={styles.clearButton}>
            <ThemedText style={styles.clearText}>Limpiar</ThemedText>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
        </View>
      ) : history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyEmoji}>🕐</ThemedText>
          <ThemedText style={styles.emptyTitle}>Sin historial</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Tu historial de búsquedas aparecerá aquí
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
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  clearText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: IronManColors.arcReactorBlue,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: IronManColors.borderHoloSubtle,
    marginBottom: Spacing.sm,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: IronManColors.glassDarkMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  itemEmoji: {
    fontSize: 18,
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
  itemDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: IronManColors.textTertiary,
  },
  arrow: {
    fontSize: 18,
    color: IronManColors.arcReactorBlue,
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
