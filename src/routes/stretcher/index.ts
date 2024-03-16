import express from 'express'
import StretcherModel from '../../db/model/Stretcher.model'
import Controller from './controller/stretcher.controller'
import validateSchema from '../middleware/validateSchema'

const router = express.Router()

router.get('/list', Controller.getAll)
router.get('/:id', Controller.getOne)
router.get('/list/versions', Controller.getAllVersions)
router.get('/list/versions/:id', Controller.getVersionsById)
router.post('/create', validateSchema(StretcherModel), Controller.register)
router.patch('/update/:id', validateSchema(StretcherModel), Controller.update)
router.delete('/delete/:id', Controller.delete)

export default router
