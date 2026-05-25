<script setup lang="ts">
import { HomeOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = withDefaults(
  defineProps<{
    showHome?: boolean;
    hideWhenOnlyOne?: boolean;
  }>(),
  {
    showHome: true,
    hideWhenOnlyOne: true,
  },
);

const route = useRoute();
const router = useRouter();

const items = computed(() => {
  const list: { title: string; path?: string }[] = [];

  if (props.showHome) {
    list.push({ title: '首页', path: '/dashboard' });
  }

  for (const match of route.matched) {
    const { meta, path } = match;
    if (!path || meta?.hideInBreadcrumb || meta?.hideInMenu) continue;
    const title = (meta?.title as string) || '';
    if (title) list.push({ title, path });
  }

  if (props.hideWhenOnlyOne && list.length <= 1) return [];
  return list;
});
</script>

<template>
  <a-breadcrumb v-if="items.length" class="layout-breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in items" :key="index">
      <template v-if="index === 0 && showHome">
        <HomeOutlined />
      </template>
      <a v-if="item.path && index < items.length - 1" @click.prevent="router.push(item.path)">
        {{ item.title }}
      </a>
      <span v-else>{{ item.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style scoped lang="less">
.layout-breadcrumb {
  margin-left: 8px;
}
</style>
