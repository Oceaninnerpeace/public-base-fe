import type { RouteLocationNormalized } from 'vue-router';

import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface TabItem {
  path: string;
  fullPath: string;
  title: string;
  name?: string;
  affix?: boolean;
}

export const useTabbarStore = defineStore('tabbar', () => {
  const tabs = ref<TabItem[]>([
    {
      path: '/dashboard',
      fullPath: '/dashboard',
      title: '工作台',
      name: 'Dashboard',
      affix: true,
    },
  ]);
  const activeKey = ref('/dashboard');

  function addTab(route: RouteLocationNormalized) {
    const { path, fullPath, meta, name } = route;
    if (!path || path === '/login' || meta?.hideInMenu) return;

    const exists = tabs.value.find((t) => t.path === path);
    if (exists) {
      activeKey.value = path;
      return;
    }

    tabs.value.push({
      path,
      fullPath,
      title: (meta?.title as string) || String(name || path),
      name: name ? String(name) : undefined,
      affix: !!meta?.affix,
    });
    activeKey.value = path;
  }

  function closeTab(path: string) {
    const index = tabs.value.findIndex((t) => t.path === path);
    if (index === -1) return null;
    const tab = tabs.value[index];
    if (tab?.affix) return null;

    tabs.value.splice(index, 1);
    if (activeKey.value === path) {
      const next = tabs.value[index] ?? tabs.value[index - 1];
      return next?.fullPath ?? '/dashboard';
    }
    return null;
  }

  function closeOther(path: string) {
    tabs.value = tabs.value.filter((t) => t.affix || t.path === path);
    activeKey.value = path;
  }

  function closeAll() {
    tabs.value = tabs.value.filter((t) => t.affix);
    activeKey.value = tabs.value[0]?.path ?? '/dashboard';
    return tabs.value[0]?.fullPath ?? '/dashboard';
  }

  function setActive(path: string) {
    activeKey.value = path;
  }

  function reset() {
    tabs.value = [
      {
        path: '/dashboard',
        fullPath: '/dashboard',
        title: '工作台',
        name: 'Dashboard',
        affix: true,
      },
    ];
    activeKey.value = '/dashboard';
  }

  return {
    tabs,
    activeKey,
    addTab,
    closeTab,
    closeOther,
    closeAll,
    setActive,
    reset,
  };
});
