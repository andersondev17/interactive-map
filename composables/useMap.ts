// composables/useMap.ts
import { Loader } from '@googlemaps/js-api-loader'
import type { Coordinates } from '~/types/map'
export default function useMap(container: Ref<HTMLElement | null>) {
    const map = ref<google.maps.Map | null>(null)
    const isLoading = ref(false)

    async function initMap(center: Coordinates) {
        if (!container.value) return

        try {
            isLoading.value = true
            const loader = new Loader({
                apiKey: useRuntimeConfig().public.googleMapsApiKey,
                libraries: ['visualization']
            })

            const { Map } = await loader.importLibrary('maps')
            map.value = new Map(container.value, {
                center,
                zoom: 6,
            })
        } finally {
            isLoading.value = false
        }
    }

    return { map, isLoading, initMap }
}