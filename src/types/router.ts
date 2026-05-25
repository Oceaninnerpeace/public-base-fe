import type { RouteRecordRaw } from 'vue-router';

/** 后端返回的菜单节点 */
export interface MenuRecord {
  id: string;
  parentId?: string;
  /** 路由 name（英文标识） */
  name: string;
  /** 菜单/页面标题 */
  title?: string;
  path: string;
  component?: string;
  redirect?: string;
  icon?: string;
  /** 路由权限码，满足任一即可访问 */
  permission?: string | string[];
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean;
  /** 是否缓存页面 */
  keepAlive?: boolean;
  /** 标签页固定（不可关闭） */
  affix?: boolean;
  children?: MenuRecord[];
  /** 父级路径链（根路径在首位），混合/双列菜单用 */
  parents?: string[];
  /** 仅菜单展示，路由由主应用 micro-routes 注册 */
  isMicroHost?: boolean;
}

export interface RouteMeta {
  title?: string;
  icon?: string;
  /** 路由权限码 */
  permission?: string | string[];
  hideInMenu?: boolean;
  keepAlive?: boolean;
  /** 外链 */
  link?: string;
  /** Qiankun 子应用承载页 */
  isMicro?: boolean;
  microAppId?: string;
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta;
  children?: AppRouteRecordRaw[];
};
