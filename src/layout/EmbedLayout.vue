<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { MICRO_CONTAINER_ID } from '@/micro/container';
import { useEmbedStore } from '@/store/embed';

import LayoutContent from './components/LayoutContent.vue';

const route = useRoute();
const embedStore = useEmbedStore();

const isMicroRoute = computed(() => !!route.meta.isMicro);

const style = computed(() => ({
  padding: isMicroRoute.value ? '0' : `${embedStore.contentPadding}px`,
}));

watch(isMicroRoute, (active) => {
  document.documentElement.classList.toggle('has-micro-app', active);
}, { immediate: true });
</script>

<template>
  <div class="embed-layout">
    <main class="embed-layout__content" :style="style">
      <div
        v-show="isMicroRoute"
        :id="MICRO_CONTAINER_ID"
        class="micro-app-container micro-app-container--embed"
      />
      <LayoutContent v-show="!isMicroRoute" :router-key="embedStore.contentVersion" />
      <LayoutContent
        v-show="isMicroRoute"
        :router-key="embedStore.contentVersion"
        class="micro-route-host"
      />
    </main>
  </div>
</template>

<style scoped lang="less">
.embed-layout {
  min-height: 100vh;
  background: #f4f7f9;

  &__content {
    position: relative;
    min-height: 100vh;
    overflow: auto;
  }
}

.micro-app-container {
  width: 100%;
  min-height: 100vh;

  &--embed {
    border-radius: 0;
  }
}

.micro-route-host {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}
</style>
