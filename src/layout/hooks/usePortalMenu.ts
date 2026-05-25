import { portalAppsToMenus } from '@/config/portal-apps';
import type { MenuRecord } from '@/types/router';

import * as Icons from '@ant-design/icons-vue';
import { computed, h, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/** 门户侧栏菜单：仅展示已注册子应用 */
export function usePortalMenu() {
  const router = useRouter();
  const route = useRoute();
  const menus = ref<MenuRecord[]>(portalAppsToMenus());

  const selectedKeys = computed(() => {
    const hit = menus.value.find(
      (m) => route.path === m.path || route.path.startsWith(`${m.path}/`),
    );
    return hit ? [hit.path] : ['/portal'];
  });

  const menuItems = computed(() =>
    [
      {
        key: '/portal',
        label: '应用中心',
        title: '应用中心',
        icon: () => h(Icons.AppstoreOutlined),
      },
      ...menus.value.map((menu) => ({
        key: menu.path,
        label: menu.title ?? menu.name,
        title: menu.title ?? menu.name,
        icon: renderIcon(menu.icon),
      })),
    ],
  );

  function renderIcon(name?: string) {
    if (!name) return () => h(Icons.AppstoreOutlined);
    const IconComp = (Icons as Record<string, unknown>)[name];
    if (IconComp && typeof IconComp === 'object') {
      return () => h(IconComp as Parameters<typeof h>[0]);
    }
    return () => h(Icons.AppstoreOutlined);
  }

  function findMenuByPath(list: MenuRecord[], path: string): MenuRecord | undefined {
    return list.find((m) => m.path === path);
  }

  function onMenuClick({ key }: { key: string }) {
    if (key === '/portal') {
      router.push('/portal');
      return;
    }
    const menu = findMenuByPath(menus.value, key);
    router.push(menu?.redirect ?? key);
  }

  return {
    menuItems,
    selectedKeys,
    openKeys: ref<string[]>([]),
    onMenuClick,
  };
}
