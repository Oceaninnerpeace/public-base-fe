<script setup lang="ts">
import {
  AccessControl,
  ApiComponent,
  AppModal,
  BasicForm,
  Page,
  ProTable,
} from '@/components';
import type { FormSchema } from '@/components/BasicForm/types';
import { useModal } from '@/hooks/useModal';
import { Select } from 'ant-design-vue';
import type { TableColumnType } from 'ant-design-vue';

interface UserRow {
  id: string;
  username: string;
  nickname: string;
  role: string;
}

const columns: TableColumnType<UserRow>[] = [
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  { title: '角色', dataIndex: 'role' },
  { title: '操作', key: 'action', width: 200 },
];

const { open, openModal, closeModal } = useModal();

const roleSchemas: FormSchema[] = [
  { field: 'username', label: '用户名', required: true },
  { field: 'nickname', label: '昵称', required: true },
  {
    field: 'role',
    label: '角色',
    type: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' },
    ],
  },
];

async function fetchUsers(params: Record<string, unknown>) {
  await new Promise((r) => setTimeout(r, 200));
  const list: UserRow[] = [
    { id: '1', username: 'admin', nickname: '管理员', role: 'admin' },
    { id: '2', username: 'user', nickname: '普通用户', role: 'user' },
  ];
  const keyword = String(params.username ?? '');
  const filtered = keyword ? list.filter((u) => u.username.includes(keyword)) : list;
  return { list: filtered, total: filtered.length };
}

async function fetchRoles() {
  return [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' },
  ];
}

function onFormSubmit(values: Record<string, unknown>) {
  console.log('submit', values);
  closeModal();
}
</script>

<template>
  <Page title="用户管理">
    <template #extra>
      <AccessControl :codes="'system:user:add'">
        <a-button type="primary" @click="openModal()">新增用户</a-button>
      </AccessControl>
    </template>

    <ProTable :columns="columns" :request="fetchUsers">
      <template #search="{ model }">
        <a-form-item label="用户名">
          <a-input v-model:value="model.username" allow-clear />
        </a-form-item>
        <a-form-item label="角色">
          <ApiComponent
            v-model:value="model.role"
            :component="Select"
            :api="fetchRoles"
            allow-clear
            placeholder="请选择角色"
            style="width: 160px"
          />
        </a-form-item>
      </template>
      <template #toolbar>
        <a-space>
          <a-button v-auth="'system:user:export'">导出</a-button>
          <a-button v-access="'system:user:import'">导入</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button v-auth="'system:user:edit'" type="link">编辑</a-button>
            <a-button v-auth="'system:user:delete'" type="link" danger>删除</a-button>
          </a-space>
        </template>
      </template>
    </ProTable>

    <AppModal v-model:open="open" title="新增用户" @ok="() => {}">
      <BasicForm :schemas="roleSchemas" @submit="onFormSubmit" />
    </AppModal>
  </Page>
</template>
