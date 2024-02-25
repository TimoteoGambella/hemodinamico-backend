interface User {
  username: string
  password: string
  name: string
  lastName: string
  isAdmin: boolean
  timestamp: number
  isValidPassword: (password: string) => boolean
}

interface Patient {
  [x: string]: unknown
  fullname: string
  dni: number
  gender: 'M' | 'F'
  age: number
  weight: number
  height: number
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  stretcherId: unknown
  laboratoryId: unknown
  timestamp: number
}

interface GasometricSamples {
  vena: {
    sat: number
    pC02: number
  }
  arteria: {
    sat: number
    pC02: number
    lactato: number
    delta: number | undefined
  }
}

interface IndirectFick {
  hemoglobina: number
  consumo: number | undefined
  diferencia: number | undefined
  contenido: {
    ap: number | undefined
    ao: number | undefined
  }
  capacidad : number | undefined
  gasto: number | undefined
  indice: number | undefined
}

interface Stretcher {
  label: string
  patientId: unknown
  muestra: GasometricSamples
  fick: IndirectFick
  timestamp: number
}

interface Hematology {
  hemoglobina: number | null
  plaquetas: number | null
  leucocitos: number | null
  bastones: number | null
  segmentados: number | null
  INR: number | null
  protrombina: number | null
  TPA: number | null
}

interface LiverProfile {
  TGO: number | null
  TGP: number | null
  albumina: number | null
  fosfatasa: number | null
  bilirrubina: {
    total: number | null
    directa: number | null
  }
}

interface CardiacProfile {
  troponina: number | null
  CPK: number | null
  PRO: number | null
  CA125: number | null
}

interface Infective {
  proteinaC: number | null
  procalcitonina: number | null
  cultivo: 'hemocultivo' | 'urocultivo' | 'cultivo de secreción' | null
  resultado: boolean | null
  germen: string | null
}

interface Kidney {
  urea: number | null
  creatinina: number | null
  TFG: number | null
}

interface Diagnostic {
  type: 'shock' | 'falla_cardiaca' | 'infarto' | 'valvular' | null
  subtype:
      | 'isquemico'
      | 'no_isquemico'
      | 'cronica'
      | 'FCAD'
      | 'aguda'
      | 'st_no_elevado'
      | 'st_elevado'
      | 'aortico'
      | 'mitral'
      | 'tricuspide'
      | null,
  child:
      | 'isquemia'
      | 'no_isquemica'
      | 'anterior'
      | 'anterosepta'
      | 'inferior'
      | 'inf_post_la'
      | 'insuficiente'
      | 'estenosis'
      | 'doble_lesion'
      | null,
  FEVI: '50' | '40-' | '40' | null
}

interface Laboratory {
  patientId: string | PatientData
  hematology: Hematology
  liver_profile: LiverProfile
  cardiac_profile: CardiacProfile
  diagnostic: Diagnostic
  infective: Infective
  kidney: Kidney
  timestamp: number
}
