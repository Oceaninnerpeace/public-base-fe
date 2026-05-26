<script setup lang="ts">
import { useDebounceFn } from '../../composables/useDebounceFn'

defineOptions({ name: 'PbButton' })

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
    danger?: boolean
    loading?: boolean
    disabled?: boolean
    debounce?: number
  }>(),
  {
    type: 'default',
    debounce: 0,
  },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

const debouncedClick = useDebounceFn((e: MouseEvent) => emit('click', e), props.debounce || 0)
</script>

<template>
  <a-button
    :type="type"
    :danger="danger"
    :loading="loading"
    :disabled="disabled"
    v-bind="$attrs"
    @click="debouncedClick"
  >
    <slot />
  </a-button>
</template>
