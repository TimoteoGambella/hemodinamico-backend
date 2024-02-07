import { Request, Response, NextFunction } from 'express'

export default function validateAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    res.status(401).json({
      message: 'Authentication required',
    })
    return
  }
  next()
}
