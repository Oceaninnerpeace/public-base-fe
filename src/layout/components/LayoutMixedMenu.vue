<script setup lang="ts">
import type { MenuRecord } from '@/types/router';

import * as Icons from '@ant-design/icons-vue';
import { computed, h } from 'vue';

const props = defineProps<{
  menus: MenuRecord[];
  activePath?: string;
}>();

const emit = defineEmits<{
  select: [MenuRecord];
  enter: [MenuRecord];
}>();

function renderIcon(name?: string) {
  if (!name) return () => h(Icons.AppstoreOutlined);
  const IconComp = (Icons as Record<string, unknown>)[name];
  if (IconComp && typeof IconComp === 'object') {
    return () => h(IconComp as Parameters<typeof h>[0]);
  }
  return () => h(Icons.AppstoreOutlined);
}

const items = computed(() => props.menus);
</script>

<template>
  <ul class="mixed-menu">
    <li
      v-for="menu in items"
      :key="menu.path"
      class="mixed-menu__item"
      :class="{ 'mixed-menu__item--active': activePath === menu.path }"
      @click="emit('select', menu)"
      @mouseenter="emit('enter', menu)"
    >
      <component :is="renderIcon(menu.icon)" class="mixed-menu__icon" />
      <span class="mixed-menu__name">{{ menu.title ?? menu.name }}</span>
    </li>
  </ul>
</template>

<style scoped lang="less">
.mixed-menu {
  width: 72px;
  margin: 0;
  padding: 8px 4px;
  list-style: none;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 4px;
    margin-bottom: 4px;
    color: rgb(255 255 255 / 65%);
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      color: #fff;
      background: rgb(255 255 255 / 8%);
    }

    &--active {
      color: #fff;
      background: @primary-color;
    }
  }

  &__icon {
    font-size: 20px;
  }

  &__name {
    width: 100%;
    margin-top: 6px;
    overflow: hidden;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
