import PatientModel from '../model/Patient.model'
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
      const patients = await PatientModel.find().select('-__v')
      return patients
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: ObjectId) {
    try {
      const patient = await PatientModel.findOne({ _id }).select('-__v')
      return patient?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getByDNI(dni: number) {
    try {
      const patient = await PatientModel.findOne({ dni }).select('-__v')
      return patient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patient: Patient) {
    try {
      const newPatient = new PatientModel(patient)
      await newPatient.save()
      return newPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, patient: Patient) {
    try {
      const updatedPatient = await PatientModel.findOneAndUpdate({ _id: id }, patient, { new: true })
      return updatedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(patient: Patient) {
    try {
      const deletedPatient = await PatientModel.findOneAndDelete({ dni: patient.dni })
      return deletedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
