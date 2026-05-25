/** 字典项 */
export interface DictItem {
  label: string;
  value: string | number;
  color?: string;
  disabled?: boolean;
  /** 扩展字段 */
  extra?: Record<string, unknown>;
}

export type DictMap = Record<string, DictItem[]>;
