<script setup lang="ts">
import * as AntIcons from '@ant-design/icons-vue';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    icons?: string[];
    pageSize?: number;
    placeholder?: string;
  }>(),
  {
    icons: () => [],
    pageSize: 36,
    placeholder: '请选择图标',
  },
);

const modelValue = defineModel<string>({ default: '' });
const visible = ref(false);
const keyword = ref('');
const page = ref(1);

const allIcons = computed(() => {
  if (props.icons.length) return props.icons;
  return Object.keys(AntIcons).filter((k) => k.endsWith('Outlined'));
});

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  if (!kw) return allIcons.value;
  return allIcons.value.filter((name) => name.toLowerCase().includes(kw));
});

const pageIcons = computed(() => {
  const start = (page.value - 1) * props.pageSize;
  return filtered.value.slice(start, start + props.pageSize);
});

const total = computed(() => filtered.value.length);

function selectIcon(name: string) {
  modelValue.value = name;
  visible.value = false;
}

function renderIcon(name: string) {
  const comp = (AntIcons as Record<string, unknown>)[name];
  return comp ? comp : null;
}
</script>

<template>
  <a-popover v-model:open="visible" trigger="click" placement="bottomLeft">
    <a-input :value="modelValue" :placeholder="placeholder" readonly>
      <template v-if="modelValue" #prefix>
        <component :is="renderIcon(modelValue)" />
      </template>
      <template #suffix>
        <a-button type="link" size="small">选择</a-button>
      </template>
    </a-input>
    <template #content>
      <a-input v-model:value="keyword" allow-clear placeholder="搜索图标" style="margin-bottom: 8px" />
      <div class="icon-picker__grid">
        <a-tooltip v-for="name in pageIcons" :key="name" :title="name">
          <a-button
            :type="modelValue === name ? 'primary' : 'default'"
            class="icon-picker__item"
            @click="selectIcon(name)"
          >
            <component :is="renderIcon(name)" />
          </a-button>
        </a-tooltip>
      </div>
      <a-pagination
        v-model:current="page"
        size="small"
        :total="total"
        :page-size="pageSize"
        style="margin-top: 8px; text-align: right"
      />
    </template>
  </a-popover>
</template>

<style scoped lang="less">
.icon-picker__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 320px;
}

.icon-picker__item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
}
</style>
