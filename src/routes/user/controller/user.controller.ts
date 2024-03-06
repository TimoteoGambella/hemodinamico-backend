import { Request, Response, NextFunction } from 'express'
import { ReqSession } from '../../../../module-types'
import UserDAO from '../../../db/dao/User.dao'
import { ObjectId } from 'mongoose'

export default {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await new UserDAO().getAll()
      if (!users) throw new Error('Error al obtener usuarios.')
      res.status(200).json({ message: 'Get all users', data: users })
    } catch (error) {
      next(error)
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body
    try {
      const createdUser = await new UserDAO().create(user)
      if (!createdUser) throw new Error('Error al crear usuario.')
      res.status(201).json({
        message: 'Usuario creado exitosamente.',
        data: createdUser,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    const { username } = req.params
    try {
      const user = await new UserDAO().getByUsername(username)
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado.' })
        return
      }
      const deletedUser = await new UserDAO().delete(
        user.username,
        req.session!.user?._id as unknown as ObjectId
      )
      if (!deletedUser) throw new Error('Error al eliminar usuario.')
      res.status(200).json({
        message: 'Usuario eliminado exitosamente.',
        data: deletedUser,
      })
    } catch (error) {
      next(error)
    }
  },
}
