<script setup lang="ts">
defineOptions({ name: 'PbLoading' })

withDefaults(
  defineProps<{
    spinning?: boolean
    tip?: string
    fullscreen?: boolean
  }>(),
  {
    spinning: true,
    tip: '加载中...',
    fullscreen: false,
  },
)
</script>

<template>
  <a-spin :spinning="spinning" :tip="tip" :wrapper-class-name="fullscreen ? 'pb-loading--fullscreen' : undefined">
    <slot />
  </a-spin>
</template>

<style scoped>
:deep(.pb-loading--fullscreen) {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: rgb(255 255 255 / 65%);
}
</style>
