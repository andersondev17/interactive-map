import type { Coordinates } from '~/types/map'

export default function useSearch(map: Ref<google.maps.Map | null>) {
    const searchRadius = ref(5000)
    const searchCircle = ref<google.maps.Circle | null>(null)
    const searchMarker = ref<google.maps.Marker | null>(null)
    const searchPoint = ref<Coordinates | null>(null)

    // Manejar búsqueda desde el panel
    const handleSearch = (lat: number, lng: number) => {
        if (!map.value || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
            alert('Coordenadas inválidas')
            return
        }

        searchPoint.value = { lat, lng }

        map.value.panTo(searchPoint.value)
        map.value.setZoom(12)

        clearMapElements()

        // Crear nuevo marcador
        searchMarker.value = new google.maps.Marker({
            position: searchPoint.value,
            map: map.value,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeWeight: 2
            }
        })

        updateRadius(searchRadius.value)
    }

    const clearMapElements = () => {
        if (searchMarker.value) {
            searchMarker.value.setMap(null)
            searchMarker.value = null
        }
        if (searchCircle.value) {
            searchCircle.value.setMap(null)
            searchCircle.value = null
        }
    }

    const updateRadius = (radius: number) => {
        searchRadius.value = radius

        if (!map.value || !searchPoint.value) return

        // Eliminar círculo anterior antes de crear uno nuevo
        if (searchCircle.value) {
            searchCircle.value.setMap(null)
        }

        searchCircle.value = new google.maps.Circle({
            map: map.value,
            center: searchPoint.value,
            radius,
            strokeColor: '#4285F4',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#4285F4',
            fillOpacity: 0.1
        })
    }

    return { searchRadius, searchPoint, handleSearch, updateRadius }
}
