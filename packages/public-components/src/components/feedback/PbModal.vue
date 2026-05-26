<script setup lang="ts">
defineOptions({ name: 'PbModal' })

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string | number
    destroyOnClose?: boolean
    confirmLoading?: boolean
    showFooter?: boolean
    okText?: string
    cancelText?: string
  }>(),
  {
    width: 720,
    destroyOnClose: true,
    showFooter: true,
    okText: '确定',
    cancelText: '取消',
  },
)

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ ok: []; cancel: [] }>()
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :width="width"
    :destroy-on-close="destroyOnClose"
    :confirm-loading="confirmLoading"
    :ok-text="okText"
    :cancel-text="cancelText"
    v-bind="$attrs"
    @ok="emit('ok')"
    @cancel="emit('cancel')"
  >
    <slot />
    <template v-if="!showFooter" #footer>
      <slot name="footer" />
    </template>
  </a-modal>
</template>
