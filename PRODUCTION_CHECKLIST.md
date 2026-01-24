# 📋 Checklist de Producción - Pocima Salvaje
## Lista Completa para Publicación en App Store y Google Play

**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ **LISTO PARA BUILD EN MAC**

---

## ✅ COMPLETADO

### 1. Código y Compilación
- [x] Errores de TypeScript corregidos (17 errores → 0 errores)
- [x] Compilación verificada (`npm run check` pasa sin errores)
- [x] Carpetas nativas generadas (`ios/` y `android/`)
- [x] Configuración de iOS completa (Info.plist, Podfile)
- [x] Configuración de Android completa (build.gradle, manifest)
- [x] Assets completos (iconos, splash, fuentes)

### 2. Backend y API
- [x] **Backend desplegado en chyrris.com** (Replit)
- [x] **Endpoints funcionando:**
  - `POST https://chyrris.com/api/moldoctor/chat`
  - `POST https://chyrris.com/api/moldoctor/analyze-lab`
  - `GET https://chyrris.com/api/health`
- [x] **App móvil apuntando a chyrris.com**
- [x] **API key configurada en Replit Secrets**

### 3. URLs Requeridas para Tiendas
- [x] **Marketing URL:** https://chyrris.com/pocima-salvaje ✅
- [x] **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy ✅
- [x] **Terms of Service:** https://chyrris.com/pocima-salvaje/terms ✅
- [x] **Support URL:** https://chyrris.com/pocima-salvaje/support ✅
- [x] **Support Email:** info@chyrris.com ✅

### 4. Documentación
- [x] Reporte de revisión completo (REPORTE_REVISION_BUILD.md)
- [x] Arquitectura de backend documentada (BACKEND_ARCHITECTURE.md)
- [x] Guía de build para Mac (GUIA_BUILD_MAC.md)
- [x] URLs para tiendas (POCIMA_SALVAJE_URLS.md)

### 5. Repositorios
- [x] Cambios commiteados en Pocima-Salvage
- [x] Cambios commiteados en chyrris
- [x] Ambos repos pusheados a GitHub
- [x] Backend desplegado en Replit

---

## 🚀 PASOS PARA BUILD EN TU MAC

### Paso 1: Preparación

```bash
# Clonar repositorio (o pull si ya lo tienes)
cd ~/Documents
git clone https://github.com/g3lasio/Pocima-Salvage.git
cd Pocima-Salvage

# O si ya lo tienes clonado:
cd ~/Documents/Pocima-Salvage
git pull origin main

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

### Paso 5: Probar MolDoctor

1. Abre la app en el simulador/dispositivo
2. Ve a la pestaña "MolDoctor"
3. Envía un mensaje de prueba: "Hola, tengo dolor de cabeza"
4. Verifica que responde correctamente

**Si no responde:**
- Verifica que chyrris.com está corriendo en Replit
- Verifica que la API key está configurada en Replit Secrets
- Revisa los logs en Replit Console

### Paso 6: Build de Producción iOS

**En Xcode:**
1. Product > Archive
2. Esperar a que compile (5-15 minutos)
3. Distribute App > App Store Connect
4. Seguir el asistente para subir a App Store

### Paso 7: Build de Producción Android

```bash
# Generar keystore si no lo tienes
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/pocima-salvage-release.keystore \
  -alias pocima-salvaje \
  -keyalg RSA -keysize 2048 -validity 10000

# Configurar en android/gradle.properties
# (Ver sección de Keystore abajo)

# Compilar AAB
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

### URLs Requeridas ✅
- **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy
- **Terms of Use:** https://chyrris.com/pocima-salvaje/terms (opcional)
- **Support URL:** https://chyrris.com/pocima-salvaje/support
- **Marketing URL:** https://chyrris.com/pocima-salvaje
- **Support Email:** info@chyrris.com

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
- **iPad Pro 12.9":** 2048 x 2732 px (opcional)

