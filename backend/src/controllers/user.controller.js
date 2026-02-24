import { User } from '../models/user.model.js'

/**
 * @class UserController
 * @description Handles all business logic for user CRUD operations.
 *              Follows Single Responsibility Principle — pure data layer only.
 */
export class UserController {
  /**
   * List all users with optional filtering.
   *
   * @param {Object} filters - Optional query filters (active, role)
   * @param {Object} pagination - { page, limit }
   * @returns {Promise<{ data: User[], total: number, page: number, pages: number }>}
   */
  static async findAll({ active, role, page = 1, limit = 10 } = {}) {
    const query = {}
    if (active !== undefined) query.active = active === 'true' || active === true
    if (role) query.role = role

    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ])

    return {
      data: data.map((u) => u.toJSON()),
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Find a single user by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<User>}
   * @throws {Error} If user not found
   */
  static async findById(id) {
    const user = await User.findById(id)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    return user.toJSON()
  }

  /**
   * Create a new user.
   *
   * @param {{ name: string, email: string, role?: string, active?: boolean }} payload
   * @returns {Promise<User>}
   * @throws {Error} If email already exists
   */
  static async create(payload) {
    try {
      const user = new User(payload)
      await user.save()
      return user.toJSON()
    } catch (err) {
      if (err.code === 11000) {
        const error = new Error('Email already in use')
        error.statusCode = 409
        throw error
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message)
        const error = new Error(messages.join('; '))
        error.statusCode = 422
        throw error
      }
      throw err
    }
  }

  /**
   * Update an existing user by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {Partial<User>} payload - Fields to update
   * @returns {Promise<User>}
   * @throws {Error} If user not found or email conflict
   */
  static async update(id, payload) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true }
      )
      if (!user) {
        const error = new Error('User not found')
        error.statusCode = 404
        throw error
      }
      return user.toJSON()
    } catch (err) {
      if (err.code === 11000) {
        const error = new Error('Email already in use')
        error.statusCode = 409
        throw error
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message)
        const error = new Error(messages.join('; '))
        error.statusCode = 422
        throw error
      }
      throw err
    }
  }

  /**
   * Delete a user by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<void>}
   * @throws {Error} If user not found
   */
  static async delete(id) {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
  }
}
