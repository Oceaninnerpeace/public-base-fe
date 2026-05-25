/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_NAMESPACE: string;
  readonly VITE_GLOB_API_URL: string;
  /** @deprecated 使用 VITE_GLOB_API_URL */
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_PORT: string;
  readonly VITE_PROXY_TARGET: string;
  readonly VITE_DEVTOOLS: string;
  readonly VITE_BUILD_SOURCEMAP: string;
  readonly VITE_BUILD_DROP_CONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
