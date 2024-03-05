import express from 'express'
import Controller from './controller/auth.controller'
import validateAuth from '../middleware/validateAuth'

const router = express.Router()

router.get('/user', validateAuth(true), Controller.userInfo)
router.post('/login', validateAuth(false), Controller.login)
router.get('/logout', validateAuth(true), Controller.logout)
router.get('/session', Controller.session)

export default router
