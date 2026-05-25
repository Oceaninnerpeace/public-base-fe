import type { AppRouteRecordRaw } from '@/types/router';

/** 静态路由（404 在门户路由注册后再挂载；无全局登录页） */
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    redirect: '/portal',
    meta: { title: '登录' },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '无权限' },
  },
];

/** 通配 404，必须在动态路由之后 addRoute，否则会抢先匹配 /dashboard 等路径 */
export const notFoundRoute: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue'),
  meta: { title: '页面不存在' },
};

/** 布局壳路由，动态路由挂载在其 children 下 */
export const layoutRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Layout',
  component: () => import('@/layout/BasicLayout.vue'),
  redirect: '/portal',
  children: [],
};
