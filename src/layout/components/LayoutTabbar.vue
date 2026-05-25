<script setup lang="ts">
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useTabbarStore } from '@/store/tabbar';
import { useRouter } from 'vue-router';

const tabbarStore = useTabbarStore();
const router = useRouter();

function onChange(key: string | number) {
  const path = String(key);
  const tab = tabbarStore.tabs.find((t) => t.path === path);
  if (tab) router.push(tab.fullPath);
}

function onEdit(targetKey: string | MouseEvent | KeyboardEvent, action: 'add' | 'remove') {
  if (action !== 'remove' || typeof targetKey !== 'string') return;
  const next = tabbarStore.closeTab(targetKey);
  if (next) router.push(next);
}

function refreshCurrent() {
  const tab = tabbarStore.tabs.find((t) => t.path === tabbarStore.activeKey);
  if (tab) router.replace({ path: tab.path, query: { ...router.currentRoute.value.query, _t: Date.now() } });
}

function closeOther() {
  tabbarStore.closeOther(tabbarStore.activeKey);
}
</script>

<template>
  <div class="layout-tabbar">
    <a-tabs
      :active-key="tabbarStore.activeKey"
      type="editable-card"
      hide-add
      size="small"
      @change="onChange"
      @edit="onEdit"
    >
      <a-tab-pane
        v-for="tab in tabbarStore.tabs"
        :key="tab.path"
        :closable="!tab.affix"
      >
        <template #tab>
          <span class="layout-tabbar__label">{{ tab.title }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div class="layout-tabbar__tools">
      <a-dropdown>
        <a-button type="text" size="small">
          <CloseOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="closeOther">关闭其他</a-menu-item>
            <a-menu-item @click="router.push(tabbarStore.closeAll()!)">关闭全部</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-tooltip title="刷新当前">
        <a-button type="text" size="small" @click="refreshCurrent">
          <ReloadOutlined />
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.layout-tabbar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;
  padding: 0 8px 0 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  :deep(.ant-tabs) {
    flex: 1;
    min-width: 0;

    .ant-tabs-nav {
      margin: 0;

      &::before {
        border: none;
      }
    }

    .ant-tabs-tab {
      padding: 4px 12px !important;
      background: transparent !important;
      border: none !important;
      border-radius: 4px 4px 0 0 !important;

      &.ant-tabs-tab-active {
        background: #f4f7f9 !important;
      }
    }
  }

  &__tools {
    display: flex;
    flex-shrink: 0;
    gap: 2px;
    align-items: center;
    padding-left: 4px;
  }

  &__label {
    font-size: 13px;
  }
}
</style>
