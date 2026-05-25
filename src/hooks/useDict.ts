import { computed } from 'vue';

import { useDictStore } from '@/store/dict';

/** 字典 Hook：文本翻译、下拉选项 */
export function useDict() {
  const dictStore = useDictStore();

  function options(code: string) {
    return computed(() =>
      dictStore.getDict(code).map((item) => ({
        label: item.label,
        value: item.value,
        disabled: item.disabled,
      })),
    );
  }

  return {
    getLabel: dictStore.getLabel,
    getDict: dictStore.getDict,
    options,
    refresh: dictStore.refreshCode,
  };
}
