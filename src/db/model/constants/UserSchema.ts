import { ObjectId } from 'mongodb'

export default {
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createAt: {
    type: Number,
    required: false,
    default: () => Date.now(),
    immutable: true,
  },
  deletedBy: {
    type: ObjectId,
    ref: 'users',
    required: false,
  },
  deletedAt: {
    type: Number,
  },
}
