import cors from 'cors'

export default function corsConfig() {
  const CLIENT_URL = process.env.CLIENT_URL
  if (!CLIENT_URL) throw new Error('CLIENT_URL is not defined')
  return cors({
    origin: CLIENT_URL.split(',').map((url) => url.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'PREFLIGHT'],
    credentials: true,
  })
}
