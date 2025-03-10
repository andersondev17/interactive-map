// composables/useStatistics.ts
import type { Coordinates } from '~/types/map';
import type { Project, StatisticsResult } from '~/types/projects';
import { calculateHaversineDistance } from '~/utils/geo';

export default function useStatistics() {
    const calculateStatistics = (
        projects: Project[],
        center: Coordinates | null,
        radiusKm: number
    ): StatisticsResult | null => {
        if (!center || !projects.length) return null;

        const filteredProjects = projects
            .filter(project => {
                if (!project.location) return false;
                
                project.distance = calculateHaversineDistance(center, project.location);
                return project.distance <= radiusKm;
            });

        if (!filteredProjects.length) return null;

        // Extraer valores para cálculos
        const prices = filteredProjects.map(p => p.price);
        const radiations = filteredProjects.map(p => p.radiation || 0);
        const distances = filteredProjects.map(p => p.distance || 0);
        const count = filteredProjects.length;

        return {
            count,
            averagePrice: prices.reduce((sum, val) => sum + val, 0) / count,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            averageRadiation: radiations.reduce((sum, val) => sum + val, 0) / count,
            minRadiation: Math.min(...radiations),
            maxRadiation: Math.max(...radiations),
            minDistance: Math.min(...distances)
        };
    };

    return { calculateStatistics };
}