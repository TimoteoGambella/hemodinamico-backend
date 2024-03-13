import StretcherSchema from '../constants/StretcherSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface StretcherDocument extends StretcherVersions, Document {}

const stretcherSchema = new mongoose.Schema<StretcherDocument>(
  {
    ...StretcherSchema,
    editedBy: { type: ObjectId, required: true, ref: 'users', inmutable: true },
    refId: {
      type: ObjectId,
      ref: 'stretchers',
      required: true,
      inmutable: true,
    },
    __v: {
      type: Number,
      required: true,
      inmutable: true,
    },
  },
  {
    versionKey: false,
  }
)

const StretcherModel = mongoose.model('stretchers_versions', stretcherSchema)

export default StretcherModel
