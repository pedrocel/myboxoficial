import { serve } from '@hono/node-server'
import { getConnInfo } from '@hono/node-server/conninfo'
import { buildApp } from './app.ts'
import { purgeExpiredSessions } from './auth.ts'
import { loadConfig } from './config.ts'
import { openDatabase } from './db.ts'

const config = loadConfig()
const db = openDatabase(config.databasePath)

const app = buildApp({
  config,
  db,
  // Atras do Caddy o socket e o proxy; so ai o cabecalho encaminhado vale.
  clientIp: (c) => {
    const forwarded = (c.req.header('x-forwarded-for') ?? '').split(',')[0].trim()
    if (config.trustProxy && forwarded) return forwarded
    return getConnInfo(c).remote.address ?? 'unknown'
  },
})

const purge = setInterval(() => purgeExpiredSessions(db), 3_600_000)

const server = serve({ fetch: app.fetch, port: config.port, hostname: config.host }, (info) => {
  console.log(`mybox-api ouvindo em http://${info.address}:${info.port}`)
})

const shutdown = () => {
  clearInterval(purge)
  server.close(() => {
    db.close()
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
