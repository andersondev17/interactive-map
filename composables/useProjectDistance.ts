// composables/useProjectDistance.ts - Lógica especializada
import type { Coordinates } from "~/types/map";
import type { Project } from "~/types/projects";
import { calculateHaversineDistance } from "~/utils/geo";
export const useProjectDistance = (searchPoint: Ref<Coordinates | null>) => {
    const calculateProjectDistances = (projects: Project[]) => {
        return projects.map(project => ({
            ...project,
            distance: searchPoint.value && project.location ?
                calculateHaversineDistance(searchPoint.value, project.location) : null
        }));
    };

    return { calculateProjectDistances };
};