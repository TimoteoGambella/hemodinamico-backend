import express from 'express'
import Controller from './controller/user.controller'
import validateAuth from '../middleware/validateAuth'
import validateAdmin from '../middleware/validateAdmin'

const router = express.Router()

router.get('/list', validateAuth(true), validateAdmin, Controller.getAllUsers)

export default router
