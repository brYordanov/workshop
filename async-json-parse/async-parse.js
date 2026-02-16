import path from "node:path"
import { fileURLToPath } from "node:url"
import { Worker } from "node:worker_threads"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export function asyncJSONParse(jsonStr) {
    return new Promise((resolve, reject) => {
        const workerPath= path.join(__dirname, 'worker.js')
        const worker = new Worker(workerPath, {
            workerData: jsonStr
        })

        worker.once('message', (msg) => {
            if(msg?.ok) resolve(msg.value)
            else reject(Object.assign(new Error(msg?.error?.message ?? 'Worker parse failed'), msg?.error))
            worker.terminate()
        })

        worker.once('error', (err) => {
            reject(err)
            worker.terminate()
        })

        worker.once('exit', (code) => {
            if(code !==0) reject(new Error(`worker exited with code ${code}`))
        })
    })
}