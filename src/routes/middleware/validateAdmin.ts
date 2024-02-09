import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.user?.isAdmin) {
    res.status(403).json({
      message: 'No tienes permisos para acceder a este recurso.',
    })
    return
  }
  next()
}
