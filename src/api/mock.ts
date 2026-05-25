import type { LoginParams, LoginResult, UserInfo } from '@/types/api';
import type { MenuRecord } from '@/types/router';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/** 演示账号：admin / user */
const USERS: Record<string, UserInfo & { password: string }> = {
  admin: {
    id: '1',
    username: 'admin',
    password: '123456',
    nickname: '超级管理员',
    roles: ['admin'],
    permissions: ['*'],
  },
  user: {
    id: '2',
    username: 'user',
    password: '123456',
    nickname: '普通用户',
    roles: ['user'],
    permissions: [
      'dashboard:view',
      'system:user:view',
      'uav:view',
      'power:view',
    ],
  },
};

export async function mockLogin(data: LoginParams): Promise<LoginResult> {
  await delay();
  const user = USERS[data.username];
  if (!user || user.password !== data.password) {
    throw new Error('用户名或密码错误');
  }
  return { token: `mock-token-${user.username}` };
}

export async function mockUserInfo(): Promise<UserInfo> {
  await delay();
  const token = localStorage.getItem('ADMIN_TOKEN') ?? '';
  const username = token.replace('mock-token-', '') || 'admin';
  const user = USERS[username] ?? USERS.admin;
  const { password: _pwd, ...info } = user;
  return info;
}

/** 基座不再从接口拉取业务菜单，仅保留 API 兼容 */
export async function mockMenus(): Promise<MenuRecord[]> {
  await delay();
  return [];
}
