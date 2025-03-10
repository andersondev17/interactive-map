// composables/useProjects.ts
import { onUnmounted, ref, watch } from 'vue';
import type { Coordinates } from '~/types/map';
import type { Project, ProjectLoader } from '~/types/projects';
import { calculateHaversineDistance } from '~/utils/geo';

export default function useProjects(
    loader: ProjectLoader,
    map?: Ref<google.maps.Map | null>
) {
    const projects = ref<Project[]>([]);
    const markers = ref<google.maps.Marker[]>([]);
    const infoWindows = ref<google.maps.InfoWindow[]>([]);
    const isLoading = ref(false);
    const showProjectsOnMap = ref(true);


    // Cargar proyectos desde la API
    async function load() {
        isLoading.value = true;
        try {
            const apiProjects = await loader.getProjects();

            if (apiProjects?.length) {
                projects.value = apiProjects;

                if (map?.value && showProjectsOnMap.value) {
                    showMarkers();
                }
            } else {
                console.warn("No se pudieron cargar los proyectos");
                projects.value = [];
            }

            return projects.value;
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            projects.value = [];
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    // Alternar visualización de marcadores
    function toggleProjectsVisibility(visible: boolean) {
        showProjectsOnMap.value = visible;
        visible && map?.value ? showMarkers() : clearMarkers();
    }

    // Mostrar marcadores en el mapa
    function showMarkers() {
        if (!map?.value || !projects.value.length) return;

        clearMarkers();

            const projectIcon = {
                url: '/images/solar-panel-icon.svg', // Ruta relativa a la carpeta public
                scaledSize: new google.maps.Size(18, 20), // Ajusta el tamaño según necesites
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 24    ) // Punto de anclaje en el centro
            };

        // Usar fragmento de documento para mejor rendimiento
        const batch = projects.value.filter(p => 
            p.location && 
            (p.location.lat !== 0 || p.location.lng !== 0)
          );

        batch.forEach(project => {
            if (!project.location) return;

            const marker = new google.maps.Marker({
                position: project.location,
                map: map.value,
                title: project.name,
                icon: projectIcon,
                optimized: true
            });

            // Contenido simplificado para InfoWindow
            const infoContent = `
                <div style="padding:8px; max-width:250px">
                    <h3 style="margin:0 0 8px; font-size:16px">${project.name}</h3>
                    <div>Precio: ${typeof project.price === 'number' ? project.price.toLocaleString() : 'N/A'} COP</div>
                    <div>Radiación: ${project.radiation?.toFixed(2) || project.solargis || 'N/A'}</div>
                    ${project.distance ? `<div>Distancia: ${project.distance.toFixed(2)} km</div>` : ''}
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                disableAutoPan: true // Mejora performance
            });

            marker.addListener('click', () => {
                infoWindows.value.forEach(window => window.close());
                infoWindow.open(map.value, marker);
            });

            markers.value.push(marker);
            infoWindows.value.push(infoWindow);
        });
    }

    // Filtrar proyectos por radio
    function getProjectsInRadius(center: Coordinates, radiusKm: number): Project[] {
        if (!projects.value.length) return [];

        return projects.value.filter(project => {
            if (!project.location) return false;

            const distance = calculateHaversineDistance(center, project.location);
            project.distance = distance;
            return distance <= radiusKm;
        }).sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Ordenar por distancia
    }

    // Limpiar marcadores
    function clearMarkers() {
        markers.value.forEach(marker => {
            google.maps.event.clearInstanceListeners(marker);
            marker.setMap(null);
        });

        infoWindows.value.forEach(window => window.close());
        markers.value = [];
        infoWindows.value = [];
    }

    // Actualizar marcadores cuando cambia el mapa
    if (map) {
        watch(map, (newMap) => {
            if (newMap && projects.value.length > 0 && showProjectsOnMap.value) {
                showMarkers();
            }
        });
    }

    // Limpiar recursos al desmontar
    onUnmounted(clearMarkers);

    return {
        projects,
        load,
        showMarkers,
        clearMarkers,
        toggleProjectsVisibility,
        showProjectsOnMap,
        getProjectsInRadius,
        isLoading
    };
}