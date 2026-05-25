import type { App } from 'vue';

/** 全局 JS / Vue 异常捕获与上报占位 */
export function setupGlobalErrorHandler(app: App) {
  app.config.errorHandler = (err, instance, info) => {
    console.error('[GlobalError]', err, info, instance);
    // TODO: 对接监控平台上报
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledRejection]', event.reason);
  });

  window.addEventListener('error', (event) => {
    console.error('[ResourceError]', event.message, event.filename);
  });
}
