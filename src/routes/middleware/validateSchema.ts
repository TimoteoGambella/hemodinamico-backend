/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { Document } from 'mongoose'

export default function validateSchema(modelClass: new (...args: any[]) => Document) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body
      const instance = new modelClass(user)
      const isValid = instance.validateSync()
      if (isValid) {
        res.status(400).json({
          message: 'Estructura de datos de usuario inválida.',
          error: isValid.errors,
        })
        return
      } else {
        next()
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
      })
    }
  }
}
