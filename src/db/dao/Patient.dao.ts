import PatientModel, { PatientDocument } from '../model/Patient.model'
import PatientVersionDAO from './PatientVersion.dao'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'

export default class PatientDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      const patients = await PatientModel.find({ isDeleted: false })
      return patients
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(
    _id: ObjectId | string,
    asObject: boolean = true
  ): Promise<Patient | PatientDocument | null | undefined> {
    try {
      const patient = await PatientModel.findOne({ _id })
      if (asObject) return patient?.toObject()
      else return patient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getByDNI(dni: number) {
    try {
      const patient = await PatientModel.findOne({ dni })
      return patient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patient: Patient, createdBy: ObjectId) {
    try {
      patient.editedBy = createdBy
      const newPatient = new PatientModel(patient)
      await newPatient.save()
      return newPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, patient: Patient, editedBy: ObjectId | string) {
    try {
      const current = (await this.getById(id, true)) as PatientDocument | null
      if (!current) throw new Error('Paciente no encontrado.')
      const savedPatient = await new PatientVersionDAO().create(current)
      if (!savedPatient)
        throw new Error('Error al guardar versión del paciente.')
      patient.editedBy = editedBy
      patient.editedAt = Date.now()
      delete patient.__v
      const updatedPatient = await PatientModel.findByIdAndUpdate(
        id,
        { $set: patient, $inc: { __v: 1 } },
        { new: true }
      )
      return updatedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(id: string, deletedBy: ObjectId) {
    try {
      const deletedPatient = await PatientModel.findByIdAndUpdate(id, {
        $set: { isDeleted: true, deletedAt: Date.now(), deletedBy },
      })
      return deletedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
