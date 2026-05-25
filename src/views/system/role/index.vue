<script setup lang="ts">
import { EllipsisText, Fallback, Page } from '@/components';
</script>

<template>
  <Page title="角色管理">
    <a-alert
      type="info"
      show-icon
      message="动态菜单 + 路由权限演示"
      style="margin-bottom: 16px"
    >
      <template #description>
        <EllipsisText :line="2" expand>
          使用 user 账号登录时无 system:role:view 权限，菜单与路由均不可见。本页还演示 EllipsisText 组件。
        </EllipsisText>
      </template>
    </a-alert>
    <Fallback status="coming-soon" :show-back="false" />
  </Page>
</template>
