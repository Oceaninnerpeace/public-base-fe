<script setup lang="ts">
import type { QueryFieldSchema } from '../../types/form'

import { reactive } from 'vue'

import { useDebounceFn } from '../../composables/useDebounceFn'
import PbDictSelect from './PbDictSelect.vue'

defineOptions({ name: 'PbQueryBar' })

const props = withDefaults(
  defineProps<{
    fields: QueryFieldSchema[]
    modelValue?: Record<string, unknown>
    debounceMs?: number
    dictLoader?: (dictCode: string) => Promise<{ label: string; value: string | number }[]>
  }>(),
  {
    debounceMs: 0,
  },
)

const emit = defineEmits<{
  'update:modelValue': [Record<string, unknown>]
  search: [Record<string, unknown>]
  reset: []
}>()

const formModel = reactive<Record<string, unknown>>({ ...(props.modelValue ?? {}) })

function syncEmit() {
  emit('update:modelValue', { ...formModel })
  emit('search', { ...formModel })
}

const triggerSearch =
  props.debounceMs > 0 ? useDebounceFn(syncEmit, props.debounceMs) : syncEmit

function onSearch() {
  triggerSearch()
}

function onReset() {
  Object.keys(formModel).forEach((k) => delete formModel[k])
  emit('update:modelValue', { ...formModel })
  emit('reset')
  triggerSearch()
}
</script>

<template>
  <a-form layout="inline" class="pb-query-bar">
    <a-form-item v-for="field in fields" :key="field.field" :label="field.label">
      <a-input
        v-if="!field.type || field.type === 'input'"
        v-model:value="formModel[field.field]"
        :placeholder="field.placeholder ?? `请输入${field.label}`"
        allow-clear
        @press-enter="onSearch"
      />
      <a-select
        v-else-if="field.type === 'select'"
        v-model:value="formModel[field.field]"
        :options="field.options"
        :placeholder="field.placeholder"
        allow-clear
        style="min-width: 160px"
      />
      <PbDictSelect
        v-else-if="field.type === 'dict'"
        :model-value="formModel[field.field] as string | number | undefined"
        @update:model-value="(v) => (formModel[field.field] = v)"
        :dict-code="field.dictCode"
        :options="field.options"
        :loader="dictLoader"
        :placeholder="field.placeholder"
        style="min-width: 160px"
      />
      <a-date-picker
        v-else-if="field.type === 'date'"
        v-model:value="formModel[field.field]"
        style="min-width: 160px"
      />
      <slot v-else :name="field.field" :model="formModel" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button @click="onReset">重置</a-button>
        <slot name="extra" :model="formModel" />
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style scoped>
.pb-query-bar {
  margin-bottom: 16px;
}
</style>
