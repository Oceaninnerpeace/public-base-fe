import { message } from 'ant-design-vue';
import { createRequest } from '@Oceaninnerpeace/public-base-request';
import type { AxiosRequestConfig } from 'axios';

import { appEnv } from '@/config';

import { getToken, removeToken } from './auth';

const request = createRequest({
  baseURL: appEnv.apiUrl,
  timeout: 15000,
  businessOkCodes: [0],
  resolveWithBusinessData: true,
  getToken,
  notify: { error: (msg) => message.error(msg) },
  onUnauthorized() {
    removeToken();
    window.location.href = `/portal?redirect=${encodeURIComponent(location.pathname)}`;
  },
});

export function http<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return request(config) as Promise<T>;
}

export default request;
