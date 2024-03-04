import { LaboratoryDocument } from '../model/Laboratory.model'
import DeleteLabModel from '../model/DeletedLabs.model'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'

export default class DeleteLabDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      const deletedLabs = await DeleteLabModel.find()
      return deletedLabs
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: string) {
    try {
      const lab = await DeleteLabModel.findOne({ _id })
      return lab?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(lab: LaboratoryDocument, userId: ObjectId) {
    try {
      const deletedLab = new DeleteLabModel({
        ...lab,
        deletedBy: userId,
        __v: lab.__v,
      })
      await deletedLab.save()
      return deletedLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
