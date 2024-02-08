import 'dotenv/config'
import express from 'express'
import logger from 'morgan'

import indexRouter from './routes/auth'
import corsConfig from './config/cors.config'
import cookieSessionConfig from './config/cookieSession.conf'

const app = express()
const PORT = process.env.PORT || 3000

app.use(corsConfig())
app.use(logger('dev'))
app.use(express.json())
app.use(cookieSessionConfig())

app.use('/api', indexRouter)
app.use('*', (_req, res) =>
  res.status(404).json({
    message: 'Route not found!',
  })
)

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT}`)
})
