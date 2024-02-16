import mongoose, { ObjectId } from 'mongoose'
import LaboratoryModel from '../model/Laboratory.model'
import Logger from '../../routes/util/Logger'

export default class LaboratoryDAO {
  private MONGODB!: typeof mongoose.connect
  private static instance: LaboratoryDAO
  private logger = new Logger()
  private URL!: string

  constructor() {
    if (LaboratoryDAO.instance) return LaboratoryDAO.instance

    this.URL = process.env.MONGODB_URI || ''
    this.MONGODB = mongoose.connect
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll(populate = false) {
    try {
      this.MONGODB(this.URL)
      const laboratories = await LaboratoryModel.find()
        .populate(populate ? 'patientId' : '')
        .select('-__v')
      return laboratories
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: string, populate = false) {
    try {
      this.MONGODB(this.URL)
      const laboratory = await LaboratoryModel.findOne({ _id })
        .populate(populate ? 'patientId' : '')
        .select('-__v')
      return laboratory
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patientId: ObjectId) {
    try {
      this.MONGODB(this.URL)
      const newLab = new LaboratoryModel({ patientId })
      await newLab.save()
      return newLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(_id: string, lab: Laboratory) {
    try {
      this.MONGODB(this.URL)
      const updatedLab = await LaboratoryModel.findOneAndUpdate({ _id }, lab)
      return updatedLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(_id: string) {
    try {
      const lab = await LaboratoryModel.findOneAndDelete({ _id })
      return lab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
