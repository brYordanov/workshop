interface slidingWindowEntry {
  timestamps: number[];
}

function slidingWindowRateLimiterV1(
  store: Map<string, slidingWindowEntry>,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  if (!store.has(key)) {
    store.set(key, { timestamps: [] });
  }

  const entry = store.get(key)!;
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= limit) {
    return false;
  }

  entry.timestamps.push(now);
  return true;
}

interface CountStore {
  prevCount: number;
  currCount: number;
  windwowStart: number;
}

const store2 = new Map<string, CountStore>();
function slidingWindowRateLimiterV2(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  if (!store2.has(key)) {
    store2.set(key, { prevCount: 0, currCount: 0, windwowStart: now });
  }

  const entry = store2.get(key)!;

  const elapsed = now - entry.windwowStart;

  if (elapsed >= windowMs) {
    entry.prevCount = entry.currCount;
    entry.currCount = 0;
    entry.windwowStart = now;
  }

  const overlap = (windowMs - elapsed) / windowMs;
  const estimated = entry.prevCount * overlap + entry.currCount;

  if (estimated >= limit) {
    return false;
  }

  entry.currCount++;

  return true;
}

/*
version 1
    Pros
        - accuracy
        - no boundry bursts
        - straightforward
    Cons
        - memory heavy
        - CPU cost
        - bad scaling

    Use cases
        - security-sensitive APIs
        - login endpoints
        - payment APIs
        - abuse detection
*/

/*
verrsion 2
    Pros
        - constant memory
        - fast

    Cons
        - approximate
        - more complex math
        - not as flexible as token bucket
        
    Use cases
        - API gateways
        - SaaS APIs
        - edge services
 */

function limiterFactory(limit: number, windowMs: number) {
  const store = new Map<string, { timestamps: number[] }>();

  const cleanp: NodeJS.Timeout = setInterval(() => {
    const now = Date.now();

    for (const [k, v] of store) {
      const hasAlive = v.timestamps.some((ts) => now - ts < windowMs);
      if (!hasAlive) store.delete(k);
    }
  }, windowMs);

  cleanp.unref();

  return (req, res, next) => {
    const key = req.ip;
    const isAllowed = slidingWindowRateLimiterV1(store, key, limit, windowMs);

    if (!isAllowed) {
      return res.status(429).json({ err: 'too bad, soo sad' });
    }

    next();
  };
}

function sliwinfWFancy(
  store: Map<
    string,
    { prevCount: number; currCount: number; windowStart: number }
  >,
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();

  if (!store.has(key)) {
    store.set(key, { prevCount: 0, currCount: 0, windowStart: now });
  }

  const entry = store.get(key)!;

  const elapsed = now - entry.windowStart;

  if (elapsed >= windowMs) {
    entry.prevCount = entry.currCount;
    entry.currCount = 0;
    entry.windowStart = now;
  }

  const overlap = (windowMs - elapsed) / windowMs;
  const estimated = entry.prevCount * overlap + entry.currCount;

  if (estimated >= limit) {
    return false;
  }

  entry.currCount++;

  return true;
}
