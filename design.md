# Pócima Salvage - Diseño de Interfaz Móvil

## Concepto de la App
Aplicación de medicina natural que permite consultar enfermedades y sus tratamientos con plantas medicinales, así como explorar un catálogo completo de plantas con información detallada sobre propiedades, preparación, dosis y contraindicaciones.

---

## Paleta de Colores

| Rol | Color | Uso |
|-----|-------|-----|
| **Primario** | `#2E7D32` (Verde bosque) | Botones principales, iconos activos, acentos |
| **Secundario** | `#81C784` (Verde claro) | Fondos destacados, badges |
| **Fondo principal** | `#FAFDF7` (Crema verdoso) | Background de pantallas |
| **Superficie/Card** | `#FFFFFF` | Tarjetas, modales |
| **Texto primario** | `#1B1B1B` | Títulos, texto principal |
| **Texto secundario** | `#5C5C5C` | Descripciones, subtítulos |
| **Texto terciario** | `#9E9E9E` | Labels, hints |
| **Alerta/Peligro** | `#D32F2F` | Contraindicaciones |
| **Advertencia** | `#F57C00` | Precauciones |

### Modo Oscuro
| Rol | Color |
|-----|-------|
| **Fondo principal** | `#121212` |
| **Superficie/Card** | `#1E1E1E` |
| **Primario** | `#66BB6A` |
| **Texto primario** | `#ECEDEE` |
| **Texto secundario** | `#A0A0A0` |

---

## Tipografía

| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| **Title** | 28px | Bold | Títulos de pantalla |
| **Subtitle** | 20px | SemiBold | Encabezados de sección |
| **Body** | 16px | Regular | Texto general |
| **Body Bold** | 16px | SemiBold | Énfasis en texto |
| **Caption** | 14px | Regular | Etiquetas, metadata |
| **Small** | 12px | Regular | Badges, notas |

---

## Lista de Pantallas

### 1. **Pantalla de Enfermedades (Tab principal)**
- Lista scrolleable de enfermedades/dolencias
- Barra de búsqueda en la parte superior
- Cada item muestra: nombre de enfermedad, número de plantas recomendadas
- Al tocar → Modal con detalle de la enfermedad y plantas recomendadas

### 2. **Pantalla de Plantas Medicinales (Tab secundario)**
- Lista scrolleable de plantas medicinales
- Barra de búsqueda en la parte superior
- Cada item muestra: nombre de planta, propiedades principales (badges)
- Al tocar → Modal con detalle completo de la planta

### 3. **Modal de Detalle de Enfermedad**
- Nombre de la enfermedad
- Descripción breve
- Lista de plantas recomendadas con:
  - Nombre de la planta
  - Por qué se recomienda para esta enfermedad
  - Botón para ver detalle de la planta

### 4. **Modal de Detalle de Planta**
- Nombre común y científico
- Imagen ilustrativa (placeholder)
- **Propiedades curativas** (lista con badges)
- **Parte utilizable** (hojas, raíz, flores, etc.)
- **Dosis recomendada**
- **Preparación** (infusión, decocción, etc.)
- **Fuente** de información
- **Contraindicaciones** (sección destacada en rojo/naranja):
  - No para embarazadas
  - No para niños
  - No para hipertensos
  - Otras advertencias

---

## Contenido Principal por Pantalla

### Tab Enfermedades
- **Datos**: Lista de 15-20 enfermedades comunes
- **Funcionalidad**: Búsqueda por nombre, tap para ver detalle
- **Layout**: FlatList con cards simples

### Tab Plantas
- **Datos**: Lista de 20-25 plantas medicinales
- **Funcionalidad**: Búsqueda por nombre, tap para ver detalle
- **Layout**: FlatList con cards que muestran propiedades como badges

---

## Flujos de Usuario Principales

### Flujo 1: Buscar tratamiento para una enfermedad
1. Usuario abre la app → Tab "Enfermedades" activo
2. Busca o scrollea hasta encontrar su dolencia
3. Toca la enfermedad → Se abre modal con detalle
4. Ve lista de plantas recomendadas
5. Puede tocar una planta para ver su información completa

### Flujo 2: Explorar plantas medicinales
1. Usuario toca Tab "Plantas"
2. Ve lista completa de plantas con propiedades
3. Busca o scrollea hasta encontrar una planta
4. Toca la planta → Se abre modal con detalle completo
5. Lee propiedades, dosis, preparación y contraindicaciones

---

## Componentes UI Clave

### Card de Enfermedad
```
┌─────────────────────────────────────┐
│ 🩺 Dolor de cabeza                  │
│    5 plantas recomendadas       >   │
└─────────────────────────────────────┘
```

### Card de Planta
```
┌─────────────────────────────────────┐
│ 🌿 Manzanilla                       │
│    Digestiva • Calmante • Antiinfl. │
└─────────────────────────────────────┘
```

### Badge de Contraindicación
```
┌──────────────────┐
│ ⚠️ No embarazadas │
└──────────────────┘
```

---

## Espaciado y Layout

- **Padding horizontal de pantalla**: 16px
- **Padding vertical de cards**: 16px
- **Gap entre cards**: 12px
- **Border radius de cards**: 12px
- **Border radius de badges**: 8px
- **Touch target mínimo**: 44px

---

## Navegación

- **Bottom Tab Bar** con 2 tabs:
  1. 🩺 Enfermedades (icono: medical)
  2. 🌿 Plantas (icono: leaf)
- **Modales** se abren desde abajo (slide_from_bottom)
- Sin navegación anidada compleja

---

## Notas de Implementación

- App 100% local (AsyncStorage no necesario para datos estáticos)
- Datos de enfermedades y plantas hardcodeados en archivos de datos
- Sin autenticación requerida
- Sin conexión a backend/base de datos
- Soporte para modo claro y oscuro
