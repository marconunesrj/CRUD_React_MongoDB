import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../src/models/user.model.js'
import { UserController } from '../src/controllers/user.controller.js'

let mongoServer

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterEach(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

const baseUser = { name: 'Alice Silva', email: 'alice@example.com', role: 'editor' }

describe('UserController.create', () => {
  it('creates a user successfully', async () => {
    const user = await UserController.create(baseUser)
    expect(user.id).toBeDefined()
    expect(user.email).toBe('alice@example.com')
    expect(user.active).toBe(true)
  })

  it('throws 409 on duplicate email', async () => {
    await UserController.create(baseUser)
    await expect(UserController.create(baseUser)).rejects.toMatchObject({
      statusCode: 409,
      message: 'Email already in use',
    })
  })

  it('throws 422 on invalid data', async () => {
    await expect(UserController.create({ name: 'X', email: 'bad-email' })).rejects.toMatchObject({
      statusCode: 422,
    })
  })
})

describe('UserController.findAll', () => {
  beforeEach(async () => {
    await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', role: 'admin', active: true },
      { name: 'Bob', email: 'bob@example.com', role: 'viewer', active: false },
      { name: 'Carol', email: 'carol@example.com', role: 'editor', active: true },
    ])
  })

  it('returns all users with pagination meta', async () => {
    const result = await UserController.findAll()
    expect(result.total).toBe(3)
    expect(result.page).toBe(1)
  })

  it('filters by active status', async () => {
    const result = await UserController.findAll({ active: 'true' })
    expect(result.data.every((u) => u.active === true)).toBe(true)
  })

  it('filters by role', async () => {
    const result = await UserController.findAll({ role: 'admin' })
    expect(result.total).toBe(1)
    expect(result.data[0].name).toBe('Alice')
  })
})

describe('UserController.findById', () => {
  it('returns user by id', async () => {
    const created = await UserController.create(baseUser)
    const found = await UserController.findById(created.id)
    expect(found.email).toBe('alice@example.com')
  })

  it('throws 404 for unknown id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    await expect(UserController.findById(fakeId)).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('UserController.update', () => {
  it('updates user fields', async () => {
    const created = await UserController.create(baseUser)
    const updated = await UserController.update(created.id, { name: 'Alice Updated' })
    expect(updated.name).toBe('Alice Updated')
  })

  it('throws 404 for unknown id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    await expect(UserController.update(fakeId, { name: 'X' })).rejects.toMatchObject({ statusCode: 404 })
  })
})

describe('UserController.delete', () => {
  it('deletes a user successfully', async () => {
    const created = await UserController.create(baseUser)
    await expect(UserController.delete(created.id)).resolves.toBeUndefined()
    await expect(UserController.findById(created.id)).rejects.toMatchObject({ statusCode: 404 })
  })

  it('throws 404 for unknown id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    await expect(UserController.delete(fakeId)).rejects.toMatchObject({ statusCode: 404 })
  })
})
