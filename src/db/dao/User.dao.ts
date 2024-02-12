import mongoose from 'mongoose'
import UserModel from '../model/User.model'
import Logger from '../../routes/util/Logger'

export default class UserDAO {
  private MONGODB!: typeof mongoose.connect
  private static instance: UserDAO
  private logger = new Logger()
  private URL!: string

  constructor() {
    if (UserDAO.instance) return UserDAO.instance

    this.URL = process.env.MONGODB_URI || ''
    this.MONGODB = mongoose.connect
  }

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      this.MONGODB(this.URL)
      const users = await UserModel.find().select('-password -__v')
      return users
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getByUsername(username: string) {
    try {
      this.MONGODB(this.URL)
      const user = await UserModel.findOne({ username }).select('-__v')
      return user
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(user: User) {
    try {
      this.MONGODB(this.URL)
      const newUser = new UserModel(user)
      await newUser.save()
      return newUser
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
