import { message as antMessage } from 'ant-design-vue'

export type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading'

/** 全局消息（统一入口，便于后续替换实现） */
export const pbMessage = {
  success(content: string, duration?: number) {
    return antMessage.success(content, duration)
  },
  error(content: string, duration?: number) {
    return antMessage.error(content, duration)
  },
  info(content: string, duration?: number) {
    return antMessage.info(content, duration)
  },
  warning(content: string, duration?: number) {
    return antMessage.warning(content, duration)
  },
  loading(content: string, duration?: number) {
    return antMessage.loading(content, duration)
  },
}
