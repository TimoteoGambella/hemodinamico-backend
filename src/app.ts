import 'dotenv/config'
import express from 'express'

import Router from './routes'
import corsConfig, { ALLOWED_ORIGINS } from './config/cors.config'
import cookieSessionConfig from './config/cookieSession.config'
import { initDBConnection } from './config/dbConnection.config'
import handleInternalError from './utils/handleInternalError'
import morganConfig from './config/morgan.config'
import { AddressInfo } from 'net'

const app = express()
const PORT = Number(process.env.PORT) || 3000

initDBConnection()
  .then(() => {
    app.use(morganConfig())
    app.use(corsConfig())
    app.use(express.json())
    app.set('trust proxy', 1)
    app.use(cookieSessionConfig())

    app.use('/api', Router)
    app.use('*', (_req, res) =>
      res.status(404).json({
        message: 'Route not found!',
      })
    )
    app.use(handleInternalError)

    const server = app.listen(PORT, () => {
      const address = server.address() as AddressInfo
      const host = address.address === '::' ? 'localhost' : address.address
      const protocol = process.env.NODE_ENV === 'prod' ? 'https' : 'http'
      const port = address.port
      console.info(
        '\x1b[34m' + `[INFO] ALLOWED ORIGINS: ${ALLOWED_ORIGINS}` + '\x1b[0m'
      )
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
