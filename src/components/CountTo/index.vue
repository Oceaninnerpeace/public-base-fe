<script setup lang="ts">
import type { StyleValue } from 'vue';

import { TransitionPresets, useTransition } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';

import { isString } from '@/utils/is';

export interface CountToProps {
  startVal?: number;
  endVal: number;
  disabled?: boolean;
  delay?: number;
  duration?: number;
  decimals?: number;
  decimal?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  transition?: keyof typeof TransitionPresets | Parameters<typeof useTransition>[1]['transition'];
  mainClass?: string;
  decimalClass?: string;
  prefixClass?: string;
  suffixClass?: string;
  mainStyle?: StyleValue;
  decimalStyle?: StyleValue;
  prefixStyle?: StyleValue;
  suffixStyle?: StyleValue;
}

const props = withDefaults(defineProps<CountToProps>(), {
  startVal: 0,
  duration: 2000,
  separator: ',',
  decimal: '.',
  decimals: 0,
  delay: 0,
  transition: 'easeOutExpo',
});

const emit = defineEmits<{ started: []; finished: [] }>();

const lastValue = ref(props.startVal);

onMounted(() => {
  lastValue.value = props.endVal;
});

watch(
  () => props.endVal,
  (val) => {
    lastValue.value = val;
  },
);

const currentValue = useTransition(lastValue, {
  delay: computed(() => props.delay),
  duration: computed(() => props.duration),
  disabled: computed(() => props.disabled),
  transition: computed(() =>
    isString(props.transition) ? TransitionPresets[props.transition] : props.transition,
  ),
  onStarted: () => emit('started'),
  onFinished: () => emit('finished'),
});

const numMain = computed(() =>
  currentValue.value
    .toFixed(props.decimals)
    .split('.')[0]
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator),
);

const numDec = computed(() => {
  const part = currentValue.value.toFixed(props.decimals).split('.')[1];
  return part ? props.decimal + part : '';
});
</script>

<template>
  <div class="count-to">
    <span v-if="prefix || $slots.prefix" :class="prefixClass" :style="prefixStyle">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <span :class="mainClass" :style="mainStyle">
      {{ numMain }}<span v-if="decimals > 0" :class="decimalClass" :style="decimalStyle">{{
        numDec
      }}</span>
    </span>
    <span v-if="suffix || $slots.suffix" :class="suffixClass" :style="suffixStyle">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
  </div>
</template>

<style scoped lang="less">
.count-to {
  display: inline-flex;
  gap: 2px;
  align-items: baseline;
  font-size: 24px;
  font-weight: 600;
}
</style>
