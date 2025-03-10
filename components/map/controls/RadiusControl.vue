
<script setup lang="ts">
import { Button, ButtonGroup } from '@/components/ui';

interface Props {
  radius: number; // Radio en km
}

const props = defineProps<Props>();
const emit = defineEmits(['update:radius']);

// Crear ref local que refleje el valor de la prop como array para el Slider
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

// Función para establecer el radio usando los botones predefinidos
const setRadius = (value: number) => {
  localRadius.value = [value];
  emit('update:radius', value);
};
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">{{ localRadius[0].toFixed(1) }} km</div>
      <ButtonGroup class="hidden md:flex gap-1">
        <Button 
          size="xs" 
          variant="outline" 
          class="px-2 h-7"
          @click="setRadius(5)" 
          :class="localRadius[0] === 5 ? 'bg-primary/10' : ''"
        >5km</Button>
        <Button 
          size="xs" 
          variant="outline" 
          class="px-2 h-7"
          @click="setRadius(10)" 
          :class="localRadius[0] === 10 ? 'bg-primary/10' : ''"
        >10km</Button>
        <Button 
          size="xs" 
          variant="outline" 
          class="px-2 h-7"
          @click="setRadius(25)" 
          :class="localRadius[0] === 25 ? 'bg-primary/10' : ''"
        >25km</Button>
        <Button 
          size="xs" 
          variant="outline" 
          class="px-2 h-7"
          @click="setRadius(50)" 
          :class="localRadius[0] === 50 ? 'bg-primary/10' : ''"
        >50km</Button>
      </ButtonGroup>
    </div>
   
    <div class="flex justify-between text-xs text-muted-foreground pt-1">
      <span>1km</span>
      <span>50km</span>
    </div>
  </div>
</template>
