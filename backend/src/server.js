import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import sensible from '@fastify/sensible'

import { connectDatabase } from './config/database.js'
import { userRoutes } from './routes/user.routes.js'

const {
  PORT = 3001,
  NODE_ENV = 'development',
  MONGODB_URI,
  CORS_ORIGIN = 'http://localhost:5173',
} = process.env

if (!MONGODB_URI) {
  console.error('[Server] MONGODB_URI environment variable is required')
  process.exit(1)
}

/**
 * Builds and configures the Fastify application instance.
 *
 * @returns {Promise<import('fastify').FastifyInstance>}
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: NODE_ENV === 'test' ? 'silent' : 'info',
      transport:
        NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  })

  // ── Security & utilities ───────────────────────────────────────────────────
  await app.register(helmet)
  await app.register(cors, {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
  await app.register(sensible)

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  // ── API routes ────────────────────────────────────────────────────────────
  app.register(userRoutes, { prefix: '/api/users' })

  // ── Global error handler ──────────────────────────────────────────────────
  app.setErrorHandler((error, _req, reply) => {
    app.log.error(error)
    const status = error.statusCode ?? 500
    reply.status(status).send({
      error: status === 500 ? 'Internal Server Error' : error.message,
    })
  })

  return app
}

/**
 * Bootstraps the server: connects to MongoDB then starts listening.
 */
async function start() {
  try {
    await connectDatabase(MONGODB_URI)

    const app = await buildApp()
    await app.listen({ port: Number(PORT), host: '0.0.0.0' })

    console.log(`[Server] Running on http://0.0.0.0:${PORT}`)

    const shutdown = async (signal) => {
      console.log(`[Server] ${signal} received — shutting down`)
      await app.close()
      process.exit(0)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (err) {
    console.error('[Server] Startup failed:', err)
    process.exit(1)
  }
}

start()
