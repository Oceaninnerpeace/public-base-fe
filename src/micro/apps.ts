import { portalAppsToMicroConfigs } from '@/config/portal-apps';
import { appEnv } from '@/config';

/** Qiankun 子应用注册（来源于 portal-apps 配置） */
export const microApps = portalAppsToMicroConfigs();

export const microEnabled = appEnv.microEnabled;
