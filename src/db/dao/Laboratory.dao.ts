import LaboratoryModel, { LaboratoryDocument } from '../model/Laboratory.model'
import LabVersionDAO from './LabVersion.dao'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'

export default class LaboratoryDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAll(_populate = false, includeDeleted = false) {
    try {
      let laboratories
      if (!includeDeleted) {
        laboratories = await LaboratoryModel.find({
          isDeleted: false,
        })
      } else {
        laboratories = await LaboratoryModel.find()
      }
      return laboratories
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getById(_id: string, _populate = false) {
    try {
      const laboratory = await LaboratoryModel.findOne({ _id })
      if (!laboratory) return null
      return laboratory.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patient: Patient, createdBy: ObjectId) {
    try {
      const newLab = new LaboratoryModel({
        patientId: patient,
        editedBy: createdBy,
        createdAt: Date.now(),
      })
      await newLab.save()
      return newLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(_id: string, currentLab: LaboratoryDocument, newLab: Laboratory, userId: ObjectId, patient: Patient) {
    try {
      const labVersionDAO = await new LabVersionDAO().create(currentLab)
      if (!labVersionDAO) return null
      const updatedFields = this.mergeNestedValues(currentLab, newLab)
      updatedFields.patientId = patient
      updatedFields.editedBy = userId
      updatedFields.editedAt = Date.now()
      const updatedLab = await LaboratoryModel.findByIdAndUpdate(
        { _id },
        { $set: updatedFields, $inc: { __v: 1 } },
        { new: true }
      )
      return updatedLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private mergeNestedValues(currentLab: Laboratory, newLab: Laboratory) {
    const updatedFields: Partial<Laboratory> = {}
    for (const [key, value] of Object.entries(newLab)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (Object.prototype.toString.call(subValue) === '[object Object]') {
            value[subKey] = {
              ...(currentLab[key as keyof Laboratory]?.[
                subKey as keyof Laboratory[keyof Laboratory]
              ] ?? {}),
              ...(subValue as object),
            }
          }
        }
        updatedFields[key as keyof Laboratory] = {
          ...((currentLab[key as keyof Laboratory] as object) ?? {}),
          ...value,
        }
      } else updatedFields[key as keyof Laboratory] = value
    }
    return updatedFields
  }

  async delete(lab: LaboratoryDocument, userId: ObjectId) {
    try {
      const deletedLab = await LaboratoryModel.findByIdAndUpdate(
        { _id: lab._id },
        {
          $set: { isDeleted: true, deletedBy: userId, deletedAt: Date.now() },
        }
      )
      return deletedLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
