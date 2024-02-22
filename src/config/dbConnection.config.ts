import mongoose from 'mongoose'

let connection: typeof mongoose | null = null

export const initDBConnection = async () => {
  if (!connection) {
    const url = process.env.MONGODB_URI
    if (!url) throw new Error('MongoDB URI is not defined')
    connection = await mongoose.connect(url, {
      maxPoolSize: 10,
      minPoolSize: 0,
      waitQueueTimeoutMS: 2500,
    })
    console.info(
      '\x1b[34m' +
        '[INFO] MongoDB connection established successfully' +
        '\x1b[0m'
    )
  }
  return connection
}

export const closeDBConnection = async () => {
  if (connection) {
    await mongoose.disconnect()
    console.info('\x1b[34m' + '[INFO] Disconnected from MongoDB' + '\x1b[0m')
    connection = null
  }
}

export default connection
