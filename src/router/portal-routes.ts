import type { AppRouteRecordRaw } from '@/types/router';

/** 基座门户静态路由（无业务动态路由） */
export const portalStaticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/portal',
    name: 'Portal',
    component: () => import('@/views/portal/index.vue'),
    meta: {
      title: '应用中心',
      affix: true,
    },
  },
];
