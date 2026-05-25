import { getDictAllApi, getDictByCodeApi } from '@/api/dict';
import type { DictItem, DictMap } from '@/types/dict';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDictStore = defineStore('dict', () => {
  const dictMap = ref<DictMap>({});
  const loaded = ref(false);

  async function loadAll(force = false) {
    if (loaded.value && !force) return dictMap.value;
    dictMap.value = await getDictAllApi();
    loaded.value = true;
    return dictMap.value;
  }

  async function refreshCode(code: string) {
    const list = await getDictByCodeApi(code);
    dictMap.value = { ...dictMap.value, [code]: list };
    return list;
  }

  function getDict(code: string): DictItem[] {
    return dictMap.value[code] ?? [];
  }

  function getLabel(code: string, value?: string | number): string {
    if (value === undefined || value === null || value === '') return '';
    const item = getDict(code).find((d) => String(d.value) === String(value));
    return item?.label ?? String(value);
  }

  function reset() {
    dictMap.value = {};
    loaded.value = false;
  }

  return {
    dictMap,
    loaded,
    loadAll,
    refreshCode,
    getDict,
    getLabel,
    reset,
  };
});
