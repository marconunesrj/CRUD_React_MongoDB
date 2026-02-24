import { Pet } from '../models/pet.model.js'

/**
 * Maps a populated Pet document to a response DTO,
 * replacing user_id with the owner's name.
 *
 * @param {import('mongoose').Document} pet - Populated pet document
 * @returns {Object}
 */
function toDTO(pet) {
  const obj = pet.toObject()
  return {
    id:        obj._id.toString(),
    user_name: obj.user_id?.name ?? null,
    name:      obj.name,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

/**
 * @class PetController
 * @description Handles all business logic for pet CRUD operations.
 *              Follows Single Responsibility Principle — pure data layer only.
 */
export class PetController {
  /**
   * List all pets with optional filtering.
   * Populates user_id to expose the owner's name.
   *
   * @param {Object} filters - Optional query filters (user_id)
   * @param {Object} pagination - { page, limit }
   * @returns {Promise<{ data: Pet[], total: number, page: number, pages: number }>}
   */
  static async findAll({ user_id, page = 1, limit = 10 } = {}) {
    const query = {}
    if (user_id) query.user_id = user_id

    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      Pet.find(query).populate('user_id', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Pet.countDocuments(query),
    ])

    return {
      data: data.map(toDTO),
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Find a single pet by ID.
   * Populates user_id to expose the owner's name.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<Pet>}
   * @throws {Error} If pet not found
   */
  static async findById(id) {
    const pet = await Pet.findById(id).populate('user_id', 'name')
    if (!pet) {
      const error = new Error('Pet not found')
      error.statusCode = 404
      throw error
    }
    return toDTO(pet)
  }

  /**
   * Create a new pet.
   *
   * @param {{ user_id: string, name: string }} payload
   * @returns {Promise<Pet>}
   */
  static async create(payload) {
    try {
      const pet = new Pet(payload)
      await pet.save()
      return pet.toJSON()
    } catch (err) {
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
   * Update an existing pet by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {Partial<Pet>} payload - Fields to update
   * @returns {Promise<Pet>}
   * @throws {Error} If pet not found
   */
  static async update(id, payload) {
    try {
      const pet = await Pet.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true }
      )
      if (!pet) {
        const error = new Error('Pet not found')
        error.statusCode = 404
        throw error
      }
      return pet.toJSON()
    } catch (err) {
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
   * Delete a pet by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<void>}
   * @throws {Error} If pet not found
   */
  static async delete(id) {
    const pet = await Pet.findByIdAndDelete(id)
    if (!pet) {
      const error = new Error('Pet not found')
      error.statusCode = 404
      throw error
    }
  }
}
