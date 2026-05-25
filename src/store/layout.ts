import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type LayoutMode = 'sidebar-nav' | 'sidebar-mixed-nav' | 'header-mixed-nav';

/** 经典侧栏 */
export const SIDEBAR_NAV_WIDTH = 210;
export const SIDEBAR_NAV_COLLAPSED_WIDTH = 64;
/** 双列：左列根菜单 */
export const MIXED_ROOT_WIDTH = 72;
/** 双列：右列子菜单 */
export const MIXED_SUB_WIDTH = 168;
/** 混合：仅子菜单侧栏 */
export const HEADER_MIXED_SUB_WIDTH = 210;

export const useLayoutStore = defineStore(
  'layout',
  () => {
    const collapsed = ref(false);
    const layoutMode = ref<LayoutMode>('sidebar-nav');
    /** 双列/混合模式下子菜单列是否展示 */
    const subMenuVisible = ref(true);

    const sidebarWidth = computed(() => {
      if (layoutMode.value === 'sidebar-mixed-nav') {
        return subMenuVisible.value
          ? MIXED_ROOT_WIDTH + MIXED_SUB_WIDTH
          : MIXED_ROOT_WIDTH;
      }
      if (layoutMode.value === 'header-mixed-nav') {
        return subMenuVisible.value ? HEADER_MIXED_SUB_WIDTH : 0;
      }
      return collapsed.value ? SIDEBAR_NAV_COLLAPSED_WIDTH : SIDEBAR_NAV_WIDTH;
    });

    const isSidebarNav = computed(() => layoutMode.value === 'sidebar-nav');
    const isSidebarMixedNav = computed(() => layoutMode.value === 'sidebar-mixed-nav');
    const isHeaderMixedNav = computed(() => layoutMode.value === 'header-mixed-nav');

    function toggleCollapsed() {
      if (!isSidebarNav.value) return;
      collapsed.value = !collapsed.value;
    }

    function setCollapsed(val: boolean) {
      if (!isSidebarNav.value) return;
      collapsed.value = val;
    }

    function setLayoutMode(mode: LayoutMode) {
      layoutMode.value = mode;
      if (mode !== 'sidebar-nav') {
        collapsed.value = false;
      }
    }

    function setSubMenuVisible(visible: boolean) {
      subMenuVisible.value = visible;
    }

    return {
      collapsed,
      layoutMode,
      subMenuVisible,
      sidebarWidth,
      isSidebarNav,
      isSidebarMixedNav,
      isHeaderMixedNav,
      toggleCollapsed,
      setCollapsed,
      setLayoutMode,
      setSubMenuVisible,
    };
  },
  {
    persist: {
      pick: ['collapsed', 'layoutMode'],
    },
  },
);
