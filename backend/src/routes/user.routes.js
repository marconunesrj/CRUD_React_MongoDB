import { UserController } from '../controllers/user.controller.js'

// ─── JSON Schema definitions (Fastify native validation) ──────────────────────

const userBodySchema = {
  type: 'object',
  properties: {
    name:   { type: 'string', minLength: 2, maxLength: 100 },
    email:  { type: 'string', format: 'email' },
    role:   { type: 'string', enum: ['admin', 'editor', 'viewer'] },
    active: { type: 'boolean' },
  },
}

const createBodySchema = {
  ...userBodySchema,
  required: ['name', 'email'],
}

const idParamSchema = {
  type: 'object',
  properties: { id: { type: 'string', minLength: 24, maxLength: 24 } },
  required: ['id'],
}

const listQuerySchema = {
  type: 'object',
  properties: {
    page:   { type: 'integer', minimum: 1, default: 1 },
    limit:  { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    active: { type: 'string', enum: ['true', 'false'] },
    role:   { type: 'string', enum: ['admin', 'editor', 'viewer'] },
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Converts controller errors to proper HTTP responses.
 *
 * @param {import('fastify').FastifyReply} reply
 * @param {Error & { statusCode?: number }} err
 */
function handleError(reply, err) {
  const status = err.statusCode ?? 500
  reply.status(status).send({ error: err.message })
}

// ─── Route plugin ─────────────────────────────────────────────────────────────

/**
 * Registers all /users routes on the Fastify instance.
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
export async function userRoutes(fastify) {
  /**
   * GET /users
   * Returns paginated list of users with optional filters.
   */
  fastify.get('/', { schema: { querystring: listQuerySchema } }, async (req, reply) => {
    try {
      const result = await UserController.findAll(req.query)
      reply.send(result)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * GET /users/:id
   * Returns a single user by MongoDB ObjectId.
   */
  fastify.get('/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    try {
      const user = await UserController.findById(req.params.id)
      reply.send(user)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * POST /users
   * Creates a new user. Returns 201 with created resource.
   */
  fastify.post('/', { schema: { body: createBodySchema } }, async (req, reply) => {
    try {
      const user = await UserController.create(req.body)
      reply.status(201).send(user)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * PUT /users/:id
   * Full or partial update for a user.
   */
  fastify.put('/:id', { schema: { params: idParamSchema, body: userBodySchema } }, async (req, reply) => {
    try {
      const user = await UserController.update(req.params.id, req.body)
      reply.send(user)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * DELETE /users/:id
   * Deletes a user by ID. Returns 204 No Content.
   */
  fastify.delete('/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    try {
      await UserController.delete(req.params.id)
      reply.status(204).send()
    } catch (err) {
      handleError(reply, err)
    }
  })
}
