import { ObjectId } from 'mongodb'

export default {
  laboratoryId: { type: ObjectId, required: false, ref: 'laboratories', default: null },
  stretcherId: { type: ObjectId, required: false, ref: 'stretcher', default: null },
  gender: { type: String, required: true, enum: ['M', 'F'] },
  fullname: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  bloodType: {
    type: String,
    required: false,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Tipo de sangre no válido.',
    },
  },
  dni: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: (dni: number) => dni.toString().length === 8,
      message: 'El DNI debe tener 8 dígitos.',
    },
  },
  createdAt: {
    type: Number,
    required: false,
    default: Date.now(),
    immutable: true,
  },
  editedBy: { type: ObjectId, required: false, ref: 'users' },
  editedAt: { type: Number, required: false, default: null },
}
