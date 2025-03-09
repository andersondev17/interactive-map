# Mapa Interactivo con Nuxt 3, Vue 3 y Google Maps

![Captura del Mapa](docs/screenshot.png) <!-- Añadir imagen del mapa -->

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
API_KEY=
API_URL=
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