import { getUserInfoApi, loginApi, logoutApi } from '@/api/auth';
import type { LoginParams, UserInfo } from '@/types/api';
import { useEmbedStore } from '@/store/embed';
import { removeToken, setToken } from '@/utils/auth';
import { hasPermission as checkPermission } from '@/utils/permission';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('');
    const userInfo = ref<UserInfo | null>(null);

    async function login(params: LoginParams) {
      const { token: accessToken } = await loginApi(params);
      token.value = accessToken;
      setToken(accessToken);
      await fetchUserInfo();
    }

    async function fetchUserInfo() {
      userInfo.value = await getUserInfoApi();
    }

    async function logout() {
      try {
        await logoutApi();
      } finally {
        token.value = '';
        userInfo.value = null;
        removeToken();
        const embed = useEmbedStore();
        if (embed.isEmbed && typeof window !== 'undefined') {
          window.parent.postMessage(
            { source: 'vue-admin', type: 'logout' },
            embed.parentOrigin,
          );
        }
      }
    }

    const permissions = computed(() => userInfo.value?.permissions ?? []);
    const roles = computed(() => userInfo.value?.roles ?? []);

    function hasPermission(code?: string | string[]) {
      const list = permissions.value;
      if (list.includes('*')) return true;
      return checkPermission(list, code);
    }

    return {
      token,
      userInfo,
      permissions,
      roles,
      hasPermission,
      login,
      fetchUserInfo,
      logout,
    };
  },
  {
    persist: {
      pick: ['token'],
    },
  },
);
