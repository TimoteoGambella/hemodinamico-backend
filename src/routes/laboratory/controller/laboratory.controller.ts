import { Request, Response, NextFunction } from 'express'
import LaboratoryDAO from '../../../db/dao/Laboratory.dao'
import LabVersionDAO from '../../../db/dao/LabVersion.dao'
import { ReqSession } from '../../../../module-types'
import PatientDAO from '../../../db/dao/Patient.dao'
import { ObjectId } from 'mongoose'

export default {
  getById: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { populate } = req.query
    try {
      const shouldPopulate = populate === 'true'
      const laboratory = await new LaboratoryDAO().getById(id, shouldPopulate)
      if (!laboratory) {
        res.status(404).json({ message: 'Laboratorio no encontrado.' })
        return
      }
      res.status(200).json({ message: 'Get laboratory', data: laboratory })
    } catch (error) {
      next(error)
    }
  },
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    const { populate, includeDeleted } = _req.query
    try {
      const shouldPopulate = populate === 'true'
      const laboratories = await new LaboratoryDAO().getAll(
        shouldPopulate,
        includeDeleted === 'true'
      )
      if (!laboratories) throw new Error('Could not obtain all laboratories.')
      res
        .status(200)
        .json({ message: 'Get all laboratories', data: laboratories })
    } catch (error) {
      next(error)
    }
  },
  getAllVersions: async (_req: Request, res: Response, next: NextFunction) => {
    const { populate } = _req.query
    const { id } = _req.params
    try {
      const shouldPopulate = populate === 'true'
      const exist = await new LaboratoryDAO().getById(id)
      if (!exist) {
        res.status(404).json({ message: 'Laboratorio no encontrado.' })
        return
      }
      const laboratories = await new LabVersionDAO().getAllById(
        id,
        shouldPopulate
      )
      if (!laboratories) throw new Error('Could not obtain all laboratories.')
      res
        .status(200)
        .json({ message: 'Get all versions of laboratory', data: laboratories })
    } catch (error) {
      next(error)
    }
  },
  create: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { patientId } = req.body
    try {
      if (!patientId)
        res.status(400).json({ message: 'El ID del paciente es requerido.' })
      const patient = await new PatientDAO().getById(patientId)
      if (!patient) {
        res.status(404).json({ message: 'Paciente no encontrado.' })
        return
      } else {
        if (patient.laboratoryId) {
          res
            .status(409)
            .json({ message: 'El paciente ya tiene asociado un laboratorio.' })
          return
        }
        const lab = await new LaboratoryDAO().create(
          patient._id as ObjectId,
          req.session?.user?._id as unknown as ObjectId
        )
        if (!lab) throw new Error('Laboratory could not be created.')
        await new PatientDAO().update(
          patientId,
          {
            laboratoryId: lab._id,
          } as Patient,
          req.session?.user?._id as unknown as ObjectId
        )
        res
          .status(201)
          .json({ message: 'Laboratory created successfully.', data: lab })
      }
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const laboratory = req.body
    try {
      laboratory.infective.resultado =
        laboratory?.infective?.resultado === 'true'
      if (!laboratory || Object.keys(laboratory).length === 0) {
        res.status(400).json({
          message: 'No se ha proporcionado la información de laboratorio.',
        })
        return
      }
      const exist = await new LaboratoryDAO().getById(id)
      if (!exist) {
        res.status(404).json({ message: 'Laboratorio no encontrado.' })
        return
      }
      const lab = await new LaboratoryDAO().update(
        id,
        exist,
        laboratory,
        req.session?.user?._id as ObjectId
      )
      if (!lab) throw new Error('Laboratory could not be updated.')
      res
        .status(200)
        .json({ message: 'Laboratory updated successfully.', data: lab })
    } catch (error) {
      next(error)
    }
  },
  delete: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { id } = req.params
    try {
      const lab = await new LaboratoryDAO().getById(id)
      if (!lab) {
        res.status(404).json({ message: 'Laboratorio no encontrado.' })
        return
      }
      const deleted = await new LaboratoryDAO().delete(
        lab,
        req.session?.user?._id as unknown as ObjectId
      )
      if (!deleted) throw new Error('Laboratory could not be deleted.')
      await new PatientDAO().update(
        String(lab.patientId),
        {
          laboratoryId: null,
        } as Patient,
        req.session?.user?._id as unknown as ObjectId
      )
      res
        .status(200)
        .json({ message: 'Laboratory deleted successfully.', data: deleted })
    } catch (error) {
      next(error)
    }
  },
}
