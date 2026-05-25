<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed, useTemplateRef } from 'vue';

const props = defineProps<{
  contentStyle?: CSSProperties;
  isPassing?: boolean;
  successText?: string;
  text?: string;
}>();

const contentRef = useTemplateRef<HTMLDivElement>('contentRef');
const style = computed(() => ({ ...props.contentStyle }));

defineExpose({
  getEl: () => contentRef.value,
});
</script>

<template>
  <div
    ref="contentRef"
    class="slider-captcha__content"
    :class="{ 'slider-captcha__content--success': isPassing }"
    :style="style"
  >
    <slot name="text">
      {{ isPassing ? successText : text }}
    </slot>
  </div>
</template>
