# Mapa Interactivo con Nuxt 3, Vue 3 y Google Maps

![Visualización de heatmap y controles.](/public/images/p1.png) <!-- Añadir imagen del mapa -->
![Visualización 2.](/public/images//p2.png) <!-- Añadir imagen del mapa -->

![Ubicación de punto para búsqueda de proyecto cercanos y controles de este punto, visualización de proyectos cercanos](/public/images/p3.png) <!-- Añadir imagen del mapa -->



Aplicación web para visualizar proyectos solares en un mapa interactivo, con heatmaps de precios y radiación, búsqueda por coordenadas, y estadísticas

## Características Principales
- 🗺️ Mapa interactivo con Google Maps.
- 🔥 Heatmaps personalizados para precios (azul) y radiación solar (verde-rojo).
- 📍 Búsqueda por coordenadas con validación.
- 📏 Control deslizante para ajustar el radio de búsqueda (1-50 km).
- 📊 Estadísticas detalladas de proyectos cercanos.
- 🛠️ Integración con API externa y datos de muestra.

## Tecnologías
- **Frontend:** Nuxt 3, Vue 3 (Composition API)
- **Mapas:** Google Maps API (`@googlemaps/js-api-loader`)
- **UI:** ShadCN/Radix (Componentes: Card, Slider, Switch)
- **Herramientas:** TypeScript

## Patrones de Diseño
### 1. Composables (Hooks)
Se implementa un sistema de composables como useMap, useHeatmap, useProjects, etc., que encapsulan funcionalidades específicas:
```bash 
export { default as useHeatmap } from './useHeatmap';
export { default as useMap } from './useMap';
export { default as useProjects } from './useProjects';
export { default as useSearch } from './useSearch';
export { default as useStatistics } from './useStatistics';
```
Impacto: Este patrón permite compartir lógica entre componentes, reduce la duplicación de código y mejora la mantenibilidad. La lógica relacionada se mantiene junta y puede evolucionar independientemente.

### 2. Observer Pattern
Se utiliza el sistema reactivo de Vue con ref, computed y watch para implementar el patrón Observer:
```bash 
// Ejemplo en InteractiveMap.vue
watch([searchRadius, searchPoint, projects], () => {
  if (searchPoint.value) {
    statistics.value = calculateStatistics(
      projects.value, 
      searchPoint.value, 
      searchRadius.value / 1000
    );
  }
}, { immediate: true });

```
Impacto: Permite responder automáticamente a cambios en el estado de la aplicación, manteniendo la UI sincronizada con los datos y reduciendo la complejidad del código.

### 3. Adapter Pattern
Se utiliza para convertir las coordenadas recibidas de la API a un formato utilizable:
```bash
 // En parseCoordinates.ts
export function parseCoordinates(coordStr: string): Coordinates {
    // Implementación que adapta de string a objeto Coordinates
}

```

Impacto: Permite adaptar los datos de la API al formato en la aplicación.


### 4. Command Pattern
Implementado en los controles del mapa, donde cada acción del usuario se encapsula en métodos específicos:
```bash
// En MapControls.vue
const handlePriceToggle = () => {
  priceHeatmapActive.value = !priceHeatmapActive.value;
  
  if (priceHeatmapActive.value && radiationHeatmapActive.value) {
    radiationHeatmapActive.value = false;
  }
  
  emit('toggle-heatmap', 'price');
};

```
Impacto: Facilita la implementación de características como activar lo heatmaps para precios o radiacion 

## Configuración Inicial

### Requisitos
- Node.js v18+
- Clave API de Google Maps ([Aquí](https://developers.google.com/maps/documentation/javascript/get-api-key))

### Pasos para Ejecutar
1. Clonar el repositorio:
```bash
   git clone https://github.com/tu-usuario/mapa-interactivo.git
   cd mapa-interactivo

   ```

2.   Instalar dependencias:

```bash

npm install
```


3. Configurar variables de entorno:
Crear un archivo .env en la raíz:

```bash

GOOGLE_MAPS_API_KEY="tu-clave-de-google-maps"
API_KEY="tu-clave-api-aquí"
API_URL="tu-clave-url"
``

4 . Abrir en el navegador:

npm run dev

```

## Uso
### Búsqueda por Coordenadas

- Ingresa latitud y longitud (ej: 6.2442, -75.5812 para Medellín).

- Haz clic en "Buscar" para centrar el mapa.

- Ajustar Radio de Búsqueda

- Utiliza el slider en el panel derecho para definir el radio (1-50 km).

- Alternar Heatmaps

- Usa los switches en el panel superior derecho para activar/desactivar heatmaps de precios o radiación.

- Ver Proyectos Cercanos

- Los proyectos dentro del radio aparecen en el panel izquierdo con estadísticas detalladas.