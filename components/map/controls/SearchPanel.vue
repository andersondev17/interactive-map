<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <Label for="latitude" class="text-sm">Latitud</Label>
        <Input
          id="latitude"
          v-model.trim="latitude"
          placeholder="Ej: 6.2442"
          autocomplete="off"
          :class="{ 'border-red-500': error }"
        />
      </div>

      <div class="space-y-2">
        <Label for="longitude" class="text-sm">Longitud</Label>
        <Input
          id="longitude"
          v-model.trim="longitude"
          placeholder="Ej: -75.5812"
          autocomplete="off"
          :class="{ 'border-red-500': error }"
        />
      </div>
    </div>

    <!-- Botones de ubicaciones predefinidas -->
    <div class="flex flex-wrap gap-2 my-2">
      <Button 
        v-for="location in predefinedLocations" 
        :key="location.name"
        variant="outline" 
        size="sm" 
        class="text-xs"
        @click="setLocation(location)"
      >
        {{ location.name }}
      </Button>
    </div>

    <div v-if="error" class="text-sm text-red-500 px-1">
      {{ error }}
    </div>

    <Button class="w-full" @click="handleSearch" :disabled="isSearching">
      <Search v-if="!isSearching" class="mr-2 h-4 w-4" />
      <span v-else class="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></span>
      {{ isSearching ? 'Buscando...' : 'Buscar' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, Input, Label } from '@/components/ui';
import { Search } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const emit = defineEmits(['search']);

const latitude = ref('');
const longitude = ref('');
const error = ref<string | null>(null);
const isSearching = ref(false);

const predefinedLocations = [
  { name: 'Medellín', lat: 6.2442, lng: -75.5812 },
  { name: 'Bogotá', lat: 4.711, lng: -74.0721 },
  { name: 'Cali', lat: 3.4516, lng: -76.532 },
  { name: 'Barranquilla', lat: 10.9685, lng: -74.7813 }
];

// 🛠 Validar coordenadas antes de buscar
const validateCoordinates = (): boolean => {
  error.value = null;
  const lat = parseFloat(latitude.value);
  const lng = parseFloat(longitude.value);

  if (!latitude.value || !longitude.value || isNaN(lat) || isNaN(lng)) {
    error.value = 'Ingrese coordenadas válidas';
    return false;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    error.value = 'Latitud entre -90 y 90, Longitud entre -180 y 180';
    return false;
  }
  return true;
};

// 🔍 Realizar la búsqueda
const handleSearch = async () => {
  if (!validateCoordinates()) return;

  isSearching.value = true;
  emit('search', parseFloat(latitude.value), parseFloat(longitude.value));

  setTimeout(() => {
    isSearching.value = false;
  }, 500);
};

// 🌍 Asignar ubicación predefinida
const setLocation = (location: { lat: number; lng: number }) => {
  latitude.value = location.lat.toString();
  longitude.value = location.lng.toString();
  error.value = null;
};

// 🛑 Limpiar errores al cambiar inputs
watch([latitude, longitude], () => {
  error.value = null;
});
</script>
