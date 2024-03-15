import LabSchema from '../schemas/LabSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface LaboratoryDocument extends LabVersions, Document {}

const labVersionSchema = new mongoose.Schema<LaboratoryDocument>({
  ...LabSchema,
  editedBy: { type: ObjectId, required: true, ref: 'users', inmutable: true },
  refId: {
    type: ObjectId,
    ref: 'laboratories',
    required: true,
    inmutable: true,
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
