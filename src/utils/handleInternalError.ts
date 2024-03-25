/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import Logger from './Logger'

const logger = new Logger()

export default (error: Error, _req: Request, res: Response,  _next: NextFunction) => {
  logger.log(error.stack || error.message)
  res.status(500).json({
    message: 'Internal server error',
  })
}
