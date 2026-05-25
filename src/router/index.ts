import { createRouter, createWebHistory } from 'vue-router';

import { setupRouterGuard } from './guard';
import { constantRoutes, layoutRoute } from './modules';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [layoutRoute, ...constantRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

setupRouterGuard(router);

export default router;
