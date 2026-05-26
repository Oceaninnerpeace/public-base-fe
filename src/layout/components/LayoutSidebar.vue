<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';

import { useLayoutStore } from '@/store/layout';

import { useLayoutMenu } from '../hooks/useLayoutMenu';
import { useMixedMenu } from '../hooks/useMixedMenu';
import LayoutLogo from './LayoutLogo.vue';
import LayoutMixedMenu from './LayoutMixedMenu.vue';
import LayoutSubMenu from './LayoutSubMenu.vue';

const layoutStore = useLayoutStore();
const classic = useLayoutMenu();
const mixed = useMixedMenu();

const selectedKeys = computed(() => [mixed.sidebarActive.value]);

const subMenuTitle = computed(() => {
  const root = mixed.allMenus.value.find((m) => m.path === mixed.rootMenuPath.value);
  return root?.title ?? root?.name ?? '';
});

function onClassicClick({ key }: { key: string }) {
  classic.onMenuClick({ key });
}
</script>

<template>
  <!-- 经典单栏侧栏 -->
  <aside
    v-if="layoutStore.isSidebarNav"
    class="layout-sidebar"
    :class="{ 'layout-sidebar--collapsed': layoutStore.collapsed }"
    :style="{ width: `${layoutStore.sidebarWidth}px` }"
  >
    <LayoutLogo theme="dark" />
    <div class="layout-sidebar__menu">
      <a-menu
        v-model:open-keys="classic.openKeys.value"
        theme="dark"
        mode="inline"
        :inline-collapsed="layoutStore.collapsed"
        :selected-keys="classic.selectedKeys.value"
        :items="classic.menuItems.value"
        @click="onClassicClick"
      />
    </div>
    <div class="layout-sidebar__footer">
      <a-tooltip :title="layoutStore.collapsed ? '展开菜单' : '收起菜单'" placement="right">
        <button type="button" class="layout-sidebar__collapse" @click="layoutStore.toggleCollapsed()">
          <MenuUnfoldOutlined v-if="layoutStore.collapsed" />
          <MenuFoldOutlined v-else />
        </button>
      </a-tooltip>
    </div>
  </aside>

  <!-- 双列侧栏：左根菜单 + 右子菜单 -->
  <aside
    v-else-if="layoutStore.isSidebarMixedNav"
    class="layout-sidebar layout-sidebar--mixed"
    :style="{ width: `${layoutStore.sidebarWidth}px` }"
  >
    <LayoutLogo theme="dark" class="layout-sidebar__logo-full" />
    <div class="layout-sidebar__mixed-body">
      <LayoutMixedMenu
        :menus="mixed.rootMenus.value"
        :active-path="mixed.headerActive.value"
        @select="mixed.handleRootSelect"
      />
      <LayoutSubMenu
        v-if="mixed.subMenuVisible.value"
        :menus="mixed.sidebarMenus.value"
        :selected-keys="selectedKeys"
        :title="subMenuTitle"
        @select="mixed.handleSubSelect"
      />
    </div>
  </aside>

  <!-- 混合菜单：仅子菜单侧栏 -->
  <aside
    v-else-if="layoutStore.isHeaderMixedNav && mixed.subMenuVisible.value"
    class="layout-sidebar layout-sidebar--sub-only"
    :style="{ width: `${layoutStore.sidebarWidth}px` }"
  >
    <LayoutSubMenu
      :menus="mixed.sidebarMenus.value"
      :selected-keys="selectedKeys"
      :title="subMenuTitle"
      @select="mixed.handleSubSelect"
    />
  </aside>
</template>

<style scoped lang="less">
.layout-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #001529;
  box-shadow: 2px 0 8px rgb(0 0 0 / 8%);
  transition: width 0.2s;

  &--mixed {
    background: #001529;
  }

  &--sub-only {
    background: #000c17;
  }

  &__logo-full {
    flex-shrink: 0;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  &__mixed-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__menu {
    flex: 1;
    overflow: hidden auto;

    :deep(.ant-menu) {
      border-inline-end: none !important;
    }
  }

  &__footer {
    flex-shrink: 0;
    padding: 8px 0 12px;
    border-top: 1px solid rgb(255 255 255 / 8%);
  }

  &__collapse {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    color: rgb(255 255 255 / 65%);
    font-size: 16px;
    cursor: pointer;
    background: transparent;
    border: none;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }

  &--collapsed &__menu {
    padding: 4px 6px;

    :deep(.ant-menu-inline-collapsed) {
      width: 100% !important;
      background: transparent !important;
    }

    :deep(.ant-menu-title-content) {
      display: none !important;
      width: 0 !important;
      max-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
    }

    :deep(.ant-menu-item),
    :deep(.ant-menu-submenu-title) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px !important;
      height: 36px !important;
      padding-inline: 0 !important;
      margin: 4px auto !important;
      line-height: 36px !important;
      color: #fff;
      background: transparent !important;
      border-radius: 8px;
    }

    :deep(.ant-menu-item .anticon),
    :deep(.ant-menu-submenu-title .anticon),
    :deep(.ant-menu-item-icon) {
      margin-inline-end: 0 !important;
      color: #fff !important;
      font-size: 18px;
      line-height: 1;
    }

    :deep(.ant-menu-item svg) {
      fill: currentColor;
    }

    :deep(.ant-menu-item-selected) {
      color: #fff !important;
      background: @primary-color !important;
    }

    :deep(.ant-menu-item-selected .anticon),
    :deep(.ant-menu-item-selected .ant-menu-item-icon) {
      color: #fff !important;
    }

    :deep(.ant-menu-item-selected::after) {
      display: none;
    }

    :deep(.ant-menu-item:not(.ant-menu-item-selected):hover),
    :deep(.ant-menu-submenu-title:hover) {
      color: #fff !important;
      background: rgb(255 255 255 / 8%) !important;
    }

    :deep(.ant-menu-item:not(.ant-menu-item-selected):hover .anticon) {
      color: #fff !important;
    }
  }

  &--collapsed &__footer &__collapse {
    color: #fff;
  }

  &--collapsed &__footer {
    padding-inline: 6px;
  }
}
</style>
