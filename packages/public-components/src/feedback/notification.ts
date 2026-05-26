import { notification as antNotification } from 'ant-design-vue'

export interface PbNotifyOptions {
  message: string
  description?: string
  duration?: number
}

/** 全局通知 */
export const pbNotification = {
  success(opts: PbNotifyOptions) {
    antNotification.success({
      message: opts.message,
      description: opts.description,
      duration: opts.duration ?? 4.5,
    })
  },
  error(opts: PbNotifyOptions) {
    antNotification.error({
      message: opts.message,
      description: opts.description,
      duration: opts.duration ?? 4.5,
    })
  },
  info(opts: PbNotifyOptions) {
    antNotification.info({
      message: opts.message,
      description: opts.description,
      duration: opts.duration ?? 4.5,
    })
  },
  warning(opts: PbNotifyOptions) {
    antNotification.warning({
      message: opts.message,
      description: opts.description,
      duration: opts.duration ?? 4.5,
    })
  },
}
