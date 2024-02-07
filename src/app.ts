import 'dotenv/config'
import express from 'express'
import logger from 'morgan'
import cookieSession from 'cookie-session'
import ms from 'ms'

import indexRouter from './routes/auth'

const app = express()
const PORT = process.env.PORT || 3000

app.use(logger('dev'))
app.use(cookieSession({
  name: 'session',
  secret: process.env.SEION_SECRET || 'secret',
  maxAge: ms('8h'),
}))
app.use(express.json())

app.use('/', indexRouter)

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT}`)
})
