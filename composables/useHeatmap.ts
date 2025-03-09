// composables/useHeatmap.ts
import type { HeatmapData } from "~/types/map";
import type { Project } from "~/types/projects";

export default function useHeatmap(
    map: Ref<google.maps.Map | null>,
    projects: Ref<Project[]>
) {
    const heatmap = ref<google.maps.visualization.HeatmapLayer | null>(null);
    const activeHeatmapType = ref<'price' | 'radiation' | null>(null);
    const isLoading = ref(false);

    // Función para alternar heatmaps
    const toggleHeatmap = (type: 'price' | 'radiation') => {
        if (activeHeatmapType.value === type) {
            // Desactivar si ya está activo
            heatmap.value?.setMap(null);
            activeHeatmapType.value = null;
        } else {
            // Generar nuevos datos y activar
            const heatmapData = generateHeatmapData(type);
            createHeatmap(heatmapData);
            activeHeatmapType.value = type;
        }
    };

    // Generar datos normalizados
    const generateHeatmapData = (type: 'price' | 'radiation'): HeatmapData[] => {
        if (!projects.value.length) return [];
        
        const values = projects.value.map(p => p[type]);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = maxValue - minValue;
        
        return projects.value.map(project => ({
            location: project.location,
            weight: range ? (project[type] - minValue) / range : 0.5 // Normalizar entre 0-1
        }));
    };

    // Función para crear el heatmap
    const createHeatmap = (data: HeatmapData[]) => {
        if (!map.value) return;

        const weightedLocations = data.map(d => ({
            location: new google.maps.LatLng(d.location.lat, d.location.lng),
            weight: d.weight
        }));

        heatmap.value?.setMap(null); // Limpiar anterior
        
        // Configuración específica según el tipo de heatmap
        const gradients = {
            price: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)'
            ],
            radiation: [
                'rgba(0, 255, 0, 0)',
                'rgba(0, 255, 0, 1)',
                'rgba(128, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 128, 0, 1)',
                'rgba(255, 0, 0, 1)'
            ]
        };
        
        heatmap.value = new google.maps.visualization.HeatmapLayer({
            data: weightedLocations,
            map: map.value,
            radius: 25,
            opacity: 0.8,
            gradient: activeHeatmapType.value === 'price' 
                ? gradients.price 
                : gradients.radiation
        });
    };

    watch(projects, (newProjects) => {
        if (activeHeatmapType.value && newProjects.length > 0) {
            const heatmapData = generateHeatmapData(activeHeatmapType.value);
            createHeatmap(heatmapData);
        }
    }, { deep: true });
    
    return { 
        createHeatmap,
        toggleHeatmap,
        activeHeatmapType: activeHeatmapType.value, // Exportar el valor actual
        isLoading: isLoading.value  // Exportar el valor actual
    };
}