import { ObjectId } from 'mongodb'

export default {
  patientId: { type: ObjectId, required: true, ref: 'patients' },
  hematology: {
    type: Object,
    required: false,
    default: {
      hemoglobina: null,
      bastones: null,
      segmentados: null,
      plaquetas: null,
      INR: null,
      leucocitos: null,
      protrombina: null,
      TPA: null,
    },
  },
  liver_profile: {
    type: Object,
    required: false,
    default: {
      fosfatasa: null,
      albumina: null,
      TGO: null,
      TGP: null,
      bilirrubina: {
        total: null,
        directa: null,
      },
    },
  },
  cardiac_profile: {
    type: Object,
    required: false,
    default: {
      troponina: null,
      CA125: null,
      CPK: null,
      PRO: null,
    },
  },
  diagnostic: {
    type: Object,
    required: false,
    default: {
      type: null,
      subtype: null,
      child: null,
      FEVI: null,
    },
  },
  infective: {
    type: Object,
    required: false,
    default: {
      procalcitonina: null,
      germen: null,
      proteinaC: null,
      resultado: null,
      cultivo: null,
    },
  },
  kidney: {
    type: Object,
    required: false,
    default: {
      creatinina: null,
      urea: null,
    },
  },
  createdAt: {
    type: Number,
    required: false,
    default: Date.now(),
    immutable: true,
  },
}
