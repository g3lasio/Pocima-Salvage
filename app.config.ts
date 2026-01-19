// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID for Chyrris Technologies
const iosBundleId = "com.chyrris.pocimasalvaje";
const androidPackage = "com.chyrris.pocimasalvaje";
const scheme = "pocimasalvaje";

const env = {
  // App branding
  appName: 'Pócima Salvaje',
  appSlug: 'pocima-salvaje',
  scheme: scheme,
  iosBundleId: iosBundleId,
  androidPackage: androidPackage,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  extra: {
    eas: {
      projectId: "5e273ac1-bf33-4086-af67-e6bb672b7a88"
    }
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    infoPlist: {
      UIBackgroundModes: ["audio"],
      ITSAppUsesNonExemptEncryption: false
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0A1929",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0A1929",
        dark: {
          backgroundColor: "#050D15",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/Quantico-Regular.ttf",
          "./assets/fonts/Quantico-Bold.ttf",
          "./assets/fonts/Quantico-Italic.ttf",
          "./assets/fonts/Quantico-BoldItalic.ttf"
        ]
      }
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
