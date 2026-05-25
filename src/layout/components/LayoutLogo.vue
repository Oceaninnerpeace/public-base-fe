<script setup lang="ts">
import { appEnv } from '@/config';
import { useLayoutStore } from '@/store/layout';

defineProps<{
  theme?: 'dark' | 'light';
}>();

const layoutStore = useLayoutStore();
</script>

<template>
  <div class="layout-logo" :class="[`layout-logo--${theme ?? 'dark'}`, { 'is-collapsed': layoutStore.collapsed }]">
    <div class="layout-logo__icon">A</div>
    <span v-show="!layoutStore.collapsed" class="layout-logo__title">{{ appEnv.title }}</span>
  </div>
</template>

<style scoped lang="less">
.layout-logo {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &--dark {
    color: #fff;
  }

  &--light {
    color: rgb(0 0 0 / 88%);
  }

  &.is-collapsed {
    justify-content: center;
    padding: 0;
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-weight: 700;
    background: @primary-color;
    border-radius: 8px;
  }

  &__title {
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
