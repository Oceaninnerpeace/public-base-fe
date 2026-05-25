<script setup lang="ts">
import type { MenuRecord } from '@/types/router';

import * as Icons from '@ant-design/icons-vue';
import { computed, h, ref, watch } from 'vue';

const props = defineProps<{
  menus: MenuRecord[];
  selectedKeys?: string[];
  title?: string;
}>();

const emit = defineEmits<{
  select: [string];
}>();

const openKeys = ref<string[]>([]);

const menuItems = computed(() => buildItems(props.menus));

watch(
  () => props.selectedKeys,
  () => {
    const parent = props.menus.find((m) =>
      m.children?.some((c) => c.path === props.selectedKeys?.[0]),
    );
    if (parent && !openKeys.value.includes(parent.path)) {
      openKeys.value = [...openKeys.value, parent.path];
    }
  },
  { immediate: true },
);

function renderIcon(name?: string) {
  if (!name) return undefined;
  const IconComp = (Icons as Record<string, unknown>)[name];
  if (IconComp && typeof IconComp === 'object') {
    return () => h(IconComp as Parameters<typeof h>[0]);
  }
  return undefined;
}

function buildItems(menus: MenuRecord[]) {
  return menus
    .filter((m) => !m.hideInMenu)
    .map((menu) => {
      const item: Record<string, unknown> = {
        key: menu.path,
        label: menu.title ?? menu.name,
        title: menu.title ?? menu.name,
        icon: renderIcon(menu.icon),
      };
      if (menu.children?.length) {
        item.children = buildItems(menu.children);
      }
      return item;
    });
}

function onClick({ key }: { key: string }) {
  emit('select', key);
}
</script>

<template>
  <div class="layout-sub-menu">
    <div v-if="title" class="layout-sub-menu__title">{{ title }}</div>
    <a-menu
      v-model:open-keys="openKeys"
      theme="dark"
      mode="inline"
      :selected-keys="selectedKeys"
      :items="menuItems"
      @click="onClick"
    />
  </div>
</template>

<style scoped lang="less">
.layout-sub-menu {
  flex: 1;
  overflow: hidden auto;
  background: #000c17;

  &__title {
    height: 50px;
    padding: 0 16px;
    color: rgb(255 255 255 / 85%);
    font-weight: 600;
    line-height: 50px;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  :deep(.ant-menu) {
    border-inline-end: none !important;
  }
}
</style>
