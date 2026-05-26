<script setup lang="ts">
defineOptions({ name: 'PbEmpty' })

withDefaults(
  defineProps<{
    description?: string
    image?: 'default' | 'simple' | undefined
  }>(),
  {
    description: '暂无数据',
  },
)
</script>

<template>
  <a-empty :description="description" :image="image" v-bind="$attrs">
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="$slots.default">
      <slot />
    </template>
  </a-empty>
</template>
