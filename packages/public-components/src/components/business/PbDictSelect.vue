<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

defineOptions({ name: 'PbDictSelect' })

export interface DictOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    dictCode?: string
    options?: DictOption[]
    /** 异步加载字典项：(dictCode) => options */
    loader?: (dictCode: string) => Promise<DictOption[]>
    placeholder?: string
    allowClear?: boolean
    mode?: 'multiple' | 'tags'
    disabled?: boolean
  }>(),
  {
    placeholder: '请选择',
    allowClear: true,
    disabled: false,
  },
)

const model = defineModel<string | number | (string | number)[] | undefined>()
const innerOptions = ref<DictOption[]>(props.options ?? [])
const loading = ref(false)

async function loadOptions() {
  if (props.options?.length) {
    innerOptions.value = props.options
    return
  }
  if (!props.dictCode || !props.loader) return
  loading.value = true
  try {
    innerOptions.value = await props.loader(props.dictCode)
  } finally {
    loading.value = false
  }
}

onMounted(loadOptions)
watch(() => [props.dictCode, props.options], loadOptions, { deep: true })
</script>

<template>
  <a-select
    v-model:value="model"
    :options="innerOptions"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :mode="mode"
    :disabled="disabled"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
