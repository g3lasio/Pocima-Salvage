import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform, View, ActivityIndicator, StyleSheet, Text } from "react-native";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/manus-runtime";
import { IronManColors } from "@/constants/theme";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

// Custom Iron Man theme for navigation
const IronManDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: IronManColors.arcReactorBlue,
    background: IronManColors.darkBackground,
    card: IronManColors.darkSurface,
    text: "#E8F4FF",
    border: IronManColors.borderHolo,
    notification: IronManColors.arcReactorBlue,
  },
};

const IronManLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: IronManColors.arcReactorBlue,
    background: "#0A1929",
    card: "rgba(10, 25, 41, 0.95)",
    text: "#E8F4FF",
    border: IronManColors.borderHolo,
    notification: IronManColors.arcReactorBlue,
  },
};

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  const [fontError, setFontError] = useState<Error | null>(null);

  // Load Quantico fonts with error handling
  const [fontsLoaded, fontLoadError] = useFonts({
    "Quantico-Regular": require("../assets/fonts/Quantico-Regular.ttf"),
    "Quantico-Bold": require("../assets/fonts/Quantico-Bold.ttf"),
    "Quantico-Italic": require("../assets/fonts/Quantico-Italic.ttf"),
    "Quantico-BoldItalic": require("../assets/fonts/Quantico-BoldItalic.ttf"),
  });

  // Handle font loading errors
  useEffect(() => {
    if (fontLoadError) {
      console.error("Error loading fonts:", fontLoadError);
      setFontError(fontLoadError);
      // Hide splash screen even on error to prevent infinite loading
      SplashScreen.hideAsync();
    } else if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontLoadError]);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    try {
      initManusRuntime();
    } catch (error) {
      console.error("Error initializing Manus runtime:", error);
    }
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    try {
      const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
      return () => unsubscribe();
    } catch (error) {
      console.error("Error subscribing to safe area insets:", error);
    }
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  const providerInitialMetrics = useMemo(
    () => initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame },
    [initialFrame, initialInsets],
  );

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={IronManColors.arcReactorBlue} />
        <Text style={styles.loadingText}>Cargando Pócima Salvage...</Text>
      </View>
    );
  }

  // Show error message if fonts failed to load
  if (fontError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ Error al cargar fuentes</Text>
        <Text style={styles.errorSubtext}>La aplicación continuará con fuentes del sistema</Text>
      </View>
    );
  }

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === "dark" ? IronManDarkTheme : IronManLightTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
              <Stack.Screen 
                name="enfermedad-detail" 
                options={{ 
                  presentation: "modal",
                  headerShown: false,
                  animation: "slide_from_bottom",
                }} 
              />
              <Stack.Screen 
                name="planta-detail" 
                options={{ 
                  presentation: "modal",
                  headerShown: false,
                  animation: "slide_from_bottom",
                }} 
              />
              <Stack.Screen 
                name="enfermedad-expandida-detail" 
                options={{ 
                  presentation: "modal",
                  headerShown: false,
                  animation: "slide_from_bottom",
                }} 
              />
              <Stack.Screen 
                name="planta-expandida-detail" 
                options={{ 
                  presentation: "modal",
                  headerShown: false,
                  animation: "slide_from_bottom",
                }} 
              />
              <Stack.Screen name="oauth/callback" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        <SafeAreaFrameContext.Provider value={frame}>
          <SafeAreaInsetsContext.Provider value={insets}>{content}</SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
      </SafeAreaProvider>
    );
  }

  return <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: IronManColors.darkBackground,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: IronManColors.arcReactorBlue,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "#FF4444",
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#E8F4FF",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
