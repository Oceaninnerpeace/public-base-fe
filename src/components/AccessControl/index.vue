<script setup lang="ts">
import { usePermission } from '@/hooks/usePermission';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    codes?: string | string[];
    type?: 'code' | 'role';
  }>(),
  {
    type: 'code',
  },
);

const { hasAuth, hasAnyRole } = usePermission();

const visible = computed(() => {
  if (!props.codes || (Array.isArray(props.codes) && !props.codes.length)) return true;
  return props.type === 'role' ? hasAnyRole(props.codes) : hasAuth(props.codes);
});
</script>

<template>
  <slot v-if="visible" />
</template>
