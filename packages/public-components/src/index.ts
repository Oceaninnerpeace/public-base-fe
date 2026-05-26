import { install } from './install'

export { install }
export * from './components'
export * from './composables/useLoading'
export * from './composables/useDebounceFn'
export * from './composables/useMonitorPlayer'
export * from './utils/captureVideoFrame'
export type * from './types/monitor'
export * from './feedback/message'
export * from './feedback/notification'
export * from './utils/debounce'
export * from './utils/export'
export * from './utils/validate'
export type * from './types/form'
export type * from './types/table'

import * as components from './components'

/** 默认插件：app.use(PublicBaseComponents) */
export default {
  install,
  ...components,
}
