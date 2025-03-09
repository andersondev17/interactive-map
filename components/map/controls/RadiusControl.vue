<!-- components/map/controls/RadiusControl.vue -->
<script setup lang="ts">
import { Card, CardContent, Label, Slider } from '@/components/ui';

interface Props {
  radius: number; // Radio en km
}

const props = defineProps<Props>();
const emit = defineEmits(['update:radius']);

// Crear ref local que refleje el valor de la prop, pero como array para el Slider
const localRadius = ref([props.radius]);

// Observar cambios en la prop
watch(() => props.radius, (newValue) => {
  localRadius.value = [newValue];
});

// Manejar cambios del slider (que devuelve un array)
const onChange = (values: number[] | undefined) => {
  if (values && values.length > 0) {
    emit('update:radius', values[0]);
  }
};
</script>

<template>
  <Card class="absolute bottom-4 right-4 z-10 w-72">
    <CardContent class="py-3 px-4">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label>Radio de distancia (km)</Label>
          <span class="text-sm font-medium">{{ localRadius[0].toFixed(1) }}</span>
        </div>
        <Slider 
          :model-value="localRadius" 
          :min="1" 
          :max="50" 
          :step="0.5"
          @update:model-value="onChange" 
          class="mt-2"
        />
      </div>
    </CardContent>
  </Card>
</template>