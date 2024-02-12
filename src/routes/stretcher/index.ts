import express from 'express'
import StretcherModel from '../../db/model/Stretcher.model'
import Controller from './controller/stretcher.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.post('/create', validateSchema(StretcherModel), Controller.register)
router.delete('/delete', Controller.delete)

export default router
