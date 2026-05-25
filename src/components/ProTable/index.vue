<script setup lang="ts">
import { useLoading } from '@/hooks/useLoading';
import type { TableColumnType, TablePaginationConfig } from 'ant-design-vue';
import { reactive, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    columns: TableColumnType[];
    request: (params: Record<string, unknown>) => Promise<{
      list: Record<string, unknown>[];
      total: number;
    }>;
    rowKey?: string;
    showSearch?: boolean;
  }>(),
  {
    rowKey: 'id',
    showSearch: true,
  },
);

const { loading, run } = useLoading();
const dataSource = ref<Record<string, unknown>[]>([]);
const searchForm = reactive<Record<string, unknown>>({});
const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

async function loadData() {
  const result = await run(() =>
    props.request({
      ...searchForm,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }),
  );
  dataSource.value = result.list;
  pagination.total = result.total;
}

function onSearch() {
  pagination.current = 1;
  loadData();
}

function onReset() {
  Object.keys(searchForm).forEach((k) => delete searchForm[k]);
  onSearch();
}

function onTableChange(pag: TablePaginationConfig) {
  pagination.current = pag.current ?? 1;
  pagination.pageSize = pag.pageSize ?? 10;
  loadData();
}

watch(() => props.request, loadData, { immediate: true });

defineExpose({ reload: loadData });
</script>

<template>
  <div class="pro-table">
    <a-form v-if="showSearch && $slots.search" layout="inline" class="pro-table__search">
      <slot name="search" :model="searchForm" />
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="onSearch">查询</a-button>
          <a-button @click="onReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <div v-if="$slots.toolbar" class="pro-table__toolbar">
      <slot name="toolbar" />
    </div>

    <a-table
      :row-key="rowKey"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="onTableChange"
    >
      <template #bodyCell="slotData">
        <slot name="bodyCell" v-bind="slotData" />
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less">
.pro-table {
  &__search {
    margin-bottom: 16px;
  }

  &__toolbar {
    margin-bottom: 12px;
  }
}
</style>
