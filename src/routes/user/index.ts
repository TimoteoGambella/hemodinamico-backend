import express from 'express'
import UserModel from '../../db/model/User.model'
import Controller from './controller/user.controller'
import validateAdmin from '../middleware/validateAdmin'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', validateAdmin, Controller.getAll)
router.post('/create', validateSchema(UserModel), Controller.register)
router.delete('/delete/:username', validateAdmin, Controller.delete)

export default router
