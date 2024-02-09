import mongoose from 'mongoose'
import UserModel from '../model/User.model'

export default class UserDAO {
  private static instance: UserDAO
  private URL!: string
  private MONGODB!: typeof mongoose.connect

  constructor() {
    if (UserDAO.instance) return UserDAO.instance

    this.URL = process.env.MONGODB_URI || ''
    this.MONGODB = mongoose.connect
  }

  async getAll() {
    try {
      this.MONGODB(this.URL)
      const users = await UserModel.find().select('-password -__v')
      return users
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getByUsername(username: string) {
    try {
      this.MONGODB(this.URL)
      const user = await UserModel.findOne({ username }).select('-__v')
      return user
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async create(user: User) {
    try {
      this.MONGODB(this.URL)
      const newUser = new UserModel(user)
      await newUser.save()
      return newUser
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
