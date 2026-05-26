<script setup lang="ts">
defineOptions({ name: 'PbBadge' })

withDefaults(
  defineProps<{
    count?: number
    dot?: boolean
    overflowCount?: number
    showZero?: boolean
  }>(),
  {
    overflowCount: 99,
    showZero: false,
    dot: false,
  },
)
</script>

<template>
  <a-badge
    :count="count"
    :dot="dot"
    :overflow-count="overflowCount"
    :show-zero="showZero"
    v-bind="$attrs"
  >
    <slot />
  </a-badge>
</template>
