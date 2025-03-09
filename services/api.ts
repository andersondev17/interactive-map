// services/api.ts
import type { Coordinates } from '~/types/map';
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

            // Obtener proyectos de la API
            const apiProjects = await response.json() as Project[];
            
            // Procesar cada proyecto para añadir propiedades calculadas
            return apiProjects.map((project: Project) => {
                // Parsear coordenadas
                const location = this.parseCoordinates(project.coordinates);
                
                // Parsear radiación
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
    
    // Método para parsear coordenadas
    private parseCoordinates(coordStr: string): Coordinates {
        if (!coordStr) return { lat: 0, lng: 0 };
        
        try {
            // Eliminar paréntesis y espacios
            const cleaned = coordStr.replace(/[() ]/g, '');
            const parts = cleaned.split(',');
            
            if (parts.length !== 2) return { lat: 0, lng: 0 };
            
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            
            if (isNaN(lat) || isNaN(lng)) return { lat: 0, lng: 0 };
            
            return { lat, lng };
        } catch (e) {
            console.warn(`Error parseando coordenadas:`, e);
            return { lat: 0, lng: 0 };
        }
    }
}

// Exportamos una única instancia del servicio
export const apiService = new ApiService();