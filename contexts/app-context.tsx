import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys for AsyncStorage
const FAVORITES_KEY = "@pocima_favorites";
const HISTORY_KEY = "@pocima_history";
const SETTINGS_KEY = "@pocima_settings";

// Types
export interface FavoriteItem {
  id: string;
  type: "planta" | "enfermedad";
  nombre: string;
  descripcion?: string;
  addedAt: number;
}

export interface HistoryItem {
  id: string;
  type: "planta" | "enfermedad" | "busqueda";
  nombre: string;
  timestamp: number;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  saveHistory: boolean;
  language: "es" | "en";
}

interface AppContextType {
  // Favorites
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  
  // History
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, "timestamp">) => Promise<void>;
  clearHistory: () => Promise<void>;
  
  // Settings
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  
  // Language helpers
  t: (es: string, en: string) => string;
}

const defaultSettings: AppSettings = {
  notifications: true,
  darkMode: true,
  saveHistory: true,
  language: "es",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favData, histData, settData] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);

      if (favData) setFavorites(JSON.parse(favData));
      if (histData) {
        const items = JSON.parse(histData);
        items.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
        setHistory(items);
      }
      if (settData) setSettings({ ...defaultSettings, ...JSON.parse(settData) });
    } catch (error) {
      console.error("Error loading app data:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Favorites
  const addFavorite = async (item: Omit<FavoriteItem, "addedAt">) => {
    try {
      const newItem: FavoriteItem = { ...item, addedAt: Date.now() };
      const updated = [...favorites, newItem];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setFavorites(updated);
    } catch (error) {
      console.error("Error adding favorite:", error);
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

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  // History
  const addToHistory = async (item: Omit<HistoryItem, "timestamp">) => {
    if (!settings.saveHistory) return;
    
    try {
      const newItem: HistoryItem = { ...item, timestamp: Date.now() };
      // Remove duplicates and add new item at the beginning
      const filtered = history.filter(h => !(h.id === item.id && h.type === item.type));
      const updated = [newItem, ...filtered].slice(0, 50); // Keep last 50 items
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    } catch (error) {
      console.error("Error adding to history:", error);
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

  // Settings
  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    try {
      const updated = { ...settings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  // Translation helper
  const t = (es: string, en: string) => {
    return settings.language === "es" ? es : en;
  };

  const value: AppContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    history,
    addToHistory,
    clearHistory,
    settings,
    updateSetting,
    t,
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
