# Reporte de Revisión - Pocima Salvage
## Preparación para Build Nativo iOS y Android

**Fecha:** 24 de enero de 2026  
**Ingeniero:** Manus AI  
**Proyecto:** Pocima Salvage  
**Repositorio:** https://github.com/g3lasio/Pocima-Salvage

---

## 1. Resumen Ejecutivo

He completado una revisión exhaustiva del proyecto **Pocima Salvage** para verificar su preparación para compilar apps nativas de iOS y Android. El proyecto está **casi listo** para el build, pero requiere **correcciones críticas** antes de compilar con Xcode en tu Mac.

### Estado General: ⚠️ REQUIERE CORRECCIONES

- ✅ Estructura del proyecto: Correcta
- ✅ Configuración de Expo: Completa
- ✅ Carpetas nativas generadas: iOS y Android creadas
- ⚠️ **Errores de TypeScript: 17 errores críticos**
- ⚠️ **Configuración de producción: Incompleta**
- ✅ Assets y recursos: Completos
- ⚠️ Variables de entorno: Requieren configuración

---

## 2. Problemas Críticos Identificados

### 2.1. 🔴 CRÍTICO: Errores de TypeScript (17 errores)

**Problema:** El código hace referencia a `Fonts.semiBold` que no existe en la definición de tipos.

**Archivos afectados:**
- `app/(tabs)/index.tsx` (3 errores)
- `app/(tabs)/moldoctor.tsx` (1 error)
- `app/(tabs)/plantas.tsx` (3 errores)
- `app/about.tsx` (2 errores)
- `app/favorites.tsx` (2 errores)
- `app/help.tsx` (2 errores)
- `app/history.tsx` (3 errores)
- `app/settings.tsx` (1 error)

**Solución requerida:**

**Opción 1 (Recomendada):** Reemplazar `Fonts.semiBold` por `Fonts.bold` en todos los archivos:

```bash
# Ejecutar en tu terminal local:
cd ~/ruta/a/Pocima-Salvage
find app -name "*.tsx" -type f -exec sed -i '' 's/Fonts\.semiBold/Fonts.bold/g' {} +
```

**Opción 2:** Agregar la fuente semiBold al archivo `constants/theme.ts`:

```typescript
export const Fonts = {
  regular: "Quantico-Regular",
  bold: "Quantico-Bold",
  semiBold: "Quantico-Bold", // Usar bold como semiBold
  italic: "Quantico-Italic",
  boldItalic: "Quantico-BoldItalic",
  system: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "System",
  }),
};
```

**Impacto:** Sin esta corrección, el build **FALLARÁ** en Xcode.

---

### 2.2. ⚠️ IMPORTANTE: Configuración de Firma para Android

**Problema:** El proyecto usa el keystore de debug para builds de producción.

**Ubicación:** `android/app/build.gradle` línea ~45

```gradle
release {
    // Caution! In production, you need to generate your own keystore file.
    signingConfig signingConfigs.debug  // ⚠️ ESTO ES INSEGURO PARA PRODUCCIÓN
    ...
}
```

**Solución requerida:**

1. **Generar keystore de producción:**

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore pocima-salvage-release.keystore \
  -alias pocima-salvage -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configurar en `android/gradle.properties`:**

```properties
MYAPP_RELEASE_STORE_FILE=pocima-salvage-release.keystore
MYAPP_RELEASE_KEY_ALIAS=pocima-salvage
MYAPP_RELEASE_STORE_PASSWORD=***tu-password***
MYAPP_RELEASE_KEY_PASSWORD=***tu-password***
```

3. **Actualizar `android/app/build.gradle`:**

```gradle
signingConfigs {
    debug { ... }
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
```

**Impacto:** Sin esto, no podrás publicar en Google Play Store.

---

### 2.3. ⚠️ IMPORTANTE: Variables de Entorno

**Problema:** El proyecto requiere varias variables de entorno que no están configuradas.

**Variables requeridas:**

```bash
# Para el servidor backend (MolDoctor AI)
ANTHROPIC_API_KEY=sk-ant-***  # O usar Gemini con las credenciales de Manus
LLM_PROVIDER=anthropic  # O "auto" para usar Gemini por defecto

# Para OAuth (si usas autenticación Manus)
VITE_APP_ID=***
OAUTH_SERVER_URL=***
OWNER_OPEN_ID=***
OWNER_NAME=Gelasio Sanchez Gomez

# Para base de datos (opcional, si usas DB)
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=***tu-secret-seguro***
```

**Solución:**

1. **Crear archivo `.env.local` en la raíz del proyecto:**

```bash
# .env.local (NO COMMITEAR A GIT)
ANTHROPIC_API_KEY=tu-clave-aqui
LLM_PROVIDER=anthropic
```

