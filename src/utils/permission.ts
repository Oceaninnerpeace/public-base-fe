import { isArray } from './is';

/** 判断是否拥有权限（任一匹配即可） */
export function hasPermission(
  userPermissions: string[],
  required?: string | string[],
): boolean {
  if (!required) return true;
  const codes = isArray(required) ? required : [required];
  if (!codes.length) return true;
  return codes.some((code) => userPermissions.includes(code));
}

/** 判断是否拥有角色（任一匹配即可） */
export function hasRole(userRoles: string[], required?: string | string[]): boolean {
  if (!required) return true;
  const roles = isArray(required) ? required : [required];
  if (!roles.length) return true;
  return roles.some((role) => userRoles.includes(role));
}
