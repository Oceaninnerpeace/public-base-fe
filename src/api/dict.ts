import type { DictItem } from '@/types/dict';

import { appEnv } from '@/config';
import { http } from '@/utils/request';

import { mockDictAll } from './mock-dict';

export async function getDictAllApi(): Promise<Record<string, DictItem[]>> {
  if (appEnv.useMock) return mockDictAll();
  return http({ url: '/system/dict/all', method: 'get' });
}

export async function getDictByCodeApi(code: string): Promise<DictItem[]> {
  if (appEnv.useMock) {
    const all = await mockDictAll();
    return all[code] ?? [];
  }
  return http({ url: `/system/dict/${code}`, method: 'get' });
}
