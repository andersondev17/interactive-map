<!-- components/map/ProjectStatistics.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { StatisticsResult } from '~/composables/useStatistics';

interface Props {
    stats: StatisticsResult | null;
}

// Definir props con validación de tipos
const props = defineProps<Props>();

// Función para formatear números
const formatNumber = (value: number | undefined, decimals = 2): string => {
    if (value === undefined) return 'N/A';
    return value.toFixed(decimals);
};

// Determinar si hay estadísticas para mostrar
const hasStats = computed(() => !!props.stats && props.stats.count > 0);
</script>

<template>
    <Card class="absolute bottom-4 left-4 z-10 w-72">
        <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium">Estadísticas de Proyectos Cercanos</CardTitle>
        </CardHeader>
        <CardContent>
            <div v-if="hasStats" class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Proyectos encontrados:</span>
                    <span class="font-medium">{{ stats?.count }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Precio promedio:</span>
                    <span class="font-medium">{{ formatNumber(stats?.averagePrice) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Precio mínimo:</span>
                    <span class="font-medium">{{ formatNumber(stats?.minPrice) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Precio máximo:</span>
                    <span class="font-medium">{{ formatNumber(stats?.maxPrice) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Radiación promedio:</span>
                    <span class="font-medium">{{ formatNumber(stats?.averageRadiation) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Radiación mínima:</span>
                    <span class="font-medium">{{ formatNumber(stats?.minRadiation) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Radiación máxima:</span>
                    <span class="font-medium">{{ formatNumber(stats?.maxRadiation) }}</span>
                </div>

                <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Distancia mínima (km):</span>
                    <span class="font-medium">{{ formatNumber(stats?.minDistance) }}</span>
                </div>
            </div>

            <div v-else class="py-2 text-center text-sm text-muted-foreground">
                No hay proyectos en el área seleccionada.
            </div>
        </CardContent>
    </Card>
</template>