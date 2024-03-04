import LabVersionDAO from '../dao/LabVersion.dao'
import { Document, UpdateQuery } from 'mongoose'
import LabSchema from './constants/LabSchema'
import mongoose from 'mongoose'

export interface LaboratoryDocument extends Laboratory, Document {}

const laboratorySchema = new mongoose.Schema<LaboratoryDocument>(LabSchema)

laboratorySchema.pre('findOneAndUpdate', function (next) {
  const doc = (this.getUpdate() as UpdateQuery<Laboratory>)?.['$set']
  if (doc) {
    doc.infective.resultado = doc.infective.resultado === 'true'
  }
  next()
})
laboratorySchema.pre('findOneAndDelete', async function (next) {
  const { _id } = this.getFilter() as { _id: mongoose.ObjectId }
  const saved = await new LabVersionDAO().updateRefIsDeleted(_id)
  if (!saved) return next(new Error('Error al actualizar las versiones asociadas al laboratorio.'))
  next()
})

const LaboratoryModel = mongoose.model('laboratories', laboratorySchema)

export default LaboratoryModel
