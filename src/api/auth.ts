import type { LoginParams, LoginResult, UserInfo } from '@/types/api';
import { http } from '@/utils/request';

import { appEnv } from '@/config';

import { mockLogin, mockMenus, mockUserInfo } from './mock';

export async function loginApi(data: LoginParams): Promise<LoginResult> {
  if (appEnv.useMock) return mockLogin(data);
  return http({ url: '/auth/login', method: 'post', data });
}

export async function getUserInfoApi(): Promise<UserInfo> {
  if (appEnv.useMock) return mockUserInfo();
  return http({ url: '/auth/user' });
}

export async function getMenusApi() {
  if (appEnv.useMock) return mockMenus();
  return http({ url: '/auth/menus' });
}

export async function logoutApi(): Promise<void> {
  if (appEnv.useMock) return;
  return http({ url: '/auth/logout', method: 'post' });
}
