<!-- components/map/ProjectStatistics.vue -->
<script setup lang="ts">
import type { StatisticsResult } from '@/types/projects';
import { Formatter } from '@/utils/formatter';
import type { Coordinates } from '~/types/map';

const props = defineProps<{
  stats: StatisticsResult | null;
  searchRadius: number;
  searchPoint: Coordinates | null;
}>();

// Formateadores
const { currency, number: formatNumber } = Formatter();
</script>

<template>
  <div v-if="searchPoint && stats" class="p-6 border-b bg-muted/20">
    <h2 class="text-lg font-semibold mb-4">Resumen de proyectos</h2>
    <div class="bg-card rounded-lg p-4 shadow-sm">
      <div class="mb-3 flex items-center">
        <span class="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
        <span class="font-medium">{{ stats.count }} proyectos cercanos ({{ formatNumber(searchRadius / 1000) }} km)</span>
      </div>
      <div class="space-y-3 text-sm">
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">Distancia promedio:</span>
          <span class="font-medium">{{ formatNumber(stats.minDistance) }} km</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">$/ha promedio:</span>
          <span class="font-medium">{{ currency(stats.averagePrice) }} COP</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">Radiación promedio:</span>
          <span class="font-medium">{{ formatNumber(stats.averageRadiation) }} kWh/kWp</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="searchPoint" class="p-6 border-b bg-muted/20">
    <p class="text-center text-muted-foreground">No hay datos disponibles para el área seleccionada</p>
  </div>
</template>