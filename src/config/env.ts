/**
 * 运行时环境变量（统一入口，避免散落 import.meta.env）
 * 仅读取 VITE_ 前缀变量：https://vite.dev/guide/env-and-mode
 */

export type AppEnvMode = 'development' | 'test' | 'staging' | 'production' | string;

function toBool(val: string | undefined, defaultValue = false) {
  if (val === undefined || val === '') return defaultValue;
  return val === 'true' || val === '1';
}

export interface AppEnv {
  mode: AppEnvMode;
  isDev: boolean;
  isProd: boolean;
  title: string;
  namespace: string;
  apiUrl: string;
  useMock: boolean;
  port: number;
  proxyTarget: string;
  buildSourcemap: boolean;
  buildDropConsole: boolean;
  /** 是否启用 Qiankun 微前端主应用 */
  microEnabled: boolean;
}

export function createAppEnv(): AppEnv {
  const env = import.meta.env;

  return {
    mode: env.MODE,
    isDev: env.DEV,
    isProd: env.PROD,
    title: env.VITE_APP_TITLE || '公共微前端基座',
    namespace: env.VITE_APP_NAMESPACE || 'public-base-fe',
    apiUrl: env.VITE_GLOB_API_URL || env.VITE_API_URL || '/api',
    useMock: toBool(env.VITE_USE_MOCK, env.DEV),
    port: Number(env.VITE_PORT) || 5173,
    proxyTarget: env.VITE_PROXY_TARGET || 'http://localhost:3000',
    buildSourcemap: toBool(env.VITE_BUILD_SOURCEMAP, !env.PROD),
    buildDropConsole: toBool(env.VITE_BUILD_DROP_CONSOLE, env.PROD),
    microEnabled: toBool(env.VITE_MICRO_ENABLED, false),
  };
}

/** 单例，应用内共享 */
export const appEnv = createAppEnv();
