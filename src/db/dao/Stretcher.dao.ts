import StretcherModel from '../model/Stretcher.model'
import Logger from '../../routes/util/Logger'

export default class StretcherDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll(populate?: boolean) {
    try {
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
      const stretcher = await StretcherModel.findOne({ patientId: null })
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(stretcher: Stretcher) {
    try {
      const newStretcher = new StretcherModel(stretcher)
      await newStretcher.save()
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, stretcher: Stretcher) {
    try {
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
      const deletedStretcher = await StretcherModel.findOneAndDelete({ _id })
      return deletedStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
