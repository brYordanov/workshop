const { parentPort, workerData  } = require("node:worker_threads")

try {
    const parsed = JSON.parse(workerData)
    parentPort.postMessage({ok: true, value: parsed})
} catch(err) {
    parentPort.postMessage({
        ok: false,
        error: {
            name: err?.name ?? 'Error',
            message: err?.message ?? String(err)
        }
    })
}
