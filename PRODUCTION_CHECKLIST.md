# 📋 Checklist de Producción - Pocima Salvaje
## Lista Completa para Publicación en App Store y Google Play

**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** LISTO PARA BUILD (después de desplegar backend)

---

## ✅ COMPLETADO

### 1. Código y Compilación
- [x] Errores de TypeScript corregidos (17 errores → 0 errores)
- [x] Compilación verificada (`npm run check` pasa sin errores)
- [x] Carpetas nativas generadas (`ios/` y `android/`)
- [x] Configuración de iOS completa (Info.plist, Podfile)
- [x] Configuración de Android completa (build.gradle, manifest)
- [x] Assets completos (iconos, splash, fuentes)

### 2. URLs Requeridas para Tiendas
- [x] **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy
- [x] **Terms of Service:** https://chyrris.com/pocima-salvaje/terms
- [x] **Support URL:** https://chyrris.com/pocima-salvaje/support
- [x] **Marketing URL:** https://chyrris.com (página principal de Chyrris)

### 3. Documentación
- [x] Reporte de revisión completo (REPORTE_REVISION_BUILD.md)
- [x] Arquitectura de backend documentada (BACKEND_ARCHITECTURE.md)
- [x] Guía de build para Mac (GUIA_BUILD_MAC.md)
- [x] Estado del proyecto en JSON (build-status.json)

### 4. Repositorios
- [x] Cambios commiteados en Pocima-Salvage
- [x] Cambios commiteados en chyrris (landing page)
- [x] Ambos repos pusheados a GitHub

---

## ⚠️ PENDIENTE ANTES DE BUILD EN MAC

### 1. Backend (CRÍTICO para MolDoctor)

**Opción A: Desplegar en Railway (RECOMENDADO)**

```bash
# 1. Crear cuenta en railway.app
# 2. Conectar repositorio GitHub: g3lasio/Pocima-Salvage
# 3. Railway detectará automáticamente el proyecto Node.js
# 4. Configurar variables de entorno:
ANTHROPIC_API_KEY=sk-ant-***
NODE_ENV=production
PORT=3000

# 5. Railway te dará una URL como:
# https://pocima-salvage-production.up.railway.app
```

**Actualizar URL en la app:**
```typescript
// Editar: constants/oauth.ts línea 40
if (ReactNative.Platform.OS !== "web") {
  return "https://pocima-salvage-production.up.railway.app";
}
```

**Opción B: Usar backend de Manus temporalmente**
- URL actual: `https://3000-i6bjqff548tmliorgm2j9-2b5dd600.us2.manus.computer`
- ⚠️ Solo para testing, no para producción
- El servidor se apaga cuando no hay actividad

**Opción C: Deshabilitar MolDoctor**
- Comentar tab de MolDoctor en `app/(tabs)/_layout.tsx`
- La app funcionará solo con datos locales (plantas y enfermedades)

### 2. Keystore de Android (REQUERIDO para Google Play)

```bash
# Generar keystore de producción
keytool -genkeypair -v -storetype PKCS12 \
  -keystore pocima-salvage-release.keystore \
  -alias pocima-salvage \
  -keyalg RSA -keysize 2048 -validity 10000

# Guardar en: android/app/pocima-salvage-release.keystore
# Guardar contraseñas en lugar seguro
```

**Configurar en `android/gradle.properties`:**
```properties
MYAPP_RELEASE_STORE_FILE=pocima-salvage-release.keystore
MYAPP_RELEASE_KEY_ALIAS=pocima-salvaje
MYAPP_RELEASE_STORE_PASSWORD=***
MYAPP_RELEASE_KEY_PASSWORD=***
```

**Actualizar `android/app/build.gradle`:**
```gradle
signingConfigs {
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

---

## 🚀 PASOS PARA BUILD EN TU MAC

### Paso 1: Preparación

```bash
# Clonar repositorio
cd ~/Documents
git clone https://github.com/g3lasio/Pocima-Salvage.git
cd Pocima-Salvage

