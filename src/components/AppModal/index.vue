<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    width?: string | number;
    destroyOnClose?: boolean;
    confirmLoading?: boolean;
    showFooter?: boolean;
  }>(),
  {
    width: 720,
    destroyOnClose: true,
    showFooter: true,
  },
);

const open = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  ok: [];
  cancel: [];
}>();

function onOk() {
  emit('ok');
}

function onCancel() {
  open.value = false;
  emit('cancel');
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :width="width"
    :destroy-on-close="destroyOnClose"
    :confirm-loading="confirmLoading"
    @ok="onOk"
    @cancel="onCancel"
  >
    <slot />
    <template v-if="!showFooter" #footer>
      <slot name="footer" />
    </template>
  </a-modal>
</template>
