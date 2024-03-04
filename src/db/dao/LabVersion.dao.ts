import { LaboratoryDocument } from '../model/Laboratory.model'
import LabVersionModel from '../model/LabVersion.model'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'

export default class LabVersionDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      const laboratories = await LabVersionModel.find()
      return laboratories
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: string) {
    try {
      const laboratory = await LabVersionModel.findOne({ _id })
      return laboratory?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async updateRefIsDeleted(refId: ObjectId) {
    try {
      const updated = await LabVersionModel.updateMany(
        { refId },
        { refIsDeleted: true }
      )
      return updated
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(lab: LaboratoryDocument, userId: ObjectId) {
    try {
      const currentId = lab._id
      delete lab._id
      const newLabVersion = new LabVersionModel({
        ...lab,
        editedBy: userId,
        refId: currentId,
        __v: lab.__v,
      })
      await newLabVersion.save()
      return newLabVersion
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
