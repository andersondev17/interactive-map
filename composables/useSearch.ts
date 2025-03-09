// composables/useSearch.ts
import type { Coordinates } from '~/types/map'

export default function useSearch(map: Ref<google.maps.Map | null>) {
    const searchRadius = ref(5000)
    const searchCircle = ref<google.maps.Circle | null>(null)
    const searchMarker = ref<google.maps.Marker | null>(null)
    const searchPoint = ref<Coordinates | null>(null)

    // Validar coordenadas numéricas
    const isValidCoordinate = (value: number, max: number) => 
        !isNaN(value) && Math.abs(value) <= max

    // Manejar búsqueda desde el panel
    const handleSearch = async (lat: number, lng: number) => {
        searchPoint.value = { lat, lng };
        console.log('Punto de búsqueda actualizado:', searchPoint.value); // Depuración
        if (!map.value || 
            !isValidCoordinate(lat, 90) || 
            !isValidCoordinate(lng, 180)) {
            alert('Coordenadas inválidas')
            return
        }

        searchPoint.value = { lat, lng }
        
        // Mover mapa a la ubicación
        map.value.panTo(searchPoint.value)
        map.value.setZoom(12)

        // Actualizar marcador y círculo
        updateSearchMarker(searchPoint.value)
        updateRadius(searchRadius.value)
    }

    // Actualizar marcador de búsqueda
    const updateSearchMarker = (point: Coordinates) => {
        if (!map.value) return

        searchMarker.value?.setMap(null)
        searchMarker.value = new google.maps.Marker({
            position: point,
            map: map.value,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeWeight: 2
            }
        })
    }

    // Actualizar radio del círculo
    const updateRadius = (radius: number) => {
        searchRadius.value = radius
        if (searchCircle.value) {
            searchCircle.value.setRadius(radius)
        } else if (map.value && searchPoint.value) {
            searchCircle.value = new google.maps.Circle({
                map: map.value,
                center: searchPoint.value,
                radius,
                strokeColor: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.1
            })
        }
    }

    return { 
        searchRadius, 
        searchPoint,
        handleSearch, 
        updateRadius 
    }
}