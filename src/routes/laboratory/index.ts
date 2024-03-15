import express from 'express'
import LaboratoryModel from '../../db/model/Laboratory.model'
import Controller from './controller/laboratory.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.get('/:id', Controller.getById)
router.get('/list/versions/:id', Controller.getAllVersions)
router.post('/create', validateSchema(LaboratoryModel), Controller.create)
router.patch('/update/:id', Controller.update)
router.delete('/delete/:id', Controller.delete)

export default router
