import { Request, Response, NextFunction } from 'express'
import UserDAO from '../../../db/dao/User.dao'

export default {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body
      const handleInvalid = (status: number) =>
        res.status(status).json({
          message: 'El usuario o la contraseña son inválidos.',
        })

      if (username && password) {
        const user = await new UserDAO().getByUsername(username)
        if (!user || !await user.isValidPassword(password)) {
          handleInvalid(401)
          return
        }
        req.session!.user = { _id: user._id, isAdmin: user.isAdmin }
        const tmp = JSON.parse(JSON.stringify(user))
        delete tmp.password
        res.json({
          message: 'Inicio de sesión exitoso.',
          user: tmp,
        })
      } else {
        handleInvalid(400)
      }
    } catch (error) {
      next(error)
    }
  },
  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      req.session = null
      res.json({
        message: 'Cierre de sesión exitoso.',
      })
    } catch (error) {
      next(error)
    }
  },
  session: (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.session && req.session.user) {
        res.status(200).end()
      } else {
        res.status(401).end()
      }
    } catch (error) {
      next(error)
    }
  }
}
