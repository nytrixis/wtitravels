/** Storage wrappers that never throw (private mode, blocked cookies, SSR previews). */
const safe = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const local = {
  get: (key: string): string | null => safe(() => localStorage.getItem(key), null),
  set: (key: string, value: string): void => safe(() => localStorage.setItem(key, value), undefined),
  remove: (key: string): void => safe(() => localStorage.removeItem(key), undefined),
};

export const session = {
  get: (key: string): string | null => safe(() => sessionStorage.getItem(key), null),
  set: (key: string, value: string): void => safe(() => sessionStorage.setItem(key, value), undefined),
};

export const readJson = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
