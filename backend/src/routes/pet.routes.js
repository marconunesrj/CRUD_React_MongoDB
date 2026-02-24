import { PetController } from '../controllers/pet.controller.js'

// ─── JSON Schema definitions (Fastify native validation) ──────────────────────

const petBodySchema = {
  type: 'object',
  properties: {
    user_id: { type: 'string', minLength: 24, maxLength: 24 },
    name:    { type: 'string', minLength: 2, maxLength: 100 },
  },
}

const createBodySchema = {
  ...petBodySchema,
  required: ['user_id', 'name'],
}

const idParamSchema = {
  type: 'object',
  properties: { id: { type: 'string', minLength: 24, maxLength: 24 } },
  required: ['id'],
}

const userIdParamSchema = {
  type: 'object',
  properties: { user_id: { type: 'string', minLength: 24, maxLength: 24 } },
  required: ['user_id'],
}

const paginationQuerySchema = {
  type: 'object',
  properties: {
    page:  { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  },
}

const listQuerySchema = {
  type: 'object',
  properties: {
    page:    { type: 'integer', minimum: 1, default: 1 },
    limit:   { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    user_id: { type: 'string', minLength: 24, maxLength: 24 },
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
 * Registers all /pets routes on the Fastify instance.
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
export async function petRoutes(fastify) {
  /**
   * GET /pets
   * Returns paginated list of pets with optional user_id filter.
   */
  fastify.get('/', { schema: { querystring: listQuerySchema } }, async (req, reply) => {
    try {
      const result = await PetController.findAll(req.query)
      reply.send(result)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * GET /pets/user/:user_id
   * Returns paginated list of pets belonging to a specific user.
   */
  fastify.get('/user/:user_id', { schema: { params: userIdParamSchema, querystring: paginationQuerySchema } }, async (req, reply) => {
    try {
      const result = await PetController.findAll({ user_id: req.params.user_id, ...req.query })
      reply.send(result)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * GET /pets/:id
   * Returns a single pet by MongoDB ObjectId.
   */
  fastify.get('/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    try {
      const pet = await PetController.findById(req.params.id)
      reply.send(pet)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * POST /pets
   * Creates a new pet. Returns 201 with created resource.
   */
  fastify.post('/', { schema: { body: createBodySchema } }, async (req, reply) => {
    try {
      const pet = await PetController.create(req.body)
      reply.status(201).send(pet)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * PUT /pets/:id
   * Full or partial update for a pet.
   */
  fastify.put('/:id', { schema: { params: idParamSchema, body: petBodySchema } }, async (req, reply) => {
    try {
      const pet = await PetController.update(req.params.id, req.body)
      reply.send(pet)
    } catch (err) {
      handleError(reply, err)
    }
  })

  /**
   * DELETE /pets/:id
   * Deletes a pet by ID. Returns 204 No Content.
   */
  fastify.delete('/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
    try {
      await PetController.delete(req.params.id)
      reply.status(204).send()
    } catch (err) {
      handleError(reply, err)
    }
  })
}
