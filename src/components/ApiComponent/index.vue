<script setup lang="ts">
import type { Component } from 'vue';

import { cloneDeep, get, isEqual, isFunction } from '@/utils/object';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { computed, nextTick, ref, unref, useAttrs, watch } from 'vue';

export type ApiOption = {
  label?: string;
  value?: string | number;
  disabled?: boolean;
  children?: ApiOption[];
  [key: string]: unknown;
};

const props = withDefaults(
  defineProps<{
    component: Component;
    api?: (params?: Record<string, unknown>) => Promise<ApiOption[] | Record<string, unknown>>;
    params?: Record<string, unknown>;
    resultField?: string;
    labelField?: string;
    valueField?: string;
    disabledField?: string;
    childrenField?: string;
    optionsPropName?: string;
    modelPropName?: string;
    immediate?: boolean;
    alwaysLoad?: boolean;
    options?: ApiOption[];
    visibleEvent?: string;
    loadingSlot?: string;
    numberToString?: boolean;
    autoSelect?: 'first' | 'last' | 'one' | false | ((list: ApiOption[]) => ApiOption | undefined);
    beforeFetch?: (p: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
    shouldFetch?: (p: Record<string, unknown>) => Promise<boolean> | boolean;
    afterFetch?: (res: unknown) => Promise<unknown> | unknown;
  }>(),
  {
    labelField: 'label',
    valueField: 'value',
    disabledField: 'disabled',
    childrenField: 'children',
    optionsPropName: 'options',
    modelPropName: 'value',
    params: () => ({}),
    immediate: true,
    options: () => [],
  },
);

const emit = defineEmits<{ optionsChange: [ApiOption[]] }>();

const modelValue = defineModel<unknown>('value');
const attrs = useAttrs();
const innerParams = ref<Record<string, unknown>>({});
const refOptions = ref<ApiOption[]>([]);
const loading = ref(false);
const isFirstLoaded = ref(false);
const hasPending = ref(false);
const componentRef = ref();

function transform(list: ApiOption[] = []): ApiOption[] {
  return list.map((item) => {
    const value = get(item, props.valueField) as string | number;
    const children = (get(item, props.childrenField) as ApiOption[]) || item.children;
    return {
      ...item,
      label: String(get(item, props.labelField) ?? ''),
      value: props.numberToString ? String(value) : value,
      disabled: !!get(item, props.disabledField),
      ...(Array.isArray(children) && children.length
        ? { children: transform(children) }
        : {}),
    };
  });
}

const bindOptions = computed(() => {
  const data = transform(unref(refOptions));
  return data.length ? data : transform(props.options);
});

const bindProps = computed(() => ({
  [props.modelPropName]: unref(modelValue),
  [props.optionsPropName]: unref(bindOptions),
  [`onUpdate:${props.modelPropName}`]: (val: unknown) => {
    modelValue.value = val;
  },
  ...attrs,
  ...(props.visibleEvent
    ? {
        [props.visibleEvent]: handleVisible,
      }
    : {}),
}));

const mergedParams = computed(() => ({ ...props.params, ...unref(innerParams) }));

async function fetchApi() {
  if (!props.api || !isFunction(props.api)) return;
  if (loading.value) {
    hasPending.value = true;
    return;
  }
  refOptions.value = [];
  try {
    loading.value = true;
    let finalParams = unref(mergedParams);
    if (props.beforeFetch) finalParams = (await props.beforeFetch(cloneDeep(finalParams))) || finalParams;
    if (props.shouldFetch && !(await props.shouldFetch(finalParams))) return;
    let res = await props.api(finalParams);
    if (props.afterFetch) res = (await props.afterFetch(res)) || res;
    isFirstLoaded.value = true;
    if (Array.isArray(res)) refOptions.value = res;
    else if (props.resultField) refOptions.value = (get(res as Record<string, unknown>, props.resultField) as ApiOption[]) || [];
    emitChange();
  } finally {
    loading.value = false;
    if (hasPending.value) {
      hasPending.value = false;
      await nextTick();
      fetchApi();
    }
  }
}

async function handleVisible(visible: boolean) {
  if (!visible) return;
  if (props.alwaysLoad || (!props.immediate && !isFirstLoaded.value)) await fetchApi();
}

function emitChange() {
  const list = unref(bindOptions);
  if (modelValue.value === undefined && props.autoSelect && list.length) {
    let picked: ApiOption | undefined;
    if (isFunction(props.autoSelect)) picked = props.autoSelect(list);
    else if (props.autoSelect === 'first') picked = list[0];
    else if (props.autoSelect === 'last') picked = list[list.length - 1];
    else if (props.autoSelect === 'one' && list.length === 1) picked = list[0];
    if (picked) modelValue.value = picked.value;
  }
  emit('optionsChange', list);
}

watch(mergedParams, (v, o) => !isEqual(v, o) && fetchApi(), { deep: true, immediate: props.immediate });

defineExpose({
  getOptions: () => unref(bindOptions),
  getValue: () => unref(modelValue),
  getComponentRef: () => componentRef.value,
  updateParam: (p: Record<string, unknown>) => {
    innerParams.value = p;
  },
  reload: fetchApi,
});
</script>

<template>
  <component :is="component" v-bind="bindProps" ref="componentRef">
    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="name" v-bind="data || {}" />
    </template>
    <template v-if="loadingSlot && loading" #[loadingSlot]>
      <LoadingOutlined spin />
    </template>
  </component>
</template>
