import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

interface LaboratoryDocument extends Laboratory, Document {}

const laboratorySchema = new mongoose.Schema<LaboratoryDocument>({
  patientId: { type: ObjectId, required: true, ref: 'patients' },
  blood_type: { type: String, required: false },
  hematology: { type: Object, required: false },
  liver_profile: { type: Object, required: false },
  cardiac_profile: { type: Object, required: false },
  infective: { type: Object, required: false },
  kidney: { type: Object, required: false },
  timestamp: {
    type: Number,
    required: false,
    default: Date.now(),
    immutable: true,
  },
})

laboratorySchema.pre('save', function (next) {
  if (this.isNew) initValues(this)
  next()
})

function initValues(lab: LaboratoryDocument) {
  lab.blood_type = null
  lab.hematology = {
    hemoglobina: null,
    bastones: null,
    segmentados: null,
    plaquetas: null,
    INR: null,
    leucocitos: null,
    protrombina: null,
    TPA: null,
  }
  lab.liver_profile = {
    fosfatasa: null,
    albumina: null,
    TGO: null,
    TGP: null,
    bilirrubina: {
      total: null,
      directa: null,
      indirecta: null,
    },
  }
  lab.cardiac_profile = {
    troponina: null,
    CA125: null,
    CPK: null,
    PRO: null,
  }
  lab.infective = {
    procalcitonina: null,
    germen: null,
    proteinaC: null,
    resultado: null,
    cultivo: null,
  }
  lab.kidney = {
    creatinina: null,
    urea: null,
    TFG: null,
  }
}

const LaboratoryModel = mongoose.model('laboratories', laboratorySchema)

export default LaboratoryModel
