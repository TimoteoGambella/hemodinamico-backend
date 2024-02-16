import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import patientRouter from './patient'
import stretcherRouter from './stretcher'
import laboratoryRouter from './laboratory'
import validateAuth from './middleware/validateAuth'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', validateAuth(true), userRouter)
router.use('/patient', validateAuth(true), patientRouter)
router.use('/stretcher', validateAuth(true), stretcherRouter)
router.use('/laboratory', validateAuth(true), laboratoryRouter)
router.use('*', (_req, res) =>
  res.status(404).json({
    message: 'Route not found!',
  })
)

export default router
