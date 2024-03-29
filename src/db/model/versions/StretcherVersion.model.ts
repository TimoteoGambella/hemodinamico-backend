import StretcherSchema from '../schemas/StretcherSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface StretcherDocument extends StretcherVersions, Document {}

const stretcherSchema = new mongoose.Schema<StretcherDocument>(
  {
    ...StretcherSchema,
    editedBy: { type: ObjectId, required: true, ref: 'users', inmutable: true },
    patientId: {
      type: Object,
      required: function() { this.patientId === undefined },
      inmutable: true,
      default: null,
    },
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
