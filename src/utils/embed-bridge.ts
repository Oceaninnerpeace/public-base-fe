import { useEmbedStore } from '@/store/embed';
import type { Router } from 'vue-router';

/** 父页面 → 本应用（iframe 外接场景） */
export type ParentToAppMessage =
  | { source: 'portal-parent'; type: 'navigate'; path: string }
  | { source: 'portal-parent'; type: 'refresh' };

/** 本应用 → 父页面 */
export type AppToParentMessage =
  | { source: 'public-base-fe'; type: 'ready' }
  | { source: 'public-base-fe'; type: 'route'; path: string; fullPath: string; title?: string };

export function postToParent(message: AppToParentMessage) {
  const embedStore = useEmbedStore();
  if (!embedStore.isEmbed || typeof window === 'undefined') return;
  window.parent.postMessage(message, embedStore.parentOrigin);
}

/** 基座不向子应用写入 Token；iframe 外接仅做布局通信 */
export function setupEmbedBridge(router: Router) {
  const embedStore = useEmbedStore();

  window.addEventListener('message', (event: MessageEvent) => {
    const allowed = embedStore.parentOrigin;
    if (allowed !== '*' && event.origin !== allowed) return;
    const data = event.data;
    if (!data || data.source !== 'portal-parent') return;

    switch (data.type) {
      case 'navigate':
        router.push(data.path);
        break;
      case 'refresh':
        window.location.reload();
        break;
      default:
        break;
    }
  });

  router.isReady().then(() => {
    if (embedStore.isEmbed) {
      postToParent({ source: 'public-base-fe', type: 'ready' });
    }
  });

  router.afterEach((to) => {
    if (!embedStore.isEmbed) return;
    postToParent({
      source: 'public-base-fe',
      type: 'route',
      path: to.path,
      fullPath: to.fullPath,
      title: (to.meta?.title as string) || '',
    });
  });
}
