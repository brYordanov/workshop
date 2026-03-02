function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  //   redundant
  if (typeof value === 'function') {
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
    const res = new Map();
    seen.set(value, res);

    for (const [k, v] of value) {
      res.set(deepClone(k, seen), deepClone(v, seen));
    }

    return res;
  }

  if (value instanceof Set) {
    const res = new Set();
    seen.set(value, res);

    for (const v of value) {
      res.add(deepClone(v, seen));
    }

    return res;
  }

  if (Array.isArray(value)) {
    const res = [];
    seen.set(value, res);

    for (let i = 0; i < value.length; i++) {
      res[i] = deepClone(value[i], seen);
    }

    return res;
  }

  const res = Object.create(Object.getPrototypeOf(value));
  seen.set(value, res);
  for (const key of Reflect.ownKeys(value)) {
    res[key] = deepClone(value[key], seen);

    // if we want descriptors and getters/setters
    // const desc = Object.getOwnPropertyDescriptor(value, key);
    // if (desc.get || desc.set) {
    //   Object.defineProperty(res, key, desc);
    // } else {
    //   desc.value = deepClone(desc.value, seen);
    //   Object.defineProperty(res, key, desc);
    // }
  }

  return res;
}

// cases:
// - null
// - non objects(primitives)
// - function
// - Date
// - RegExp
// - map
// - set
// - Array
// - default obj
