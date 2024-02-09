import { Request, Response, NextFunction } from 'express'
import UserDAO from '../../../db/dao/User.dao'

export default {
  getAllUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await new UserDAO().getAll()
      res.status(200).json({ message: 'Get all users', data: users })
    } catch (error) {
      next(error)
    }
  },
}
