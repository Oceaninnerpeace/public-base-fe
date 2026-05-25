import type { MenuRecord } from '@/types/router';

export interface TreeNode<T> {
  children?: TreeNode<T>[];
}

/** 列表转树 */
export function listToTree<T extends { id: string; parentId?: string }>(
  list: T[],
  rootParentId = '',
): (T & TreeNode<T>)[] {
  const map = new Map<string, T & TreeNode<T>>();
  const roots: (T & TreeNode<T>)[] = [];

  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of list) {
    const node = map.get(item.id)!;
    const parentId = item.parentId ?? rootParentId;
    if (!parentId || parentId === rootParentId) {
      roots.push(node);
    } else {
      const parent = map.get(parentId);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return roots;
}

/** 按权限过滤菜单树：自身有权限或存在可见子节点则保留 */
export function filterMenuTree(
  menus: MenuRecord[],
  hasPermission: (code?: string | string[]) => boolean,
): MenuRecord[] {
  const result: MenuRecord[] = [];
  for (const menu of menus) {
    const children = menu.children ? filterMenuTree(menu.children, hasPermission) : [];
    const selfPass = hasPermission(menu.permission);
    if (selfPass || children.length > 0) {
      result.push({
        ...menu,
        children: children.length > 0 ? children : undefined,
      });
    }
  }
  return result;
}
