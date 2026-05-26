import type { Rule } from 'ant-design-vue/es/form'

/** 必填规则 */
export function requiredRule(label: string): Rule {
  return { required: true, message: `请输入${label}` }
}

/** 合并规则 */
export function mergeRules(...rules: (Rule | Rule[] | undefined)[]): Rule[] {
  return rules.flatMap((r) => (Array.isArray(r) ? r : r ? [r] : []))
}
