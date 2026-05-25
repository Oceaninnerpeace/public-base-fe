<script setup lang="ts">
import { uploadFileApi } from '@/api/upload';
import ImageCropper from '@/components/ImageCropper/index.vue';
import { getBase64, isImageFile } from '@/utils/upload';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 最大文件大小 MB */
    maxSize?: number;
    /** 上传前是否裁剪（仅单图） */
    crop?: boolean;
    aspectRatio?: string;
    listType?: UploadProps['listType'];
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    placeholder?: string;
    /** 自定义上传，不传则走 mock/api */
    customUpload?: (file: File) => Promise<string>;
  }>(),
  {
    listType: 'picture-card',
    placeholder: '上传文件',
    multiple: false,
    crop: false,
  },
);

const fileList = defineModel<UploadFile[]>('fileList', { default: () => [] });

const previewVisible = ref(false);
const previewIndex = ref(0);
const cropOpen = ref(false);
const cropSrc = ref('');
const cropResolve = ref<((blob: Blob | string) => void) | null>(null);
const cropReject = ref<((err: Error) => void) | null>(null);
const cropperRef = ref<InstanceType<typeof ImageCropper>>();

const imagePreviewList = computed(() =>
  (fileList.value || []).filter((f) => isImageFile(f)).map((f) => f.url || f.thumbUrl || ''),
);

async function cropImage(file: File): Promise<Blob | string | undefined> {
  return new Promise((resolve, reject) => {
    cropSrc.value = URL.createObjectURL(file);
    cropResolve.value = resolve;
    cropReject.value = reject;
    cropOpen.value = true;
  });
}

async function onCropOk() {
  try {
    const result = await cropperRef.value?.getCropImage('image/png', 0.92, 'base64');
    if (result) cropResolve.value?.(result);
    else cropReject.value?.(new Error('裁剪失败'));
  } catch (e) {
    cropReject.value?.(e as Error);
  } finally {
    cropOpen.value = false;
    if (cropSrc.value) URL.revokeObjectURL(cropSrc.value);
  }
}

function onCropCancel() {
  cropResolve.value?.('');
  cropOpen.value = false;
  if (cropSrc.value) URL.revokeObjectURL(cropSrc.value);
}

const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  const sizeMb = (file.size || 0) / 1024 / 1024;
  if (props.maxSize && sizeMb > props.maxSize) {
    message.error(`文件不能超过 ${props.maxSize}MB`);
    return false;
  }
  if (props.crop && !props.multiple && isImageFile(file)) {
    const blob = await cropImage(file as File);
    if (!blob) return false;
    if (typeof blob === 'string') {
      const res = await fetch(blob);
      return res.blob();
    }
    return blob;
  }
  return true;
};

const customRequest: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError, onProgress } = options;
  try {
    onProgress?.({ percent: 30 });
    const raw = file as File;
    const url = props.customUpload
      ? await props.customUpload(raw)
      : (await uploadFileApi(raw)).url;
    onProgress?.({ percent: 100 });
    onSuccess?.({ url });
  } catch (e) {
    onError?.(e as Error);
  }
};

function onChange(info: UploadChangeParam) {
  fileList.value = info.fileList.filter((f) => f.status !== 'removed');
}

async function onPreview(file: UploadFile) {
  if (!isImageFile(file)) {
    const url = file.url || file.preview;
    if (url) window.open(url, '_blank');
    return;
  }
  const list = fileList.value || [];
  for (const f of list) {
    if (!f.url && !f.preview && f.originFileObj) {
      f.preview = await getBase64(f.originFileObj as File);
    }
  }
  previewIndex.value = list.findIndex((f) => f.uid === file.uid);
  previewVisible.value = true;
}

</script>

<template>
  <div class="file-upload">
    <a-upload
      v-model:file-list="fileList"
      :list-type="listType"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @change="onChange"
      @preview="onPreview"
    >
      <template v-if="listType === 'picture-card'">
        <div v-if="!disabled">
          <UploadOutlined />
          <div class="file-upload__placeholder">{{ placeholder }}</div>
        </div>
      </template>
      <a-button v-else-if="!disabled">
        <UploadOutlined />
        {{ placeholder }}
      </a-button>
    </a-upload>

    <div style="display: none">
      <a-image-preview-group
        :preview="{
          visible: previewVisible,
          current: previewIndex,
          onVisibleChange: (v: boolean) => (previewVisible = v),
        }"
      >
        <a-image v-for="(src, i) in imagePreviewList" :key="i" :src="src" />
      </a-image-preview-group>
    </div>

    <a-modal
      v-model:open="cropOpen"
      title="裁剪图片"
      :width="560"
      :mask-closable="false"
      ok-text="确认"
      cancel-text="取消"
      @ok="onCropOk"
      @cancel="onCropCancel"
    >
      <ImageCropper v-if="cropOpen && cropSrc" ref="cropperRef" :img="cropSrc" :aspect-ratio="aspectRatio" />
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.file-upload {
  &__placeholder {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
