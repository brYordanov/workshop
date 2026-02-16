import { asyncJSONParse } from "./async-parse.js"
import fs from 'node:fs/promises'

async function main() {
    const raw = await fs.readFile('../big.json', {encoding: 'utf-8'})

    console.log('Main thread: starting parse in worker...')
    
    const t0 = Date.now()
    const data = await asyncJSONParse(raw)

    console.log('Parsed in ms:', Date.now() - t0)
    console.log('Top-level keys:', Object.keys(data))
}

main().catch((err) => {
    console.error('failed: ', err);
    process.exitCode = 1    
})