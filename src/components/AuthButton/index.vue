<script setup lang="ts">
/** 权限按钮，等价于 AccessControl */
import AccessControl from '../AccessControl/index.vue';

defineProps<{
  auth?: string | string[];
}>();
</script>

<template>
  <AccessControl :codes="auth" type="code">
    <slot />
  </AccessControl>
</template>
