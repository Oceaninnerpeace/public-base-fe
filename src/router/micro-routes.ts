import type { AppRouteRecordRaw } from '@/types/router';

import { PORTAL_APPS } from '@/config/portal-apps';

/** 微前端子应用承载路由（菜单仅展示在门户应用列表） */
export const microHostRoutes: AppRouteRecordRaw[] = PORTAL_APPS.filter(
  (a) => a.type === 'qiankun',
).map((app) => ({
  path: `${app.activeRule}/:pathMatch(.*)*`,
  name: `Micro_${app.id}`,
  component: () => import('@/views/micro/MicroAppView.vue'),
  meta: {
    title: app.title,
    isMicro: true,
    microAppId: app.id,
  },
}));

export function isMicroHostPath(path?: string) {
  return !!path && path.startsWith('/micro/');
}

export function isPortalShellPath(path: string) {
  return path === '/portal' || path.startsWith('/portal/') || isMicroHostPath(path);
}
