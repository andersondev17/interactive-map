<!-- components/map/controls/MapControls.vue -->
<template>
  <Card class="w-64 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
    <CardHeader class="py-3 px-4 border-b">
      <CardTitle class="text-sm font-medium flex items-center">
        <Layers class="h-4 w-4 mr-2 text-gray-700" />
        <span class="text-gray-800">Filtros del Mapa</span>
      </CardTitle>
    </CardHeader>
    
    <CardContent class="py-3 px-4 space-y-3">
      <!-- Grupo de Filtros -->
      <div class="space-y-2">
        <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Categorías
        </h3>
        
        <!-- Filtro de Proyectos -->
        <div class="flex items-center justify-between p-2 hover:bg-gray-300 rounded-lg">
          <div class="flex items-center">
            <div class="h-4 w-4 mr-2 bg-purple-500 rounded-sm"></div>
            <Label for="show-projects" class="cursor-pointer text-sm text-gray-700">
              Proyectos
            </Label>
          </div>
          <Switch
            id="show-projects"
            :model-value="showProjects"
            @update:model-value="handleProjectsToggle"
            class="data-[state=checked]:bg-purple-500"
            aria-label="Mostrar proyectos en el mapa"
          />
        </div>
        
        <!-- Filtro de Precios -->
        <div class="flex items-center justify-between p-2 hover:bg-gray-300 rounded-lg">
          <div class="flex items-center">
            <div class="h-4 w-4 mr-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-sm"></div>
            <Label for="price-heatmap" class="cursor-pointer text-sm text-gray-700">
              Precios
            </Label>
          </div>
          <Switch
            id="price-heatmap"
            :model-value="priceHeatmapActive"
            @update:model-value="handlePriceToggle"
            class="data-[state=checked]:bg-blue-500"
            aria-label="Mostrar heatmap de precios"
          />
        </div>
        
        <!-- Filtro de Radiación -->
        <div class="flex items-center justify-between p-2 hover:bg-gray-300 rounded-lg">
          <div class="flex items-center">
            <div class="h-4 w-4 mr-2 bg-gradient-to-r from-green-400 to-red-500 rounded-sm"></div>
            <Label for="radiation-heatmap" class="cursor-pointer text-sm text-gray-700">
              Radiación
            </Label>
          </div>
          <Switch
            id="radiation-heatmap" 
            :model-value="radiationHeatmapActive"
            @update:model-value="handleRadiationToggle"
            class="data-[state=checked]:bg-green-500"
            aria-label="Mostrar heatmap de radiación"
          />
        </div>
      </div>
      
      <!-- Leyenda de colores -->
      <div v-if="priceHeatmapActive || radiationHeatmapActive" class="pt-3 space-y-2 border-t">
        <h3 class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Leyenda
        </h3>
        
        <!-- Leyenda de Precios -->
        <div v-if="priceHeatmapActive" class="space-y-1 text-xs">
          <div class="flex items-center">
            <div class="h-2 w-full bg-gradient-to-r from-cyan-100 to-blue-700 rounded-sm"></div>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Bajo</span>
            <span>Alto</span>
          </div>
        </div>
        
        <!-- Leyenda de Radiación -->
        <div v-if="radiationHeatmapActive" class="space-y-1 text-xs">
          <div class="flex items-center">
            <div class="h-2 w-full bg-gradient-to-r from-green-300 via-yellow-400 to-red-600 rounded-sm"></div>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Bajo</span>
            <span>Alto</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, Label, Switch } from '@/components/ui';
import { Layers } from 'lucide-vue-next';

const emit = defineEmits(['toggle-heatmap', 'toggle-projects']);

// Estado para los interruptores
const showProjects = ref(true);
const priceHeatmapActive = ref(false);
const radiationHeatmapActive = ref(false);

// Función para alternar la visualización de proyectos
const handleProjectsToggle = () => {
  showProjects.value = !showProjects.value;
  emit('toggle-projects', showProjects.value);
};

// Función para manejar cambios en el toggle de precios
const handlePriceToggle = () => {
  priceHeatmapActive.value = !priceHeatmapActive.value;
  if (priceHeatmapActive.value && radiationHeatmapActive.value) {
    radiationHeatmapActive.value = false;
  }
  emit('toggle-heatmap', 'price');
};

// Función para manejar cambios en el toggle de radiación
const handleRadiationToggle = () => {
  radiationHeatmapActive.value = !radiationHeatmapActive.value;
  if (radiationHeatmapActive.value && priceHeatmapActive.value) {
    priceHeatmapActive.value = false;
  }
  emit('toggle-heatmap', 'radiation');
};
</script>

<style scoped>
/* Efecto de hover sutil */
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.8);
}

/* Transiciones suaves */
.switch-transition {
  transition: background-color 0.2s ease;
}

/* Sombra suave */
.shadow-lg {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>