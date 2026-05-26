import type { PbTableColumn } from '../types/table'

function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/** 将表格数据导出为 CSV 并触发下载 */
export function exportTableCsv(
  columns: PbTableColumn[],
  rows: Record<string, unknown>[],
  filename = 'export.csv',
) {
  const exportCols = columns.filter((c) => c.exportable !== false && 'dataIndex' in c && c.dataIndex)
  const headers = exportCols.map((c) => String(c.title ?? c.dataIndex))
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) =>
      exportCols
        .map((c) => {
          const key = c.dataIndex as string | number
          const val = row[key as string]
          return escapeCsvCell(val)
        })
        .join(','),
    ),
  ]
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
