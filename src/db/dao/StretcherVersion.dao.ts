import StretcherVersionModel from '../model/versions/StretcherVersion.model'
import Logger from '../../routes/util/Logger'
import { StretcherDocument } from '../model/Stretcher.model'

export default class StretcherVersionDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAllBy(_id: string, populate?: boolean) {
    try {
      const stretcher = await StretcherVersionModel.find({
        refId: _id,
      }).populate(populate ? 'patientId' : '')
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(stretcher: StretcherDocument) {
    try {
      const currentId = stretcher._id
      delete stretcher._id
      const newStretcher = new StretcherVersionModel({
        ...stretcher,
        refId: currentId,
        __v: stretcher.__v,
      })
      await newStretcher.save()
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
