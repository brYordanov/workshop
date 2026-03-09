interface slidingWindowEntry {
  timestamps: number[];
}

const store = new Map<string, slidingWindowEntry>();

function slidingWindowRateLimiterV1(
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
