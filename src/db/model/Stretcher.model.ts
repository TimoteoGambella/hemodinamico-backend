import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import mongoose from 'mongoose'

interface StretcherDocument extends Stretcher, Document {}

const stretcherSchema = new mongoose.Schema<StretcherDocument>({
  label: { type: String, required: false },
  patientId: { type: ObjectId, required: false, ref: 'patients' },
  patientHeartRate: { type: Number, required: false, default: null },
  aid: {
    type: [String],
    required: false,
    default: ['ecmo'],
  },
  suministros: {
    type: Object,
    required: false,
    default: {
      drogas: [],
    },
  },
  diagnostic: {
    type: Object,
    required: false,
    default: {
      type: null,
      subtype: null,
    },
  },
  muestra: {
    type: Object,
    required: false,
    default: {
      arteria: {
        delta: null,
        lactato: null,
        pC02: null,
        sat: null,
      },
      vena: {
        pC02: null,
        sat: null,
      },
    },
  },
  cateter: {
    type: Object,
    required: false,
    default: {
      PAP: {
        diastolica: null,
        sistolica: null,
      },
      gasto: null,
      presion: {
        AD: null,
        capilar: null,
        mediaSistemica: null,
      },
    },
  },
  fick: {
    type: Object,
    required: false,
    default: {
      gasto: null,
      capacidad: null,
      consumo: null,
      diferencia: null,
      hemoglobina: null,
      indice: null,
      contenido: {
        ao: null,
        ap: null,
      },
    },
  },
  timestamp: {
    type: Number,
    required: false,
    default: Date.now(),
    immutable: true,
  },
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
