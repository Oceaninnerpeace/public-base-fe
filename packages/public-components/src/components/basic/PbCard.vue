<script setup lang="ts">
defineOptions({ name: 'PbCard' })

withDefaults(
  defineProps<{
    title?: string
    bordered?: boolean
    loading?: boolean
  }>(),
  {
    bordered: true,
    loading: false,
  },
)
</script>

<template>
  <a-card :title="title" :bordered="bordered" :loading="loading" v-bind="$attrs">
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <slot />
  </a-card>
</template>
