import type { App, Plugin } from 'vue'

import * as components from './components'

const allComponents = Object.values(components).filter(
  (c) => c && typeof c === 'object' && 'name' in (c as { name?: string }),
)

export interface PbComponentsInstallOptions {
  /** 是否全局注册所有 Pb* 组件 */
  registerComponents?: boolean
}

export const install: Plugin = (app: App, options?: PbComponentsInstallOptions) => {
  if (options?.registerComponents === false) return
  for (const comp of allComponents) {
    const name = (comp as { name?: string }).name
    if (name) app.component(name, comp)
  }
}
