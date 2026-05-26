<script setup lang="ts">
defineOptions({ name: 'PbDivider' })

withDefaults(
  defineProps<{
    orientation?: 'left' | 'right' | 'center'
    dashed?: boolean
    plain?: boolean
  }>(),
  {
    orientation: 'center',
    dashed: false,
    plain: false,
  },
)
</script>

<template>
  <a-divider :orientation="orientation" :dashed="dashed" :plain="plain" v-bind="$attrs">
    <slot />
  </a-divider>
</template>
