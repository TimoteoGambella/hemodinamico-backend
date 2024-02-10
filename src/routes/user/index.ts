import express from 'express'
import UserModel from '../../db/model/User.model'
import Controller from './controller/user.controller'
import validateAuth from '../middleware/validateAuth'
import validateAdmin from '../middleware/validateAdmin'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', validateAuth(true), validateAdmin, Controller.getAllUsers)
router.post('/create', validateSchema(UserModel), Controller.register)

export default router
