<script setup lang="ts">
import { CountTo, FileUpload, ImageCropper, Page } from '@/components';
import { ref } from 'vue';
import type { UploadFile } from 'ant-design-vue';

const uploadList = ref<UploadFile[]>([]);
const avatarList = ref<UploadFile[]>([]);
const demoImg = ref(
  'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
);
const cropperRef = ref<InstanceType<typeof ImageCropper>>();

async function applyCrop() {
  const data = await cropperRef.value?.getCropImage('image/png', 0.9, 'base64');
  if (data && typeof data === 'string') demoImg.value = data;
}
</script>

<template>
  <Page title="工作台" description="布局参考 vben：侧边栏 + 顶栏 + 标签页 + 面包屑">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="今日访问">
          <CountTo :end-val="1286" suffix=" 次" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="待办">
          <CountTo :end-val="12" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="消息">
          <CountTo :end-val="3" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="12">
        <a-card title="文件上传">
          <p class="demo-tip">多图上传（picture-card）</p>
          <FileUpload v-model:file-list="uploadList" multiple />
          <p class="demo-tip" style="margin-top: 16px">头像上传（裁剪 1:1）</p>
          <FileUpload
            v-model:file-list="avatarList"
            :max-size="2"
            crop
            aspect-ratio="1:1"
            list-type="picture-card"
            placeholder="上传头像"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="图片裁剪">
          <ImageCropper ref="cropperRef" :img="demoImg" aspect-ratio="16:9" :width="480" :height="270" />
          <a-button type="primary" style="margin-top: 12px" @click="applyCrop">应用裁剪结果</a-button>
        </a-card>
      </a-col>
    </a-row>
  </Page>
</template>

<style scoped lang="less">
.demo-tip {
  margin-bottom: 8px;
  color: @text-color-secondary;
  font-size: 13px;
}
</style>
