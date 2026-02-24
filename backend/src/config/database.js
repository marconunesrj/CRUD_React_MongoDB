import mongoose from 'mongoose'

/**
 * Establishes connection to MongoDB.
 * Logs connection lifecycle events.
 *
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<void>}
 */
export async function connectDatabase(uri) {
  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Connection established')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Connection lost')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err)
  })

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
}

/**
 * Gracefully closes the MongoDB connection.
 *
 * @returns {Promise<void>}
 */
export async function disconnectDatabase() {
  await mongoose.disconnect()
  console.log('[MongoDB] Disconnected')
}