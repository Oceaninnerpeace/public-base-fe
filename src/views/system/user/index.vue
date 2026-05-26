<script setup lang="ts">
import {
  AccessControl,
  AppModal,
  BasicForm,
  Page,
  PbQueryBar,
  ProTable,
} from '@/components';
import type { FormSchema } from '@/components';
import { useModal } from '@/hooks/useModal';
import type { PbTableColumn } from '@/components';
import { ref } from 'vue';

interface UserRow extends Record<string, unknown> {
  id: string;
  username: string;
  nickname: string;
  role: string;
}

const columns: PbTableColumn[] = [
  { title: '用户名', dataIndex: 'username', exportable: true },
  { title: '昵称', dataIndex: 'nickname', exportable: true },
  { title: '角色', dataIndex: 'role', exportable: true },
  { title: '操作', key: 'action', width: 200, exportable: false },
];

const query = ref<Record<string, unknown>>({});
const tableRef = ref<{ reload: () => void } | null>(null);

const queryFields = [
  { field: 'username', label: '用户名', type: 'input' as const },
  {
    field: 'role',
    label: '角色',
    type: 'select' as const,
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' },
    ],
  },
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
  const role = String(params.role ?? '');
  let filtered = keyword ? list.filter((u) => u.username.includes(keyword)) : list;
  if (role) filtered = filtered.filter((u) => u.role === role);
  return { list: filtered, total: filtered.length };
}

function onFormSubmit(values: Record<string, unknown>) {
  console.log('submit', values);
  closeModal();
}

function onSearch() {
  tableRef.value?.reload();
}
</script>

<template>
  <Page title="用户管理">
    <template #extra>
      <AccessControl :codes="'system:user:add'">
        <a-button type="primary" @click="openModal()">新增用户</a-button>
      </AccessControl>
    </template>

    <PbQueryBar
      v-model="query"
      :fields="queryFields"
      @search="onSearch"
      @reset="onSearch"
    />

    <ProTable
      ref="tableRef"
      :columns="columns"
      :search-params="query"
      :request="fetchUsers"
      export-filename="users"
    >
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
