<script setup lang="ts">
import { computed } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const props = withDefaults(
  defineProps<{
    value?: Record<string, unknown> | string | unknown[];
    expandDepth?: number;
    deep?: number;
    showLineNumber?: boolean;
    showIcon?: boolean;
    showLength?: boolean;
    showLine?: boolean;
    collapsedOnClickBrackets?: boolean;
  }>(),
  {
    value: () => ({}),
    expandDepth: 2,
    deep: 3,
    showLineNumber: true,
    showIcon: true,
    showLength: true,
    showLine: true,
    collapsedOnClickBrackets: true,
  },
);

const jsonData = computed(() => {
  if (typeof props.value !== 'string') return props.value ?? {};
  try {
    return JSON.parse(props.value) as Record<string, unknown>;
  } catch {
    return { error: 'Invalid JSON string' };
  }
});
</script>

<template>
  <div class="json-viewer">
    <VueJsonPretty
      :data="jsonData"
      :deep="deep"
      :show-line-number="showLineNumber"
      :show-icon="showIcon"
      :show-length="showLength"
      :show-line="showLine"
      :collapsed-on-click-brackets="collapsedOnClickBrackets"
    />
  </div>
</template>

<style scoped lang="less">
.json-viewer {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}
</style>
