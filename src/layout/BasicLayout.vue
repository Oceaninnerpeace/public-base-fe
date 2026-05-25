<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { MICRO_CONTAINER_ID } from '@/micro/container';
import { useEmbedStore } from '@/store/embed';
import { useLayoutStore } from '@/store/layout';

import LayoutContent from './components/LayoutContent.vue';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutSidebar from './components/LayoutSidebar.vue';
import LayoutTabbar from './components/LayoutTabbar.vue';
import EmbedLayout from './EmbedLayout.vue';

const route = useRoute();
const layoutStore = useLayoutStore();
const embedStore = useEmbedStore();
const routerKey = ref(0);

const isMicroRoute = computed(() => !!route.meta.isMicro);

const mainStyle = computed(() => ({
  marginLeft: isMicroRoute.value ? '0' : `${layoutStore.sidebarWidth}px`,
  transition: 'margin-left 0.2s',
}));

function refreshView() {
  routerKey.value += 1;
}

watch(isMicroRoute, (active) => {
  document.documentElement.classList.toggle('has-micro-app', active);
});

onMounted(() => {
  if (layoutStore.isSidebarNav && layoutStore.collapsed) {
    layoutStore.setCollapsed(true);
  }
  document.documentElement.classList.toggle('has-micro-app', isMicroRoute.value);
});
</script>

<template>
  <EmbedLayout v-if="embedStore.isEmbed" />

  <div v-else class="admin-layout" :class="{ 'admin-layout--micro': isMicroRoute }">
    <LayoutSidebar v-if="!isMicroRoute" />
    <div class="admin-layout__main" :style="mainStyle">
      <LayoutHeader @refresh="refreshView" />
      <LayoutTabbar v-if="!isMicroRoute" />
      <main class="admin-layout__content" :class="{ 'admin-layout__content--micro': isMicroRoute }">
        <!-- 容器须在 Qiankun 加载前存在于 DOM，故放在布局层而非异步子路由内 -->
        <div
          v-show="isMicroRoute"
          :id="MICRO_CONTAINER_ID"
          class="micro-app-container"
        />
        <LayoutContent v-show="!isMicroRoute" :router-key="routerKey" />
        <LayoutContent v-show="isMicroRoute" :router-key="routerKey" class="micro-route-host" />
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
.admin-layout {
  min-height: 100vh;
  background: #f4f7f9;

  &--micro {
    .micro-app-container {
      min-height: calc(100vh - 50px);
      border-radius: 0;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  &__content {
    position: relative;
    flex: 1;
    min-height: 0;
    padding: 16px;
    overflow: auto;

    &--micro {
      padding: 0;
      overflow: hidden;
      background: transparent;
    }
  }
}

.micro-app-container {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: calc(100vh - 50px - 40px);
  overflow: auto;
  background: #fff;
  border-radius: 8px;
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
