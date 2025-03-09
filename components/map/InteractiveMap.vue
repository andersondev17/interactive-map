<script setup lang="ts">
import { Card, CardContent } from '@/components/ui'
import { useHeatmap, useMap, useProjects, useSearch } from '@/composables/index'
import useStatistics, { type StatisticsResult } from '@/composables/useStatistics'
import { apiService } from '~/services/api'
import type { Coordinates } from '~/types/map'
import MapControls from './controls/MapControls.vue'
import RadiusControl from './controls/RadiusControl.vue'
import SearchPanel from './controls/SearchPanel.vue'
import NearbyProjects from './NearbyProjects.vue'
import ProjectStatistics from './ProjectStatistics.vue'

const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(true)

// Inicializar composables
const { map, initMap } = useMap(mapContainer)
const { projects, load: loadProjects, toggleProjectsVisibility } = useProjects(apiService, map)
const { searchRadius, searchPoint, updateRadius, handleSearch } = useSearch(map)
const heatmapManager = useHeatmap(map, projects) // Guardar el objeto completo
const { calculateStatistics } = useStatistics()

// Estado para las estadísticas
const statistics = ref<StatisticsResult | null>(null)

// Recalcular estadísticas cuando cambia el radio o el punto de búsqueda
watch([searchRadius, searchPoint, projects], () => {
  if (searchPoint.value) {
    statistics.value = calculateStatistics(
      projects.value, 
      searchPoint.value, 
      searchRadius.value / 1000 // Convertir metros a kilómetros ✅
    );
  }
}, { immediate: true });

// Manejador para alternar la visualización de proyectos
const handleToggleProjects = (visible: boolean) => {
  toggleProjectsVisibility(visible)
}

// Manejador para alternar heatmaps
const handleToggleHeatmap = (type: 'price' | 'radiation') => {
  heatmapManager.toggleHeatmap(type)
}

// Cargar el mapa y los proyectos al montar el componente
onMounted(async () => {
  isLoading.value = true
  try {
    // Coordenadas iniciales (Medellín, Colombia)
    const initialCoordinates: Coordinates = { lat: 6.2442, lng: -75.5812 }
    
    // Inicializar el mapa
    await initMap(initialCoordinates)
    
    // Cargar proyectos
    await loadProjects()
  } catch (error) {
    console.error('Error al inicializar el mapa:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="relative h-[600px] w-full">
    <!-- Mostrar componente de carga mientras se inicializa -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 flex items-center justify-center bg-background/80 z-50"
    >
      <Card class="w-[300px]">
        <CardContent class="flex flex-col items-center p-6">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p class="mt-4">Cargando mapa y proyectos...</p>
        </CardContent>
      </Card>
    </div>

    <!-- Contenedor del mapa -->
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Controles y paneles superpuestos -->
    <MapControls 
      @toggle-heatmap="handleToggleHeatmap" 
      @toggle-projects="handleToggleProjects" 
    />
    <SearchPanel @search="handleSearch" />
    <RadiusControl 
      :radius="searchRadius / 1000" 
      @update:radius="(r) => updateRadius(r * 1000)" 
    />
    <ProjectStatistics :stats="statistics" />
    
    <!-- Lista de proyectos cercanosd (cuando hay un punto de búsqueda) -->
    <NearbyProjects 
      v-if="searchPoint" 
      :projects="projects" 
      :search-point="searchPoint" 
      :radius-km="searchRadius / 1000" 
    />
  </div>
</template>