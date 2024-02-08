import { Request, Response } from 'express'
import UserDAO from '../../db/dao/User.dao'
import comparePassword from '../util/comparePassword'

export default {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body
      const handleInvalid = (status: number) =>
        res.status(status).json({
          message: 'El usuario o la contraseña son inválidos.',
        })
  
      if (username && password) {
        const user = await new UserDAO().getByUsername(username)
        if (!user || !comparePassword(password, user.password)) {
          handleInvalid(401)
          return
        }
        req.session!.user = user._id
        res.json({
          message: 'Inicio de sesión exitoso.',
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
        message: 'Usuario creado exitosamente.',
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
      message: 'Cierre de sesión exitoso.',
    })
  }
}
