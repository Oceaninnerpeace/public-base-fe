import { onUnmounted } from 'vue'

import { debounce } from '../utils/debounce'

/** 在组件内使用的防抖函数，卸载时自动 cancel */
export function useDebounceFn<T extends (...args: never[]) => void>(fn: T, wait = 300) {
  const debounced = debounce(fn, wait)
  onUnmounted(() => {
    if ('cancel' in debounced && typeof debounced.cancel === 'function') {
      debounced.cancel()
    }
  })
  return debounced
}
