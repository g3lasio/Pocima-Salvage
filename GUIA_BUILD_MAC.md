# Guía Rápida de Build en Mac - Pocima Salvage

## ⚡ Inicio Rápido (5 pasos)

### 1️⃣ Clonar y preparar

```bash
cd ~/Documents
git clone https://github.com/g3lasio/Pocima-Salvage.git
cd Pocima-Salvage
npm install
```

### 2️⃣ Corregir errores críticos

```bash
# Opción A: Usar script automático
./fix-fonts.sh

# Opción B: Manual
find app -name "*.tsx" -type f -exec sed -i '' 's/Fonts\.semiBold/Fonts.bold/g' {} +
```

### 3️⃣ Verificar que todo está OK

```bash
npm run check
# Debe decir: "Found 0 errors"
```

### 4️⃣ Instalar dependencias de iOS

```bash
cd ios
pod install
cd ..
```

### 5️⃣ Abrir en Xcode y compilar

```bash
open ios/PcimaSalvaje.xcworkspace
```

**En Xcode:**
1. Selecciona tu equipo de desarrollo en "Signing & Capabilities"
2. Selecciona tu dispositivo o simulador
3. Presiona ⌘+R para compilar y ejecutar

---

## 🔧 Solución de Problemas Comunes

### Error: "Command PhaseScriptExecution failed"

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### Error: "Unable to resolve module"

```bash
rm -rf node_modules
npm install
```

### Error: "No signing certificate"

En Xcode:
1. Ve a "Signing & Capabilities"
2. Selecciona tu equipo de desarrollo
3. Xcode generará automáticamente el certificado

---

## 📱 Para Compilar Android

```bash
# Asegúrate de tener Android Studio instalado
npx expo run:android
```

---

## ⚠️ Importante

- **NO uses** `npx expo start` - eso es solo para desarrollo
- **USA** `open ios/PcimaSalvaje.xcworkspace` para abrir en Xcode
- **Asegúrate** de corregir los errores de TypeScript primero

---

## 📞 ¿Necesitas ayuda?

Revisa el archivo `REPORTE_REVISION_BUILD.md` para información detallada sobre:
- Configuración de variables de entorno
- Configuración de keystore para Android
- Problemas conocidos y soluciones
- Checklist completo pre-build

---

**¡Listo para compilar!** 🚀
