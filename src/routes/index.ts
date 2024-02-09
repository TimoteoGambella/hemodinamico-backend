import authRouter from './auth'
import userRouter from './user'
import { Router } from 'express'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('*', (_req, res) =>
  res.status(404).json({
    message: 'Route not found!',
  })
)

export default router
