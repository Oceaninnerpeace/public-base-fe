export function isArray<T = unknown>(val: unknown): val is T[] {
  return Array.isArray(val);
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isEmpty(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (isArray(val) || isString(val)) return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
}
