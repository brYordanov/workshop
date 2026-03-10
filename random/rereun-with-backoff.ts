async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    jitter?: number;
  }
): Promise<T> {
  const {
    maxRetries = 4,
    baseDelay = 100,
    maxDelay = 6000,
    jitter = true,
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;

      let delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
      if (jitter) delay *= 0.5 + Math.random() * 0.5;
      console.log(`delay: ${delay}`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('unreachable');
}

let count = 0;
const data = withExponentialBackoff(
  () => {
    console.log(count);
    count++;
    if (count < 10) throw new Error('not yet');
    return new Promise(() => {});
  },
  { maxRetries: 10 }
);
