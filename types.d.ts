interface User {
  username: string
  password: string
  name: string
  lastName: string
  isAdmin: boolean
  createdAt: number
  isDeleted: boolean
  deletedBy: unknown
  deletedAt: number
  isValidPassword: (password: string) => Promise<boolean>
}

interface Patient {
  [x: string]: unknown
  fullname: string
  dni: string
  gender: 'M' | 'F'
  age: number
  weight: number
  height: number
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  stretcherId: unknown
  laboratoryId: unknown
  createdAt: number
  /**
   * Should be a ObjectId of a user
   */
  editedBy: unknown
  editedAt: number | null
  /**
   * Indicates if the document has been deleted
   */
  isDeleted: boolean
  /**
   * Indicates who deleted the document by their ObjectId
   */
  deletedBy: unknown | undefined
  /**
   * Indicates the time when the document was deleted
   */
  deletedAt: number | undefined
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
  }
}

interface IndirectFick {
  hemoglobina: number | null
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

interface StretcherDiagnostic {
  type: 'shock_isq' | 'shock' | 'falla_avanzada' | null
  subtype: 'intermacs_1' | 'intermacs_2' | 'intermacs_3' | null
}

interface Stretcher {
  [x: string]: unknown
  label: string
  patientId: string | Patient | null
  aid: ('ecmo' | 'balon')[] | null
  patientHeartRate: number | null
  muestra: GasometricSamples
  cateter: ArteryCatheter
  suministros: Supplied
  fick: IndirectFick
  diagnostic: StretcherDiagnostic
  editedAt: number | null,
  editedBy: unknown,
  isDeleted: boolean,
  deletedBy: unknown | undefined,
  deletedAt: number | undefined,
  createdAt: number
}

interface StretcherVersions extends Omit<Stretcher, 'isDeleted'> {
  patientId: unknown
  refId: unknown
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

type Cultivo = {
  cultivo: 'hemocultivo' | 'urocultivo' | 'cultivo de secreción'
  resultado: boolean
  germen: string | null
}

interface Infective {
  proteinaC: number | null
  procalcitonina: number | null
  cultivos: Cultivo[]
}

interface Kidney {
  urea: number | null
  creatinina: number | null
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
  patientId: Patient
  hematology: Hematology
  liver_profile: LiverProfile
  cardiac_profile: CardiacProfile
  diagnostic: Diagnostic
  infective: Infective
  kidney: Kidney
  /**
   * Should be a ObjectId of a user
   */
  editedBy: unknown
  editedAt: number | null
  createdAt: number
  /**
   * Indicates if the document has been deleted
   */
  isDeleted: boolean
  /**
   * Indicates who deleted the document by their ObjectId
   */
  deletedBy: unknown | undefined
  /**
   * Indicates the time when the document was deleted
   */
  deletedAt: number | undefined
}

interface LabVersions extends Omit<Laboratory, 'isDeleted'> {
  /**
   * Should be a ObjectId of a patient - required
   */
  patientId: unknown
  /**
   * Refers to the _id prop of a document in the laboratory collection 
   */
  refId: unknown
}
