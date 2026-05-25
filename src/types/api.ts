export interface ApiResult<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  roles: string[];
  /** 按钮/接口级权限码 */
  permissions: string[];
}
