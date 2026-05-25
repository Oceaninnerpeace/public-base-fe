<script setup lang="ts">
import type { FormSchema } from './types';

import { computed, reactive, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    schemas: FormSchema[];
    model?: Record<string, unknown>;
    labelWidth?: number | string;
    layout?: 'horizontal' | 'vertical' | 'inline';
    showAction?: boolean;
    submitText?: string;
    resetText?: string;
  }>(),
  {
    layout: 'horizontal',
    labelWidth: 100,
    showAction: true,
    submitText: '提交',
    resetText: '重置',
  },
);

const emit = defineEmits<{
  submit: [Record<string, unknown>];
  reset: [];
}>();

const formModel = reactive<Record<string, unknown>>({ ...(props.model ?? {}) });

watch(
  () => props.model,
  (val) => {
    if (val) Object.assign(formModel, val);
  },
  { deep: true },
);

for (const schema of props.schemas) {
  if (formModel[schema.field] === undefined && schema.defaultValue !== undefined) {
    formModel[schema.field] = schema.defaultValue;
  }
}

const visibleSchemas = computed(() =>
  props.schemas.filter((s) => (s.ifShow ? s.ifShow(formModel) : true)),
);

async function onSubmit() {
  emit('submit', { ...formModel });
}

function onReset() {
  for (const s of props.schemas) {
    formModel[s.field] = s.defaultValue ?? undefined;
  }
  emit('reset');
}

defineExpose({
  getValues: () => ({ ...formModel }),
  setValues: (vals: Record<string, unknown>) => Object.assign(formModel, vals),
});
</script>

<template>
  <a-form :model="formModel" :layout="layout" :label-col="{ style: { width: `${labelWidth}px` } }">
    <a-row :gutter="16">
      <a-col v-for="schema in visibleSchemas" :key="schema.field" :span="schema.span ?? 24">
        <a-form-item
          :label="schema.label"
          :name="schema.field"
          :rules="
            schema.rules ??
            (schema.required ? [{ required: true, message: `请输入${schema.label}` }] : undefined)
          "
        >
          <a-input
            v-if="!schema.type || schema.type === 'input'"
            v-model:value="formModel[schema.field]"
            v-bind="schema.componentProps"
          />
          <a-input-password
            v-else-if="schema.type === 'password'"
            v-model:value="formModel[schema.field]"
            v-bind="schema.componentProps"
          />
          <a-textarea
            v-else-if="schema.type === 'textarea'"
            v-model:value="formModel[schema.field]"
            v-bind="schema.componentProps"
          />
          <a-select
            v-else-if="schema.type === 'select'"
            v-model:value="formModel[schema.field]"
            :options="schema.options"
            v-bind="schema.componentProps"
          />
          <a-date-picker
            v-else-if="schema.type === 'date'"
            v-model:value="formModel[schema.field]"
            style="width: 100%"
            v-bind="schema.componentProps"
          />
          <a-switch
            v-else-if="schema.type === 'switch'"
            v-model:checked="formModel[schema.field]"
            v-bind="schema.componentProps"
          />
          <a-input-number
            v-else-if="schema.type === 'number'"
            v-model:value="formModel[schema.field]"
            style="width: 100%"
            v-bind="schema.componentProps"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showAction">
      <a-space>
        <a-button type="primary" @click="onSubmit">{{ submitText }}</a-button>
        <a-button @click="onReset">{{ resetText }}</a-button>
        <slot name="action" />
      </a-space>
    </a-form-item>
  </a-form>
</template>
