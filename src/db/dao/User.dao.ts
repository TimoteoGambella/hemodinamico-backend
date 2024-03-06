import UserModel from '../model/User.model'
import Logger from '../../routes/util/Logger'
import { ObjectId } from 'mongoose'
import { ObjectId as ObjId } from 'mongodb'

export default class UserDAO {
  private logger = new Logger()

  constructor() {}

  private handleError(error: Error) {
    this.logger.log(error.stack || error.toString())
    return null
  }

  async getAll() {
    try {
      const users = await UserModel.find({ isDeleted: false }).select(
        '-password -__v'
      )
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

  async delete(username: string, deletedBy: ObjectId) {
    try {
      const deletedUser = await UserModel.findOneAndUpdate(
        { username },
        {
          isDeleted: true,
          deletedAt: Date.now(),
          username: new ObjId().toString(),
          deletedBy,
        }
      )
      return deletedUser
    } catch (error) {
      return this.handleError(error as Error)
    }
  }
}
