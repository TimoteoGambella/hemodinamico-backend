import LabSchema from './schemas/LabSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

export interface LaboratoryDocument extends Laboratory, Document {}

const laboratorySchema = new mongoose.Schema<LaboratoryDocument>({
  ...LabSchema,
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

const LaboratoryModel = mongoose.model('laboratories', laboratorySchema)

export default LaboratoryModel
