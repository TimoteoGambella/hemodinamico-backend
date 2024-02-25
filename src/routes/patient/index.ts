import express from 'express'
import Controller from './controller/patient.controller'

const router = express.Router()

router.get('/list', Controller.getAll)
router.post('/create', Controller.register)
router.patch('/update/:id', Controller.update)
router.delete('/delete/:id', Controller.delete)

export default router
