// utils/geo.ts - álculos geográficos con Haversine
import type { Coordinates } from '~/types/map';
export const calculateHaversineDistance = (point1: Coordinates, point2: Coordinates): number => {
    const R = 6371; // Radio Tierra en km
    const dLat = toRadians(point2.lat - point1.lat);
    const dLon = toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);