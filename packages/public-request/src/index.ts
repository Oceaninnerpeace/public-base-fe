import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

import {
  defaultBusinessMessage,
  describeHttpError,
  isRecord,
  readServerErrorMessage,
} from './errors'
import type { CreateRequestOptions, HttpClient } from './types'

const DEFAULT_OK = [0, 200]
const DEFAULT_UNAUTHORIZED = [401]

function pickBody<T>(response: AxiosResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in (response as AxiosResponse<T>)) {
    return (response as AxiosResponse<T>).data
  }
  return response as T
}

/** 创建带统一拦截器的 Axios 实例（各项目注入 baseURL / Token / 401 回调） */
export function createRequest(options: CreateRequestOptions): AxiosInstance {
  const businessOk = new Set(options.businessOkCodes ?? DEFAULT_OK)
  const unauthorizedCodes = new Set(options.unauthorizedBusinessCodes ?? DEFAULT_UNAUTHORIZED)
  const getMessage = options.getBusinessMessage ?? defaultBusinessMessage
  const notifyError = (msg: string) => options.notify?.error(msg)
  const dataKey = options.businessDataKey ?? 'data'

  const service = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 30_000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.headers,
    },
  })

  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = options.getToken?.()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        options.onAttachAuthHeaders?.(config.headers as Record<string, unknown>, token)
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error),
  )

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const d = response.data
      if (isRecord(d) && typeof d.code === 'number' && !businessOk.has(d.code)) {
        const text = getMessage(d)
        notifyError?.(text)
        if (unauthorizedCodes.has(d.code)) {
          options.onUnauthorized?.()
        }
        return Promise.reject(new Error(text))
      }

      if (options.resolveWithBusinessData && isRecord(d) && typeof d.code === 'number') {
        return d[dataKey] as AxiosResponse
      }

      return response
    },
    (err: AxiosError) => {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        notifyError?.('请求超时，请稍后重试')
        return Promise.reject(err)
      }
      if (!err.response) {
        notifyError?.('网络连接失败，请检查网络')
        return Promise.reject(err)
      }

      const status = err.response.status
      const msgFromServer = readServerErrorMessage(err.response.data)

      if (status === 401) {
        notifyError?.(msgFromServer || '登录已过期，请重新登录')
        options.onUnauthorized?.()
        return Promise.reject(err)
      }

      notifyError?.(msgFromServer || describeHttpError(status))
      return Promise.reject(err)
    },
  )

  return service
}

/** 创建实例 + get/post/put/del 快捷方法 */
export function createHttpClient(options: CreateRequestOptions): HttpClient {
  const instance = createRequest(options)

  return {
    instance,
    get<T>(url: string, params?: object, config?: AxiosRequestConfig) {
      return instance.get<T>(url, { params, ...config }).then((r) => pickBody(r))
    },
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return instance.post<T>(url, data, config).then((r) => pickBody(r))
    },
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return instance.put<T>(url, data, config).then((r) => pickBody(r))
    },
    del<T>(url: string, config?: AxiosRequestConfig) {
      return instance.delete<T>(url, config).then((r) => pickBody(r))
    },
    http<T>(config: AxiosRequestConfig) {
      return instance.request<T>(config).then((r) => pickBody(r))
    },
  }
}

export { defaultBusinessMessage, describeHttpError, isRecord, readServerErrorMessage } from './errors'
export type { CreateRequestOptions, HttpClient, RequestNotify } from './types'
