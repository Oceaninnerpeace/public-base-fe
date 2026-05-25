import type { MicroAppConfig } from '@/types/micro';
import type { MenuRecord } from '@/types/router';

/**
 * 门户子应用注册表（与《微前端基座建设落地技术文档》一致）
 * 基座只做调度与体验统一，不参与子应用鉴权/菜单/字典
 */
export interface PortalAppDefinition {
  id: string;
  /** Qiankun 应用名，与子应用 vite-plugin-qiankun name 一致 */
  name: string;
  title: string;
  description?: string;
  icon?: string;
  /** 侧栏/应用中心入口路径 */
  menuPath: string;
  /** 进入子应用默认地址 */
  defaultPath: string;
  activeRule: string;
  entry: string;
  /** 子应用本地存储前缀（防串登），如 DRONE_ / STATION_ */
  storagePrefix: string;
  type: 'qiankun' | 'iframe';
}

export const PORTAL_APPS: PortalAppDefinition[] = [
  {
    id: 'drone',
    name: 'drone-system',
    title: '无人机系统',
    description: '无人机智能移动机场业务平台',
    icon: 'RocketOutlined',
    menuPath: '/micro/uav',
    defaultPath: '/micro/uav/flying/index',
    activeRule: '/micro/uav',
    entry: import.meta.env.VITE_MICRO_DRONE_ENTRY || '//localhost:5666',
    storagePrefix: 'DRONE_',
    type: 'qiankun',
  },
  {
    id: 'power',
    name: 'smart-power-admin',
    title: '智慧电站',
    description: '智慧电站运行监控与管理',
    icon: 'ThunderboltOutlined',
    menuPath: '/micro/power',
    defaultPath: '/micro/power/home',
    activeRule: '/micro/power',
    entry: import.meta.env.VITE_MICRO_POWER_ENTRY || '//localhost:5177',
    storagePrefix: 'STATION_',
    type: 'qiankun',
  },
];

export function portalAppsToMenus(): MenuRecord[] {
  return PORTAL_APPS.map((app) => ({
    id: app.id,
    name: app.name,
    title: app.title,
    path: app.menuPath,
    redirect: app.defaultPath,
    icon: app.icon,
    isMicroHost: true,
  }));
}

export function portalAppsToMicroConfigs(): MicroAppConfig[] {
  return PORTAL_APPS.filter((a) => a.type === 'qiankun').map((app) => ({
    name: app.name,
    entry: app.entry,
    activeRule: app.activeRule,
    container: '#micro-app-container',
  }));
}

export function findPortalAppByPath(path: string) {
  return PORTAL_APPS.find(
    (app) => path === app.menuPath || path.startsWith(`${app.activeRule}/`) || path === app.activeRule,
  );
}
