// composables/useStatistics.ts
import type { Coordinates } from '~/types/map'
import type { Project } from '~/types/projects'

export default function useStatistics() {
    // Calcular distancia entre dos puntos usando la fórmula de Haversine
    const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
        const R = 6371 // Radio de la Tierra en km
        const dLat = toRadians(point2.lat - point1.lat)
        const dLng = toRadians(point2.lng - point1.lng)

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c // Distancia en km
    }

    // Convertir grados a radianes
    const toRadians = (degrees: number): number => {
        return degrees * (Math.PI / 180)
    }

    // Filtrar proyectos dentro de un radio específico
    const filterProjectsByRadius = (
        projects: Project[],
        center: Coordinates,
        radiusKm: number
    ): Project[] => {
        return projects.filter(project => {
            const distance = calculateDistance(center, project.location)
            // Agregar la distancia como propiedad para usarla en las estadísticas
            project.distance = distance
            return distance <= radiusKm
        })
    }

    // Calcular estadísticas sobre proyectos
    const calculateStatistics = (
        projects: Project[],
        center: Coordinates | null,
        radiusKm: number
    ): StatisticsResult | null => {
        if (!center || !projects.length) {
            return null
        }

        // Filtrar proyectos dentro del radio
        const filteredProjects = filterProjectsByRadius(projects, center, radiusKm)

        if (!filteredProjects.length) {
            return null
        }

        // Calcular estadísticas
        const count = filteredProjects.length
        const prices = filteredProjects.map(p => p.price)
        const radiations = filteredProjects.map(p => p.radiation)
        const distances = filteredProjects.map(p => p.distance || 0)

        return {
            count,
            averagePrice: prices.reduce((sum, val) => sum + val, 0) / count,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            averageRadiation: radiations.reduce((sum, val) => sum + val, 0) / count,
            minRadiation: Math.min(...radiations),
            maxRadiation: Math.max(...radiations),
            minDistance: Math.min(...distances)
        }
    }

    return {
        calculateDistance,
        filterProjectsByRadius,
        calculateStatistics
    }
}

// Tipo para las estadísticas calculadas
export interface StatisticsResult {
    count: number
    averagePrice: number
    minPrice: number
    maxPrice: number
    averageRadiation: number
    minRadiation: number
    maxRadiation: number
    minDistance: number
}