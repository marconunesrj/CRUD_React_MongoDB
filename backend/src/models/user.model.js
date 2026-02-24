import mongoose from 'mongoose'

/**
 * @typedef {Object} User
 * @property {string} name        - Full name of the user
 * @property {string} email       - Unique email address
 * @property {string} role        - User role: 'admin' | 'editor' | 'viewer'
 * @property {boolean} active     - Whether the user account is active
 * @property {Date}   createdAt   - Record creation timestamp (auto)
 * @property {Date}   updatedAt   - Record last update timestamp (auto)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'editor', 'viewer'],
        message: 'Role must be one of: admin, editor, viewer',
      },
      default: 'viewer',
    },
    active: {
      type: Boolean,
      default: true,
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

// Index for faster email lookups
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ active: 1 })

export const User = mongoose.model('User', userSchema)
