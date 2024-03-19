import StretcherModel, { StretcherDocument } from '../model/Stretcher.model'
import StretcherVersionDAO from './StretcherVersion.dao'
import Logger from '../../routes/util/Logger'
import { ClientSession } from 'mongoose'
import PatientDAO from './Patient.dao'

export default class StretcherDAO {
  private logger = new Logger()
  private session: ClientSession | undefined

  constructor(session?: ClientSession) {
    this.session = session
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll(populate?: boolean, includeDeleted?: boolean) {
    try {
      const filter = includeDeleted ? {} : { isDeleted: false }
      const stretchers = await StretcherModel.find(filter)
      if (populate) {
        return await Promise.all(
          stretchers.map(async (stretcher) => {
            const patient = await new PatientDAO().getById(
              stretcher.patientId as string
            )
            // Reemplaza el patientId con el paciente completo
            return { ...stretcher.toObject(), patientId: patient }
          })
        )
      }
      return stretchers
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(id: string, populate?: boolean) {
    try {
      const stretcher = await StretcherModel.findOne(
        { _id: id },
        null,
        { session: this.session }
      ).populate(populate ? 'patientId' : '')
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
      await newStretcher.save({ session: this.session })
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async update(id: string, stretcher: Stretcher, editedBy: string) {
    try {
      const current = await this.getById(id, false)
      if (!current) throw new Error('Cama no encontrada.')
      const savedStretcher = await new StretcherVersionDAO(this.session).create(
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
      /**
       * OBTINE LA INFORMACION DE LA CAMA QUE SE VA A ELIMINAR
       */
      const stretcher = await this.getById(_id, false)
      if (!stretcher) throw new Error('Cama no encontrada.')
      /**
       * OBTIENE LA INFORMACION DEL PACIENTE QUE ESTA OCUPANDO LA CAMA
       */
      const patient = await new PatientDAO().getById(
        stretcher.patientId as string
      )
      /**
       * ACTUALIZA LA CAMA ESTABLECIENDO EL CAMPO isDeleted EN TRUE
       * Y ACTUALIZANDO LOS CAMPOS deletedAt, deletedBy Y patientId
       * patientId DEBE SER EL DOCUMENTO ACTUAL DEL PACIENTE QUE ESTA
       * OCUPANDO LA CAMA
       */
      const deletedStretcher = await StretcherModel.findByIdAndUpdate(
        { _id },
        {
          isDeleted: true,
          patientId: patient,
          deletedAt: Date.now(),
          deletedBy: deletedBy,
        },
        {
          session: this.session,
        }
      )
      if (!deletedStretcher) throw new Error('Error al eliminar la cama.')
      /**
       * CREA UNA CAMA NUEVA CON EL MISMO LABEL Y AID QUE LA CAMA
       * QUE SE ACABA DE ELIMINAR
       */
      const newStretcher = await this.create(
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
