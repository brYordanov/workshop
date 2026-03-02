function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const clone = new Map();
    seen.set(value, clone);

    for (const [k, v] of value) {
      clone.set(deepClone(k, seen), deepClone(v, seen));
    }

    return clone;
  }

  if (value instanceof Set) {
    const clone = new Set();
    seen.set(value, clone);

    for (const v of value) {
      clone.set(deepClone(v));
    }

    return clone;
  }

  if (Array.isArray(value)) {
    const clone = [];

    seen.set(value, clone);

    for (let i = 0; i < value.length; i++) {
      clone[i] = deepClone(value[i], seen);
    }

    return clone;
  }
}
