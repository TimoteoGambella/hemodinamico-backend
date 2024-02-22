import 'dotenv/config'
import express from 'express'
import logger from 'morgan'

import Router from './routes'
import corsConfig from './config/cors.config'
import cookieSessionConfig from './config/cookieSession.config'
import handleInternalError from './routes/util/handleInternalError'
import { initDBConnection } from './config/dbConnection.config'
import { AddressInfo } from 'net'

const app = express()
const PORT = Number(process.env.PORT) || 3000

initDBConnection()
  .then(() => {
    app.use(corsConfig())
    app.use(logger('dev'))
    app.use(express.json())
    app.use(cookieSessionConfig())

    app.use('/api', Router)
    app.use(handleInternalError)

    const server = app.listen(PORT, () => {
      const address = server.address() as AddressInfo
      const host = address.address === '::' ? 'localhost' : address.address
      const protocol = process.env.NODE_ENV === 'prod' ? 'https' : 'http'
      const port = address.port
      console.info(
        '\x1b[34m' +
          `[INFO] Server is running on ${protocol}://${host}:${port}` +
          '\x1b[0m'
      )
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
