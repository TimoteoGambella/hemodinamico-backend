import StretcherVersionModel from '../model/versions/StretcherVersion.model'
import { StretcherDocument } from '../model/Stretcher.model'
import Logger from '../../routes/util/Logger'
import StretcherDAO from './Stretcher.dao'
import { ClientSession } from 'mongoose'
import PatientDAO from './Patient.dao'

export default class StretcherVersionDAO {
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
      if (populate && !curStretcher.isDeleted && curStretcher.patientId) {
        const patient = await new PatientDAO().getById(
          curStretcher.patientId as string
        )
        if (!patient) throw new Error('Error al obtener el paciente.')
        curStretcher.patientId = patient
      }
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

      const patient = await new PatientDAO(this.session).getById(
        stretcher.patientId as string
      )

      const newStretcher = new StretcherVersionModel({
        ...stretcher,
        refId: currentId,
        patientId: patient,
        __v: stretcher.__v,
      })
      await newStretcher.save({ session: this.session })
      return newStretcher
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
