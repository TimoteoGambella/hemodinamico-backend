import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'
import LabSchema from './constants/LabSchema'

interface DeletedLabDocument extends DeletedLabs, Document {}

const DeletedLabSchema = new mongoose.Schema<DeletedLabDocument>({
  ...LabSchema,
  deletedBy: { type: ObjectId, required: true, ref: 'users', inmutable: true },
  deletedAt: {
    type: Number,
    required: true,
    default: Date.now(),
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

const DeletedLabsModel = mongoose.model(
  'deleted_laboratories',
  DeletedLabSchema
)

export default DeletedLabsModel
