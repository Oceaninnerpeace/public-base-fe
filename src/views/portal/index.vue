<script setup lang="ts">
import { PORTAL_APPS } from '@/config/portal-apps';
import { useRouter } from 'vue-router';
import * as Icons from '@ant-design/icons-vue';
import { computed, h } from 'vue';

const router = useRouter();

const apps = computed(() =>
  PORTAL_APPS.map((app) => {
    const IconComp = (Icons as Record<string, unknown>)[app.icon ?? 'AppstoreOutlined'];
    return {
      ...app,
      iconRender:
        IconComp && typeof IconComp === 'object'
          ? () => h(IconComp as Parameters<typeof h>[0])
          : () => h(Icons.AppstoreOutlined),
    };
  }),
);

function openApp(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="portal-page">
    <a-page-header title="应用中心" sub-title="统一门户入口，各业务系统独立登录与权限" />
    <a-row :gutter="[16, 16]">
      <a-col v-for="app in apps" :key="app.id" :xs="24" :sm="12" :lg="8">
        <a-card hoverable class="portal-page__card" @click="openApp(app.defaultPath)">
          <div class="portal-page__card-head">
            <component :is="app.iconRender" class="portal-page__icon" />
            <div>
              <div class="portal-page__title">{{ app.title }}</div>
              <div class="portal-page__desc">{{ app.description }}</div>
            </div>
          </div>
          <a-tag color="blue">独立鉴权</a-tag>
          <a-tag>存储前缀 {{ app.storagePrefix }}</a-tag>
        </a-card>
      </a-col>
    </a-row>
    <a-alert
      class="portal-page__tip"
      type="info"
      show-icon
      message="基座说明"
      description="本系统为公共门户容器，不维护业务登录态。进入子应用后请使用各系统自有账号登录，Token 与缓存按业务前缀隔离，避免串登。"
    />
  </div>
</template>

<style scoped lang="less">
.portal-page {
  &__card {
    cursor: pointer;
    min-height: 140px;
  }

  &__card-head {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__icon {
    font-size: 36px;
    color: @primary-color;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
  }

  &__desc {
    margin-top: 4px;
    color: rgb(0 0 0 / 45%);
    font-size: 13px;
  }

  &__tip {
    margin-top: 24px;
  }
}
</style>
