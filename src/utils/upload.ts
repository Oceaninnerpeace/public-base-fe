import type { UploadFile } from 'ant-design-vue';

const IMAGE_EXTENSIONS = new Set(['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp']);

export function isImageFile(file: UploadFile | File): boolean {
  if ('url' in file && file.url) {
    const ext = file.url.split('.').pop()?.toLowerCase();
    return ext ? IMAGE_EXTENSIONS.has(ext) : false;
  }
  const name = 'name' in file ? file.name : '';
  const type = 'type' in file ? file.type : '';
  if (type?.startsWith('image/')) return true;
  const ext = name.split('.').pop()?.toLowerCase();
  return ext ? IMAGE_EXTENSIONS.has(ext) : false;
}

export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function fileToUploadFile(file: File, url?: string): UploadFile {
  return {
    uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    status: 'done',
    url: url ?? URL.createObjectURL(file),
    originFileObj: file as UploadFile['originFileObj'],
  };
}
