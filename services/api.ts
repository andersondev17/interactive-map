// services/api.ts
import { parseCoordinates } from '@/utils/parseCoordinates';
import type { Project, ProjectLoader } from '~/types/projects';

class ApiService implements ProjectLoader {
    private apiEndpoint: string;
    private apiKey: string;
    constructor() {
        const config = useRuntimeConfig();
        this.apiEndpoint = config.public.apiEndpoint;
        this.apiKey = config.public.apiKey;
    }

    // Método para obtener todos los proyectos
    async getProjects(): Promise<Project[]> {

        try {
            const response = await fetch(`${this.apiEndpoint}`, {
                method: 'GET',
                headers: {
                    'x-api-key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const apiProjects = await response.json() as Project[];

            // Procesar cada proyecto para añadir propiedades calculadas
            return apiProjects.map((project: Project) => {
                const location = parseCoordinates(project.coordinates);

                const radiation = parseFloat(project.solargis) || 0;

                return {
                    ...project,
                    location,
                    radiation
                };
            });
        } catch (error) {
            console.error('Error obteniendo proyectos:', error);
            return [];
        }
    }
}
export const apiService = new ApiService();