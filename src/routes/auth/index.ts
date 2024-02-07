import express from 'express'
import UserModel from '../../db/model/User.model'
import validateSchema from '../middleware/validateSchema'
import Controller from '../controller/auth.controller'
import validateAuth from '../middleware/validateAuth'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API',
  })
})

router.post('/login', Controller.login)
router.post('/register', validateSchema(UserModel), Controller.register)
router.get('/logout', validateAuth, Controller.logout)

export default router
