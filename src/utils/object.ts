export function isFunction(val: unknown): val is (...args: unknown[]) => unknown {
  return typeof val === 'function';
}

export function get<T = unknown>(obj: Record<string, unknown>, path: string, def?: T): T {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return def as T;
    result = (result as Record<string, unknown>)[key];
  }
  return (result === undefined ? def : result) as T;
}

export function cloneDeep<T>(val: T): T {
  return JSON.parse(JSON.stringify(val)) as T;
}

export function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
