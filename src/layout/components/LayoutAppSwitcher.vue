<script setup lang="ts">
import { PORTAL_APPS } from '@/config/portal-apps';
import { findPortalAppByPath } from '@/config/portal-apps';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import * as Icons from '@ant-design/icons-vue';
import { computed, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeAppId = computed(() => findPortalAppByPath(route.path)?.id ?? 'portal');

const items = computed(() => [
  {
    key: 'portal',
    label: '应用中心',
    icon: () => h(AppstoreOutlined),
  },
  ...PORTAL_APPS.map((app) => {
    const IconComp = (Icons as Record<string, unknown>)[app.icon ?? 'AppstoreOutlined'];
    return {
      key: app.id,
      label: app.title,
      icon:
        IconComp && typeof IconComp === 'object'
          ? () => h(IconComp as Parameters<typeof h>[0])
          : () => h(AppstoreOutlined),
    };
  }),
]);

function onSelect({ key }: { key: string }) {
  if (key === 'portal') {
    router.push('/portal');
    return;
  }
  const app = PORTAL_APPS.find((a) => a.id === key);
  if (app) router.push(app.defaultPath);
}
</script>

<template>
  <a-menu
    class="layout-app-switcher"
    mode="horizontal"
    :selected-keys="[activeAppId]"
    :items="items"
    @click="onSelect"
  />
</template>

<style scoped lang="less">
.layout-app-switcher {
  flex: 1;
  min-width: 0;
  line-height: 48px;
  background: transparent;
  border-bottom: none !important;
}
</style>
