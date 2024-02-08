import cookieSession from 'cookie-session'
import ms from 'ms'

export default function cookieSessionConfig() {
  return cookieSession({
    name: 'session',
    secret: process.env.SEION_SECRET || 'secret',
    maxAge: ms('8h'),
  })
}
