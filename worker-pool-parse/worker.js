import { parentPort } from 'node:worker_threads';

parentPort.on('message', (job) => {
  const { id, jsonStr } = job;

  try {
    const parsed = JSON.parse(jsonStr);
    parentPort.postMessage({ id, ok: true, value: parsed });
  } catch (err) {
    parentPort.postMessage({
      id,
      ok: false,
      error: {
        name: err?.name ?? 'Error',
        message: err?.message ?? String(err),
      },
    });
  }
});
