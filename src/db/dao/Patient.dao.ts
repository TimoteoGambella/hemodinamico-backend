import mongoose, { ObjectId } from 'mongoose'
import PatientModel from '../model/Patient.model'
import Logger from '../../routes/util/Logger'

export default class PatientDAO {
  private MONGODB!: typeof mongoose.connect
  private static instance: PatientDAO
  private logger = new Logger()
  private URL!: string

  constructor() {
    if (PatientDAO.instance) return PatientDAO.instance

    this.URL = process.env.MONGODB_URI || ''
    this.MONGODB = mongoose.connect
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      this.MONGODB(this.URL)
      const patients = await PatientModel.find().select('-__v')
      return patients
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: ObjectId) {
    try {
      this.MONGODB(this.URL)
      const patient = await PatientModel.findOne({ _id }).select('-__v')
      return patient?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getByDNI(dni: number) {
    try {
      this.MONGODB(this.URL)
      const patient = await PatientModel.findOne({ dni }).select('-__v')
      return patient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patient: Patient) {
    try {
      this.MONGODB(this.URL)
      const newPatient = new PatientModel(patient)
      await newPatient.save()
      return newPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, patient: Patient) {
    try {
      this.MONGODB(this.URL)
      const updatedPatient = await PatientModel.findOneAndUpdate({ _id: id }, patient, { new: true })
      return updatedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(patient: Patient) {
    try {
      this.MONGODB(this.URL)
      const deletedPatient = await PatientModel.findOneAndDelete({ dni: patient.dni })
      return deletedPatient
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
