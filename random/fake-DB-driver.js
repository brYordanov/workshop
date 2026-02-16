/**
 * demo.js
 * Run: node demo.js
 *
 * What you'll see:
 * - HTTP handler calls db.query() and hits await
 * - Fake DB responds later
 * - Driver's 'data' callback runs (this was registered earlier)
 * - That callback resolves the Promise
 * - The await continuation runs as a microtask (before setImmediate)
 */

const net = require('node:net')
const http = require('node:http')

function log(...args) {
  // timestamp-ish to make ordering obvious
  const t = new Date().toISOString().slice(11, 23)
  console.log(`[${t}]`, ...args)
}

/** -----------------------------
 *  Fake DB server (TCP)
 *  ----------------------------- */
function startFakeDbServer(port = 5555) {
  const server = net.createServer((socket) => {
    socket.setEncoding('utf8')

    socket.on('data', (queryText) => {
      log('[DB SERVER] got query bytes:', JSON.stringify(queryText.trim()))

      // Simulate DB doing work "elsewhere" (not on JS stack)
      setTimeout(() => {
        const payload = JSON.stringify({
          rows: [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }],
          query: queryText.trim(),
        })

        log('[DB SERVER] sending response bytes')
        socket.write(payload + '\n')
        setTimeout(() => {
          socket.write(payload + '\n')
        }, 5)
      }, 120)
    })
  })

  return new Promise((resolve) => {
    server.listen(port, () => {
      log('[DB SERVER] listening on', port)
      resolve(server)
    })
  })
}

/** -----------------------------
 *  Fake DB driver (client)
 *  ----------------------------- */
function createFakeDbClient({ host = '127.0.0.1', port = 5555 } = {}) {
  const socket = net.createConnection({ host, port })
  socket.setEncoding('utf8')

  socket.on('connect', () => log('[DB DRIVER] connected to fake DB'))

  let buffer = ''
  socket.on('data', (chunk) => {
    // This is just to drain data in case multiple queries exist.
    buffer += chunk
  })

  function query(sql) {
    log('[DB DRIVER] query() called → will return Promise immediately')

    return new Promise((resolve, reject) => {
      log('[DB DRIVER] registering "data-ready" callback (runs when socket readable)')
      // In a real driver, this wiring is more complex, but the core idea is identical:
      // a callback is registered that will run when the DB socket becomes readable.
      const onReadable = () => {
        log('[DB DRIVER] >>> onReadable callback START (triggered by I/O readiness)')
        try {
          // Parse "one line" response
          const idx = buffer.indexOf('\n')
          if (idx === -1) return // not enough yet (simplification)
          const line = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 1)

          const result = JSON.parse(line)

          log('[DB DRIVER] resolving Promise now (THIS queues await continuation as microtask)')
          resolve(result)

          log('[DB DRIVER] >>> onReadable callback END (Promise already resolved)')
        } catch (e) {
          reject(e)
        } finally {
          socket.off('data', onData)
        }
      }

      const onData = () => {
        // This handler runs because Node emitted 'data' for the socket.
        // The "why" it emitted is libuv poll noticing the socket readable.
        onReadable()
      }

      // Register the callback (the thing you asked for explicitly)
      socket.on('data', onData)

      // Kick off the I/O (send query bytes)
      log('[DB DRIVER] writing query bytes to DB socket')
      socket.write(sql.trim() + '\n')
    })
  }

  return { query }
}

/** -----------------------------
 *  HTTP server that uses the DB driver
 *  ----------------------------- */
async function main() {
  await startFakeDbServer(5555)
  const db = createFakeDbClient({ port: 5555 })

  const server = http.createServer(async (req, res) => {
    if (req.url !== '/users') {
      res.statusCode = 404
      return res.end('not found')
    }

    log('[HTTP] handler START')

    // Show where microtasks vs immediates land relative to await resumption
    setImmediate(() => log('[HTTP] setImmediate fired (check phase)'))
    setTimeout(() => log('[HTTP] setTimeout(0) fired (timers phase)'), 0)

    queueMicrotask(() => log('[HTTP] queueMicrotask fired (microtask queue)'))
    Promise.resolve().then(() => log('[HTTP] Promise.then fired (microtask queue)'))

    log('[HTTP] about to await db.query(...)')

    const result = await db.query('SELECT * FROM users')

    // This line runs as the continuation of the await (microtask).
    log('[HTTP] AFTER await (await continuation ran) → got rows:', result.rows.length)

    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(result))
    log('[HTTP] response sent')
  })

  server.listen(3000, () => {
    log('[HTTP] listening on http://localhost:3000')
    log('[HTTP] try: curl http://localhost:3000/users')
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
