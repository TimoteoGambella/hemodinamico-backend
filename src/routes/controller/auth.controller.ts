import { Request, Response } from 'express'
import UserDAO from '../../db/dao/User.dao'
import comparePassword from '../util/comparePassword'

export default {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body
      const handleInvalid = (status: number) =>
        res.status(status).json({
          message: 'Invalid email or password',
        })
  
      if (username && password) {
        const user = await new UserDAO().getByUsername(username)
        if (!user || !comparePassword(password, user.password)) {
          handleInvalid(401)
          return
        }
        req.session!.user = user._id
        res.json({
          message: 'Login successful',
          user,
        })
      } else {
        handleInvalid(400)
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
      })
    }
  },
  register: async (req: Request, res: Response) => {
    const user = req.body
    try {
      const createdUser = await new UserDAO().create(user)
      res.status(201).json({
        message: 'User created successfully',
        user: createdUser,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
      })
    }
  },
  logout: (req: Request, res: Response) => {
    req.session = null
    res.json({
      message: 'Logout successful',
    })
  }
}
