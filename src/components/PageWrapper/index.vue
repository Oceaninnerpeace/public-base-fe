<script setup lang="ts">
/** @deprecated 请使用 Page 组件，保留别名便于迁移 */
import Page from '../Page/index.vue';

defineProps<{
  title?: string;
  subTitle?: string;
}>();
</script>

<template>
  <Page :title="title" :description="subTitle">
    <template v-if="$slots.extra" #extra>
      <slot name="extra" />
    </template>
    <slot />
  </Page>
</template>