# Instalar dependencias
npm install

# Verificar que no hay errores
npm run check
```

### Paso 2: Generar Carpetas Nativas

```bash
# Generar carpetas iOS y Android
npx expo prebuild --clean
```

### Paso 3: Instalar Dependencias de iOS

```bash
# Instalar CocoaPods
cd ios
pod install
cd ..
```

### Paso 4: Abrir en Xcode

```bash
# Abrir workspace (NO el .xcodeproj)
open ios/PcimaSalvaje.xcworkspace
```

**En Xcode:**
1. Seleccionar tu equipo de desarrollo en "Signing & Capabilities"
2. Conectar tu iPhone o seleccionar simulador
3. Presionar ⌘+R para compilar y ejecutar

### Paso 5: Build de Producción iOS

**En Xcode:**
1. Product > Archive
2. Esperar a que compile (5-15 minutos)
3. Distribute App > App Store Connect
4. Seguir el asistente para subir a App Store

### Paso 6: Build de Producción Android

```bash
# Asegurarse de tener el keystore configurado
cd android
./gradlew bundleRelease

# El AAB estará en:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📱 INFORMACIÓN PARA APP STORE CONNECT

### Información Básica
- **App Name:** Pócima Salvaje
- **Bundle ID:** com.chyrris.pocimasalvaje
- **Version:** 1.0.0
- **Build:** 1
- **Category:** Health & Fitness / Medical
- **Content Rating:** 12+ (medical content)

### URLs Requeridas
- **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy
- **Terms of Use:** https://chyrris.com/pocima-salvaje/terms
- **Support URL:** https://chyrris.com/pocima-salvaje/support
- **Marketing URL:** https://chyrris.com

### Descripción Corta (80 caracteres)
```
Guía de plantas medicinales y remedios naturales con asistente IA
```

### Descripción Larga
```
Pócima Salvaje es tu compañero definitivo para explorar el mundo de la medicina natural y las plantas medicinales.

CARACTERÍSTICAS PRINCIPALES:

🌿 Base de Datos Completa
• 693 plantas medicinales con información detallada
• 482 condiciones de salud y sus tratamientos naturales
• Nombres alternativos regionales para fácil búsqueda
• Contraindicaciones y dosis recomendadas

🤖 MolDoctor - Asistente IA
• Consultas educativas sobre salud natural
• Análisis de imágenes de síntomas y documentos médicos
• Recomendaciones personalizadas de plantas medicinales
• Respuestas basadas en conocimiento tradicional

🔍 Búsqueda Inteligente
• Busca por nombre de planta o condición de salud
• Filtra por sistema corporal
• Guarda tus favoritos
• Historial de consultas

✨ Diseño Holográfico
• Interfaz futurista inspirada en tecnología JARVIS
• Experiencia visual inmersiva
• Fácil navegación

AVISO IMPORTANTE:
Esta aplicación es solo para fines educativos e informativos. No reemplaza el consejo médico profesional. Siempre consulta a un profesional de salud calificado antes de usar cualquier remedio natural.

Desarrollado por Chyrris Technologies
```

### Keywords (100 caracteres)
```
plantas medicinales,remedios naturales,medicina natural,herbolaria,salud,wellness,IA,plantas
```

### Screenshots Requeridos
- **iPhone 6.7":** 1290 x 2796 px (mínimo 3, máximo 10)
- **iPhone 6.5":** 1242 x 2688 px (mínimo 3, máximo 10)
- **iPad Pro 12.9":** 2048 x 2732 px (mínimo 3, máximo 10)

---

## 📱 INFORMACIÓN PARA GOOGLE PLAY CONSOLE

### Información Básica
- **App Name:** Pócima Salvaje
- **Package Name:** com.chyrris.pocimasalvaje
- **Version Name:** 1.0.0
- **Version Code:** 1
- **Category:** Health & Fitness
- **Content Rating:** PEGI 12 / ESRB Everyone 10+

