# 📱 Guía de Desarrollo Móvil - Pócima Salvage

## 🚀 Inicio Rápido con Expo Go

### Requisitos Previos
1. **Instalar Expo Go** en tu dispositivo móvil:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Configurar Secrets en Replit**:
   - `ANTHROPIC_API_KEY` - Tu clave de API de Anthropic
   - `LLM_PROVIDER=anthropic` (opcional, por defecto usa Gemini)

### 🎯 Método 1: Desarrollo con Túnel (Recomendado para Replit)

Este método usa Expo Tunnel para crear una conexión pública que funciona desde cualquier red.

```bash
# 1. Actualizar el código
git pull
pnpm install

# 2. Para desarrollo WEB (interfaz en navegador de Replit):
pnpm dev

# 3. Para desarrollo MÓVIL (código QR para Expo Go):
pnpm dev:mobile
```

**Verás algo como:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Using Expo Go
› Press s │ switch to development build
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

**Para ver el código QR:**
1. Abre la terminal de Replit
2. El código QR aparecerá automáticamente en la consola
3. Escanea el código QR con:
   - **iOS**: App de Cámara nativa
   - **Android**: App de Expo Go

### 🌐 Método 2: Desarrollo con LAN (Red Local)

Si estás en la misma red WiFi que tu computadora:

```bash
# Editar package.json y cambiar:
"dev:metro": "cross-env EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo start --host lan"

# Luego ejecutar:
pnpm dev
```

### 📲 Método 3: Scripts Específicos por Plataforma

```bash
# Solo Android (requiere emulador o dispositivo conectado)
pnpm android

# Solo iOS (requiere macOS y simulador)
pnpm ios

# Generar código QR manualmente
pnpm qr "exp://tu-url-de-expo"
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
pnpm dev              # Inicia servidor backend + Metro bundler
pnpm dev:server       # Solo servidor backend
pnpm dev:metro        # Solo Metro bundler (Expo)
```

### Calidad de Código
```bash
pnpm check            # Verificar TypeScript
pnpm lint             # Verificar ESLint
pnpm format           # Formatear código con Prettier
pnpm test             # Ejecutar pruebas
```

### Base de Datos
```bash
pnpm db:push          # Generar y aplicar migraciones
```

## 🏗️ Compilación para Producción (EAS Build)

### Configuración Inicial
```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# Configurar el proyecto
eas build:configure
```

### Compilar APK para Android
```bash
# Preview (para pruebas internas)
eas build --platform android --profile preview

# Producción (para publicar en Google Play)
eas build --platform android --profile production
```

### Compilar para iOS
```bash
# Preview (para pruebas internas)
eas build --platform ios --profile preview

# Producción (para publicar en App Store)
eas build --platform ios --profile production
```

## 🎨 Características del Estilo Iron Man

La aplicación cuenta con un diseño holográfico inspirado en JARVIS/Tony Stark:

- ✨ **Backgrounds**: Grid holográfico animado con líneas de escaneo
- 🔷 **Bordes**: Efectos de brillo pulsante y animaciones
- 💎 **Iconos**: Estilo vidrio transparente con glow
- 🎨 **Fuente**: Quantico (futurista y tecnológica)
- ⚡ **Colores**: 
  - Arc Reactor Blue: `#00D4FF`
  - Holographic Cyan: `#00FFFF`
  - Glass Blue: `rgba(0, 212, 255, 0.1)`

## 🐛 Solución de Problemas

### El código QR no aparece
```bash
# Asegúrate de usar --tunnel
pnpm dev:metro
```

### Error "Requiring unknown module"
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
pnpm install
pnpm dev
```

### La app no se conecta al servidor
1. Verifica que ambos (dispositivo y servidor) estén en la misma red
2. Usa `--tunnel` en lugar de `--host lan`
3. Verifica que el firewall no esté bloqueando las conexiones

### Error de Anthropic AI
1. Verifica que `ANTHROPIC_API_KEY` esté en los Secrets de Replit
2. Opcionalmente configura `LLM_PROVIDER=anthropic`
3. Reinicia el servidor después de agregar secrets

## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [Expo Go](https://expo.dev/go)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## 🤝 Soporte

Si encuentras algún problema, revisa:
1. Los logs en la terminal de Replit
2. Los logs en Expo Go (sacude el dispositivo → Ver logs)
3. La consola del navegador (si usas web)
