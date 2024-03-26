import { Request, Response, NextFunction } from 'express'
import { ReqSession } from '../../../../module-types'
import UserDAO from '../../../db/dao/User.dao'

export default {
  userInfo: (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
    try {
      res.json(req.session!.user)
    } catch (error) {
      next(error)
    }
  },
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
        const tmp = JSON.parse(JSON.stringify(user))
        delete tmp.password
        req.session!.user = tmp
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
      res.clearCookie('session')
      res.json({
        message: 'Cierre de sesión exitoso.',
      })
    } catch (error) {
      next(error)
    }
  },
  session: (request: Request, res: Response, next: NextFunction) => {
    const req = request as ReqSession
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
