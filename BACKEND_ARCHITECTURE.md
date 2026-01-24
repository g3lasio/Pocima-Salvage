# Backend Architecture - Pocima Salvage
## MolDoctor y Arquitectura de API

**Fecha:** 24 de enero de 2026  
**Autor:** Manus AI

---

## 🎯 Tu Preocupación es VÁLIDA y ya está RESUELTA

**Tu preocupación:** "Desde el APK o app nativo no se pueden hacer llamadas directas a la API de Anthropic"

**✅ RESPUESTA:** El proyecto **YA está correctamente arquitecturado** con un backend intermedio. Las apps nativas **NO hacen llamadas directas** a Anthropic. Todo pasa por tu servidor backend.

---

## 📐 Arquitectura Actual (CORRECTA)

```
┌─────────────────────────────────────────────────────────────────┐
│                      APP NATIVA (iOS/Android)                   │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │ Enfermedades │    │  MolDoctor   │    │   Plantas    │    │
│  │   (Local)    │    │   (tRPC)     │    │   (Local)    │    │
│  └──────────────┘    └──────┬───────┘    └──────────────┘    │
│                              │                                  │
│                              │ tRPC over HTTPS                  │
│                              ▼                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ Internet
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    TU SERVIDOR BACKEND                          │
│                  (Express + tRPC + Node.js)                     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  server/_core/index.ts                                 │   │
│  │  - Puerto 3000                                         │   │
│  │  - CORS habilitado                                     │   │
│  │  - Endpoints: /api/trpc, /api/health, /api/oauth      │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  server/_core/llm.ts                                   │   │
│  │  - Maneja ANTHROPIC_API_KEY (segura en servidor)      │   │
│  │  - Maneja BUILT_IN_FORGE_API_KEY (Gemini)             │   │
│  │  - Selección automática de proveedor                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ HTTPS con API Key
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
         ▼                                           ▼
┌─────────────────────┐                  ┌─────────────────────┐
│  Anthropic Claude   │                  │   Manus Forge       │
│  (claude-sonnet-4)  │                  │  (gemini-2.5-flash) │
└─────────────────────┘                  └─────────────────────┘
```

---

## ✅ Por qué esta arquitectura es CORRECTA

### 1. **Seguridad de API Keys** 🔐
- ✅ La `ANTHROPIC_API_KEY` **NUNCA** está en el código de la app
- ✅ La API key está en el **servidor backend** (variables de entorno)
- ✅ La app solo conoce la URL de tu backend
- ✅ Imposible extraer la API key del APK/IPA

### 2. **Comunicación Segura** 🔒
```typescript
// En la app (lib/trpc.ts):
const trpc = createTRPCClient({
  links: [
    httpBatchLink({
      url: `${getApiBaseUrl()}/api/trpc`,  // Tu servidor backend
      headers: async () => ({
        authorization: `Bearer ${sessionToken}`,  // Auth del usuario
      }),
    }),
  ],
});
```

### 3. **Backend como Proxy Seguro** 🛡️
```typescript
// En el servidor (server/_core/llm.ts):
async function invokeAnthropic(params: InvokeParams): Promise<InvokeResult> {
  // La API key está en el servidor, no en la app
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ENV.anthropicApiKey,  // ⬅️ Segura en el servidor
    },
    body: JSON.stringify(payload),
  });
  
  return convertedResponse;
}
```

---

## 🚀 Opciones de Despliegue del Backend

Para que MolDoctor funcione en producción, necesitas desplegar el backend. Aquí están tus opciones:

### Opción 1: Railway (RECOMENDADA) ⭐

**Ventajas:**
- ✅ Fácil de configurar
- ✅ $5/mes con $5 gratis al inicio
- ✅ Despliegue automático desde GitHub
- ✅ Variables de entorno seguras
- ✅ SSL/HTTPS incluido