### URLs Requeridas (OBLIGATORIAS)
- **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy ✅
- **Terms of Service:** https://chyrris.com/pocima-salvaje/terms ✅
- **Support Email:** info@chyrris.com
- **Website:** https://chyrris.com

### Descripción Corta (80 caracteres)
```
Guía de plantas medicinales y remedios naturales con asistente IA
```

### Descripción Larga (4000 caracteres máximo)
```
Pócima Salvaje es tu compañero definitivo para explorar el mundo de la medicina natural y las plantas medicinales.

CARACTERÍSTICAS PRINCIPALES:

🌿 BASE DE DATOS COMPLETA
• 693 plantas medicinales con información detallada
• 482 condiciones de salud y sus tratamientos naturales
• Nombres alternativos regionales para fácil búsqueda
• Propiedades medicinales, preparación y dosis
• Contraindicaciones y precauciones

🤖 MOLDOCTOR - ASISTENTE IA
• Consultas educativas sobre salud natural
• Análisis de imágenes de síntomas y documentos médicos
• Recomendaciones personalizadas de plantas medicinales
• Respuestas basadas en conocimiento tradicional y científico
• Entrada y salida por voz

🔍 BÚSQUEDA INTELIGENTE
• Busca por nombre de planta o condición de salud
• Filtra por sistema corporal (respiratorio, digestivo, etc.)
• Explora por categorías de plantas
• Guarda tus favoritos para acceso rápido
• Historial de consultas

📚 INFORMACIÓN DETALLADA
• Descripción completa de cada planta
• Usos medicinales tradicionales
• Formas de preparación (té, infusión, cataplasma, etc.)
• Dosis recomendadas
• Contraindicaciones y efectos secundarios
• Interacciones con medicamentos

✨ DISEÑO HOLOGRÁFICO
• Interfaz futurista inspirada en tecnología JARVIS
• Experiencia visual inmersiva
• Navegación intuitiva
• Modo oscuro para comodidad visual

🔒 PRIVACIDAD Y SEGURIDAD
• Datos almacenados localmente en tu dispositivo
• Sin recopilación de información personal
• Comunicación segura con servicios de IA
• Sin anuncios ni rastreadores

AVISO MÉDICO IMPORTANTE:
Esta aplicación es solo para fines educativos e informativos. La información proporcionada NO constituye consejo médico, diagnóstico o tratamiento. No reemplaza la consulta con profesionales de salud calificados. Siempre consulta a un médico antes de usar cualquier remedio natural o cambiar tu tratamiento médico.

SOBRE CHYRRIS TECHNOLOGIES:
Desarrollamos aplicaciones innovadoras que combinan tecnología de vanguardia con conocimiento tradicional para mejorar tu bienestar y calidad de vida.

Contacto: info@chyrris.com
Sitio web: https://chyrris.com
```

### Screenshots Requeridos
- **Phone:** 1080 x 1920 px o superior (mínimo 2, máximo 8)
- **7-inch Tablet:** 1024 x 600 px (opcional)
- **10-inch Tablet:** 1920 x 1200 px (opcional)

### Feature Graphic (OBLIGATORIO)
- **Tamaño:** 1024 x 500 px
- **Formato:** PNG o JPG
- **Contenido:** Banner promocional de la app

---

## 🎨 ASSETS PARA TIENDAS

### Iconos
- [x] App Icon: 1024x1024 px (ya existe en `assets/images/icon.png`)
- [x] Adaptive Icon Android (ya existe)

### Screenshots (PENDIENTE)
Necesitas capturar screenshots de:
1. Pantalla principal (lista de enfermedades)
2. Detalle de enfermedad con plantas relacionadas
3. Lista de plantas medicinales
4. Detalle de planta con información completa
5. MolDoctor en acción (chat con IA)
6. Búsqueda y filtros

**Herramientas:**
- Simulador de iOS (Xcode)
- Emulador de Android (Android Studio)
- Figma/Sketch para composición

---

## 💰 COSTOS ESTIMADOS

