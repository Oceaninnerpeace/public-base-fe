<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import { computed, ref, useTemplateRef } from 'vue';

const props = defineProps<{
  actionStyle?: CSSProperties;
  isPassing?: boolean;
  toLeft?: boolean;
}>();

const actionRef = useTemplateRef<HTMLDivElement>('actionRef');
const left = ref('0');

const style = computed(() => ({ ...props.actionStyle, left: left.value }));

defineExpose({
  getEl: () => actionRef.value,
  getStyle: () => actionRef.value?.style,
  setLeft: (val: string) => {
    left.value = val;
  },
});
</script>

<template>
  <div
    ref="actionRef"
    class="slider-captcha__action"
    :class="{ 'slider-captcha__action--reset': toLeft, 'slider-captcha__action--drag': !isPassing }"
    :style="style"
  >
    <slot name="icon">
      <CheckOutlined v-if="isPassing" />
      <DoubleRightOutlined v-else />
    </slot>
  </div>
</template>
