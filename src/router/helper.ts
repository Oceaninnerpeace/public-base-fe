import type { AppRouteRecordRaw } from '@/types/router';
import type { MenuRecord } from '@/types/router';

const viewModules = import.meta.glob('@/views/**/*.vue');

function resolveComponent(component?: string) {
  if (!component) return undefined;
  const path = `/src/views${component}.vue`;
  const loader = viewModules[path];
  if (!loader) {
    console.warn(`[router] component not found: ${path}`);
    return () => import('@/views/error/404.vue');
  }
  return loader;
}

export function transformMenusToRoutes(menus: MenuRecord[]): AppRouteRecordRaw[] {
  return menus.map((menu) => {
    const hasChildren = !!menu.children?.length;
    const route: AppRouteRecordRaw = {
      path: menu.path,
      name: menu.name,
      meta: {
        title: menu.title ?? menu.name,
        icon: menu.icon,
        permission: menu.permission,
        hideInMenu: menu.hideInMenu,
        keepAlive: menu.keepAlive,
        affix: menu.path === '/dashboard',
      },
      redirect: menu.redirect,
      component: menu.component
        ? resolveComponent(menu.component)
        : hasChildren
          ? () => import('@/layout/ParentLayout.vue')
          : undefined,
      children: hasChildren ? transformMenusToRoutes(menu.children!) : undefined,
    };
    return route;
  });
}
