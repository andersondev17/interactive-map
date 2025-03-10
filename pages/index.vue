<!-- pages/index.vue -->
<template>
    <div class="container mx-auto py-6 space-y-6">
        <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent animate-fade-in">
                Mapa Interactivo de Proyectos</h1>
                <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    Explora proyectos en el mapa, visualiza datos de precios y radiación solar, y analiza estadísticas.
            </p>

            
        </div>
        
        

        <Tabs default-value="map" class="w-full">
            <TabsList>
                <TabsTrigger value="map">Mapa Interactivo</TabsTrigger>
                <TabsTrigger value="about">Acerca De</TabsTrigger>
            </TabsList>

            <TabsContent value="map">
                <InteractiveMap />
            </TabsContent>

            <TabsContent value="about">
                <Card>
                    <CardHeader>
                        <CardTitle>Acerca de esta aplicación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-4">
                            <p>
                                Esta aplicación permite visualizar proyectos en un mapa interactivo, con las siguientes
                                características:
                            </p>

                            <ul class="list-disc pl-6 space-y-2">
                                <li>Visualización de heatmaps para datos de precios y radiación solar</li>
                                <li>Búsqueda de ubicaciones por coordenadas</li>
                                <li>Ajuste de radio de búsqueda para proyectos cercanos</li>
                                <li>Visualización de estadísticas de proyectos</li>
                            </ul>

                            <Alert>
                                <AlertTitle>Nota</AlertTitle>
                                <AlertDescription>
                                    Para obtener los mejores resultados, asegúrate de tener una conexión estable a
                                    internet y permitir el acceso a tu ubicación.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Card,
    CardContent,
    CardHeader, CardTitle,
    Tabs,
    TabsContent,
    TabsList, TabsTrigger
} from '@/components/ui';
import InteractiveMap from '~/components/map/InteractiveMap.vue';

// Establecer el título de la página
useHead({
    title: 'Mapa Interactivo de Proyectos',
    meta: [
        { name: 'description', content: 'Visualización de proyectos con datos de precios y radiación solar' }
    ]
});
</script>