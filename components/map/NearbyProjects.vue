<!-- components/map/NearbyProjects.vue -->
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { MapPin } from 'lucide-vue-next';
import type { Coordinates } from '~/types/map';
import type { Project } from '~/types/projects';

interface Props {
    projects: Project[];
    searchPoint: Coordinates | null;
    radiusKm: number;
}

const props = defineProps<Props>();

// Filtrar proyectos por radio
const nearbyProjects = computed(() => {
    if (!props.searchPoint) return [];
    
    return props.projects
        .filter(project => {
            const distance = calculateDistance(props.searchPoint!, project.location);
            return distance <= props.radiusKm; // Radio en km
        })
        .sort((a, b) => calculateDistance(props.searchPoint!, a.location) - calculateDistance(props.searchPoint!, b.location))
        .slice(0, 10);
});

// Calcular distancia entre dos puntos usando la fórmula de Haversine
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRadians(point2.lat - point1.lat);
    const dLng = toRadians(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

// Calcular estadísticas
const stats = computed(() => {
    if (!nearbyProjects.value.length) return null;

    const prices = nearbyProjects.value.map(p => p.price);
    const radiations = nearbyProjects.value.map(p => p.radiation);

    return {
        count: nearbyProjects.value.length,
        avgDistance: nearbyProjects.value.reduce((sum, p) => sum + (p.distance || 0), 0) / nearbyProjects.value.length,
        avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
        avgRadiation: radiations.reduce((sum, r) => sum + r, 0) / radiations.length
    };
});

// Formatear números
const formatNumber = (value: number, decimals = 2): string => {
    return value.toFixed(decimals);
};

// Formatear precios
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO').format(value);
};
</script>

<template>
    <Card class="absolute bottom-24 left-4 z-10 w-80 max-h-[300px]" v-if="nearbyProjects.length > 0">
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
                <!-- Estadísticas resumen -->
                <div v-if="stats" class="p-3 bg-muted/40">
                    <div class="grid grid-cols-3 gap-2 text-xs">
                        <div>
                            <div class="text-muted-foreground">Distancia promedio</div>
                            <div class="font-medium">{{ formatNumber(stats.avgDistance) }} km</div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Precio promedio</div>
                            <div class="font-medium">{{ formatCurrency(stats.avgPrice) }}</div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Radiación</div>
                            <div class="font-medium">{{ formatNumber(stats.avgRadiation) }}</div>
                        </div>
                    </div>
                </div>

                <!-- Lista de proyectos -->
                <div v-for="project in nearbyProjects" :key="project.id" class="p-3 hover:bg-muted/20">
                    <div class="font-medium text-sm">{{ project.name }}</div>
                    <div class="mt-1 grid grid-cols-2 gap-1 text-xs">
                        <div class="flex items-center gap-1 text-muted-foreground">
                            <MapPin class="h-3 w-3" />
                            <span>{{ formatNumber(project.distance || 0) }} km</span>
                        </div>
                        <div class="text-right text-muted-foreground">
                            {{ formatCurrency(project.price) }} COP
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>