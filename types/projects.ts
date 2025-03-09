import type { Coordinates } from "./map";

// types/projects.tsimport type { Coordinates } from "./map"

export interface Project {
    id: number | string;
    name: string;
    coordinates: string;     // Como viene en la API
    solargis: string;        // Valor de radiación solar
    agreement: string;       // Tipo de acuerdo
    price: number;
    // Propiedades calculadas que agregaremos
    location?: Coordinates;  // Coordenadas parseadas
    radiation?: number;      // Valor numérico de solargis
    distance?: number;       // Distancia calculada para búsquedas
}

export interface ProjectLoader {
    getProjects(): Promise<Project[]>;
}
export interface ProjectStatistics {
    totalProjects: number;
    averagePrice: number;
    averageRadiation: number;
    minDistance: number;
    maxDistance: number;
}

export interface ProjectStatisticsCalculator {
    calculate(projects: Project[]): ProjectStatistics
}
export interface StatisticsProps {
    stats: {
        count: number;
        averagePrice: number;
        averageRadiation: number;
        minDistance: number;
        maxPrice: number;
        minPrice: number;
        maxRadiation: number;
        minRadiation: number;
    } | null;
}

