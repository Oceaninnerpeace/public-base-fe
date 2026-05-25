import { appEnv } from '@/config';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { LocationQuery } from 'vue-router';

const SESSION_KEY = `${appEnv.namespace}_embed`;

function queryFlag(val: unknown): boolean {
  return val === '1' || val === 'true' || val === 'yes';
}

function queryOff(val: unknown): boolean {
  return val === '0' || val === 'false' || val === 'no';
}

function envTrue(val: string | undefined): boolean {
  return val === 'true' || val === '1';
}

function isInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
}

/** iframe / 第三方系统集成：仅展示内容区 */
export const useEmbedStore = defineStore('embed', () => {
  const isEmbed = ref(false);
  /** 内容区内边距（px），可通过 ?embedPadding=0 调整 */
  const contentPadding = ref(16);

  const parentOrigin = computed(
    () => import.meta.env.VITE_APP_EMBED_PARENT_ORIGIN?.trim() || '*',
  );

  function readSession(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  }

  function writeSession(enabled: boolean) {
    try {
      if (enabled) sessionStorage.setItem(SESSION_KEY, '1');
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  /** 根据 URL、环境、iframe 检测同步嵌入状态 */
  function syncFromQuery(query: LocationQuery) {
    if (queryOff(query.embed) || queryOff(query.iframe)) {
      isEmbed.value = false;
      writeSession(false);
      return;
    }

    if (queryFlag(query.embed) || queryFlag(query.iframe)) {
      isEmbed.value = true;
      writeSession(true);
    } else if (envTrue(import.meta.env.VITE_APP_EMBED)) {
      isEmbed.value = true;
      writeSession(true);
    } else if (readSession()) {
      isEmbed.value = true;
    } else if (
      import.meta.env.VITE_APP_EMBED_AUTO_IFRAME !== 'false' &&
      isInIframe()
    ) {
      isEmbed.value = true;
      writeSession(true);
    }

    const pad = query.embedPadding;
    if (pad !== undefined && pad !== null && pad !== '') {
      const n = Number(Array.isArray(pad) ? pad[0] : pad);
      contentPadding.value = Number.isFinite(n) ? n : 16;
    }
  }

  function exitEmbed() {
    isEmbed.value = false;
    writeSession(false);
  }

  /** 父系统 postMessage 触发内容区刷新 */
  const contentVersion = ref(0);

  function requestContentRefresh() {
    contentVersion.value += 1;
  }

  return {
    isEmbed,
    contentPadding,
    parentOrigin,
    contentVersion,
    syncFromQuery,
    exitEmbed,
    requestContentRefresh,
  };
});
