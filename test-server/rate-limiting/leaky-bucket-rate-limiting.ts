type Bucket = {
  queue: number;
  lastLeak: number;
};

const buckets = new Map<string, Bucket>();

export function leakyBucketRateLimiter(
  key: string,
  leakRate: number,
  capacity: number
) {
  const now = Date.now();

  if (!buckets.has(key)) {
    buckets.set(key, { queue: 0, lastLeak: now });
  }

  const bucket = buckets.get(key)!;

  const elapsed = (now - bucket.lastLeak) / 1000;
  const leaked = elapsed * leakRate;

  bucket.queue = Math.max(0, bucket.queue - leaked);

  if (bucket.queue >= capacity) {
    return false;
  }

  bucket.queue++;

  return true;
}

// traffic shaper
