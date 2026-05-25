<script setup lang="ts">
import { RouterView } from 'vue-router';

defineProps<{
  routerKey?: number;
}>();
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <transition name="fade-slide" mode="out-in">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component" :key="`${route.fullPath}-${routerKey ?? 0}`" />
      </keep-alive>
      <component :is="Component" v-else :key="`${route.fullPath}-${routerKey ?? 0}`" />
    </transition>
  </RouterView>
</template>

<style scoped lang="less">
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
