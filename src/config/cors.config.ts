import cors from 'cors'

export default function corsConfig() {
  return cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PREFLIGHT'],
    credentials: true,
  })
}
