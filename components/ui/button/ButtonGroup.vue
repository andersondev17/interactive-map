<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    /**
     * Variante del grupo de botones
     * @default "default"
     */
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';

    /**
     * Tamaño del grupo de botones
     * @default "default"
     */
    size?: 'default' | 'sm' | 'lg' | 'xs';

    /**
     * Clases adicionales para el grupo de botones
     */
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'default',
});

const groupClasses = computed(() => [
    'inline-flex items-center rounded-md',
    props.class,
]);
</script>

<template>
    <div :class="groupClasses">
        <slot />
    </div>
</template>

<style scoped>
/* Estilos para unir los botones visualmente */
:deep(button) {
    margin-right: -1px;
    z-index: 0;
}

:deep(button:hover) {
    z-index: 1;
}

:deep(button:focus-visible) {
    z-index: 2;
}

:deep(button:first-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

:deep(button:last-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-right: 0;
}

:deep(button:not(:first-child):not(:last-child)) {
    border-radius: 0;
}
</style>