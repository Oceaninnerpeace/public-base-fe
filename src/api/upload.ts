import type { UploadFile } from 'ant-design-vue';

import { appEnv } from '@/config';
import { http } from '@/utils/request';

/** Mock 上传，返回可访问 URL */
export async function uploadFileApi(file: File): Promise<{ url: string }> {
  if (appEnv.useMock) {
    await new Promise((r) => setTimeout(r, 500));
    return { url: URL.createObjectURL(file) };
  }
  const form = new FormData();
  form.append('file', file);
  return http({
    url: '/upload',
    method: 'post',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function uploadFilesApi(files: File[]): Promise<UploadFile[]> {
  const results = await Promise.all(files.map((f) => uploadFileApi(f)));
  return files.map((file, i) => ({
    uid: `${Date.now()}-${i}`,
    name: file.name,
    status: 'done',
    url: results[i]?.url,
  }));
}
