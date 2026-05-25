import type { Rule } from 'ant-design-vue/es/form';

export type FormFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'select'
  | 'date'
  | 'switch'
  | 'number';

export interface FormSchema {
  field: string;
  label: string;
  type?: FormFieldType;
  required?: boolean;
  rules?: Rule[];
  defaultValue?: unknown;
  componentProps?: Record<string, unknown>;
  /** select 静态选项 */
  options?: { label: string; value: string | number }[];
  /** 占栅格，默认 24 */
  span?: number;
  ifShow?: (model: Record<string, unknown>) => boolean;
}

export interface BasicFormProps {
  schemas: FormSchema[];
  model?: Record<string, unknown>;
  labelWidth?: number | string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  showAction?: boolean;
  submitText?: string;
  resetText?: string;
}
