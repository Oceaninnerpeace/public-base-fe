import type { AppRouteRecordRaw } from '@/types/router';
import type { MenuRecord } from '@/types/router';
import { portalAppsToMenus } from '@/config/portal-apps';
import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

import { microHostRoutes } from '@/router/micro-routes';
import { portalStaticRoutes } from '@/router/portal-routes';

/**
 * 基座路由：仅门户静态页 + 微前端承载路由
 * 不做全局动态菜单、业务权限、字典加载
 */
export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<MenuRecord[]>([]);
  const routes = shallowRef<AppRouteRecordRaw[]>([]);
  const isRoutesLoaded = ref(false);

  async function buildRoutes() {
    menus.value = portalAppsToMenus();
    routes.value = [...portalStaticRoutes, ...microHostRoutes];
    isRoutesLoaded.value = true;
    return routes.value;
  }

  function reset() {
    menus.value = [];
    routes.value = [];
    isRoutesLoaded.value = false;
  }

  return {
    menus,
    routes,
    isRoutesLoaded,
    buildRoutes,
    reset,
  };
});