**Pasos:**
1. Crear cuenta en [railway.app](https://railway.app)
2. Conectar tu repositorio GitHub
3. Railway detectará automáticamente el proyecto Node.js
4. Configurar variables de entorno:
   ```
   ANTHROPIC_API_KEY=sk-ant-***
   NODE_ENV=production
   PORT=3000
   ```
5. Railway te dará una URL: `https://pocima-salvage-production.up.railway.app`

**Actualizar en la app:**
```typescript
// constants/oauth.ts línea 40
if (ReactNative.Platform.OS !== "web") {
  return "https://pocima-salvage-production.up.railway.app";
}
```

---

### Opción 2: Render

**Ventajas:**
- ✅ Plan gratuito disponible
- ✅ Fácil configuración
- ⚠️ El plan gratuito "duerme" después de 15 min de inactividad

**Pasos:**
1. Crear cuenta en [render.com](https://render.com)
2. New > Web Service
3. Conectar GitHub repo
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm run build && npm start`
   - Variables de entorno: `ANTHROPIC_API_KEY`

---

### Opción 3: Vercel

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Despliegue automático

**Limitaciones:**
- ⚠️ Funciones serverless (no servidor persistente)
- ⚠️ Límite de 10 segundos por request (puede ser corto para IA)

---

### Opción 4: Manus/Replit (Desarrollo)

**Ventajas:**
- ✅ Ya está configurado
- ✅ Gratis durante desarrollo

**Limitaciones:**
- ⚠️ No recomendado para producción
- ⚠️ El servidor se apaga cuando no hay actividad
- ⚠️ URL puede cambiar

**URL actual en el código:**
```typescript
// constants/oauth.ts línea 40
return "https://3000-i6bjqff548tmliorgm2j9-2b5dd600.us2.manus.computer";
```

---

## 🔧 Configuración Recomendada para Producción

### 1. Desplegar Backend en Railway

```bash
# En Railway, configurar estas variables de entorno:
ANTHROPIC_API_KEY=sk-ant-api03-***
NODE_ENV=production
PORT=3000
```

### 2. Actualizar URL en la App

Editar `constants/oauth.ts`:

```typescript
export function getApiBaseUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/$/, "");
  }
  
  // Para apps nativas en producción
  if (ReactNative.Platform.OS !== "web") {
    // ⬇️ Cambiar esta URL a tu servidor de producción
    return "https://pocima-salvage-production.up.railway.app";
  }
  
  // Para desarrollo web
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname, port } = window.location;
    
    if (hostname.includes('.replit.dev') || hostname.includes('.repl.co')) {
      const apiHostname = hostname.replace(/^5000-/, '3000-');
      if (apiHostname !== hostname) {
        return `${protocol}//${apiHostname}`;
      }
    }
    
    if (port === '5000' || port === '8081') {
      return `${protocol}//${hostname}:3000`;
    }
  }
  
  return "";
}
```

### 3. Configurar Variables de Entorno en Railway

En el dashboard de Railway:
1. Ve a tu proyecto
2. Variables
3. Agregar:
   - `ANTHROPIC_API_KEY` = tu clave de Anthropic
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

---

## 📱 Flujo de Datos en la App Nativa

### Cuando el usuario usa MolDoctor:

```
1. Usuario escribe mensaje en MolDoctor
   ↓
2. App llama a tRPC: trpc.moldoctor.chat.mutate({ message })
   ↓
3. tRPC envía HTTPS request a: https://tu-backend.railway.app/api/trpc
   ↓
4. Backend recibe request, valida sesión
   ↓
5. Backend llama a Anthropic con la API key (segura en servidor)
   ↓
6. Anthropic responde al backend
   ↓
7. Backend procesa y envía respuesta a la app
   ↓
