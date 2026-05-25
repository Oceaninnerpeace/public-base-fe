import { PORTAL_APPS } from '@/config/portal-apps';
import { initGlobalState, type MicroAppStateActions } from 'qiankun';
import type { Router } from 'vue-router';

/** 基座暴露给子应用的能力（通过 Qiankun mount props.portal 传入） */
export interface PortalBridge {
  /** 是否在公共微前端基座内运行 */
  poweredByPortal: true;
  /** 跳转应用中心 */
  goPortal: () => void;
  /** 按 portal-apps 的 id 切换子应用，如 drone / power */
  switchApp: (appId: string) => void;
  /** 当前基座路由 fullPath */
  getHostPath: () => string;
  /** Qiankun 全局状态（与子应用双向通信） */
  globalActions: MicroAppStateActions;
}

let globalActions: MicroAppStateActions | null = null;

export function setupPortalGlobalState(
  initialState: Record<string, unknown> = { portal: true },
): MicroAppStateActions {
  globalActions = initGlobalState(initialState);
  return globalActions;
}

export function getPortalGlobalActions(): MicroAppStateActions | null {
  return globalActions;
}

/** 创建挂载时传给子应用的 portal 对象 */
export function createPortalBridge(router: Router): PortalBridge {
  const actions = getPortalGlobalActions();
  if (!actions) {
    throw new Error('[portal] 请先调用 setupPortalGlobalState()');
  }

  return {
    poweredByPortal: true,
    goPortal() {
      void router.push('/portal');
    },
    switchApp(appId: string) {
      const app = PORTAL_APPS.find((a) => a.id === appId);
      if (app) void router.push(app.defaultPath);
    },
    getHostPath() {
      return router.currentRoute.value.fullPath;
    },
    globalActions: actions,
  };
}
