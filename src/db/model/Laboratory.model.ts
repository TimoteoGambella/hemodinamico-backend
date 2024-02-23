import { ObjectId } from 'mongodb'
import { Document, UpdateQuery } from 'mongoose'
import mongoose from 'mongoose'

interface LaboratoryDocument extends Laboratory, Document {}

const laboratorySchema = new mongoose.Schema<LaboratoryDocument>({
  patientId: { type: ObjectId, required: true, ref: 'patients' },
  hematology: { type: Object, required: false },
  liver_profile: { type: Object, required: false },
  cardiac_profile: { type: Object, required: false },
  diagnostic: { type: Object, required: false },
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

laboratorySchema.pre('findOneAndUpdate', function (next) {
  const doc = (this.getUpdate() as UpdateQuery<Laboratory>)?.['$set']
  if(doc) {
    doc.infective.resultado = doc.infective.resultado === 'true'
  }
  next()
})

function initValues(lab: LaboratoryDocument) {
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
      directa: null
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
  lab.diagnostic = {
    type: null,
    subtype: null,
    child: null,
    FEVI: null,
  }
  lab.kidney = {
    creatinina: null,
    urea: null,
    TFG: null,
  }
}

const LaboratoryModel = mongoose.model('laboratories', laboratorySchema)

export default LaboratoryModel