2. **Para desarrollo local sin backend:**
   - La app funcionará sin estas variables, pero **MolDoctor no funcionará**
   - Las pantallas de Enfermedades y Plantas funcionarán normalmente

**Impacto:** Sin API key, la funcionalidad de MolDoctor (chat con IA) no funcionará.

---

## 3. Configuración Verificada ✅

### 3.1. Configuración de iOS

**Bundle Identifier:** `com.chyrris.pocimasalvaje`  
**Display Name:** Pócima Salvaje  
**Version:** 1.0.0 (Build 1)  
**Deployment Target:** iOS 15.1+  
**New Architecture:** Habilitado ✅  

**Permisos configurados:**
- ✅ Cámara (`NSCameraUsageDescription`)
- ✅ Micrófono (`NSMicrophoneUsageDescription`)
- ✅ Galería de fotos (`NSPhotoLibraryUsageDescription`)
- ✅ Audio en background (`UIBackgroundModes`)

**Fuentes incluidas:**
- ✅ Quantico-Regular.ttf
- ✅ Quantico-Bold.ttf
- ✅ Quantico-Italic.ttf
- ✅ Quantico-BoldItalic.ttf

**Archivos clave generados:**
- ✅ `ios/PcimaSalvaje.xcodeproj/` - Proyecto de Xcode
- ✅ `ios/Podfile` - Dependencias de CocoaPods
- ✅ `ios/PcimaSalvaje/Info.plist` - Configuración de la app

---

### 3.2. Configuración de Android

**Package Name:** `com.chyrris.pocimasalvaje`  
**App Name:** Pócima Salvaje  
**Version:** 1.0.0 (versionCode 1)  
**Min SDK:** 23 (Android 6.0)  
**Target SDK:** 34 (Android 14)  
**New Architecture:** Habilitado ✅  

**Permisos configurados:**
- ✅ POST_NOTIFICATIONS (notificaciones)

**Assets generados:**
- ✅ Adaptive icon (foreground, background, monochrome)
- ✅ Splash screen configurado

**Archivos clave generados:**
- ✅ `android/app/build.gradle` - Configuración de build
- ✅ `android/build.gradle` - Configuración del proyecto
- ✅ `android/app/src/main/AndroidManifest.xml` - Manifiesto

---

### 3.3. Assets y Recursos

**Iconos:**
- ✅ `assets/images/icon.png` (1024x1024)
- ✅ `assets/images/adaptive-icon.png`
- ✅ `assets/images/android-icon-foreground.png`
- ✅ `assets/images/android-icon-background.png`
- ✅ `assets/images/android-icon-monochrome.png`
- ✅ `assets/images/splash-icon.png`
- ✅ `assets/images/favicon.png`

**Fuentes:**
- ✅ Familia Quantico completa (4 archivos)

