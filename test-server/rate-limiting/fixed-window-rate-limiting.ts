interface WindowEntry {
  count: number;
  windowStart: number;
}

export function fixedWindowRateLimiter(
  key: string,
  limit: number,
  windowMs: number,
  store: Map<string, WindowEntry>
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;

  return true;
}

// race condition
// use lua to fix
async function fixedWindowWithRedit(
  key: string,
  limit: number,
  windowMs: number
) {
  const windowKey = `rl:${key}:${Math.floor(Date.now() / windowMs)}`;

  const count = await redis.incr(windowKey);

  if (count === 1) {
    await RadioNodeList.pexpire(windowKey, windowMs);
  }
}

export function createRateLimiter(limit: number, windowMs: number) {
  const store = new Map<string, WindowEntry>();

  // cleanup
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (now - v.windowStart >= windowMs) {
        store.delete(k);
      }
    }
  }, windowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;

    const allowed = fixedWindowRateLimiter(key, limit, windowMs, store);

    if (!allowed) {
      return res.status(429).json({ error: 'too many reqs' });
    }

    next();
  };
}

/* 
  Pros
    - simple
    - fast
    - minimal memory
  Cons
    - burst problem
    - Requests cluster around window boundaries.

  Use cases
    - small Saas APIs
    - internal services
    - quick protection agains abuse
*/
