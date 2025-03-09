<!-- components/map/controls/SearchPanel.vue -->
<script setup lang="ts">
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui';
import { Search } from 'lucide-vue-next';

const emit = defineEmits(['search']);

const latitude = ref<string>('');
const longitude = ref<string>('');
const error = ref<string | null>(null);

// Validar coordenadas
const validateCoordinates = (): boolean => {
  error.value = null;
  
  // Verificar si los campos están vacíos
  if (!latitude.value || !longitude.value) {
    error.value = 'Por favor, ingrese ambas coordenadas';
    return false;
  }
  
  const lat = parseFloat(latitude.value);
  const lng = parseFloat(longitude.value);
  
  // Verificar si son números válidos
  if (isNaN(lat) || isNaN(lng)) {
    error.value = 'Las coordenadas deben ser valores numéricos';
    return false;
  }
  
  // Verificar rangos de latitud y longitud
  if (lat < -90 || lat > 90) {
    error.value = 'La latitud debe estar entre -90 y 90';
    return false;
  }
  
  if (lng < -180 || lng > 180) {
    error.value = 'La longitud debe estar entre -180 y 180';
    return false;
  }
  
  return true;
};

const handleSearch = () => {
  if (validateCoordinates()) {
    emit('search', parseFloat(latitude.value), parseFloat(longitude.value));
  }
};

// Limpiar error cuando se modifica alguno de los campos
watch([latitude, longitude], () => {
  error.value = null;
});
</script>

<template>
  <Card class="absolute top-4 left-4 z-10 w-72">
    <CardHeader class="pb-2">
      <CardTitle class="text-sm font-medium">Buscar por Coordenadas</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="space-y-2">
        <Label for="latitude">Latitud</Label>
        <Input id="latitude" v-model="latitude" placeholder="Ej: 6.2442" />
      </div>
      
      <div class="space-y-2">
        <Label for="longitude">Longitud</Label>
        <Input id="longitude" v-model="longitude" placeholder="Ej: -75.5812" />
      </div>
      
      <div v-if="error" class="text-sm text-red-500">
        {{ error }}
      </div>
      
      <Button class="w-full" @click="handleSearch">
        <Search class="mr-2 h-4 w-4" />
        Buscar
      </Button>
    </CardContent>
  </Card>
</template>