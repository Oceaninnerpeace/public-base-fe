<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';

export interface PageProps {
  title?: string;
  description?: string;
  contentClass?: string;
  headerClass?: string;
  footerClass?: string;
  /** 内容区按可视高度自适应滚动 */
  autoContentHeight?: boolean;
  heightOffset?: number;
  footerFixed?: boolean;
}

const props = withDefaults(defineProps<PageProps>(), {
  autoContentHeight: false,
  heightOffset: 0,
  footerFixed: false,
});

const headerRef = useTemplateRef<HTMLDivElement>('headerRef');
const footerRef = useTemplateRef<HTMLDivElement>('footerRef');
const headerHeight = ref(0);
const footerHeight = ref(0);
const shouldAutoHeight = ref(false);

const contentStyle = computed<CSSProperties>(() => {
  if (!props.autoContentHeight) return {};
  const offset =
    typeof props.heightOffset === 'number' ? `${props.heightOffset}px` : props.heightOffset;
  return {
    height: `calc(100vh - ${headerHeight.value}px - ${footerHeight.value}px - ${offset} - 120px)`,
    overflowY: shouldAutoHeight.value ? 'auto' : 'hidden',
  };
});

async function calcContentHeight() {
  if (!props.autoContentHeight) return;
  shouldAutoHeight.value = false;
  await nextTick();
  headerHeight.value = headerRef.value?.offsetHeight ?? 0;
  footerHeight.value = props.footerFixed ? 0 : (footerRef.value?.offsetHeight ?? 0);
  setTimeout(() => {
    shouldAutoHeight.value = true;
  }, 30);
}

onMounted(calcContentHeight);
</script>

<template>
  <div class="app-page">
    <div
      v-if="title || description || $slots.title || $slots.description || $slots.extra"
      ref="headerRef"
      :class="['app-page__header', headerClass]"
    >
      <div class="app-page__header-main">
        <slot name="title">
          <h2 v-if="title" class="app-page__title">{{ title }}</h2>
        </slot>
        <slot name="description">
          <p v-if="description" class="app-page__desc">{{ description }}</p>
        </slot>
      </div>
      <div v-if="$slots.extra" class="app-page__extra">
        <slot name="extra" />
      </div>
    </div>

    <a-card :bordered="false" :class="['app-page__body', contentClass]" :style="contentStyle">
      <slot />
    </a-card>

    <div v-if="$slots.footer" ref="footerRef" :class="['app-page__footer', footerClass]">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="less">
.app-page {
  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  &__desc {
    margin: 4px 0 0;
    color: @text-color-secondary;
  }

  &__footer {
    margin-top: 16px;
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
