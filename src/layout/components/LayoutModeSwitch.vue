<script setup lang="ts">
import { AppstoreOutlined } from '@ant-design/icons-vue';
import type { LayoutMode } from '@/store/layout';
import { useLayoutStore } from '@/store/layout';

const layoutStore = useLayoutStore();

const options: { key: LayoutMode; label: string }[] = [
  { key: 'sidebar-nav', label: '经典侧栏' },
  { key: 'sidebar-mixed-nav', label: '双列侧栏' },
  { key: 'header-mixed-nav', label: '混合菜单' },
];
</script>

<template>
  <a-dropdown>
    <a-button type="text" class="layout-mode-switch">
      <AppstoreOutlined />
      布局
    </a-button>
    <template #overlay>
      <a-menu
        :selected-keys="[layoutStore.layoutMode]"
        @click="({ key }) => layoutStore.setLayoutMode(key as LayoutMode)"
      >
        <a-menu-item v-for="opt in options" :key="opt.key">
          {{ opt.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped lang="less">
.layout-mode-switch {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
}
</style>
