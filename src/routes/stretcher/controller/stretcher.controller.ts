import { Request, Response, NextFunction } from 'express'
import StretcherDAO from '../../../db/dao/Stretcher.dao'

export default {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    const { populate } = _req.query
    try {
      const stretcher = await new StretcherDAO().getAll(populate === 'true')
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
      const stretcher = await new StretcherDAO().getById(id, populate === 'true')
      if (!stretcher) throw new Error('Error al obtener la camilla.')
      res.status(200).json({ message: 'Get one stretcher', data: stretcher })
    } catch (error) {
      next(error)
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    const stretcher: Stretcher = req.body
    try {
      const createdStretcher = await new StretcherDAO().create(stretcher)
      if (!createdStretcher) throw new Error('Error al crear la camilla.')
      res.status(201).json({
        message: 'Camilla creada exitosamente.',
        data: createdStretcher,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { flush } = req.query
    const stretcher: Stretcher = req.body
    try {
      if (!id) {
        res.status(400).json({ message: 'ID no proporcionado.' })
        return
      } if (flush === 'true') {
        res.status(501).json({ message: 'Flush not implemented yet.' })
        return
      }
      const updatedStretcher = await new StretcherDAO().update(String(id), stretcher)
      if (!updatedStretcher) throw new Error('Error al actualizar la camilla.')
      res.status(200).json({
        message: 'Camilla actualizada exitosamente.',
        data: updatedStretcher,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
      if (!id) {
        res.status(400).json({ message: 'ID no proporcionado.' })
        return
      }
      const deletedPatient = await new StretcherDAO().delete(String(id))
      if (!deletedPatient) throw new Error('Error al eliminar la camilla.')
      res.status(200).json({
        message: 'Camilla eliminada exitosamente.',
        data: deletedPatient,
      })
    } catch (error) {
      next(error)
    }
  },
}
