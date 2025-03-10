// types/map.ts
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface HeatmapData {
    location: Coordinates;
    weight: number;
}
export interface MapConfig {
    // Add properties to the MapConfig interface as needed
    apiKey: string;
    center: Coordinates;
    zoom: number;
}

export interface MapProvider {
    init(container: HTMLElement, config: MapConfig): Promise<void>
    panTo(coords: Coordinates): void
}

export interface HeatmapProvider {
    createLayer(data: HeatmapData[]): void
}

export type HeatmapType = 'price' | 'radiation' | null;
export type HeatmapConfig = {
    radius: number;
    opacity: number;
    dissipating: boolean;
    maxIntensity?: number;
    gradient: string[];
};