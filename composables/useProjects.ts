// composables/useProjects.ts
import type { Coordinates } from '~/types/map';
import type { Project, ProjectLoader } from '~/types/projects';

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
            
            if (apiProjects && apiProjects.length > 0) {
                projects.value = apiProjects;
            } else {
                console.warn("No se pudieron cargar los proyectos");
                projects.value = [];
            }
            
            if (map?.value && showProjectsOnMap.value) {
                showMarkers();
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

        if (visible && map?.value) {
            showMarkers();
        } else {
            clearMarkers();
        }
    }

    // Mostrar marcadores en el mapa
    function showMarkers() {
        if (!map?.value || !projects.value.length) return;

        // Limpiar marcadores existentes
        clearMarkers();

        // Crear nuevos marcadores para cada proyecto
        projects.value.forEach(project => {
            if (!project.location) return;
            
            const marker = new google.maps.Marker({
                position: project.location,
                map: map.value,
                title: project.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: '#9c27b0', // Color púrpura
                    fillOpacity: 0.8,
                    strokeWeight: 1,
                    strokeColor: '#FFFFFF'
                }
            });

            // Crear ventana de información con datos seguros
            const radiation = typeof project.radiation === 'number' 
                ? project.radiation.toFixed(2) 
                : project.solargis || 'N/A';
                
            const price = typeof project.price === 'number'
                ? project.price.toLocaleString()
                : 'N/A';
                
            const distance = project.distance && typeof project.distance === 'number'
                ? project.distance.toFixed(2)
                : null;
                
            const agreement = project.agreement || 'N/A';

            // Crear ventana de información con estilos mejorados
            const infoContent = `
                <div style="font-family: 'Inter', sans-serif; padding: 8px; max-width: 280px;">
                    <h3 style="margin-top: 0; font-weight: 600; font-size: 16px; color: #1a1a1a;">${project.name}</h3>
                    <div style="margin-top: 8px; display: flex; justify-content: space-between;">
                        <span style="font-weight: 500; color: #555;">Precio:</span>
                        <span style="font-weight: 400;">${price} COP</span>
                    </div>
                    <div style="margin-top: 4px; display: flex; justify-content: space-between;">
                        <span style="font-weight: 500; color: #555;">Radiación:</span>
                        <span style="font-weight: 400;">${radiation} kWh/kWp</span>
                    </div>
                    <div style="margin-top: 4px; display: flex; justify-content: space-between;">
                        <span style="font-weight: 500; color: #555;">Acuerdo:</span>
                        <span style="font-weight: 400;">${agreement}</span>
                    </div>
                    ${distance ? `
                    <div style="margin-top: 4px; display: flex; justify-content: space-between;">
                        <span style="font-weight: 500; color: #555;">Distancia:</span>
                        <span style="font-weight: 400;">${distance} km</span>
                    </div>
                    ` : ''}
                </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                pixelOffset: new google.maps.Size(0, -5)
            });

            // Agregar evento de clic para mostrar la ventana de información
            marker.addListener('click', () => {
                // Cerrar todas las ventanas de información abiertas primero
                infoWindows.value.forEach(window => window.close());

                // Abrir esta ventana de información
                infoWindow.open(map.value, marker);
            });

            // Guardar referencias
            markers.value.push(marker);
            infoWindows.value.push(infoWindow);
        });
    }

    // Filtrar proyectos por radio desde un punto central
    function getProjectsInRadius(center: Coordinates, radiusKm: number): Project[] {
        if (!projects.value.length) return [];

        return projects.value.filter(project => {
            if (!project.location) return false;
            
            // Calcular distancia utilizando la fórmula de Haversine
            const distance = calculateDistance(center, project.location);

            // Actualizar la propiedad distance del proyecto
            project.distance = distance;

            // Devolver solo los proyectos dentro del radio especificado
            return distance <= radiusKm;
        });
    }

    // Calcular distancia entre dos puntos utilizando la fórmula de Haversine
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

    // Convertir grados a radianes
    function toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    // Limpiar marcadores
    function clearMarkers() {
        markers.value.forEach(marker => marker.setMap(null));
        markers.value = [];
        infoWindows.value = [];
    }

    // Si el mapa cambia y hay proyectos, actualizar marcadores
    if (map) {
        watch(map, (newMap) => {
            if (newMap && projects.value.length > 0 && showProjectsOnMap.value) {
                showMarkers();
            }
        });
    }

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