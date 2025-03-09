// composables/useHeatmap.ts
import type { HeatmapData } from "~/types/map";
import type { Project } from "~/types/projects";

export default function useHeatmap(
    map: Ref<google.maps.Map | null>,
    projects: Ref<Project[]>
) {
    const heatmap = ref<google.maps.visualization.HeatmapLayer | null>(null);
    const activeHeatmapType = ref<'price' | 'radiation' | null>(null);

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
        
        // Filtrar proyectos con ubicación válida
        const validProjects = projects.value.filter(p => p.location);
        
        if (!validProjects.length) return [];
        
        // Obtener valores según el tipo
        const values = validProjects.map(p => 
            type === 'radiation' ? (p.radiation || 0) : p.price
        );
        
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = maxValue - minValue;
        
        if (range === 0) return validProjects.map(p => ({
            location: p.location!,
            weight: 0.5
        }));
        
        return validProjects.map((project, i) => ({
            location: project.location!,
            weight: (values[i] - minValue) / range
        }));
    };

    // Función para crear el heatmap
    const createHeatmap = (data: HeatmapData[]) => {
        if (!map.value || !data.length) return;

        const weightedLocations = data.map(d => ({
            location: new google.maps.LatLng(d.location.lat, d.location.lng),
            weight: d.weight
        }));

        heatmap.value?.setMap(null); // Limpiar anterior
        
        // Gradientes para cada tipo
        const gradients = {
            price: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)'
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

    // Actualizar cuando cambien los proyectos
    watch(projects, () => {
        if (activeHeatmapType.value) {
            const data = generateHeatmapData(activeHeatmapType.value);
            createHeatmap(data);
        }
    });
    
    return { 
        toggleHeatmap,
        activeHeatmapType: computed(() => activeHeatmapType.value)
    };
}