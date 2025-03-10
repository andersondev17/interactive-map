import type { Coordinates } from '@/types/map';
export function parseCoordinates(coordStr: string): Coordinates {
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
