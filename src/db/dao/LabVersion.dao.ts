import LabVersionModel from '../model/versions/LabVersion.model'
import { LaboratoryDocument } from '../model/Laboratory.model'
import { ClientSession, ObjectId } from 'mongoose'
import Logger from '../../utils/Logger'

export default class LabVersionDAO {
  private logger = new Logger()
  private session: ClientSession | undefined

  constructor(session?: ClientSession) {
    this.session = session
  }

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
      const laboratories = await LabVersionModel.find().populate(
        this.populateOptions(populate)
      )
      return laboratories
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getAllById(_id: string, populate = false) {
    try {
      const laboratories = await LabVersionModel.find({ refId: _id })
        .populate(this.populateOptions(populate))
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

  async create(lab: LaboratoryDocument) {
    try {
      const currentId = lab._id
      delete lab._id
      const newLabVersion = new LabVersionModel({
        ...lab,
        refId: currentId,
        __v: lab.__v,
      })
      await newLabVersion.save({ session: this.session })
      return newLabVersion
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
