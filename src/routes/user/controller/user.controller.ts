import { Request, Response, NextFunction } from 'express'
import UserDAO from '../../../db/dao/User.dao'

export default {
  getAllUsers: async (_req: Request, res: Response, next: NextFunction) => {
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
      if(!createdUser) throw new Error('Error al crear usuario.')
      res.status(201).json({
        message: 'Usuario creado exitosamente.',
        user: createdUser,
      })
    } catch (error) {
      next(error)
    }
  }
}
