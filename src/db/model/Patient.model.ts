import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

interface PatientDocument extends Patient, Document {}

const patientSchema = new mongoose.Schema<PatientDocument>({
  stretcherId: { type: ObjectId, required: false, ref: 'stretcher' },
  gender: { type: String, required: true, enum: ['M', 'F'] },
  fullname: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  dni: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: (dni: number) => dni.toString().length === 8,
      message: 'El DNI debe tener 8 dígitos.',
    },
  },
})

const PatientModel = mongoose.model('patient', patientSchema)

export default PatientModel
