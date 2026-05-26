<script setup lang="ts">
import type { QueryFieldSchema } from '../../types/form'

import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { computed, reactive, ref } from 'vue'

import PbQueryBar from './PbQueryBar.vue'

defineOptions({ name: 'PbAdvancedSearch' })

const props = withDefaults(
  defineProps<{
    fields: QueryFieldSchema[]
    /** 收起时展示的字段数 */
    collapsedCount?: number
    modelValue?: Record<string, unknown>
    dictLoader?: (dictCode: string) => Promise<{ label: string; value: string | number }[]>
  }>(),
  {
    collapsedCount: 3,
  },
)

const emit = defineEmits<{
  'update:modelValue': [Record<string, unknown>]
  search: [Record<string, unknown>]
  reset: []
}>()

const expanded = ref(false)
const formModel = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

const visibleFields = computed(() =>
  expanded.value ? props.fields : props.fields.slice(0, props.collapsedCount),
)

const hasMore = computed(() => props.fields.length > props.collapsedCount)

function onSearch(params: Record<string, unknown>) {
  Object.assign(formModel, params)
  emit('update:modelValue', { ...formModel })
  emit('search', { ...formModel })
}

function onReset() {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  emit('update:modelValue', { ...formModel })
  emit('reset')
  emit('search', { ...formModel })
}
</script>

<template>
  <div class="pb-advanced-search">
    <PbQueryBar
      :fields="visibleFields"
      :model-value="formModel"
      :dict-loader="dictLoader"
      @search="onSearch"
      @reset="onReset"
    >
      <template #extra>
        <a-button v-if="hasMore" type="link" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
          <UpOutlined v-if="expanded" />
          <DownOutlined v-else />
        </a-button>
        <slot name="extra" :model="formModel" />
      </template>
    </PbQueryBar>
  </div>
</template>
