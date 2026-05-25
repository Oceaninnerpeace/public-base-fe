<script setup lang="ts">
import Page from '../Page/index.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    leftSpan?: number;
    rightSpan?: number;
    leftCollapsible?: boolean;
  }>(),
  {
    leftSpan: 8,
    rightSpan: 16,
    leftCollapsible: false,
  },
);

const collapsed = defineModel<boolean>('leftCollapsed', { default: false });
</script>

<template>
  <Page :title="title" :description="description">
    <template v-for="(_, name) in $slots" #[name]="data">
      <slot v-if="!['default', 'left'].includes(String(name))" :name="name" v-bind="data" />
    </template>
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>

    <a-row :gutter="16">
      <a-col v-show="!collapsed" :span="leftSpan">
        <slot name="left" :collapse="() => (collapsed = true)" :expand="() => (collapsed = false)" />
      </a-col>
      <a-col :span="collapsed ? 24 : rightSpan">
        <a-button
          v-if="leftCollapsible && collapsed"
          type="link"
          size="small"
          class="col-page__expand"
          @click="collapsed = false"
        >
          展开侧栏
        </a-button>
        <slot />
      </a-col>
    </a-row>
  </Page>
</template>

<style scoped lang="less">
.col-page__expand {
  margin-bottom: 8px;
}
</style>