---

## 📱 INFORMACIÓN PARA GOOGLE PLAY CONSOLE

### Información Básica
- **App Name:** Pócima Salvaje
- **Package Name:** com.chyrris.pocimasalvaje
- **Version Name:** 1.0.0
- **Version Code:** 1
- **Category:** Health & Fitness
- **Content Rating:** PEGI 12 / ESRB Everyone 10+

### URLs Requeridas ✅
- **Website:** https://chyrris.com/pocima-salvaje
- **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy
- **Terms of Service:** https://chyrris.com/pocima-salvaje/terms
- **Support Email:** info@chyrris.com

### Descripción Corta (80 caracteres)
```
Guía de plantas medicinales y remedios naturales con asistente IA
```

### Descripción Larga
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
Sitio web: https://chyrris.com/pocima-salvaje
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

## 🔐 Configuración de Keystore para Android

### Generar Keystore

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/pocima-salvage-release.keystore \
  -alias pocima-salvaje \
  -keyalg RSA -keysize 2048 -validity 10000
```

**Información requerida:**
- Nombre: Gelasio Sanchez Gomez
- Organización: Chyrris Technologies
- Ciudad: (tu ciudad)
- Estado: (tu estado)
- País: (código de 2 letras, ej: US, MX)

**⚠️ IMPORTANTE:** Guarda las contraseñas en un lugar seguro. Si las pierdes, no podrás actualizar la app.

### Configurar en `android/gradle.properties`

```properties
MYAPP_RELEASE_STORE_FILE=pocima-salvage-release.keystore
MYAPP_RELEASE_KEY_ALIAS=pocima-salvaje
MYAPP_RELEASE_STORE_PASSWORD=tu_contraseña_aquí
MYAPP_RELEASE_KEY_PASSWORD=tu_contraseña_aquí
```

### Actualizar `android/app/build.gradle`

```gradle
android {
    ...
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
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

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

### Tests de MolDoctor
- [ ] Enviar mensaje de texto
- [ ] Subir foto de síntoma
- [ ] Subir foto de documento médico
- [ ] Verificar que responde correctamente
- [ ] Verificar que sugiere plantas
- [ ] Verificar enlaces a plantas y enfermedades

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

## 💰 COSTOS ESTIMADOS

### Desarrollo y Publicación
- **Apple Developer Program:** $99/año (requerido)
- **Google Play Developer:** $25 una vez (requerido)

### Backend (chyrris.com en Replit)
- **Replit:** $0-20/mes (dependiendo del plan)
- **Incluye:** Hosting del servidor + landing page

### API de Anthropic
- **Claude Sonnet 4:** ~$3 por millón de tokens
- **Estimado:** $10-20/mes para uso moderado

### Total Primer Año
- **Setup:** $124 (Apple $99 + Google $25)
- **Mensual:** $10-40/mes (Replit + API)
- **Anual:** $244-604

---

## ✅ CHECKLIST FINAL

### Antes de Build
- [x] Backend desplegado en chyrris.com ✅
- [x] App apuntando a chyrris.com ✅
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
- [ ] URLs verificadas ✅
- [ ] Descripción revisada

### Después de Publicar
- [ ] Monitorear reviews
- [ ] Responder feedback
- [ ] Planear actualizaciones

---

## 📞 URLs Importantes

- **Backend API:** https://chyrris.com/api/moldoctor/*
- **Landing Page:** https://chyrris.com/pocima-salvaje
- **Privacy Policy:** https://chyrris.com/pocima-salvaje/privacy
- **Terms of Service:** https://chyrris.com/pocima-salvaje/terms
- **Support:** https://chyrris.com/pocima-salvaje/support
- **Email:** info@chyrris.com

---

**¡Éxito con el lanzamiento de Pócima Salvaje!** 🚀🌿

**Creado por:** Manus AI  
**Fecha:** 24 de enero de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para Build
