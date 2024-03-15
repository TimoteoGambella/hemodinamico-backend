import PatientSchema from '../schemas/PatientSchema'
import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

interface PatientDocument extends Patient, Document {}

const patientVersionSchema = new mongoose.Schema<PatientDocument>(
  {
    ...PatientSchema,
    dni: {
      type: Number,
      required: true,
      unique: false,
    },
    editedBy: { type: ObjectId, required: true, ref: 'users', inmutable: true },
    refId: {
      type: ObjectId,
      ref: 'patients',
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

const PatientVersionModel = mongoose.model(
  'patients_versions',
  patientVersionSchema
)

export default PatientVersionModel
