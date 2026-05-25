import { useUserStore } from '@/store/user';
import type { App, Directive } from 'vue';

/**
 * 按钮级权限指令
 * @example <a-button v-auth="'system:user:add'">新增</a-button>
 * @example <a-button v-auth="['system:user:add','system:user:edit']">操作</a-button>
 */
export const authDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    updateAuth(el, binding.value);
  },
  updated(el, binding) {
    updateAuth(el, binding.value);
  },
};

function updateAuth(el: HTMLElement, value?: string | string[]) {
  const userStore = useUserStore();
  const allowed = userStore.hasPermission(value);
  if (!allowed) {
    el.style.display = 'none';
    el.setAttribute('disabled', 'true');
  } else {
    el.style.display = '';
    el.removeAttribute('disabled');
  }
}

export function setupAuthDirective(app: App) {
  app.directive('auth', authDirective);
  app.directive('access', authDirective);
  /** 方案文档命名：v-permission */
  app.directive('permission', authDirective);
}
