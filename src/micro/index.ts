import { microApps, microEnabled } from '@/micro/apps';
import { MICRO_CONTAINER_SELECTOR, waitForMicroContainer } from '@/micro/container';
import { createPortalBridge, setupPortalGlobalState } from '@/micro/portal-bridge';
import { registerMicroApps, start } from 'qiankun';
import type { Router } from 'vue-router';

/**
 * 微前端调度：仅负责挂载/卸载，不向子应用注入 Token（子应用自治鉴权）
 *
 * 须在 Vue 挂载且 #micro-app-container 已渲染后再调用。
 */
export function setupMicroApps(router: Router) {
  if (!microEnabled || !microApps.length) return;

  setupPortalGlobalState({ portal: true });
  const portal = createPortalBridge(router);

  registerMicroApps(
    microApps.map((app) => ({
      name: app.name,
      entry: app.entry,
      container: app.container ?? MICRO_CONTAINER_SELECTOR,
      activeRule: app.activeRule,
      props: {
        poweredByPortal: true,
        /** 子应用通过 props.portal 调用基座方法 */
        portal,
        /** 兼容旧写法：与 portal.globalActions 相同 */
        globalActions: portal.globalActions,
      },
    })),
    {
      beforeLoad: async () => {
        await waitForMicroContainer();
      },
      beforeMount: async () => {
        await waitForMicroContainer();
      },
    },
  );

  start({
    sandbox: {
      strictStyleIsolation: false,
      experimentalStyleIsolation: false,
    },
    prefetch: false,
    singular: false,
  });
}

export { setupPortalGlobalState, createPortalBridge } from '@/micro/portal-bridge';
export type { PortalBridge } from '@/micro/portal-bridge';
