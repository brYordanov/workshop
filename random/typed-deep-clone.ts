export function deepClone<T>(value: T, seen = new WeakMap()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value) as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  if (value instanceof Map) {
    const clone = new Map();
    seen.set(value, clone);

    for (const [k, v] of value) {
      clone.set(deepClone(k, seen), deepClone(v, seen));
    }

    return clone as T;
  }

  if (value instanceof Set) {
    const clone = new Set();
    seen.set(value, clone);

    for (const v of value) {
      clone.add(deepClone(v, seen));
    }

    return clone as T;
  }

  if (Array.isArray(value)) {
    const clone: any[] = [];
    seen.set(value, clone);

    value.forEach((v, i) => {
      clone[i] = deepClone(v, seen);
    });

    return clone as T;
  }

  const clone = Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone);

  for (const k of Reflect.ownKeys(value)) {
    clone[k as keyof typeof clone] = deepClone((value as any)[k], seen);
  }

  return clone as T;
}
