import { useUserStore } from '@/store/user';
import { hasPermission, hasRole } from '@/utils/permission';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

/**
 * 权限 Hook：路由、菜单、按钮共用
 * @example const { hasAuth } = usePermission(); hasAuth('system:user:add')
 */
export function usePermission() {
  const userStore = useUserStore();
  const { permissions, roles } = storeToRefs(userStore);

  const isAdmin = computed(() => permissions.value.includes('*'));

  function hasAuth(code?: string | string[]) {
    if (isAdmin.value) return true;
    return userStore.hasPermission(code);
  }

  function hasAnyRole(code?: string | string[]) {
    return hasRole(roles.value, code);
  }

  return {
    permissions,
    roles,
    isAdmin,
    hasAuth,
    hasAnyRole,
    hasPermission: (code?: string | string[]) => hasPermission(permissions.value, code),
  };
}
