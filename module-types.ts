import { Request } from 'express'

interface Session extends CookieSessionInterfaces.CookieSessionObject {
  user?: {
    _id: string
    username: string
    isAdmin: boolean
    lastName: string
  }
}

export interface ReqSession extends Request {
  session: Session
}
