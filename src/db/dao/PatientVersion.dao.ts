import PatientVersionModel from '../model/versions/PatientVersion.model'
import { PatientDocument } from '../model/Patient.model'
import { ClientSession } from 'mongoose'
import Logger from '../../utils/Logger'

export default class PatientVersionDAO {
  private logger = new Logger()
  private session: ClientSession | undefined

  constructor(session?: ClientSession) {
    this.session = session
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAllById(_id: string, populate = false) {
    try {
      const patients = await PatientVersionModel.find({ refId: _id })
        .populate(populate ? ['editedBy'] : '')
      return patients
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getById(_id: string) {
    try {
      const patient = await PatientVersionModel.findOne({ _id })
      return patient?.toObject()
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(patient: PatientDocument) {
    try {
      const currentId = patient._id
      delete patient._id
      const newPatientVersion = new PatientVersionModel({
        ...patient,
        refId: currentId,
        __v: patient.__v,
      })
      await newPatientVersion.save({ session: this.session })
      return newPatientVersion
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
