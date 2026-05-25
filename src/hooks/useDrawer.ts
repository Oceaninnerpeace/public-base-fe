import { ref } from 'vue';

export function useDrawer(options: { defaultOpen?: boolean; destroyOnClose?: boolean } = {}) {
  const open = ref(options.defaultOpen ?? false);
  const data = ref<Record<string, unknown>>({});

  function openDrawer(payload?: Record<string, unknown>) {
    if (payload) data.value = payload;
    open.value = true;
  }

  function closeDrawer() {
    open.value = false;
    if (options.destroyOnClose) data.value = {};
  }

  return { open, data, openDrawer, closeDrawer };
}
