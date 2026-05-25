<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed, ref, useTemplateRef } from 'vue';

const props = defineProps<{
  barStyle?: CSSProperties;
  toLeft?: boolean;
}>();

const barRef = useTemplateRef<HTMLDivElement>('barRef');
const width = ref('0');

const style = computed(() => ({ ...props.barStyle, width: width.value }));

defineExpose({
  getEl: () => barRef.value,
  setWidth: (val: string) => {
    width.value = val;
  },
});
</script>

<template>
  <div
    ref="barRef"
    class="slider-captcha__bar"
    :class="{ 'slider-captcha__bar--reset': toLeft }"
    :style="style"
  />
</template>
