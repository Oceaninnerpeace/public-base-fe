<script setup lang="ts">
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue';
import { usePermissionStore } from '@/store/permission';
import { useDictStore } from '@/store/dict';
import { useUserStore } from '@/store/user';
import { useTabbarStore } from '@/store/tabbar';

const userStore = useUserStore();
const permissionStore = usePermissionStore();
const tabbarStore = useTabbarStore();

async function handleLogout() {
  permissionStore.reset();
  useDictStore().reset();
  tabbarStore.reset();
  await userStore.logout();
  window.location.href = '/login';
}
</script>

<template>
  <a-dropdown placement="bottomRight">
    <div class="layout-user">
      <a-avatar :size="32" class="layout-user__avatar">
        {{ userStore.userInfo?.nickname?.slice(0, 1) ?? 'U' }}
      </a-avatar>
      <span class="layout-user__name">{{ userStore.userInfo?.nickname }}</span>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="profile">
          <UserOutlined />
          个人中心
        </a-menu-item>
        <a-menu-item key="settings">
          <SettingOutlined />
          账户设置
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout" @click="handleLogout">
          <LogoutOutlined />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped lang="less">
.layout-user {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgb(0 0 0 / 4%);
  }

  &__avatar {
    background: @primary-color;
  }

  &__name {
    max-width: 120px;
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
