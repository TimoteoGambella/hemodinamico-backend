import StretcherSchema from './schemas/StretcherSchema'
import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

export interface StretcherDocument extends Stretcher, Document {}

const stretcherSchema = new mongoose.Schema<StretcherDocument>({
  ...StretcherSchema,
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deletedBy: {
    type: ObjectId,
    required: false,
    ref: 'users',
  },
  deletedAt: {
    type: Number,
    required: false,
  },
})

stretcherSchema.pre('save', async function (next) {
  if (this.isNew && !this.label) {
    const num = await this.model('stretchers').countDocuments()
    this.label = 'Cama ' + (num + 1)
  }
  next()
})

const StretcherModel = mongoose.model('stretchers', stretcherSchema)

export default StretcherModel
