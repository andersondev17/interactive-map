<!-- app.vue -->
<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <div class="container mx-auto py-4 px-6">
        <h1 class="text-2xl font-bold">Mapa Interactivo de Proyectos</h1>
      </div>
    </header>
    
    <main>
      <NuxtPage />
    </main>
    
    <footer class="border-t mt-8">
      <div class="container mx-auto p-6 text-center text-sm text-muted-foreground">
        <p>Prueba Técnica - Mapa Interactivo con Nuxt 3 y Vue 3</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Todo el contenido principal se gestiona a través de NuxtPage (pages/index.vue)
</script>