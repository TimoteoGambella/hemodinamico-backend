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
const PORT = process.env.PORT || 3000;

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

    app.get('/', (req, res) => {
      res.send(`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="google-site-verification" content="-0hlQWxr_we2SAHKYa-Df3htowXQUG9e4laJxZ9lYsc" />    
        <title>Título de tu página</title>
      </head>
      <body>
        Contenido de tu página principal aquí
      </body>
      </html>`);
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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

  export default app;
