import mongoose, { ObjectId } from 'mongoose'
import StretcherModel from '../model/Stretcher.model'
import PatientDAO from '../dao/Patient.dao'
import Logger from '../../routes/util/Logger'

export default class StretcherDAO {
  private MONGODB!: typeof mongoose.connect
  private static instance: StretcherDAO
  private logger = new Logger()
  private URL!: string

  constructor() {
    if (StretcherDAO.instance) return StretcherDAO.instance

    this.URL = process.env.MONGODB_URI || ''
    this.MONGODB = mongoose.connect
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  private async populate(stretcher: Stretcher[]) {
    const stretchers: Stretcher[] = []
    for (const s of stretcher) {
      if (s.patientId) {
        const patient = await new PatientDAO().getById(s.patientId as ObjectId)
        if (patient) {
          patient.stretcherId = undefined
          s.patientId = patient
        }
      }
      stretchers.push(s)
    }
    return stretchers
  }

  async getAll(populate?: boolean) {
    try {
      this.MONGODB(this.URL)
      const stretcher = await StretcherModel.find().select('-__v')
      if (!populate) return stretcher
      return this.populate(stretcher)
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(id: string, populate?: boolean) {
    try {
      this.MONGODB(this.URL)
      const stretcher = await StretcherModel.findOne({ _id: id }).select('-__v')
      if (!stretcher || !populate) return stretcher
      if(stretcher && !populate) return stretcher
      const populatedStretcher = await this.populate([stretcher])
      return populatedStretcher[0]
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getOneFreeStretcher() {
    try {
      this.MONGODB(this.URL)
      const stretcher = await StretcherModel.findOne({ patientId: null })
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(stretcher: Stretcher) {
    try {
      this.MONGODB(this.URL)
      const newStretcher = new StretcherModel(stretcher)
      await newStretcher.save()
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, stretcher: Stretcher) {
    try {
      this.MONGODB(this.URL)
      const updatedStretcher = await StretcherModel.findOneAndUpdate({ _id: id }, stretcher)
      return updatedStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(_id: string) {
    try {
      this.MONGODB(this.URL)
      const deletedStretcher = await StretcherModel.findOneAndDelete({ _id })
      return deletedStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
