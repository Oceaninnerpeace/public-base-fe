<script setup lang="ts">
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import { useFullscreen } from '@vueuse/core';

import { appEnv } from '@/config';

import LayoutAppSwitcher from './LayoutAppSwitcher.vue';
import LayoutBreadcrumb from './LayoutBreadcrumb.vue';
import LayoutModeSwitch from './LayoutModeSwitch.vue';

const emit = defineEmits<{ refresh: [] }>();

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
</script>

<template>
  <header class="layout-header">
    <div class="layout-header__left">
      <div class="layout-header__brand">
        <span class="layout-header__brand-icon">P</span>
        <span class="layout-header__brand-text">{{ appEnv.title }}</span>
      </div>
      <LayoutAppSwitcher />
      <LayoutBreadcrumb class="layout-header__breadcrumb" />
    </div>
    <div class="layout-header__right">
      <LayoutModeSwitch />
      <a-tooltip title="刷新当前容器">
        <a-button type="text" class="layout-header__btn" @click="emit('refresh')">
          <ReloadOutlined />
        </a-button>
      </a-tooltip>
      <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏'">
        <a-button type="text" class="layout-header__btn" @click="toggleFullscreen">
          <FullscreenExitOutlined v-if="isFullscreen" />
          <FullscreenOutlined v-else />
        </a-button>
      </a-tooltip>
    </div>
  </header>
</template>

<style scoped lang="less">
.layout-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  &__left {
    display: flex;
    flex: 1;
    gap: 12px;
    align-items: center;
    min-width: 0;
  }

  &__brand {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    align-items: center;
  }

  &__brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: #fff;
    font-weight: 700;
    background: @primary-color;
    border-radius: 6px;
  }

  &__brand-text {
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
  }

  &__breadcrumb {
    flex-shrink: 0;
    margin-left: 4px;
  }

  &__right {
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    align-items: center;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
