<!-- components/map/NearbyProjects.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Formatter } from '@/utils/formatter';
import { calculateHaversineDistance } from '@/utils/geo';
import { MapPin } from 'lucide-vue-next';
import type { Coordinates } from '~/types/map';
import type { Project } from '~/types/projects';

const props = defineProps<{
    projects: Project[];
    searchPoint: Coordinates | null;
    radiusKm: number;
}>();

// Formateadores reutilizables
const { currency, number: formatNumber } = Formatter();

const nearbyProjects = computed(() => {
    if (!props.searchPoint) return [];
    
    return props.projects
        .filter(project => project.location) // Filtrar proyectos sin ubicación
        .map(project => ({
            ...project,
            distance: calculateHaversineDistance(props.searchPoint!, project.location!)
        }))
        .filter(({ distance }) => distance <= props.radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
});

// Estadísticas con cálculo seguro
const stats = computed(() => {
    const count = nearbyProjects.value.length;
    if (!count) return null;

    const total = nearbyProjects.value.reduce((acc, { distance, price, radiation }) => ({
        distance: acc.distance + (distance || 0),
        price: acc.price + price,
        radiation: acc.radiation + (radiation || 0)
    }), { distance: 0, price: 0, radiation: 0 });

    return {
        count,
        avgDistance: total.distance / count,
        avgPrice: total.price / count,
        avgRadiation: total.radiation / count
    };
});
</script>

<template>
    <Card v-show="nearbyProjects.length" class="absolute bottom-24 left-4 z-10 w-80 max-h-[300px]">
        <CardHeader class="pb-2">
            <CardTitle class="text-sm font-medium flex items-center justify-between">
                <span>Proyectos cercanos ({{ nearbyProjects.length }})</span>
                <span class="text-xs text-muted-foreground">
                    Radio: {{ radiusKm }} km
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent class="p-0 overflow-y-auto max-h-[240px]">
            <div class="border-t divide-y">
                <div v-if="stats" class="p-3 bg-muted/40">
                    <div class="grid grid-cols-3 gap-2 text-xs">
                        <div>
                            <div class="text-muted-foreground">Distancia promedio</div>
                            <div class="font-medium">{{ formatNumber(stats.avgDistance) }} km</div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Precio promedio</div>
                            <div class="font-medium">{{ currency(stats.avgPrice) }}</div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Radiación</div>
                            <div class="font-medium">{{ formatNumber(stats.avgRadiation) }}</div>
                        </div>
                    </div>
                </div>

                <div v-for="project in nearbyProjects" :key="project.id" class="p-3 hover:bg-muted/20">
                    <div class="font-medium text-sm">{{ project.name }}</div>
                    <div class="mt-1 grid grid-cols-2 gap-1 text-xs">
                        <div class="flex items-center gap-1 text-muted-foreground">
                            <MapPin class="h-3 w-3" />
                            <span>{{ formatNumber(project.distance) }} km</span>
                        </div>
                        <div class="text-right text-muted-foreground">
                            {{ currency(project.price) }}
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>