import express from 'express'
import LaboratoryModel from '../../db/model/Laboratory.model'
import Controller from './controller/laboratory.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.get('/:id', Controller.getOne)
router.post('/create', validateSchema(LaboratoryModel), Controller.create)
router.delete('/delete/:id', Controller.delete)

export default router
