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
    sat: number | null
    pC02: number | null
  }
  arteria: {
    sat: number | null
    pC02: number | null
    lactato: number | null
    delta: number | null
  }
}

interface IndirectFick {
  hemoglobina: number | null
  consumo: number | null
  diferencia: number | null
  contenido: {
    ap: number | null
    ao: number | null
  }
  capacidad: number | null
  gasto: number | null
  indice: number | null
}

interface ArteryCatheter {
  presion: {
    AD: number | null
    capilar: number | null
    mediaSistemica: number | null
  }
  PAP: {
    sistolica: number | null
    diastolica: number | null
  }
  gasto: number | null
}

interface SuppliedDrugs {
  name:
    | 'noradrenalina'
    | 'vasopresina'
    | 'adrenalina'
    | 'dobutamina'
    | 'dopamina'
    | 'levosimendan'
    | 'nitroglicerina'
    | 'nitroprusiato',
  dose: number
}

interface Supplied {
  drogas: SuppliedDrugs[]
}

interface Stretcher {
  label: string
  patientId: unknown
  aid: ('ecmo' | 'balon')[] | null
  patientHeartRate: number | null
  muestra: GasometricSamples
  cateter: ArteryCatheter
  suministros: Supplied
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
    | null
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
    | null
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
