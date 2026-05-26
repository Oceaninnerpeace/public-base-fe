import { ref } from 'vue'

/** 异步 loading 包装 */
export function useLoading(initial = false) {
  const loading = ref(initial)

  async function run<T>(fn: () => Promise<T>): Promise<T> {
    loading.value = true
    try {
      return await fn()
    } finally {
      loading.value = false
    }
  }

  return { loading, run }
}
