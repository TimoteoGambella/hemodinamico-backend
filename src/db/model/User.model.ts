import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
})

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next()

  const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  this.password = hash
  next()
})

userSchema.methods.isValidPassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

const Model = mongoose.model('users', userSchema)

export default class UserModel extends Model {
  constructor(user: User) {
    super()
    return new Model(user)
  }
}
