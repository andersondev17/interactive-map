// types/projects.ts
export interface Project {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    price: number;
    radiation: number;
    distance?: number;
}

export interface ProjectStatistics {
    totalProjects: number;
    averagePrice: number;
    averageRadiation: number;
    minDistance: number;
    maxDistance: number;
}

// types/projects.ts
export interface ProjectLoader {
    getProjects(): Promise<Project[]>
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

