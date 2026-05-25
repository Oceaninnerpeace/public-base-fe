<script setup lang="ts">
/**
 * 微前端占位路由（实际挂载容器在 BasicLayout / EmbedLayout）
 * 保留该组件以维持路由 meta（标题、页签、isMicro）
 */
</script>

<template>
  <span class="micro-app-view-placeholder" aria-hidden="true" />
</template>

<style scoped>
.micro-app-view-placeholder {
  display: none;
}
</style>
