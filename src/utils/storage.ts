import Cookies from 'js-cookie';

type StorageEngine = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function createStorage(engine: StorageEngine, prefix: string) {
  const key = (k: string) => `${prefix}${k}`;

  return {
    get<T = string>(k: string, fallback?: T): T | undefined {
      const raw = engine.getItem(key(k));
      if (raw == null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    },
    set(k: string, value: unknown) {
      engine.setItem(key(k), typeof value === 'string' ? value : JSON.stringify(value));
    },
    remove(k: string) {
      engine.removeItem(key(k));
    },
    clear(prefixOnly = true) {
      if (!prefixOnly) {
        if (engine === localStorage) localStorage.clear();
        else sessionStorage.clear();
        return;
      }
      for (let i = engine.length - 1; i >= 0; i -= 1) {
        const k = engine.key(i);
        if (k?.startsWith(prefix)) engine.removeItem(k);
      }
    },
  };
}

export const ls = createStorage(localStorage, 'pb_');
export const ss = createStorage(sessionStorage, 'pb_');

export const cookie = {
  get: Cookies.get,
  set: Cookies.set,
  remove: Cookies.remove,
};
