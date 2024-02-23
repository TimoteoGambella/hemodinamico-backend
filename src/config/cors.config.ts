import cors from 'cors'

export const ALLOWED_ORIGINS = process.env.CLIENT_URL?.split(',').map((url) =>
  url.trim()
)

export default function corsConfig() {
  if (!ALLOWED_ORIGINS) throw new Error('CLIENT_URL is not defined')
  return cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'PREFLIGHT'],
    credentials: true,
  })
}
