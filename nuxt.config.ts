import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  // Módulos
  modules: [
    ['@nuxtjs/tailwindcss', {
      cssPath: '~/assets/css/tailwind.css',
      configPath: '~/tailwind.config.js',
    }],
    'shadcn-nuxt',
  ],

  // Rutas de CSS
  css: ['~/assets/css/tailwind.css'],

  // Configuración de la renderización del lado del servidor (SSR)
  // Para deshabilitar SSR en Google Maps
  ssr: false,

  // Configuración de variables de entorno y otras configuraciones
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'default-key',  // Variable de entorno
      apiEndpoint: process.env.API_ENDPOINT || 'https://default-api-endpoint', // API endpoint por defecto
      apiKey: process.env.API_KEY || 'default-api-key', // Otra clave API
    }
  },

  compatibilityDate: '2025-03-08',
})