import { useEmbedStore } from '@/store/embed';
import { usePermissionStore } from '@/store/permission';
import { useTabbarStore } from '@/store/tabbar';
import NProgress from 'nprogress';
import type { Router } from 'vue-router';

import { notFoundRoute } from './modules';
import { isPortalShellPath } from './micro-routes';

const WHITE_LIST = ['/403'];

function ensureNotFoundRoute(router: Router) {
  if (!router.hasRoute('NotFound')) {
    router.addRoute(notFoundRoute);
  }
}

function replayNavigation(
  to: { path: string; query: Record<string, unknown>; hash: string },
  next: (arg?: unknown) => void,
) {
  next({
    path: to.path,
    query: to.query,
    hash: to.hash,
    replace: true,
  });
}

/**
 * 门户容器路由守卫：
 * - 无全局登录 / Token / 业务权限拦截
 * - 子应用鉴权由各子应用自行完成
 */
export function setupRouterGuard(router: Router) {
  router.afterEach((to) => {
    NProgress.done();
    const embedStore = useEmbedStore();
    if (embedStore.isEmbed || !isPortalShellPath(to.path)) return;
    useTabbarStore().addTab(to);
  });

  router.beforeEach(async (to, _from, next) => {
    NProgress.start();

    const embedStore = useEmbedStore();
    embedStore.syncFromQuery(to.query);

    if (to.path === '/login') {
      next({ path: '/portal', replace: true });
      return;
    }

    if (WHITE_LIST.includes(to.path)) {
      next();
      return;
    }

    const permissionStore = usePermissionStore();

    if (!permissionStore.isRoutesLoaded) {
      const staticRoutes = await permissionStore.buildRoutes();
      staticRoutes.forEach((route) => {
        router.addRoute('Layout', route);
      });
      ensureNotFoundRoute(router);
      replayNavigation(to, next);
      return;
    }

    next();
  });
}
