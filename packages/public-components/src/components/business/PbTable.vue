<script setup lang="ts">
import type { TablePaginationConfig, TableProps } from 'ant-design-vue'
import type { PbTableColumn, TableRequestParams, TableRequestResult } from '../../types/table'

import { DownloadOutlined } from '@ant-design/icons-vue'
import { reactive, ref, watch } from 'vue'

import { useLoading } from '../../composables/useLoading'
import { exportTableCsv } from '../../utils/export'

defineOptions({ name: 'PbTable' })

const props = withDefaults(
  defineProps<{
    columns: PbTableColumn[]
    request: (params: TableRequestParams) => Promise<TableRequestResult>
    rowKey?: string
    showExport?: boolean
    exportFilename?: string
    /** 外部查询参数，变化时自动刷新 */
    searchParams?: Record<string, unknown>
  }>(),
  {
    rowKey: 'id',
    showExport: true,
    exportFilename: 'export',
  },
)

const { loading, run } = useLoading()
const dataSource = ref<Record<string, unknown>[]>([])
const sortField = ref<string>()
const sortOrder = ref<'ascend' | 'descend'>()

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

async function loadData() {
  const result = await run(() =>
    props.request({
      ...(props.searchParams ?? {}),
      page: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    }),
  )
  dataSource.value = result.list
  pagination.total = result.total
}

function onSearch() {
  pagination.current = 1
  loadData()
}

const onTableChange: TableProps['onChange'] = (pag, _filters, sorter) => {
  pagination.current = pag.current ?? 1
  pagination.pageSize = pag.pageSize ?? 10
  const s = Array.isArray(sorter) ? sorter[0] : sorter
  if (s && typeof s === 'object' && 'field' in s) {
    sortField.value = s.field ? String(s.field) : undefined
    sortOrder.value = s.order ?? undefined
  }
  loadData()
}

function onExport() {
  exportTableCsv(props.columns, dataSource.value, props.exportFilename)
}

watch(() => props.request, loadData, { immediate: true })
watch(() => props.searchParams, onSearch, { deep: true })

defineExpose({ reload: loadData, getDataSource: () => dataSource.value })
</script>

<template>
  <div class="pb-table">
    <div v-if="$slots.toolbar || showExport" class="pb-table__toolbar">
      <slot name="toolbar" />
      <a-button v-if="showExport" @click="onExport">
        <template #icon><DownloadOutlined /></template>
        导出
      </a-button>
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

<style scoped>
.pb-table__toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
}
</style>
