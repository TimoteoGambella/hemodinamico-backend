import LabSchema from './constants/LabSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface LaboratoryDocument extends LabVersions, Document {}

const labVersionSchema = new mongoose.Schema<LaboratoryDocument>({
  ...LabSchema,
  editedBy: { type: ObjectId, required: true, inmutable: true },
  refId: {
    type: ObjectId,
    required: true,
    inmutable: true,
  },
  refIsDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  __v: {
    type: Number,
    required: true,
    inmutable: true,
  }
}, {
  versionKey: false
})

const LabVersionsModel = mongoose.model('laboratory_versions', labVersionSchema)

export default LabVersionsModel
