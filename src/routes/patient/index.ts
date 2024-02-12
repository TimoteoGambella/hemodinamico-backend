import express from 'express'
import PatientModel from '../../db/model/Patient.model'
import Controller from './controller/patient.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.post('/create', validateSchema(PatientModel), Controller.register)
router.delete('/delete', Controller.delete)

export default router
