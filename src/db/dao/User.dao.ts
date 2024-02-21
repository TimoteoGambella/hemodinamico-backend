import UserModel from '../model/User.model'
import Logger from '../../routes/util/Logger'

export default class UserDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      const users = await UserModel.find().select('-password -__v')
      return users
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async getByUsername(username: string) {
    try {
      const user = await UserModel.findOne({ username }).select('-__v')
      return user
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  async create(user: User) {
    try {
      const newUser = new UserModel(user)
      await newUser.save()
      return newUser
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