8. App muestra respuesta al usuario
```

**🔐 Seguridad:**
- La API key **NUNCA** sale del servidor
- La app solo conoce la URL del backend
- Comunicación cifrada con HTTPS
- Autenticación con tokens de sesión

---

## 🎯 Datos Locales vs Backend

### Datos que NO requieren backend (funcionan offline):

- ✅ **482 Enfermedades** - Almacenadas en `data/enfermedades-data.ts`
- ✅ **693 Plantas Medicinales** - Almacenadas en `data/medicinal-data.ts`
- ✅ **Cruce de datos** - Almacenado en `data/cruce-datos.ts`
- ✅ **Búsqueda y filtrado** - Todo funciona localmente
- ✅ **Navegación** - No requiere internet

### Datos que SÍ requieren backend:

- ⚠️ **MolDoctor (Chat con IA)** - Requiere backend + Anthropic
- ⚠️ **Análisis de imágenes** - Requiere backend + Anthropic
- ⚠️ **Historial sincronizado** - Actualmente usa AsyncStorage local

---

## 🔄 Opción: Modo Offline para MolDoctor

Si NO quieres mantener un backend, puedes:

### Opción A: Deshabilitar MolDoctor

```typescript
// app/(tabs)/_layout.tsx
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Enfermedades" }} />
      {/* Comentar esta línea para deshabilitar MolDoctor */}
      {/* <Tabs.Screen name="moldoctor" options={{ title: "MolDoctor" }} /> */}
      <Tabs.Screen name="plantas" options={{ title: "Plantas" }} />
    </Tabs>
  );
}
```

### Opción B: Usar API de Anthropic directamente (NO RECOMENDADO)

⚠️ **NO HAGAS ESTO:** Exponer la API key en la app es un riesgo de seguridad. Cualquiera puede extraerla del APK.

---

## 💰 Costos Estimados

### Backend (Railway):
- **Plan Hobby:** $5/mes
- **Incluye:** 500 horas de ejecución, $5 de crédito gratis

### API de Anthropic:
- **Claude Sonnet 4:** ~$3 por millón de tokens de entrada
- **Estimado:** $10-20/mes para uso moderado (100-200 conversaciones/día)

### Total estimado: **$15-25/mes**

---

## 🚦 Recomendación Final

### Para Producción:

1. ✅ **Desplegar backend en Railway** (o Render/Vercel)
2. ✅ **Configurar ANTHROPIC_API_KEY en Railway**
3. ✅ **Actualizar URL en `constants/oauth.ts`**
4. ✅ **Compilar y publicar apps**

### Para Testing/Demo:

1. ✅ **Usar backend de Manus/Replit temporalmente**
2. ⚠️ **Advertir a usuarios que es versión de prueba**
3. ✅ **Migrar a Railway antes de lanzamiento oficial**

---

## 📋 Checklist de Producción

- [ ] Backend desplegado en Railway/Render
- [ ] `ANTHROPIC_API_KEY` configurada en variables de entorno
- [ ] URL de producción actualizada en `constants/oauth.ts`
- [ ] App compilada con nueva URL
- [ ] Probado MolDoctor en app nativa
- [ ] Monitoreo de costos de Anthropic configurado

---

## 🆘 Troubleshooting

### Error: "Cannot connect to backend"

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar URL en `constants/oauth.ts`
3. Verificar CORS en `server/_core/index.ts`

### Error: "ANTHROPIC_API_KEY not configured"

**Solución:**
1. Verificar variables de entorno en Railway
2. Reiniciar el servicio en Railway
3. Verificar que la API key es válida

### MolDoctor no responde

**Solución:**
1. Verificar logs del backend en Railway
2. Verificar créditos de Anthropic
3. Verificar que la app usa la URL correcta

---

## 📞 Resumen

**Tu arquitectura actual es CORRECTA ✅**

- Las apps nativas **NO** hacen llamadas directas a Anthropic
- Todo pasa por tu backend (servidor Express)
- La API key está segura en el servidor
- Solo necesitas desplegar el backend en producción

**Próximo paso:** Desplegar backend en Railway y actualizar URL en la app.

---

**Documentación creada por:** Manus AI  
**Fecha:** 24 de enero de 2026
