import { PORTAL_APPS } from '@/config/portal-apps';
import type { MenuRecord } from '@/types/router';

import { useLayoutStore } from '@/store/layout';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/** 混合顶栏模式：根菜单为门户子应用列表 */
export function useMixedMenu() {
  const router = useRouter();
  const route = useRoute();
  const layoutStore = useLayoutStore();

  const portalMenus = computed<MenuRecord[]>(() =>
    PORTAL_APPS.map((app) => ({
      id: app.id,
      name: app.name,
      title: app.title,
      path: app.menuPath,
      redirect: app.defaultPath,
      icon: app.icon,
    })),
  );

  const allMenus = portalMenus;
  const rootMenus = portalMenus;
  const rootMenuPath = ref('');
  const splitMenus = ref<MenuRecord[]>([]);

  const needSplit = computed(
    () => layoutStore.isSidebarMixedNav || layoutStore.isHeaderMixedNav,
  );

  const sidebarMenus = computed(() => (needSplit.value ? splitMenus.value : allMenus.value));
  const sidebarActive = computed(() => route.path);
  const headerActive = computed(() => rootMenuPath.value || route.path);

  const subMenuVisible = computed(() => false);

  watch(
    subMenuVisible,
    (v) => {
      layoutStore.setSubMenuVisible(v);
    },
    { immediate: true },
  );

  function calcSplitMenus(path: string) {
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

  function navigate(path: string) {
    router.push(path);
  }

  function handleRootSelect(menu: MenuRecord) {
    navigate(menu.redirect ?? menu.path);
  }

  function handleSubSelect(path: string) {
    navigate(path);
  }

  function handleMenuOpen(key: string) {
    navigate(key);
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
