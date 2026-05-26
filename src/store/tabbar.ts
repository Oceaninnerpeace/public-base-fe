import type { RouteLocationNormalized } from 'vue-router';

import { findPortalAppByPath } from '@/config/portal-apps';
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
      path: '/portal',
      fullPath: '/portal',
      title: '应用中心',
      name: 'Portal',
      affix: true,
    },
  ]);
  const activeKey = ref('/portal');

  /**
   * 页签唯一键：微前端子应用按 activeRule 合并（避免 /micro/uav 与 /micro/uav/xxx 各开一个同名 Tab）
   */
  function resolveTabKey(route: RouteLocationNormalized): string {
    const app = findPortalAppByPath(route.path);
    if (app) return app.activeRule;
    return route.path;
  }

  function resolveTabTitle(route: RouteLocationNormalized): string {
    const app = findPortalAppByPath(route.path);
    if (app) return app.title;
    const { meta, name, path } = route;
    return (meta?.title as string) || String(name || path);
  }

  function addTab(route: RouteLocationNormalized) {
    const { fullPath, meta, name } = route;
    if (!route.path || route.path === '/login' || meta?.hideInMenu) return;

    const tabKey = resolveTabKey(route);
    const exists = tabs.value.find((t) => t.path === tabKey);
    if (exists) {
      exists.fullPath = fullPath;
      exists.title = resolveTabTitle(route);
      activeKey.value = tabKey;
      return;
    }

    tabs.value.push({
      path: tabKey,
      fullPath,
      title: resolveTabTitle(route),
      name: name ? String(name) : undefined,
      affix: !!meta?.affix,
    });
    activeKey.value = tabKey;
  }

  function closeTab(path: string) {
    const index = tabs.value.findIndex((t) => t.path === path);
    if (index === -1) return null;
    const tab = tabs.value[index];
    if (tab?.affix) return null;

    tabs.value.splice(index, 1);
    if (activeKey.value === path) {
      const next = tabs.value[index] ?? tabs.value[index - 1];
      return next?.fullPath ?? '/portal';
    }
    return null;
  }

  function closeOther(path: string) {
    tabs.value = tabs.value.filter((t) => t.affix || t.path === path);
    activeKey.value = path;
  }

  function closeAll() {
    tabs.value = tabs.value.filter((t) => t.affix);
    activeKey.value = tabs.value[0]?.path ?? '/portal';
    return tabs.value[0]?.fullPath ?? '/portal';
  }

  function setActive(path: string) {
    activeKey.value = path;
  }

  function reset() {
    tabs.value = [
      {
        path: '/portal',
        fullPath: '/portal',
        title: '应用中心',
        name: 'Portal',
        affix: true,
      },
    ];
    activeKey.value = '/portal';
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
