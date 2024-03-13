import StretcherModel, { StretcherDocument } from '../model/Stretcher.model'
import StretcherVersionDAO from './StretcherVersion.dao'
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
      const stretcher = await StretcherModel.find({
        isDeleted: false,
      }).populate(populate ? 'patientId' : '')
      return stretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(id: string, populate?: boolean) {
    try {
      const stretcher = await StretcherModel.findOne({ _id: id }).populate(
        populate ? 'patientId' : ''
      )
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

  async create(stretcher: Stretcher, createdBy: string) {
    try {
      stretcher.editedBy = createdBy
      const newStretcher = new StretcherModel(stretcher)
      await newStretcher.save()
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, stretcher: Stretcher, editedBy: string) {
    try {
      const current = await this.getById(id, false)
      if (!current) throw new Error('Cama no encontrada.')
      const savedStretcher = await new StretcherVersionDAO().create(
        current.toJSON() as StretcherDocument
      )
      if (!savedStretcher)
        throw new Error('Error al guardar la versión de la cama.')
      stretcher.editedBy = editedBy
      stretcher.editedAt = Date.now()
      delete stretcher.__v
      const updatedStretcher = await StretcherModel.findByIdAndUpdate(
        id,
        { $set: stretcher, $inc: { __v: 1 } },
        { new: true }
      )
      return updatedStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async delete(_id: string, deletedBy: string) {
    try {
      const deletedStretcher = await StretcherModel.findByIdAndUpdate(
        { _id },
        {
          isDeleted: true,
          deletedAt: Date.now(),
          deletedBy: deletedBy,
        }
      )
      if (!deletedStretcher) throw new Error('Error al eliminar la cama.')
      const newStretcher = this.create(
        {
          label: deletedStretcher.label,
          aid: deletedStretcher.aid,
        } as Stretcher,
        deletedBy as string
      )
      if (!newStretcher) throw new Error('Error al crear la copia de la cama.')
      return deletedStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
