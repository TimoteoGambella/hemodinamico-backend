import PatientSchema from './constants/PatientSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

export interface PatientDocument extends Patient, Document {}

const patientSchema = new mongoose.Schema<PatientDocument>({
  ...PatientSchema,
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

const PatientModel = mongoose.model('patients', patientSchema)

export default PatientModel
