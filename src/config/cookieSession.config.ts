import cookieSession from 'cookie-session'
import ms from 'ms'

export default function cookieSessionConfig() {
  return cookieSession({
    name: 'session',
    maxAge: ms('8h'),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    secret: process.env.SESSION_SECRET || 'secret',
    sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'strict',
  })
}
