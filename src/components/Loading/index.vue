<script setup lang="ts">
withDefaults(
  defineProps<{
    spinning?: boolean;
    tip?: string;
    minHeight?: string;
  }>(),
  {
    spinning: false,
    tip: '加载中...',
    minHeight: '120px',
  },
);
</script>

<template>
  <a-spin :spinning="spinning" :tip="tip">
    <div class="app-loading" :style="{ minHeight }">
      <slot />
    </div>
  </a-spin>
</template>

<style scoped lang="less">
.app-loading {
  width: 100%;
}
</style>
