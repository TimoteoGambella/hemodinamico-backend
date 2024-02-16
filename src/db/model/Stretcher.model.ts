import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

interface StretcherDocument extends Stretcher, Document {}

const stretcherSchema = new mongoose.Schema<StretcherDocument>({
  patientId: { type: ObjectId, required: false, ref: 'patient' },
  'muestras gasométricas': { type: Object, required: false },
  'fick indirecto': { type: Object, required: false },
  label: { type: String, required: false },
})

stretcherSchema.pre('save', async function (next) {
  if (this.isNew && !this.label) {
    const num = await this.model('stretcher').countDocuments()
    this.label = 'Cama ' + (num + 1)
  }
  next()
})

const StretcherModel = mongoose.model('stretcher', stretcherSchema)

export default StretcherModel