### Desarrollo y Publicación
- **Apple Developer Program:** $99/año (requerido)
- **Google Play Developer:** $25 una vez (requerido)

### Backend (Railway)
- **Plan Hobby:** $5/mes
- **Incluye:** 500 horas de ejecución, $5 de crédito gratis

### API de Anthropic
- **Claude Sonnet 4:** ~$3 por millón de tokens
- **Estimado:** $10-20/mes para uso moderado

### Total Primer Año
- **Setup:** $124 (Apple $99 + Google $25)
- **Mensual:** $15-25/mes (backend + API)
- **Anual:** $304-424

---

## 🧪 TESTING ANTES DE PUBLICAR

### Tests Funcionales
- [ ] Navegación entre pantallas
- [ ] Búsqueda de plantas y enfermedades
- [ ] Filtros por sistema corporal
- [ ] Favoritos (agregar/eliminar)
- [ ] MolDoctor (chat básico)
- [ ] Análisis de imágenes
- [ ] Entrada por voz
- [ ] Salida por voz

### Tests de Rendimiento
- [ ] Tiempo de carga inicial
- [ ] Búsqueda rápida (< 1 segundo)
- [ ] Scroll suave en listas largas
- [ ] Transiciones fluidas

### Tests de Dispositivos
- [ ] iPhone 12/13/14/15 (varios tamaños)
- [ ] iPad (si soportas)
- [ ] Android flagship (Samsung, Pixel)
- [ ] Android mid-range

### Tests de Red
- [ ] Funciona sin internet (datos locales)
- [ ] MolDoctor con WiFi
- [ ] MolDoctor con datos móviles
- [ ] Manejo de errores de red

---

## 📝 NOTAS FINALES

### Antes de Enviar a Revisión

1. **Probar exhaustivamente** en dispositivos reales
2. **Capturar screenshots** de alta calidad
3. **Preparar video preview** (opcional pero recomendado)
4. **Revisar metadata** (descripción, keywords)
5. **Verificar URLs** (privacy, terms, support)
6. **Confirmar backend** está funcionando
7. **Revisar precios** (gratis en este caso)

### Tiempos de Revisión Estimados

- **App Store:** 1-3 días
- **Google Play:** 1-7 días (primera vez puede ser más)

### Después de la Aprobación

- [ ] Anunciar en redes sociales
- [ ] Actualizar landing page (chyrris.com)
- [ ] Preparar materiales de marketing
- [ ] Monitorear reviews y feedback
- [ ] Responder a usuarios
- [ ] Planear actualizaciones futuras

---

## 🆘 SOPORTE

Si encuentras problemas:

1. **Revisa documentación:**
   - REPORTE_REVISION_BUILD.md
   - BACKEND_ARCHITECTURE.md
   - GUIA_BUILD_MAC.md

2. **Errores comunes:**
   - Ver sección de troubleshooting en REPORTE_REVISION_BUILD.md

3. **Contacto:**
   - Email: info@chyrris.com
   - GitHub Issues: https://github.com/g3lasio/Pocima-Salvage/issues

---

## ✅ CHECKLIST FINAL

### Antes de Build
- [ ] Backend desplegado en Railway
- [ ] URL actualizada en `constants/oauth.ts`
- [ ] Keystore de Android generado y configurado
- [ ] Certificados de iOS configurados en Xcode

### Durante Build
- [ ] Build de iOS exitoso
- [ ] Build de Android exitoso
- [ ] Testing en dispositivos reales
- [ ] Screenshots capturados

### Antes de Publicar
- [ ] Metadata completo (App Store Connect)
- [ ] Metadata completo (Google Play Console)
- [ ] Screenshots subidos
- [ ] URLs verificadas
- [ ] Descripción revisada

### Después de Publicar
- [ ] Monitorear reviews
- [ ] Responder feedback
- [ ] Planear actualizaciones

---

**¡Éxito con el lanzamiento de Pócima Salvaje!** 🚀🌿

**Creado por:** Manus AI  
**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0
