export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function defaultBusinessMessage(d: Record<string, unknown>): string {
  const m = d.msg ?? d.message ?? d.errorMessage
  return typeof m === 'string' && m ? m : '请求失败'
}

export function describeHttpError(status: number | undefined): string {
  switch (status) {
    case 400:
      return '请求参数错误'
    case 401:
      return '未登录或登录已过期'
    case 403:
      return '没有权限访问该资源'
    case 404:
      return '请求的资源不存在'
    case 408:
      return '请求超时'
    case 429:
      return '请求过于频繁，请稍后再试'
    case 500:
      return '服务器内部错误'
    case 502:
      return '网关错误'
    case 503:
      return '服务暂时不可用'
    case 504:
      return '网关超时'
    default:
      return status ? `请求失败（${status}）` : '网络异常'
  }
}

export function readServerErrorMessage(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined
  const message = data.message ?? data.msg
  return typeof message === 'string' && message ? message : undefined
}
