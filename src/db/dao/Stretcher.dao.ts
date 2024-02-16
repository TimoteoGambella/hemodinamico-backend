import mongoose from 'mongoose'
import StretcherModel from '../model/Stretcher.model'
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

  async getAll(populate?: boolean) {
    try {
      this.MONGODB(this.URL)
      const stretcher = await StretcherModel.find()
        .populate(populate ? 'patientId' : '')
        .select('-__v')
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(id: string, populate?: boolean) {
    try {
      this.MONGODB(this.URL)
      const stretcher = await StretcherModel.findOne({ _id: id })
        .populate(populate ? 'patientId' : '')
        .select('-__v')
      return stretcher
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
      const updatedStretcher = await StretcherModel.findOneAndUpdate(
        { _id: id },
        stretcher
      )
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
