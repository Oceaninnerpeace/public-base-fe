import type { Rule } from 'ant-design-vue/es/form'

export type FormFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'select'
  | 'dict'
  | 'date'
  | 'switch'
  | 'number'

export interface FormSchema {
  field: string
  label: string
  type?: FormFieldType
  required?: boolean
  rules?: Rule[]
  defaultValue?: unknown
  componentProps?: Record<string, unknown>
  options?: { label: string; value: string | number }[]
  /** dict 类型：字典编码，由 DictSelect 拉取 */
  dictCode?: string
  span?: number
  ifShow?: (model: Record<string, unknown>) => boolean
}

export interface QueryFieldSchema {
  field: string
  label: string
  type?: 'input' | 'select' | 'dict' | 'date'
  placeholder?: string
  options?: { label: string; value: string | number }[]
  dictCode?: string
  span?: number
}
