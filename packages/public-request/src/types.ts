export interface RequestNotify {
  error: (message: string) => void
}

export interface CreateRequestOptions {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  /** 读取当前登录 Token */
  getToken?: () => string | null | undefined
  /** HTTP 401 或业务未授权码时回调（跳转登录等） */
  onUnauthorized?: () => void
  /** 错误提示，不传则静默 */
  notify?: RequestNotify
  /** 业务成功 code，默认 0 与 200 */
  businessOkCodes?: number[]
  /** 业务 body 中视为未授权的 code，默认 [401] */
  unauthorizedBusinessCodes?: number[]
  /** 从业务 body 取错误文案 */
  getBusinessMessage?: (data: Record<string, unknown>) => string
  /**
   * true：响应拦截器直接 resolve 业务 data 字段（基座风格）
   * false：保留 AxiosResponse（智慧电站风格，再由 get/post 取 .data）
   */
  resolveWithBusinessData?: boolean
  /** resolveWithBusinessData 为 true 时，从 body 取值的字段名 */
  businessDataKey?: string
  /** 附加鉴权头，如智慧电站 headers.token */
  onAttachAuthHeaders?: (
    headers: Record<string, unknown>,
    token: string,
  ) => void
}

export interface HttpClient {
  instance: import('axios').AxiosInstance
  get: <T = unknown>(url: string, params?: object, config?: import('axios').AxiosRequestConfig) => Promise<T>
  post: <T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig) => Promise<T>
  put: <T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig) => Promise<T>
  del: <T = unknown>(url: string, config?: import('axios').AxiosRequestConfig) => Promise<T>
  http: <T = unknown>(config: import('axios').AxiosRequestConfig) => Promise<T>
}
