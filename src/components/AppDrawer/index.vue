<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    width?: string | number;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    destroyOnClose?: boolean;
  }>(),
  {
    width: 480,
    placement: 'right',
    destroyOnClose: true,
  },
);

const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <a-drawer
    v-model:open="open"
    :title="title"
    :width="width"
    :placement="placement"
    :destroy-on-close="destroyOnClose"
    @close="emit('close')"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </a-drawer>
</template>
