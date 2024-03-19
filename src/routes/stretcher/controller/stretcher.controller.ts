import StretcherVersionDAO from '../../../db/dao/StretcherVersion.dao'
import { Request, Response, NextFunction } from 'express'
import StretcherDAO from '../../../db/dao/Stretcher.dao'
import { ReqSession } from '../../../../module-types'
import PatientDAO from '../../../db/dao/Patient.dao'
import { startSession } from 'mongoose'

export default {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    const { populate, includeDeleted } = req.query
    try {
      const shouldPopulate = populate === 'true'
      const shouldIncludeDeleted = includeDeleted === 'true'
      const stretcher = await new StretcherDAO().getAll(
        shouldPopulate,
        shouldIncludeDeleted
      )
      if (!stretcher) throw new Error('Error al obtener las camillas.')
      res.status(200).json({ message: 'Get all stretcher', data: stretcher })
    } catch (error) {
      next(error)
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { populate } = req.query
    try {
      const stretcher = await new StretcherDAO().getById(
        id,
        populate === 'true'
      )
      if (!stretcher) throw new Error('Error al obtener la camilla.')
      res.status(200).json({ message: 'Get one stretcher', data: stretcher })
    } catch (error) {
      next(error)
    }
  },
  getVersionsById: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { populate } = req.query
    try {
      const exist = await new StretcherDAO().getById(id)
      if (!exist) {
        res.status(404).json({ message: 'Cama no encontrada.' })
        return
      }
      const stretcher = await new StretcherVersionDAO().getAllBy(
        id,
        populate === 'true'
      )
      if (!stretcher)
        throw new Error('Error al obtener las versiones de la camilla.')
      res.status(200).json({
        message: 'Get all versions of stretcher',
        data: stretcher,
      })
    } catch (error) {
      next(error)
    }
  },
  getAllVersions: async (req: Request, res: Response, next: NextFunction) => {
    const { populate } = req.query
    try {
      const shouldPopulate = populate === 'true'
      const stretcher = await new StretcherVersionDAO().getAll(shouldPopulate)
      if (!stretcher)
        throw new Error('Error al obtener las versiones de las camillas.')
      res.status(200).json({
        message: 'Get all versions of stretcher',
        data: stretcher,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    const { flush } = req.query
    const stretcher: Stretcher = req.body
    try {
      if (flush === 'true') {
        res.status(501).json({ message: 'Flush not implemented yet.' })
        return
      }
      const updatedStretcher = await new StretcherDAO().update(
        String(id),
        stretcher,
        req.session.user!._id
      )
      if (!updatedStretcher) throw new Error('Error al actualizar la camilla.')
      res.status(200).json({
        message: 'Camilla actualizada exitosamente.',
        data: updatedStretcher,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    const session = await startSession()
    session.startTransaction()
    try {
      const exist = await new StretcherDAO().getById(id, false)
      if (!exist) {
        res.status(404).json({ message: 'Cama no encontrada.' })
        return
      } else if (exist.__v === 0) {
        res.status(400).json({
          message: 'No se puede eliminar una cama que no ha sido modificada.',
        })
        return
      }
      const patient = await new PatientDAO().update(
        String(exist.patientId),
        { stretcherId: null } as Patient,
        req.session.user!._id
      )
      if (!patient) {
        session.abortTransaction()
        res.status(500).json({
          message:
            'Error al actualizar la información del paciente asociado a la cama.',
        })
        return
      }
      const deletedStretcher = await new StretcherDAO().delete(
        String(id),
        req.session.user!._id
      )
      if (!deletedStretcher) throw new Error('Error al eliminar la camilla.')
      await session.commitTransaction()
      res.status(200).json({
        message: 'Cama eliminada exitosamente.',
        data: deletedStretcher,
      })
    } catch (error) {
      await session.abortTransaction()
      next(error)
    } finally {
      session.endSession()
    }
  },
}
