import type { MenuRecord } from '@/types/router';

/** 为菜单树补充 parents 链 */
export function enrichMenuParents(
  menus: MenuRecord[],
  parents: string[] = [],
): MenuRecord[] {
  return menus.map((menu) => {
    const nextParents = [...parents, menu.path];
    return {
      ...menu,
      parents,
      children: menu.children?.length
        ? enrichMenuParents(menu.children, nextParents)
        : undefined,
    };
  });
}

export function findMenuByPath(list: MenuRecord[], path?: string): MenuRecord | null {
  if (!path) return null;
  for (const menu of list) {
    if (menu.path === path) return menu;
    if (menu.children?.length) {
      const found = findMenuByPath(menu.children, path);
      if (found) return found;
    }
  }
  return null;
}

export function findRootMenuByPath(menus: MenuRecord[], path?: string, level = 0) {
  const findMenu = findMenuByPath(menus, path);
  const rootMenuPath = findMenu?.parents?.[level];
  const rootMenu = rootMenuPath
    ? menus.find((item) => item.path === rootMenuPath)
    : undefined;
  return { findMenu, rootMenu, rootMenuPath };
}

/** 顶级菜单（有 children 的作为模块根） */
export function getRootMenus(menus: MenuRecord[]) {
  return menus.filter((m) => !m.hideInMenu);
}
