import { ref } from 'vue';

export interface UseModalOptions {
  defaultOpen?: boolean;
  destroyOnClose?: boolean;
}

/** 命令式弹窗状态（配合 AppModal 或 a-modal） */
export function useModal(options: UseModalOptions = {}) {
  const open = ref(options.defaultOpen ?? false);
  const data = ref<Record<string, unknown>>({});

  function openModal(payload?: Record<string, unknown>) {
    if (payload) data.value = payload;
    open.value = true;
  }

  function closeModal() {
    open.value = false;
    if (options.destroyOnClose) data.value = {};
  }

  return {
    open,
    data,
    openModal,
    closeModal,
  };
}
