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
}>();

function renderIcon(name?: string) {
  if (!name) return undefined;
  const IconComp = (Icons as Record<string, unknown>)[name];
  if (IconComp && typeof IconComp === 'object') {
    return () => h(IconComp as Parameters<typeof h>[0]);
  }
  return undefined;
}

const items = computed(() =>
  props.menus.map((menu) => ({
    key: menu.path,
    label: menu.title ?? menu.name,
    icon: renderIcon(menu.icon),
  })),
);

function onClick({ key }: { key: string }) {
  const menu = props.menus.find((m) => m.path === key);
  if (menu) emit('select', menu);
}
</script>

<template>
  <a-menu
    class="layout-header-menu"
    mode="horizontal"
    :selected-keys="activePath ? [activePath] : []"
    :items="items"
    @click="onClick"
  />
</template>

<style scoped lang="less">
.layout-header-menu {
  flex: 1;
  min-width: 0;
  line-height: 48px;
  background: transparent;
  border-bottom: none !important;
}
</style>
