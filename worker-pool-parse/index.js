import fs from 'node:fs/promises';
import { asyncJSONParse } from './asyncJSONParse.js';

async function main() {
  const raw = await fs.readFile('../big.json', { encoding: 'utf-8' });

  console.log('Main thread: starting parse in worker pool...');

  const t0 = Date.now();
  const data = await asyncJSONParse(raw);

  console.log('Parsed in ms:', Date.now() - t0);

  if (Array.isArray(data)) {
    console.log('Top-level type: array');
    console.log('length:', data.length);
    console.log('first item keys:', Object.keys(data[0] ?? {}));
  } else {
    console.log('Top-level type: object');
    console.log('Top-level keys:', Object.keys(data));
  }
}

main().catch((err) => {
  console.error('Failed: ', err);
  process.exitCode = 1;
});
