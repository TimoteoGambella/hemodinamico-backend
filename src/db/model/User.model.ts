import UserSchema from './constants/UserSchema'
import { Document } from 'mongoose'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

interface UserDocument extends User, Document {}

const userSchema = new mongoose.Schema<UserDocument>(UserSchema)

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next()

  const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  this.password = hash
  next()
})

userSchema.methods.isValidPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model('users', userSchema)

export default UserModel
