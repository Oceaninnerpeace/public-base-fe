import type { TableColumnType } from 'ant-design-vue'

export interface TableRequestParams {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  [key: string]: unknown
}

export interface TableRequestResult<T = Record<string, unknown>> {
  list: T[]
  total: number
}

export type PbTableColumn<T = Record<string, unknown>> = TableColumnType<T> & {
  /** 参与导出 */
  exportable?: boolean
}
