import { Request, Response } from 'express'
import UserDAO from '../../../db/dao/User.dao'

export default {
  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await new UserDAO().getAll()
      res.status(200).json({ message: 'Get all users', data: users })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
      })
    }
  },
}
