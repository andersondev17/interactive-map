// composables/useHeatmap.ts
import { computed, ref, watch } from 'vue';
import type { HeatmapConfig, HeatmapData, HeatmapType } from "~/types/map";
import type { Project } from "~/types/projects";

export default function useHeatmap(
    map: Ref<google.maps.Map | null>,
    projects: Ref<Project[]>
) {
    const heatmap = ref<google.maps.visualization.HeatmapLayer | null>(null);
    const activeHeatmapType = ref<HeatmapType>(null);
    const isLoading = ref(false);
    const heatmapCache = ref<Record<string, google.maps.visualization.WeightedLocation[] | null>>({
        price: null,
        radiation: null
    });
    const heatmapConfigs: Record<string, HeatmapConfig> = {
        radiation: {
            radius: 40,
            opacity: 0.8,
            dissipating: true,
            gradient: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 0.6)',
                'rgba(150, 255, 0, 0.7)',
                'rgba(255, 255, 0, 0.8)',
                'rgba(255, 128, 0, 0.9)',
                'rgba(255, 0, 0, 1)'
            ]
        },
        price: {
            radius: 40,
            opacity: 0.8,
            dissipating: true,
            gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 0.6)',
                'rgba(0, 191, 255, 0.7)',
                'rgba(0, 127, 255, 0.8)',
                'rgba(0, 63, 255, 0.9)',
                'rgba(0, 0, 255, 1)'
            ]
        }
    };

    /**
     * Genera datos normalizados para el heatmap
     */
    const generateHeatmapData = (type: 'price' | 'radiation'): HeatmapData[] => {
        // Validaciones iniciales
        if (!projects.value?.length) return [];
        const validProjects = projects.value.filter(p =>
            p.location && (type === 'price' ? p.price !== undefined : p.radiation !== undefined)
        );

        if (!validProjects.length) return [];
        const values = validProjects.map(p => type === 'radiation' ? (p.radiation || 0) : p.price);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = Math.max(maxValue - minValue, 0.1); // Evitar división por cero

        // Generar datos de heatmap con puntos adicionales para mejor visualización
        return validProjects.flatMap((project, i) => {
            const weight = (values[i] - minValue) / range;
            const points: HeatmapData[] = [{
                location: project.location!,
                weight
            }];

            // Para valores altos, añadir puntos
            if (weight > 0.6) {
                const extraPoints = Math.min(Math.floor(weight * 3), 4); // Máximo 4 puntos adicionales

                for (let j = 0; j < extraPoints; j++) {
                    const offsetLat = (Math.random() - 0.5) * 0.01;
                    const offsetLng = (Math.random() - 0.5) * 0.01;

                    points.push({
                        location: {
                            lat: project.location!.lat + offsetLat,
                            lng: project.location!.lng + offsetLng
                        },
                        weight: weight * 0.8 // Peso reducido para puntos secundarios
                    });
                }
            }

            return points;
        });
    };
    const createWeightedLocations = (data: HeatmapData[]): google.maps.visualization.WeightedLocation[] => {
        return data.map(d => ({
            location: new google.maps.LatLng(d.location.lat, d.location.lng),
            weight: d.weight
        }));
    };

    /**
     * Crea o actualiza la capa de heatmap
     */
    const renderHeatmap = (type: 'price' | 'radiation'): void => {
        if (!map.value) return;

        // Usar datos en caché o generarlos si no existen
        if (!heatmapCache.value[type]) {
            const heatmapData = generateHeatmapData(type);
            if (!heatmapData.length) return;

            heatmapCache.value[type] = createWeightedLocations(heatmapData);
        }

        const data = heatmapCache.value[type];
        if (!data?.length) return;

        // Limpiar heatmap anterior
        heatmap.value?.setMap(null);

        // Crear nuevo heatmap
        heatmap.value = new google.maps.visualization.HeatmapLayer({
            data,
            map: map.value,
            ...heatmapConfigs[type]
        });
    };

    const toggleHeatmap = async (type: 'price' | 'radiation'): Promise<void> => {
        // Si el mismo tipo está activo, desactivarlo
        if (activeHeatmapType.value === type) {
            heatmap.value?.setMap(null);
            activeHeatmapType.value = null;
            return;
        }

        isLoading.value = true;

        try {
            // Dar tiempo al UI para actualizar antes de cálculos intensivos
            if (!heatmapCache.value[type]) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            renderHeatmap(type);
            activeHeatmapType.value = type;
        } catch (error) {
            console.error(`Error al generar heatmap de ${type}:`, error);
        } finally {
            isLoading.value = false;
        }
    };

    // Limpiar caché
    watch(projects, () => {
        heatmapCache.value = { price: null, radiation: null };

        // Re-renderizar heatmap activo si existe
        if (activeHeatmapType.value) {
            renderHeatmap(activeHeatmapType.value);
        }
    }, { deep: true });

    //actualizar heatmap si es necesario
    watch(map, (newMap) => {
        if (newMap && activeHeatmapType.value) {
            renderHeatmap(activeHeatmapType.value);
        }
    });

    onUnmounted(() => {
        heatmap.value?.setMap(null);
    });

    return {
        toggleHeatmap,
        activeHeatmapType: computed(() => activeHeatmapType.value),
        isLoading: computed(() => isLoading.value)
    };
}