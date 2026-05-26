import { PORTAL_APPS } from '@/config/portal-apps';
import type { MenuRecord } from '@/types/router';

import { useLayoutStore } from '@/store/layout';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const PORTAL_HOME_MENU: MenuRecord = {
  id: 'portal',
  name: 'portal',
  title: '应用中心',
  path: '/portal',
  icon: 'AppstoreOutlined',
};

function buildPortalMenus(): MenuRecord[] {
  return [
    PORTAL_HOME_MENU,
    ...PORTAL_APPS.map((app) => ({
      id: app.id,
      name: app.name,
      title: app.title,
      path: app.menuPath,
      redirect: app.defaultPath,
      icon: app.icon,
      isMicroHost: true,
    })),
  ];
}

/** 混合顶栏 / 双列侧栏：根菜单为门户子应用列表 */
export function useMixedMenu() {
  const router = useRouter();
  const route = useRoute();
  const layoutStore = useLayoutStore();

  const allMenus = computed<MenuRecord[]>(() => buildPortalMenus());

  const rootMenus = computed(() =>
    allMenus.value.map((item) => ({
      ...item,
      children: undefined,
    })),
  );

  const rootMenuPath = ref('');
  const splitMenus = ref<MenuRecord[]>([]);

  const needSplit = computed(
    () => layoutStore.isSidebarMixedNav || layoutStore.isHeaderMixedNav,
  );

  const sidebarMenus = computed(() => (needSplit.value ? splitMenus.value : allMenus.value));
  const sidebarActive = computed(() => route.path);
  const headerActive = computed(() => rootMenuPath.value || route.path);

  /** 门户子应用无基座子菜单，仅在有 children 时展示右栏 */
  const subMenuVisible = computed(
    () => needSplit.value && splitMenus.value.length > 0,
  );

  watch(
    subMenuVisible,
    (visible) => {
      layoutStore.setSubMenuVisible(visible);
    },
    { immediate: true },
  );

  function calcSplitMenus(path: string) {
    if (path === '/portal' || path.startsWith('/portal/')) {
      rootMenuPath.value = '/portal';
      splitMenus.value = [];
      return;
    }

    const app = PORTAL_APPS.find(
      (a) => path.startsWith(a.activeRule) || path === a.menuPath,
    );
    rootMenuPath.value = app?.menuPath ?? '';
    splitMenus.value = [];
  }

  watch(
    () => route.path,
    (path) => calcSplitMenus(path),
    { immediate: true },
  );

  function navigate(menu: MenuRecord) {
    router.push(menu.redirect ?? menu.path);
  }

  function handleRootSelect(menu: MenuRecord) {
    rootMenuPath.value = menu.path;
    splitMenus.value = menu.children ?? [];
    if (!splitMenus.value.length) {
      navigate(menu);
    }
  }

  function handleSubSelect(path: string) {
    const menu = allMenus.value.find((m) => m.path === path);
    if (menu) navigate(menu);
    else router.push(path);
  }

  function handleMenuOpen(key: string) {
    const menu = allMenus.value.find((m) => m.path === key);
    if (menu) navigate(menu);
    else router.push(key);
  }

  return {
    allMenus,
    rootMenus,
    sidebarMenus,
    sidebarActive,
    headerActive,
    rootMenuPath,
    subMenuVisible,
    needSplit,
    handleRootSelect,
    handleSubSelect,
    handleMenuOpen,
    calcSplitMenus,
  };
}
