<!-- components/map/controls/MapControls.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, Label, Switch } from '@/components/ui';

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
  
  // Si activamos precio, desactivamos radiación (son mutuamente excluyentes)
  if (priceHeatmapActive.value && radiationHeatmapActive.value) {
    radiationHeatmapActive.value = false;
  }
  
  emit('toggle-heatmap', 'price');
};

// Función para manejar cambios en el toggle de radiación
const handleRadiationToggle = () => {
  radiationHeatmapActive.value = !radiationHeatmapActive.value;
  
  // Si activamos radiación, desactivamos precio (son mutuamente excluyentes)
  if (radiationHeatmapActive.value && priceHeatmapActive.value) {
    priceHeatmapActive.value = false;
  }
  
  emit('toggle-heatmap', 'radiation');
};
</script>

<template>
  <Card class="absolute top-4 right-4 z-10 w-72">
    <CardHeader class="pb-2">
      <CardTitle class="text-sm font-medium">Visualización de Datos</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex items-center justify-between">
        <Label for="show-projects" class="cursor-pointer">Ver proyectos</Label>
        <Switch
          id="show-projects"
          :model-value="showProjects"
          @update:model-value="handleProjectsToggle"
        />
      </div>
      
      <div class="flex items-center justify-between">
        <Label for="price-heatmap" class="cursor-pointer">Ver precios</Label>
        <Switch
          id="price-heatmap"
          :model-value="priceHeatmapActive"
          @update:model-value="handlePriceToggle"
        />
      </div>
      
      <div class="flex items-center justify-between">
        <Label for="radiation-heatmap" class="cursor-pointer">Ver radiación</Label>
        <Switch
          id="radiation-heatmap" 
          :model-value="radiationHeatmapActive"
          @update:model-value="handleRadiationToggle"
        />
      </div>
    </CardContent>
  </Card>
</template>