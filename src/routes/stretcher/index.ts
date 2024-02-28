import express from 'express'
import StretcherModel from '../../db/model/Stretcher.model'
import Controller from './controller/stretcher.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.get('/:id', Controller.getOne)
router.post('/create', validateSchema(StretcherModel), Controller.register)
router.put('/update/:id', validateSchema(StretcherModel), Controller.update)
router.delete('/delete/:id', Controller.delete)

export default router
