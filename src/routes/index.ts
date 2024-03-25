import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import patientRouter from './patient'
import stretcherRouter from './stretcher'
import laboratoryRouter from './laboratory'
import validateAuth from './middleware/validateAuth'
import validateAdmin from './middleware/validateAdmin'
import exportLogs from './middleware/exportLogs'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', validateAuth(true), userRouter)
router.use('/patient', validateAuth(true), patientRouter)
router.use('/stretcher', validateAuth(true), stretcherRouter)
router.use('/laboratory', validateAuth(true), laboratoryRouter)
router.get('/logs', validateAdmin, exportLogs)


export default router
