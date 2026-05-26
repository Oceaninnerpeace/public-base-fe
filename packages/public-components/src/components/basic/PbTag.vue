<script setup lang="ts">
defineOptions({ name: 'PbTag' })

withDefaults(
  defineProps<{
    color?: string
    closable?: boolean
  }>(),
  {
    closable: false,
  },
)

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <a-tag :color="color" :closable="closable" v-bind="$attrs" @close="emit('close')">
    <slot />
  </a-tag>
</template>
