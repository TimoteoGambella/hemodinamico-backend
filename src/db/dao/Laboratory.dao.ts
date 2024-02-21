import LaboratoryModel from '../model/Laboratory.model'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'

export default class LaboratoryDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll(populate = false) {
    try {
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
      const laboratory = await LaboratoryModel.findOne({ _id })
        .populate(populate ? 'patientId' : '')
        .select('-__v')
      return laboratory?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patientId: ObjectId) {
    try {
      const newLab = new LaboratoryModel({ patientId })
      await newLab.save()
      return newLab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(_id: string, currentLab: Laboratory, newLab: Laboratory) {
    try {
      const updatedFields = this.mergeNestedValues(currentLab, newLab)
      const updatedLab = await LaboratoryModel.findByIdAndUpdate(
        { _id },
        { $set: updatedFields },
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
          if (typeof subValue === 'object') {
            value[subKey] = {
              ...(currentLab[key as keyof Laboratory]?.[
                subKey as keyof Laboratory[keyof Laboratory]
              ] ?? {}),
              ...subValue,
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

  async delete(_id: string) {
    try {
      const lab = await LaboratoryModel.findOneAndDelete({ _id })
      return lab
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
