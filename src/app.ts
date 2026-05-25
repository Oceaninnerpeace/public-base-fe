import 'ant-design-vue/dist/reset.css';
import 'nprogress/nprogress.css';

import { setupLoadingDirective } from '@/directives/loading';
import { setupMicroApps } from '@/micro';
import router from '@/router';
import { setupStore } from '@/store';
import { setupEmbedBridge } from '@/utils/embed-bridge';
import { setupGlobalErrorHandler } from '@/utils/error-handler';
import Antd from 'ant-design-vue';
import NProgress from 'nprogress';
import { createApp, nextTick } from 'vue';

import App from './App.vue';
import '@/styles/tailwind.css';
import '@/styles/index.less';

/**
 * 公共微前端基座入口
 * 职责：门户容器、微前端调度、全局工程能力（无全局业务鉴权）
 */
export async function bootstrapApp() {
  NProgress.configure({ showSpinner: false });

  const app = createApp(App);
  setupStore(app);
  setupLoadingDirective(app);
  setupGlobalErrorHandler(app);

  app.use(Antd);
  app.use(router);
  setupEmbedBridge(router);

  await router.isReady();
  app.mount('#app');
  await nextTick();
  setupMicroApps(router);
}