**Tema visual:**
- ✅ Estilo holográfico Iron Man/JARVIS implementado
- ✅ Colores Arc Reactor Blue (#00D4FF)
- ✅ Componentes UI personalizados

---

## 4. Estructura de Datos

**Contenido de la app:**
- ✅ **482 enfermedades** con síntomas, causas y tratamientos
- ✅ **693 plantas medicinales** con propiedades y contraindicaciones
- ✅ **Cruce de datos** enfermedades ↔ plantas
- ✅ **619 plantas** con nombres alternativos regionales

**Funcionalidades:**
- ✅ Búsqueda y filtrado por sistema corporal
- ✅ Navegación entre enfermedades y plantas relacionadas
- ✅ MolDoctor - Asistente médico con IA (Anthropic Claude)
- ✅ Análisis de imágenes y documentos médicos
- ✅ Entrada/salida por voz
- ✅ Historial de conversaciones

---

## 5. Pasos para Compilar en tu Mac

### 5.1. Preparación (OBLIGATORIO)

```bash
# 1. Clonar/actualizar el repositorio
cd ~/Documents
git clone https://github.com/g3lasio/Pocima-Salvage.git
cd Pocima-Salvage

# 2. Instalar dependencias
npm install

# 3. CORREGIR ERRORES DE TYPESCRIPT (elegir una opción)

# Opción A: Reemplazar semiBold por bold (RECOMENDADO)
find app -name "*.tsx" -type f -exec sed -i '' 's/Fonts\.semiBold/Fonts.bold/g' {} +

# Opción B: Agregar semiBold a constants/theme.ts
# (editar manualmente el archivo como se indicó arriba)

# 4. Verificar que no hay errores
npm run check

# 5. Generar carpetas nativas (si no existen)
npx expo prebuild --clean
```

---

### 5.2. Build para iOS con Xcode

```bash
# 1. Instalar CocoaPods dependencies
cd ios
pod install
cd ..

# 2. Abrir proyecto en Xcode
open ios/PcimaSalvaje.xcworkspace

# 3. En Xcode:
#    - Seleccionar tu equipo de desarrollo en "Signing & Capabilities"
#    - Conectar tu iPhone o seleccionar simulador
#    - Presionar ⌘+R para compilar y ejecutar

# 4. Para build de producción:
#    - Product > Archive
#    - Distribute App > App Store Connect
```

**Requisitos:**
- macOS con Xcode 15+
- Apple Developer Account (para dispositivos físicos)
- Certificados de firma configurados

---

### 5.3. Build para Android

```bash
# 1. Build de desarrollo (APK)
npx expo run:android

# 2. Build de producción (después de configurar keystore)
cd android
./gradlew assembleRelease

# El APK estará en:
# android/app/build/outputs/apk/release/app-release.apk

# 3. Para App Bundle (Google Play)
./gradlew bundleRelease

# El AAB estará en:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Requisitos:**
- Android Studio instalado
- Android SDK configurado
- Java JDK 17+

---

## 6. Configuración Opcional (Backend)

Si quieres que **MolDoctor funcione** en la app compilada:

### 6.1. Opción A: Usar servidor en Manus/Replit

1. Mantener el servidor corriendo en Manus/Replit
2. Actualizar `constants/oauth.ts` línea 40 con la URL pública:

```typescript
if (ReactNative.Platform.OS !== "web") {
  return "https://TU-URL-DE-MANUS-O-REPLIT.com";
}
```

### 6.2. Opción B: Desplegar backend en producción

1. Desplegar `server/` en Railway, Render, o Vercel
2. Configurar variables de entorno en el servicio
3. Actualizar URL en `constants/oauth.ts`

### 6.3. Opción C: Modo offline (sin IA)

1. Comentar la importación de MolDoctor en `app/(tabs)/_layout.tsx`
2. La app funcionará solo con datos estáticos (enfermedades y plantas)

---

## 7. Checklist Pre-Build

Antes de compilar, verifica:

- [ ] ✅ Errores de TypeScript corregidos (`npm run check` sin errores)
- [ ] ✅ Dependencias instaladas (`npm install` completado)
- [ ] ✅ Carpetas `ios/` y `android/` generadas
- [ ] ✅ CocoaPods instalado (iOS): `cd ios && pod install`
- [ ] ⚠️ Variables de entorno configuradas (si usas backend)
- [ ] ⚠️ Keystore de producción generado (Android)
- [ ] ⚠️ Certificados de firma configurados (iOS)
- [ ] ✅ Xcode abierto con `ios/PcimaSalvaje.xcworkspace`
- [ ] ✅ Equipo de desarrollo seleccionado en Xcode

---

## 8. Problemas Conocidos y Soluciones

### 8.1. Error: "Command PhaseScriptExecution failed" (iOS)

**Solución:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### 8.2. Error: "Unable to resolve module" (Metro)

**Solución:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### 8.3. Error: "Duplicate resources" (Android)

**Solución:**
```bash
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
```

---

## 9. Próximos Pasos Recomendados

### Inmediato (Antes del Build):
1. ✅ Corregir errores de TypeScript (Fonts.semiBold)
2. ⚠️ Configurar keystore de producción para Android
3. ⚠️ Decidir estrategia de backend (Manus, producción, u offline)

### Corto Plazo (Para Publicación):
1. Probar la app en dispositivos físicos iOS y Android
2. Configurar App Store Connect y Google Play Console
3. Preparar screenshots y descripción de la app
4. Configurar política de privacidad y términos de servicio

### Mediano Plazo (Mejoras):
1. Implementar perfil de salud del usuario (pendiente en todo.md)
2. Sistema de seguimiento post-consulta
3. Optimizar rendimiento y tamaño del bundle
4. Agregar analytics y crash reporting

---

## 10. Contacto y Soporte

Si encuentras problemas durante el build:

1. **Errores de TypeScript:** Verifica que aplicaste la corrección de `Fonts.semiBold`
2. **Errores de CocoaPods:** Ejecuta `pod install --repo-update`
3. **Errores de firma (iOS):** Verifica tu Apple Developer Account en Xcode
4. **Errores de Gradle (Android):** Ejecuta `./gradlew clean` y vuelve a intentar

**Documentación útil:**
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native](https://reactnative.dev/docs/getting-started)

---

## 11. Conclusión

El proyecto **Pocima Salvage** está estructuralmente completo y listo para compilar, pero **requiere las correcciones críticas** mencionadas en la sección 2 antes de proceder con el build en Xcode.

**Tiempo estimado para correcciones:** 15-30 minutos  
**Tiempo estimado para primer build:** 30-60 minutos  

Una vez corregidos los errores de TypeScript, el build debería proceder sin problemas en tu Mac con Xcode.

---

**Reporte generado por:** Manus AI  
**Fecha:** 24 de enero de 2026  
**Versión del proyecto:** 1.0.0
