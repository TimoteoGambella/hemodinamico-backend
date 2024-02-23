import logger from 'morgan'

export default function morganConfig() {
  return logger(
    ':method :url :status - :res[content-length] - :response-time ms | :referrer'
  )
}
