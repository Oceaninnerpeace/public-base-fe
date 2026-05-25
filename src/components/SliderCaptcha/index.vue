<script setup lang="ts">
import type { CaptchaPassData, SliderCaptchaProps } from './types';

import { useTimeoutFn } from '@vueuse/core';
import { reactive, unref, useTemplateRef, watch, watchEffect } from 'vue';

import SliderCaptchaAction from './SliderCaptchaAction.vue';
import SliderCaptchaBar from './SliderCaptchaBar.vue';
import SliderCaptchaContent from './SliderCaptchaContent.vue';

const props = withDefaults(defineProps<SliderCaptchaProps>(), {
  successText: '验证通过',
  text: '请按住滑块拖动',
});

const emit = defineEmits<{
  success: [CaptchaPassData];
  start: [MouseEvent | TouchEvent];
  end: [MouseEvent | TouchEvent];
}>();

const modelValue = defineModel<boolean>({ default: false });

const state = reactive({
  isMoving: false,
  isPassing: false,
  moveDistance: 0,
  startTime: 0,
  endTime: 0,
  toLeft: false,
});

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef');
const barRef = useTemplateRef<InstanceType<typeof SliderCaptchaBar>>('barRef');
const contentRef = useTemplateRef<InstanceType<typeof SliderCaptchaContent>>('contentRef');
const actionRef = useTemplateRef<InstanceType<typeof SliderCaptchaAction>>('actionRef');

defineExpose({ resume });

watch(
  () => state.isPassing,
  (isPassing) => {
    if (isPassing) {
      const time = ((state.endTime - state.startTime) / 1000).toFixed(1);
      emit('success', { isPassing, time });
      modelValue.value = true;
    }
  },
);

watchEffect(() => {
  state.isPassing = !!modelValue.value;
});

function getPageX(e: MouseEvent | TouchEvent) {
  if ('pageX' in e) return e.pageX;
  return e.touches[0]?.pageX ?? 0;
}

function getOffset(actionEl: HTMLDivElement) {
  const wrapperWidth = wrapperRef.value?.offsetWidth ?? 300;
  const actionWidth = actionEl.offsetWidth;
  return { actionWidth, offset: wrapperWidth - actionWidth - 6, wrapperWidth };
}

function handleStart(e: MouseEvent | TouchEvent) {
  if (state.isPassing) return;
  const actionEl = actionRef.value?.getEl();
  const actionStyle = actionRef.value?.getStyle();
  if (!actionEl || !actionStyle) return;
  emit('start', e);
  state.moveDistance = getPageX(e) - Number.parseInt(actionStyle.left || '0', 10);
  state.startTime = Date.now();
  state.isMoving = true;
}

function handleMove(e: MouseEvent | TouchEvent) {
  if (!state.isMoving) return;
  const action = actionRef.value;
  const bar = barRef.value;
  const actionEl = action?.getEl();
  if (!action || !bar || !actionEl) return;
  const { actionWidth, offset, wrapperWidth } = getOffset(actionEl);
  const moveX = getPageX(e) - state.moveDistance;
  if (moveX > 0 && moveX <= offset) {
    action.setLeft(`${moveX}px`);
    bar.setWidth(`${moveX + actionWidth / 2}px`);
  } else if (moveX > offset) {
    action.setLeft(`${wrapperWidth - actionWidth}px`);
    bar.setWidth(`${wrapperWidth - actionWidth / 2}px`);
    checkPass();
  }
}

function handleEnd(e: MouseEvent | TouchEvent) {
  if (!state.isMoving || state.isPassing) return;
  emit('end', e);
  const action = actionRef.value;
  const bar = barRef.value;
  const actionEl = action?.getEl();
  if (!action || !bar || !actionEl) return;
  const moveX = getPageX(e) - state.moveDistance;
  const { actionWidth, offset, wrapperWidth } = getOffset(actionEl);
  if (moveX < offset) {
    resume();
  } else {
    action.setLeft(`${wrapperWidth - actionWidth}px`);
    bar.setWidth(`${wrapperWidth - actionWidth / 2}px`);
    checkPass();
  }
  state.isMoving = false;
}

function checkPass() {
  state.endTime = Date.now();
  state.isPassing = true;
  state.isMoving = false;
}

function resume() {
  state.isMoving = false;
  state.isPassing = false;
  state.moveDistance = 0;
  state.toLeft = false;
  state.startTime = 0;
  state.endTime = 0;
  modelValue.value = false;
  const action = unref(actionRef);
  const bar = unref(barRef);
  const content = unref(contentRef);
  if (!action || !bar || !content) return;
  const contentEl = content.getEl();
  if (contentEl) contentEl.style.width = '100%';
  state.toLeft = true;
  useTimeoutFn(() => {
    state.toLeft = false;
    action.setLeft('0');
    bar.setWidth('0');
  }, 300);
}
</script>

<template>
  <div
    ref="wrapperRef"
    class="slider-captcha"
    :class="props.class"
    :style="wrapperStyle"
    @mouseleave="handleEnd"
    @mousemove="handleMove"
    @mouseup="handleEnd"
    @touchend="handleEnd"
    @touchmove="handleMove"
  >
    <SliderCaptchaBar ref="barRef" :bar-style="barStyle" :to-left="state.toLeft" />
    <SliderCaptchaContent
      ref="contentRef"
      :content-style="contentStyle"
      :is-passing="state.isPassing"
      :success-text="successText"
      :text="text"
    />
    <SliderCaptchaAction
      ref="actionRef"
      :action-style="actionStyle"
      :is-passing="state.isPassing"
      :to-left="state.toLeft"
      @mousedown="handleStart"
      @touchstart="handleStart"
    />
  </div>
</template>

<style scoped lang="less">
.slider-captcha {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  overflow: hidden;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 6px;

  :deep(.slider-captcha__bar) {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #52c41a;
    transition: width 0.05s linear;

    &--reset {
      transition: width 0.3s ease;
    }
  }

  :deep(.slider-captcha__content) {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
    user-select: none;
    pointer-events: none;

    &--success {
      color: #fff;
    }
  }

  :deep(.slider-captcha__action) {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    cursor: move;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgb(0 0 0 / 12%);

    &--reset {
      transition: left 0.3s ease;
    }

    &--drag {
      border-radius: 4px;
    }
  }
}
</style>
