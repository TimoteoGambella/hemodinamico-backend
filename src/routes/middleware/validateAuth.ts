import { Request, Response, NextFunction } from 'express'

export default (shoudBeLogged: boolean) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (shoudBeLogged && !req.session?.user) {
      res.status(401).json({
        message: 'La autenticación es requerida para acceder a este recurso.',
      })
      return
    } else if (!shoudBeLogged && req.session?.user) {
      res.status(403).json({
        message: 'Para acceder a este recurso no debes estar autenticado.',
      })
      return
    }
    next()
  }
