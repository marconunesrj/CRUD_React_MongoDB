import mongoose from 'mongoose'

/**
 * @typedef {Object} Pet
 * @property {mongoose.Types.ObjectId} user_id - Reference to the owner User
 * @property {string} name                     - Name of the pet
 * @property {Date}   createdAt                - Record creation timestamp (auto)
 * @property {Date}   updatedAt                - Record last update timestamp (auto)
 */
const petSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        return ret
      },
    },
  }
)

petSchema.index({ user_id: 1 })

export const Pet = mongoose.model('Pet', petSchema)