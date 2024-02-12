interface User {
  username: string
  password: string
  name: string
  lastName: string
  isAdmin: boolean
  isValidPassword: (password: string) => boolean
}

interface Patient {
  fullname: string
  dni: number
  gender: 'M' | 'F'
  age: number
  weight: number
  height: number
  stretcherId: unknown
}

interface GasometricSamples {
  vena: {
    'Sat O2': number
    pC02: number
  },
  arteria: {
    'Sat O2': number
    pC02: number
    Lactato: number
    'Delta CO2': number | undefined
  }
}

interface IndirectFick {
  Hemoglobina: number
  'Consumo O2 (VO2)': number | undefined
  'Diferencia A-V sistémica': number | undefined
  'Contenido O2 en AP': number | undefined
  'Contenido O2 en Ao': number | undefined
  'Capacidad de Hb': number | undefined
  'Gasto cardíaco': number | undefined
  'Indice cardíaco': number | undefined
}

interface Stretcher {
  label: string
  patientId: unknown
  'muestras gasométricas': GasometricSamples
  'fick indirecto': IndirectFick
}
