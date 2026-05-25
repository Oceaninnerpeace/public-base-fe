import type { DictItem } from '@/types/dict';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export async function mockDictAll(): Promise<Record<string, DictItem[]>> {
  await delay();
  return {
    sys_user_status: [
      { label: '启用', value: '1', color: 'success' },
      { label: '禁用', value: '0', color: 'error' },
    ],
    sys_role_type: [
      { label: '系统角色', value: 'system' },
      { label: '业务角色', value: 'business' },
    ],
    sys_yes_no: [
      { label: '是', value: '1' },
      { label: '否', value: '0' },
    ],
  };
}
