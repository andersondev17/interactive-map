import { Loader } from '@googlemaps/js-api-loader'
import { useWindowSize } from '@vueuse/core'
import type { Coordinates } from '~/types/map'

export default function useMap(container: Ref<HTMLElement | null>) {
    const map = ref<google.maps.Map | null>(null)
    const isLoading = ref(false)
    const { width } = useWindowSize()
    const isDesktop = computed(() => width.value >= 768)
    
    const loader = new Loader({
        apiKey: useRuntimeConfig().public.googleMapsApiKey,
        libraries: ['visualization']
    })
    async function initMap(center: Coordinates) {
        if (!container.value) return

        try {
            isLoading.value = true

            const { Map } = await loader.importLibrary('maps')
            map.value = new Map(container.value, {
                center,
                zoom: 6,
                gestureHandling: 'cooperative',
                keyboardShortcuts: true
            })
        } catch (error) {
            console.error('Error al cargar el mapa:', error)
            throw error // Re-lanzar el error para manejarlo en el componente
        } finally {
            isLoading.value = false
        }
    }

    return { map, isLoading, isDesktop, initMap }
}