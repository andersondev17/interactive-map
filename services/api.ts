// services/api.ts
import type { Project } from '~/types/projects'

class ApiService {
    private apiEndpoint: string
    private apiKey: string

    constructor() {
        const config = useRuntimeConfig()//obtener variables de entorno
        this.apiEndpoint = config.public.apiEndpoint
        this.apiKey = config.public.apiKey
    }

    // Método para obtener todos los proyectos
    async getProjects(): Promise<Project[]> {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': this.apiKey
                }
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            return data.projects || []
        } catch (error) {
            console.error('Error fetching projects:', error)
            throw error
        }
    }
}

// Exportamos una única instancia del servicio
export const apiService = new ApiService()