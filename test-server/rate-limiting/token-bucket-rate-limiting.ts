type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();
export function tokenBucketRateLimiter(
  key: string,
  capacity: number,
  refilRate: number
): boolean {
  const now = Date.now();

  if (!buckets.has(key)) {
    buckets.set(key, { tokens: capacity, lastRefill: now });
  }

  const currBucket = buckets.get(key)!;

  const elapsed = (now - currBucket.lastRefill) / 1000;
  const refill = elapsed * refilRate;

  currBucket.tokens = Math.min(capacity, currBucket.tokens + refill);
  currBucket.lastRefill = now;

  if (currBucket.tokens < 1) {
    return false;
  }

  currBucket.tokens--;
  return true;
}

/*
    Pros
        - allows natural burst
        - smooth long term
        - efficient
    Cons
        - more complex
        - harder for distributed systems(needs atomic updates in Redis)
        - a user with saved token can burst heavily
 */
