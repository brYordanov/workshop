import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerPool {
  constructor({ workerFile, size = Math.min(os.cpus().length, 4) }) {
    this.workerFile = workerFile;
    this.size = size;

    this.workers = [];
    this.idle = [];
    this.queue = [];
    this.inflight = new Map();
    this.defaultTimeoutMS = 300;

    this.nextId = 1;

    for (let i = 0; i < this.size; i++) {
      this._spawnWorker();
    }
  }

  _spawnWorker() {
    const worker = new Worker(this.workerFile);
    worker.on('message', (msg) => {
      const { id, ok, value, error } = msg || {};
      const job = this.inflight.get(id);

      if (!job) return;

      if (job.timeoutId) clearTimeout(job.timeoutId);
      this.inflight.delete(id);

      if (ok) job.resolve(value);
      else
        job.reject(
          Object.assign(new Error(error?.message ?? 'Worker job failed'), error)
        );

      this.idle.push(worker);
      this._drain();
    });

    worker.on('error', (err) => {
      for (const [, job] of this.inflight) job.reject(err);
      this.inflight.clear();
      this.idle = this.idle.filter((w) => w !== worker);

      this._spawnWorker();
      this._drain();
    });

    worker.on('exit', (code) => {
      if (code === 0) return;

      const err = new Error(`Worker exited with code ${code}`);

      for (const [, job] of this.inflight) job.reject(err);
      this.inflight.clear();
      this.idle = this.idle.filter((w) => w !== worker);

      this._spawnWorker();
      this._drain();
    });

    this.workers.push(worker);
    this.idle.push(worker);
  }

  _drain() {
    while (this.idle.length > 0 && this.queue.length > 0) {
      const worker = this.idle.pop();
      const queued = this.queue.shift();

      const timeout = queued.timeoutMs ?? this.defaultTimeoutMS;
      const jobId = queued.id;

      const timeoutId = timeout
        ? setTimeout(() => {
            const job = this.inflight.get(jobId);
            if (!job) return;

            this.inflight.delete(jobId);
            job.reject(new Error(`Job ${jobId} timed out after ${timeout}ms`));
            worker.terminate();
            this.idle = this.idle.filter((w) => w !== worker);

            this._spawnWorker();
            this._drain();
          }, timeout)
        : null;

      this.inflight.set(jobId, {
        resolve: queued.resolve,
        reject: queued.reject,
        worker,
        timeoutId,
      });

      worker.postMessage({ id: jobId, jsonStr: queued.jsonStr });
    }
  }

  exec(jsonStr, timeoutMs) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.queue.push({ id, jsonStr, resolve, reject, timeoutMs });
      this._drain();
    });
  }

  async destroy() {
    for (const q of this.queue) q.reject(new Error('worker pool destroyed'));
    this.queue.length = 0;

    await Promise.allSettled(this.workers.map((w) => w.terminate()));
  }
}

const pool = new WorkerPool({ workerFile: path.join(__dirname, 'worker.js') });

export function asyncJSONParse(jsonStr) {
  return pool.exec(jsonStr);
}

process.once('SIGINT', async () => {
  await pool.destroy();
  process.exit(0);
});
process.once('SIGTERM', async () => {
  await pool.destroy();
  process.exit(0);
});
