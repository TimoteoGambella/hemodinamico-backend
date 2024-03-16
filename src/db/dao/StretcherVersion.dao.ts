import StretcherVersionModel from '../model/versions/StretcherVersion.model'
import { StretcherDocument } from '../model/Stretcher.model'
import Logger from '../../routes/util/Logger'
import StretcherDAO from './Stretcher.dao'

export default class StretcherVersionDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  private populateOptions(populate: boolean) {
    return populate
      ? [{ path: 'editedBy', select: '-password' }, 'patientId']
      : []
  }

  async getAll(populate = false) {
    try {
      const stretcher = await StretcherVersionModel.find().populate(
        this.populateOptions(populate)
      )
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getAllBy(_id: string, populate?: boolean) {
    try {
      const stretcher = await StretcherVersionModel.find({
        refId: _id,
      }).populate(this.populateOptions(populate ?? false))
      const curStretcher = await new StretcherDAO().getById(_id, populate)
      if (!curStretcher) throw new Error('Error al obtener la cama.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stretcher.push(curStretcher as any)
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
