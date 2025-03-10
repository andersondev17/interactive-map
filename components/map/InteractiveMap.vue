<template>
  <div class="relative w-full h-[calc(100vh-120px)] min-h-[500px] flex flex-col md:flex-row">
    <div class="relative flex-1 h-full min-h-[400px]">
      <transition name="fade">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-background/80 z-50"
          aria-live="polite" role="status">
          <Card class="w-[280px]">
            <CardContent class="flex flex-col items-center p-6">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p class="mt-4">Cargando mapa y proyectos...</p>
            </CardContent>
          </Card>
        </div>
      </transition>

      <!-- Contenedor del mapa -->
      <div ref="mapContainer" class="h-full w-full" aria-label="Mapa interactivo de proyectos"></div>

      <Button v-if="!isDesktop" class="absolute bottom-4 right-4 z-30 rounded-full h-12 w-12 shadow-lg md:hidden"
        size="icon" variant="secondary" @click="togglePanel">
        <Settings class="h-5 w-5" />
        <span class="sr-only">Abrir panel de controles</span>
      </Button>

      <MapControls class="absolute top-4 right-4 z-10 hidden md:block" @toggle-heatmap="handleToggleHeatmap"
        @toggle-projects="toggleProjectsVisibility" />

      <!-- Versión móvil de los controles -->
      <div class="absolute top-4 left-4 z-10 md:hidden">
        <Button variant="secondary" size="sm" @click="toggleControlsMenu">
          <Layers class="h-4 w-4 mr-2" />
          Capas
        </Button>
      </div>

      <Card v-if="showControlsMenu" class="absolute top-16 left-4 z-20 w-64 md:hidden shadow-lg">
        <CardContent class="p-4">
          <MapControls compact @toggle-heatmap="handleToggleHeatmap" @toggle-projects="toggleProjectsVisibility"
            @close="showControlsMenu = false" />
        </CardContent>
      </Card>

      <NearbyProjects v-if="searchPoint"
        class="absolute bottom-20 left-4 z-10 w-72 max-w-[calc(100%-2rem)] md:max-w-xs" :projects="projects"
        :search-point="searchPoint" :radius-km="searchRadius / 1000" />
    </div>

    <Transition name="panel">
      <div v-if="showPanel || isDesktop" :class="[
        'bg-card shadow-lg overflow-auto z-20',
        isDesktop ? 'w-80 lg:w-96 h-full border-l' : 'fixed inset-x-0 bottom-0 h-[60vh] border-t rounded-t-xl'
      ]">
        <div v-if="!isDesktop" class="p-2 border-b flex justify-between items-center sticky top-0 bg-card z-10">
          <div class="mx-auto w-10 h-1 rounded-full bg-muted"></div>
          <Button variant="ghost" size="icon" class="absolute right-2" @click="togglePanel">
            <X class="h-4 w-4" />
            <span class="sr-only">Cerrar panel</span>
          </Button>
        </div>

        <div class="divide-y">
          <div class="p-4 md:p-6">
            <h2 class="text-lg font-semibold mb-4">Ubicación</h2>
            <SearchPanel @search="handleSearch" />
          </div>

          <div class="p-4 md:p-6">
            <h2 class="text-lg font-semibold mb-4">Radio de distancia (km)</h2>
            <RadiusControl :radius="searchRadius / 1000" @update:radius="r => updateRadius(r * 1000)" />
          </div>

          <ProjectStatistics class="flex-1" :stats="statistics" :search-radius="searchRadius"
            :search-point="searchPoint" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, CardContent } from '@/components/ui'
import { Layers, Settings, X } from 'lucide-vue-next'
import { useHeatmap, useMap, useProjects, useSearch } from '~/composables'
import useStatistics from '~/composables/useStatistics'
import { apiService } from '~/services/api'

// Componentes
import MapControls from './controls/MapControls.vue'
import RadiusControl from './controls/RadiusControl.vue'
import SearchPanel from './controls/SearchPanel.vue'
import NearbyProjects from './NearbyProjects.vue'
import ProjectStatistics from './ProjectStatistics.vue'

// Estado
const mapContainer = ref(null)
const showPanel = ref(false)
const showControlsMenu = ref(false)

// Composables
const { map, isLoading, isDesktop, initMap } = useMap(mapContainer)
const { projects, load: loadProjects, toggleProjectsVisibility } = useProjects(apiService, map)
const { searchRadius, searchPoint, updateRadius, handleSearch } = useSearch(map)
const { toggleHeatmap: handleToggleHeatmap } = useHeatmap(map, projects)
const { calculateStatistics } = useStatistics()

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const toggleControlsMenu = () => {
  showControlsMenu.value = !showControlsMenu.value
}

const statistics = computed(() => {
  if (!searchPoint.value || !projects.value.length) return null

  const radiusKm = searchRadius.value / 1000
  return calculateStatistics(projects.value, searchPoint.value, radiusKm)
})

// Inicialización
onMounted(async () => {
  try {
    await initMap({ lat: 6.2442, lng: -75.5812 })
    await loadProjects()
  } catch (error) {
    console.error('Error al inicializar:', error)
  }
})
</script>