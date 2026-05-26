<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadChangeParam, UploadFile, UploadProps } from 'ant-design-vue'
import { pbMessage } from '../../feedback/message'

defineOptions({ name: 'PbUpload' })

const props = withDefaults(
  defineProps<{
    maxSize?: number
    accept?: string
    multiple?: boolean
    disabled?: boolean
    listType?: UploadProps['listType']
    /** 自定义上传，返回文件 URL */
    customUpload?: (file: File) => Promise<string>
  }>(),
  {
    listType: 'text',
    multiple: false,
    disabled: false,
  },
)

const fileList = defineModel<UploadFile[]>('fileList', { default: () => [] })

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const sizeMb = (file.size || 0) / 1024 / 1024
  if (props.maxSize && sizeMb > props.maxSize) {
    pbMessage.error(`文件不能超过 ${props.maxSize}MB`)
    return false
  }
  return true
}

const customRequest: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError } = options
  const raw = file as File
  try {
    if (props.customUpload) {
      const url = await props.customUpload(raw)
      onSuccess?.({ url })
    } else {
      onSuccess?.({ url: URL.createObjectURL(raw) })
    }
  } catch (e) {
    onError?.(e as Error)
    pbMessage.error('上传失败')
  }
}

function onChange(info: UploadChangeParam) {
  fileList.value = [...info.fileList]
}
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    :list-type="listType"
    :accept="accept"
    :multiple="multiple"
    :disabled="disabled"
    :before-upload="beforeUpload"
    :custom-request="customRequest"
    @change="onChange"
  >
    <slot>
      <a-button>
        <UploadOutlined />
        上传文件
      </a-button>
    </slot>
  </a-upload>
</template>
