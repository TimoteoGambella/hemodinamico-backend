import { Request, Response, NextFunction } from 'express'
import LaboratoryDAO from '../../../db/dao/Laboratory.dao'
import PatientDAO from '../../../db/dao/Patient.dao'

export default {
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    const { populate } = req.query
    const { id } = req.params
    try {
      const shouldPopulate = populate === 'true'
      const laboratory = await new LaboratoryDAO().getById(id, shouldPopulate)
      if (!laboratory) {
        res.status(404).json({ message: 'Laboratory not found.' })
        return
      }
      res.status(200).json({ message: 'Get laboratory', data: laboratory })
    } catch (error) {
      next(error)
    }
  },
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    const { populate } = _req.query
    try {
      const shouldPopulate = populate === 'true'
      const laboratories = await new LaboratoryDAO().getAll(shouldPopulate)
      if (!laboratories) throw new Error('Could not obtain all laboratories.')
      res.status(200).json({ message: 'Get all laboratories', data: laboratories })
    } catch (error) {
      next(error)
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    const { patientId } = req.body
    try {
      if (!patientId) res.status(400).json({ message: 'Patient ID is required.' })
      const patient = await new PatientDAO().getById(patientId)
      if (!patient) {
        res.status(404).json({ message: 'Patient not found.' })
        return
      } else {
        const lab = await new LaboratoryDAO().create(patient._id)
        if (!lab) throw new Error('Laboratory could not be created.')
        res.status(201).json({ message: 'Laboratory created successfully.', data: lab })
      }
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
      const lab = await new LaboratoryDAO().getById(id)
      if (!lab) {
        res.status(404).json({ message: 'Laboratory not found.' })
        return
      }
      const deleted = await new LaboratoryDAO().delete(id)
      if (!deleted) throw new Error('Laboratory could not be deleted.')
      res.status(200).json({ message: 'Laboratory deleted successfully.', data: deleted })
    } catch (error) {
      next(error)
    }
  },
}
